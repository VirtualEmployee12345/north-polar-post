import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    databaseUrlSet: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN')),
  })
}