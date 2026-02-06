import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  if (!process.env.DATABASE_URL) {
    console.error('[Prisma] DATABASE_URL not set. Available envs:', 
      Object.keys(process.env).filter(k => k.includes('DB') || k.includes('URL') || k.includes('DATA')))
    throw new Error('DATABASE_URL environment variable is not set')
  }

  console.log('[Prisma] Creating client with DATABASE_URL length:', process.env.DATABASE_URL.length)

  // Prisma 7: No special config needed - reads DATABASE_URL automatically
  const client = new PrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  
  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const client = getPrismaClient()
    const value = client[prop as keyof PrismaClient]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

export default prisma