import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

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

function calculateLetterDates(orderDate: Date): Date[] {
  // Check if after Dec 10 - compress schedule
  const dec10 = new Date(orderDate.getFullYear(), 11, 10) // Month is 0-indexed
  const isLateOrder = orderDate > dec10
  
  const intervalDays = isLateOrder ? 3 : 7
  
  return [
    new Date(orderDate.getTime() + intervalDays * 24 * 60 * 60 * 1000),      // Letter 1
    new Date(orderDate.getTime() + intervalDays * 2 * 24 * 60 * 60 * 1000),   // Letter 2
    new Date(orderDate.getTime() + intervalDays * 3 * 24 * 60 * 60 * 1000),   // Letter 3
  ]
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

      // Calculate letter dates
      const orderDate = new Date()
      const letterDates = calculateLetterDates(orderDate)

      // Create order and letters in a transaction
      await prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
          data: {
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string || null,
            status: 'PAID',
            childName,
            city,
            goodDeed,
            specialWish,
            shippingAddress: shippingAddress as any,
            amount: 39.99,
            currency: 'USD',
          },
        })

        // Create the three letters
        await tx.letter.createMany({
          data: [
            {
              orderId: order.id,
              sequenceNumber: 1,
              status: 'SCHEDULED',
              scheduledDate: letterDates[0],
              content: letterTemplates[1](childName, city, specialWish),
            },
            {
              orderId: order.id,
              sequenceNumber: 2,
              status: 'SCHEDULED',
              scheduledDate: letterDates[1],
              content: letterTemplates[2](childName, city, goodDeed),
            },
            {
              orderId: order.id,
              sequenceNumber: 3,
              status: 'SCHEDULED',
              scheduledDate: letterDates[2],
              content: letterTemplates[3](childName, city),
            },
          ],
        })

        console.log(`Order ${order.id} created with 3 scheduled letters`)
      })
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
