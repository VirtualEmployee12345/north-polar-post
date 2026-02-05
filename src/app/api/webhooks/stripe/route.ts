import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { sendLateOrderNotification, sendOrderConfirmation } from '@/services/email'

// Force dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Letter templates from the manifest
const letterTemplates = {
  1: (childName: string, city: string, wish: string) => `My dear ${childName},

I am writing this in a great hurry because the North Polar Bear has just knocked over my largest pot of red ink. My hand is a bit trembly from the cold today, but I wanted to make sure this reached you in ${city} safely.

We have received your letter at the North Pole. It was a bit damp from the snow, but the Elves dried it by the fire. I see that you are hoping for a ${wish} this year. I shall have to see what the workshop can manage! It is very busy here.

The Northern Lights are dancing over the cliffs tonight, which usually means the reindeer are getting restless. I must go and check on them before the Bear tries to help feed them again.

Yours always,
Father Christmas`,

  2: (childName: string, city: string, deed: string) => `My dear ${childName},

Such a stir since my last letter! The North Polar Bear climbed the main ladder to reach the holiday biscuits and ended up tangled in three miles of silver ribbon. The Elves are still untangling him.

I am watching very closely from the North Pole, and I was so pleased to hear that you ${deed} recently. That is exactly the sort of kindness we look for here. It makes my heart much warmer than this arctic wind!

We are double-checking the lists and polishing the bells on the sleigh. It won't be long now. Please keep being helpful in ${city} while I finish the preparations.

With love,
Father Christmas`,

  3: (childName: string, city: string) => `My dear ${childName},

The North Polar Bear is currently fast asleep and snoring like a localized earthquake, which is a blessing because the sleigh is finally packed! Everything is ready for my flight to ${city}.

The reindeer have had their extra oats, and I have my warmest coat on. I have included your Official Nice List Certificate with this letter. Please keep it somewhere safe so the Bear doesn't try to use it as a napkin.

Remember to go to sleep early on Christmas Eve. If you hear a heavy thud on the roof, it is likely just the Bear trying to jump on the back of the sleigh at the last second.

I am very proud of you, ${childName}. I will be seeing you very soon!

Yours truly,
Father Christmas`,
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function buildSchedule(orderDate: Date, intervalDays: number) {
  return [
    { sequence: 1, sendDate: addDays(orderDate, intervalDays) },
    { sequence: 2, sendDate: addDays(orderDate, intervalDays * 2) },
    { sequence: 3, sendDate: addDays(orderDate, intervalDays * 3) },
  ]
}

function calculateSchedules(orderDate: Date) {
  const dec10 = new Date(orderDate.getFullYear(), 11, 10)
  const dec20 = new Date(orderDate.getFullYear(), 11, 20)

  const originalSchedule = buildSchedule(orderDate, 7)
  let adjustedSchedule = originalSchedule
  let sequencesToSend = [1, 2, 3]
  let lateType: 'after_dec_10' | 'after_dec_20' | null = null

  if (orderDate > dec20) {
    adjustedSchedule = [{ sequence: 3, sendDate: addDays(orderDate, 3) }]
    sequencesToSend = [3]
    lateType = 'after_dec_20'
  } else if (orderDate > dec10) {
    adjustedSchedule = [
      { sequence: 2, sendDate: addDays(orderDate, 3) },
      { sequence: 3, sendDate: addDays(orderDate, 6) },
    ]
    sequencesToSend = [2, 3]
    lateType = 'after_dec_10'
  }

  return { originalSchedule, adjustedSchedule, sequencesToSend, lateType }
}

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      // Extract metadata
      const { childName, city, goodDeed, specialWish } = session.metadata || {}
      
      if (!childName || !city || !goodDeed || !specialWish) {
        console.error('Missing metadata in checkout session')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Get shipping address
      // Note: Stripe's types may not fully match the webhook payload
      const sessionData = session as any
      const shipping = sessionData.shipping_details || sessionData.shipping
      const shippingAddress = shipping?.address ? {
        line1: shipping.address.line1,
        line2: shipping.address.line2,
        city: shipping.address.city,
        state: shipping.address.state,
        postalCode: shipping.address.postal_code,
        country: shipping.address.country,
      } : null

      const orderDate = new Date()
      const { originalSchedule, adjustedSchedule, sequencesToSend, lateType } = calculateSchedules(orderDate)
      const email = sessionData.customer_details?.email || sessionData.customer_email || null

      const adjustedScheduleJson = adjustedSchedule.map(item => ({
        sequence: item.sequence,
        sendDate: item.sendDate.toISOString(),
      }))
      const originalScheduleJson = originalSchedule.map(item => ({
        sequence: item.sequence,
        sendDate: item.sendDate.toISOString(),
      }))

      // Create order and letters in a transaction
      let createdOrder = null

      try {
        await prisma.$transaction(async (tx) => {
          const processed = await tx.processedStripeSession.create({
            data: { sessionId: session.id },
          })

          if (!processed) {
            return
          }

          const order = await tx.order.create({
            data: {
              stripeCheckoutSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string || null,
              status: 'PAID',
              childName,
              city,
              goodDeed,
              specialWish,
              email,
              shippingAddress: shippingAddress as any,
              amount: 39.99,
              currency: 'USD',
              originalSchedule: originalScheduleJson as any,
              adjustedSchedule: adjustedScheduleJson as any,
            },
          })

          const letters = []
          for (const schedule of adjustedSchedule) {
            if (!sequencesToSend.includes(schedule.sequence)) continue
            if (schedule.sequence === 1) {
              letters.push({
                orderId: order.id,
                sequenceNumber: 1,
                status: 'PENDING',
                sendDate: schedule.sendDate,
                content: letterTemplates[1](childName, city, specialWish),
              })
            }
            if (schedule.sequence === 2) {
              letters.push({
                orderId: order.id,
                sequenceNumber: 2,
                status: 'PENDING',
                sendDate: schedule.sendDate,
                content: letterTemplates[2](childName, city, goodDeed),
              })
            }
            if (schedule.sequence === 3) {
              letters.push({
                orderId: order.id,
                sequenceNumber: 3,
                status: 'PENDING',
                sendDate: schedule.sendDate,
                content: letterTemplates[3](childName, city),
              })
            }
          }

          if (letters.length > 0) {
            await tx.letter.createMany({ data: letters })
          }

          createdOrder = order
          console.log(`Order ${order.id} created with ${letters.length} scheduled letters`)
        })
      } catch (error: any) {
        if (error?.code === 'P2002') {
          console.log(`Duplicate checkout session ignored: ${session.id}`)
          return NextResponse.json({ received: true, duplicate: true })
        }
        throw error
      }

      if (createdOrder) {
        await sendOrderConfirmation({
          ...createdOrder,
          adjustedSchedule: adjustedScheduleJson,
        })

        if (lateType) {
          await sendLateOrderNotification(createdOrder, lateType)
        }
      }
    }

    // Handle payment failures
    if (event.type === 'checkout.session.expired' || 
        event.type === 'payment_intent.payment_failed') {
      const session = event.data.object
      
      // Try to find and mark order as failed
      await prisma.order.updateMany({
        where: { stripeCheckoutSessionId: session.id },
        data: { status: 'FAILED' },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
