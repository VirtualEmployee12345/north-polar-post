import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    // During build time, return a dummy client that will error if actually used
    // This allows Next.js to complete static generation
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('DATABASE_URL not set - Prisma client not initialized')
      return null as unknown as PrismaClient
    }
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
