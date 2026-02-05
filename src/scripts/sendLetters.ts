// Phase 3: Letter fulfillment cron job
// Queries letters scheduled for today and sends them via Handwrytten API

import prisma from '../lib/prisma'
import { sendLetterWithRetry } from '../services/handwrytten'
import { sendLetterShippedNotification } from '../services/email'

async function sendScheduledLetters() {
  console.log('🔍 Checking for letters scheduled to send today...')

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  // Find letters scheduled for today that haven't been sent
  const lettersToSend = await prisma.letter.findMany({
    where: {
      status: 'PENDING',
      sendDate: {
        lte: endOfToday,
      },
    },
    include: {
      order: true,
    },
    orderBy: {
      sendDate: 'asc',
    },
  })

  console.log(`📬 Found ${lettersToSend.length} letters to send today`)

  if (lettersToSend.length === 0) {
    console.log('✨ No letters to send today')
    return
  }

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

      const result = await sendLetterWithRetry(letter, order)

      if (result.success) {
        await sendLetterShippedNotification(order, letter)
        console.log(`✅ Letter ${letter.id} sent successfully`)
        successCount++
      } else {
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
        status: { in: ['PENDING', 'QUEUED', 'SENDING'] },
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
