import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Run raw SQL to create tables
    await prisma.$executeRaw`
      CREATE TYPE IF NOT EXISTS "CircuitBreakerStatus" AS ENUM ('CLOSED', 'OPEN', 'HALF_OPEN');
    `
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CircuitBreakerState" (
        "id" TEXT PRIMARY KEY,
        "service" TEXT UNIQUE,
        "state" "CircuitBreakerStatus" DEFAULT 'CLOSED',
        "failureCount" INTEGER DEFAULT 0,
        "lastFailureAt" TIMESTAMP,
        "openedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP
      );
    `
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CronRun" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE,
        "lastRunAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP
      );
    `
    
    return NextResponse.json({ success: true, message: 'Migration completed' })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hint: 'Tables may already exist or migration failed'
    }, { status: 500 })
  }
}