import prisma from '../lib/prisma'
import { createLogger } from '../lib/logger'
import { sendCircuitBreakerAlert } from './email'

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

const logger = createLogger('circuit-breaker')

function getThreshold(): number {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10)
}

function getWindowMs(): number {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_WINDOW_MS || '600000', 10)
}

function getCooldownMs(): number {
  return Number.parseInt(process.env.CIRCUIT_BREAKER_COOLDOWN_MS || '1800000', 10)
}

export function computeNextFailureCount(
  lastFailureAt: Date | null,
  failureCount: number,
  now: Date,
  windowMs: number
): number {
  if (!lastFailureAt) return 1
  const withinWindow = now.getTime() - lastFailureAt.getTime() <= windowMs
  return withinWindow ? failureCount + 1 : 1
}

export class CircuitBreakerOpenError extends Error {
  readonly service: string
  readonly state: CircuitState
  readonly openedAt?: Date | null

  constructor(service: string, state: CircuitState, openedAt?: Date | null) {
    super(`Circuit breaker is ${state} for ${service}`)
    this.name = 'CircuitBreakerOpenError'
    this.service = service
    this.state = state
    this.openedAt = openedAt
  }
}

async function getOrCreateState(service: string) {
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

async function recordSuccess(service: string, state: { state: CircuitState }) {
  if (state.state === 'HALF_OPEN') {
    await prisma.circuitBreakerState.update({
      where: { service },
      data: {
        state: 'CLOSED',
        failureCount: 0,
        lastFailureAt: null,
        openedAt: null,
      },
    })
    await sendCircuitBreakerAlert(service, 'CLOSED')
    logger.info('Circuit closed after successful trial', { service })
    return
  }

  if (state.state === 'CLOSED') {
    await prisma.circuitBreakerState.update({
      where: { service },
      data: { failureCount: 0 },
    })
  }
}

async function recordFailure(service: string, state: any, now: Date, fromHalfOpen: boolean) {
  const threshold = getThreshold()
  const windowMs = getWindowMs()

  if (fromHalfOpen || state.state === 'HALF_OPEN') {
    await prisma.circuitBreakerState.update({
      where: { service },
      data: {
        state: 'OPEN',
        failureCount: threshold,
        lastFailureAt: now,
        openedAt: now,
      },
    })
    await sendCircuitBreakerAlert(service, 'OPEN')
    logger.warn('Circuit opened after failed trial', { service })
    return
  }

  const lastFailureAt = state.lastFailureAt ? new Date(state.lastFailureAt) : null
  const nextFailureCount = computeNextFailureCount(lastFailureAt, state.failureCount, now, windowMs)

  if (nextFailureCount >= threshold) {
    await prisma.circuitBreakerState.update({
      where: { service },
      data: {
        state: 'OPEN',
        failureCount: nextFailureCount,
        lastFailureAt: now,
        openedAt: now,
      },
    })
    await sendCircuitBreakerAlert(service, 'OPEN')
    logger.warn('Circuit opened after threshold failures', { service, failureCount: nextFailureCount })
    return
  }

  await prisma.circuitBreakerState.update({
    where: { service },
    data: {
      state: 'CLOSED',
      failureCount: nextFailureCount,
      lastFailureAt: now,
      openedAt: null,
    },
  })
}

export async function runWithCircuitBreaker<T>(service: string, fn: () => Promise<T>): Promise<T> {
  const now = new Date()
  let state = await getOrCreateState(service)
  let allowTrial = false

  if (state.state === 'OPEN') {
    const openedAt = state.openedAt ? new Date(state.openedAt) : null
    if (openedAt && now.getTime() - openedAt.getTime() < getCooldownMs()) {
      throw new CircuitBreakerOpenError(service, 'OPEN', openedAt)
    }

    const cooldownPassedAt = new Date(now.getTime() - getCooldownMs())
    const updated = await prisma.circuitBreakerState.updateMany({
      where: {
        service,
        state: 'OPEN',
        openedAt: { lte: cooldownPassedAt },
      },
      data: {
        state: 'HALF_OPEN',
        failureCount: 0,
        lastFailureAt: now,
      },
    })

    if (updated.count > 0) {
      allowTrial = true
      state = { ...state, state: 'HALF_OPEN' }
    } else {
      state = await getOrCreateState(service)
    }
  }

  if (state.state === 'HALF_OPEN' && !allowTrial) {
    throw new CircuitBreakerOpenError(service, 'HALF_OPEN', state.openedAt)
  }

  if (state.state === 'OPEN') {
    throw new CircuitBreakerOpenError(service, 'OPEN', state.openedAt)
  }

  try {
    const result = await fn()
    await recordSuccess(service, state)
    return result
  } catch (error) {
    await recordFailure(service, state, now, allowTrial)
    throw error
  }
}
