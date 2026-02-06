import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy singleton - only create when first accessed
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not set. Env keys:', Object.keys(process.env).filter(k => k.includes('DB') || k.includes('URL')))
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Prisma 7: use datasources.db.url configuration
  const client = new PrismaClient({
    datasources: {
      db: { url: databaseUrl }
    }
  } as any)
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  
  return client
}

// Export lazy proxy that creates client on first use
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
