type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogRecord {
  timestamp: string
  level: LogLevel
  service: string
  message: string
  metadata?: Record<string, unknown>
}

function normalizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined

  const normalized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (value instanceof Error) {
      normalized[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      }
    } else {
      normalized[key] = value
    }
  }

  return normalized
}

function emit(record: LogRecord): void {
  const line = JSON.stringify(record)
  console.log(line)
}

export function createLogger(service: string) {
  const log = (level: LogLevel, message: string, metadata?: Record<string, unknown>) => {
    emit({
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      metadata: normalizeMetadata(metadata),
    })
  }

  return {
    error: (message: string, metadata?: Record<string, unknown>) => log('error', message, metadata),
    warn: (message: string, metadata?: Record<string, unknown>) => log('warn', message, metadata),
    info: (message: string, metadata?: Record<string, unknown>) => log('info', message, metadata),
    debug: (message: string, metadata?: Record<string, unknown>) => log('debug', message, metadata),
  }
}

export const logger = createLogger(process.env.SERVICE_NAME || 'north-polar-post')
