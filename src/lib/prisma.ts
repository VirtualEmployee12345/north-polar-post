import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('[Prisma] DATABASE_URL not set. Available envs:', 
      Object.keys(process.env).filter(k => k.toLowerCase().includes('db') || k.toLowerCase().includes('url')))
    throw new Error('DATABASE_URL environment variable is not set')
  }

  console.log('[Prisma] Creating client with adapter, DATABASE_URL length:', databaseUrl.length)

  // Prisma 7: Use driver adapter for PostgreSQL
  try {
    const adapter = new PrismaPg({ connectionString: databaseUrl })
    const client = new PrismaClient({ adapter })
    
    console.log('[Prisma] Client created with PrismaPg adapter')
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client
    }
    
    return client
  } catch (error: any) {
    console.error('[Prisma] Error creating client with adapter:', error.message)
    throw error
  }
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