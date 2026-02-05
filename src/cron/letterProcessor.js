import cron from 'node-cron'
import prisma from '../lib/prisma'
import { sendLetterWithRetry } from '../services/handwrytten'
import { sendLetterShippedNotification } from '../services/email'
import { createLogger } from '../lib/logger'

const logger = createLogger('letter-processor')

async function processDueLetters() {
  const runAt = new Date()
  await prisma.cronRun.upsert({
    where: { name: 'letterProcessor' },
    create: { name: 'letterProcessor', lastRunAt: runAt },
    update: { lastRunAt: runAt },
  })

  logger.info('Running daily letter processor', { runAt: runAt.toISOString() })

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const letters = await prisma.letter.findMany({
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

  logger.info('Pending letters ready to queue', { count: letters.length })

  for (const letter of letters) {
    const updated = await prisma.letter.updateMany({
      where: { id: letter.id, status: 'PENDING' },
      data: { status: 'QUEUED' },
    })

    if (updated.count === 0) {
      continue
    }

    logger.info('Queued letter', { letterId: letter.id, sequence: letter.sequenceNumber })

    const result = await sendLetterWithRetry(letter, letter.order)

    if (result.success) {
      await sendLetterShippedNotification(letter.order, letter)
    }

    const remaining = await prisma.letter.count({
      where: {
        orderId: letter.orderId,
        status: { in: ['PENDING', 'QUEUED', 'SENDING'] },
      },
    })

    if (remaining === 0) {
      await prisma.order.update({
        where: { id: letter.orderId },
        data: { status: 'FULFILLED' },
      })
    }
  }
}

function startScheduler() {
  const schedule = process.env.LETTER_CRON_SCHEDULE || '0 8 * * *'

  cron.schedule(schedule, async () => {
    try {
      await processDueLetters()
    } catch (error) {
      logger.error('Letter processor error', { error })
    }
  })

  logger.info('Letter processor scheduled', { schedule })
}

async function bootstrap() {
  await processDueLetters()
  startScheduler()
}

bootstrap().catch(error => {
  logger.error('Failed to start letter processor', { error })
  process.exit(1)
})
