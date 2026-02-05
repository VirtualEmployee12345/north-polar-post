import prisma from '../lib/prisma'
import { sendDlqAlert } from './email'
import { runWithCircuitBreaker } from './circuitBreaker'
import { createLogger } from '../lib/logger'

const HANDWRYTTEN_API_BASE = 'https://api.handwrytten.com/v1'
const MAX_RETRIES = 3
const BASE_DELAY_MS = 1500
const CIRCUIT_SERVICE = 'handwrytten:cards:create'

const logger = createLogger('handwrytten-service')

function getAuthHeader() {
  const apiKey = process.env.HANDWRYTTEN_API_KEY
  if (!apiKey) {
    throw new Error('HANDWRYTTEN_API_KEY environment variable is not set')
  }
  return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
}

function getStationeryId() {
  const stationeryId = process.env.HANDWRYTTEN_STATIONERY_ID
  if (!stationeryId) {
    throw new Error('HANDWRYTTEN_STATIONERY_ID environment variable is not set')
  }
  return stationeryId
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function callHandwrytten(payload) {
  return runWithCircuitBreaker(CIRCUIT_SERVICE, async () => {
    const response = await fetch(`${HANDWRYTTEN_API_BASE}/cards`, {
      method: 'POST',
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = data.message || data.error || `HTTP ${response.status} ${response.statusText}`
      const error = new Error(message)
      error.status = response.status
      throw error
    }

    return {
      cardId: data.card?.id || data.id,
      status: data.card?.status || data.status,
    }
  })
}

function buildPayload(letter, order) {
  const stationeryId = getStationeryId()
  const shipping = order.shippingAddress || {}
  const childName = order.childName || ''
  const nameParts = childName.trim().split(' ')
  const firstName = nameParts[0] || childName
  const lastName = nameParts.slice(1).join(' ') || ' '

  if (!shipping.line1 || !shipping.city || !shipping.state || !shipping.postalCode) {
    throw new Error('Missing shipping address fields for Handwrytten fulfillment')
  }

  return {
    stationery_id: stationeryId,
    message: letter.content,
    recipient: {
      first_name: firstName,
      last_name: lastName,
      address1: shipping.line1,
      address2: shipping.line2,
      city: shipping.city,
      state: shipping.state,
      zip: shipping.postalCode,
      country: shipping.country || 'US',
    },
    font_style: 'script',
    ink_color: 'black',
  }
}

export async function sendLetterWithRetry(letter, order) {
  const attempts = []
  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const attemptAt = new Date().toISOString()

    logger.info('Handwrytten send attempt starting', {
      attempt,
      maxRetries: MAX_RETRIES,
      letterId: letter.id,
    })

    await prisma.letter.update({
      where: { id: letter.id },
      data: { status: 'SENDING' },
    })

    try {
      const payload = buildPayload(letter, order)
      const result = await callHandwrytten(payload)

      attempts.push({
        attempt,
        status: 'success',
        cardId: result.cardId,
        at: attemptAt,
      })

      await prisma.letter.update({
        where: { id: letter.id },
        data: {
          status: 'SENT',
          sentDate: new Date(),
          handwryttenCardId: result.cardId,
        },
      })

      logger.info('Handwrytten send attempt succeeded', {
        attempt,
        letterId: letter.id,
        cardId: result.cardId,
      })
      return { success: true, result, attempts }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      lastError = message

      attempts.push({
        attempt,
        status: 'failed',
        error: message,
        at: attemptAt,
      })

      logger.error('Handwrytten send attempt failed', {
        attempt,
        letterId: letter.id,
        error: message,
      })

      if (error?.name === 'CircuitBreakerOpenError') {
        logger.warn('Circuit breaker open, stopping retries', {
          letterId: letter.id,
        })
        break
      }

      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
        await sleep(delay)
      }
    }
  }

  await prisma.letter.update({
    where: { id: letter.id },
    data: { status: 'FAILED' },
  })

  const lastAttemptAt = new Date()
  await prisma.failedLetter.upsert({
    where: { letterId: letter.id },
    create: {
      letterId: letter.id,
      error: lastError || 'Unknown error',
      attempts,
      lastAttemptAt,
    },
    update: {
      error: lastError || 'Unknown error',
      attempts,
      lastAttemptAt,
      resolved: false,
    },
  })

  await sendDlqAlert(letter.id, lastError || 'Unknown error')

  return { success: false, error: lastError, attempts }
}
