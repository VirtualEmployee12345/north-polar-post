import assert from 'node:assert/strict'
import { computeNextFailureCount } from './circuitBreaker'

const windowMs = 600000
const now = new Date('2026-02-05T12:00:00.000Z')

assert.equal(computeNextFailureCount(null, 0, now, windowMs), 1)

const withinWindow = new Date('2026-02-05T11:55:00.000Z')
assert.equal(computeNextFailureCount(withinWindow, 2, now, windowMs), 3)

const outsideWindow = new Date('2026-02-05T11:40:00.000Z')
assert.equal(computeNextFailureCount(outsideWindow, 4, now, windowMs), 1)

console.log('circuitBreaker logic tests passed')
