import prisma from '../lib/prisma'
import { createLogger } from '../lib/logger'
import { sendCircuitBreakerAlert } from './email'

const logger = createLogger('circuit-breaker')

function getThreshold() {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10)
}

function getWindowMs() {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_WINDOW_MS || '600000', 10)
}

function getCooldownMs() {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_COOLDOWN_MS || '1800000', 10)
}

export function computeNextFailureCount(lastFailureAt, failureCount, now, windowMs) {
  if (!lastFailureAt) return 1
  const withinWindow = now.getTime() - lastFailureAt.getTime() <= windowMs
  return withinWindow ? failureCount + 1 : 1
}

export class CircuitBreakerOpenError extends Error {
  constructor(service, state, openedAt) {
    super(`Circuit breaker is ${state} for ${service}`)
    this.name = 'CircuitBreakerOpenError'
    this.service = service
    this.state = state
    this.openedAt = openedAt
  }
}

async function getOrCreateState(service) {
  return prisma.circuitBreakerState.upsert({
    where: { service },
    create: {
      service,
      state: 'CLOSED',
      failureCount: 0,
    },
    update: {},
  })
}

async function recordFailure(service, error) {
  const now = new Date()
  const windowMs = getWindowMs()
  const state = await getOrCreateState(service)
  const nextCount = computeNextFailureCount(state.lastFailureAt, state.failureCount, now, windowMs)
  const shouldOpen = nextCount >= getThreshold()

  const updated = await prisma.circuitBreakerState.update({
    where: { service },
    data: {
      failureCount: nextCount,
      lastFailureAt: now,
      ...(shouldOpen && {
        state: 'OPEN',
        openedAt: now,
      }),
    },
  })

  logger.info('Circuit breaker failure recorded', {
    service,
    failureCount: nextCount,
    state: updated.state,
  })

  if (shouldOpen) {
    logger.warn('Circuit breaker opened', { service, openedAt: now })
    await sendCircuitBreakerAlert(service, 'OPEN', nextCount)
  }

  return updated
}

async function recordSuccess(service) {
  const state = await getOrCreateState(service)
  if (state.state === 'HALF_OPEN' || state.state === 'OPEN') {
    const updated = await prisma.circuitBreakerState.update({
      where: { service },
      data: {
        state: 'CLOSED',
        failureCount: 0,
        openedAt: null,
      },
    })
    logger.info('Circuit breaker closed', { service })
    await sendCircuitBreakerAlert(service, 'CLOSED', 0)
    return updated
  }
  return state
}

function canAttempt(state) {
  if (state.state === 'CLOSED') return true
  if (state.state === 'HALF_OPEN') return true
  if (state.state === 'OPEN') {
    const openedAt = state.openedAt
    if (!openedAt) return true
    const cooldownMs = getCooldownMs()
    const elapsed = Date.now() - new Date(openedAt).getTime()
    return elapsed >= cooldownMs
  }
  return false
}

async function transitionToHalfOpen(service) {
  return prisma.circuitBreakerState.update({
    where: { service },
    data: { state: 'HALF_OPEN' },
  })
}

export async function runWithCircuitBreaker(service, operation) {
  const state = await getOrCreateState(service)

  if (!canAttempt(state)) {
    throw new CircuitBreakerOpenError(service, state.state, state.openedAt)
  }

  if (state.state === 'OPEN') {
    await transitionToHalfOpen(service)
    logger.info('Circuit breaker transitioned to HALF_OPEN', { service })
  }

  try {
    const result = await operation()
    await recordSuccess(service)
    return result
  } catch (error) {
    await recordFailure(service, error)
    throw error
  }
}

export async function getCircuitBreakerStatus(service) {
  return getOrCreateState(service)
}