// Phase 3: Letter fulfillment cron job
// Queries letters scheduled for today and sends them via Handwrytten API

import prisma from '../lib/prisma'
import { getHandwryttenClient } from '../lib/handwrytten'

async function sendScheduledLetters() {
  console.log('🔍 Checking for letters scheduled to send today...')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Find letters scheduled for today that haven't been sent
  const lettersToSend = await prisma.letter.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      order: true,
    },
    orderBy: {
      scheduledDate: 'asc',
    },
  })

  console.log(`📬 Found ${lettersToSend.length} letters to send today`)

  if (lettersToSend.length === 0) {
    console.log('✨ No letters to send today')
    return
  }

  const handwrytten = getHandwryttenClient()
  let successCount = 0
  let failureCount = 0

  for (const letter of lettersToSend) {
    try {
      const order = letter.order

      // Parse shipping address
      const shipping = order.shippingAddress as any
      if (!shipping || !shipping.line1 || !shipping.city || !shipping.state || !shipping.postalCode) {
        console.error(`❌ Order ${order.id} missing shipping address, skipping letter ${letter.id}`)
        await prisma.letter.update({
          where: { id: letter.id },
          data: { status: 'FAILED' },
        })
        failureCount++
        continue
      }

      console.log(`📝 Sending letter ${letter.sequenceNumber} for ${order.childName}...`)

      // Send via Handwrytten
      const result = await handwrytten.sendCard(letter.content, {
        childName: order.childName,
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country || 'US',
      })

      if (result.success && result.card_id) {
        // Update letter as sent
        await prisma.letter.update({
          where: { id: letter.id },
          data: {
            status: 'SENT',
            sentDate: new Date(),
            handwryttenCardId: result.card_id,
          },
        })
        console.log(`✅ Letter ${letter.id} sent successfully (Handwrytten ID: ${result.card_id})`)
        successCount++
      } else {
        // Mark as failed
        await prisma.letter.update({
          where: { id: letter.id },
          data: { status: 'FAILED' },
        })
        console.error(`❌ Failed to send letter ${letter.id}: ${result.error}`)
        failureCount++
      }
    } catch (error) {
      console.error(`❌ Error sending letter ${letter.id}:`, error)
      await prisma.letter.update({
        where: { id: letter.id },
        data: { status: 'FAILED' },
      })
      failureCount++
    }
  }

  console.log(`\n📊 Summary: ${successCount} sent, ${failureCount} failed`)

  // Check if all letters for an order are sent, update order status
  for (const letter of lettersToSend) {
    const orderId = letter.orderId
    const unsentLetters = await prisma.letter.count({
      where: {
        orderId,
        status: { in: ['PENDING', 'SCHEDULED'] },
      },
    })

    if (unsentLetters === 0) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FULFILLED' },
      })
      console.log(`🎉 Order ${orderId} fully fulfilled!`)
    }
  }
}

sendScheduledLetters()
  .then(() => {
    console.log('🏁 Letter sending complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
