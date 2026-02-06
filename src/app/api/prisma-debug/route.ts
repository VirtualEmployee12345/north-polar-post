import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug: any = {
    env: {
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
      PRISMA_ENV: Object.keys(process.env).filter(k => k.toLowerCase().includes('prisma')),
    },
    prismaModule: null as any,
    clientCreation: null as any,
    error: null as any,
  }

  try {
    // Step 1: Try to import PrismaClient
    debug.prismaModule = {
      step: 'import',
      status: 'attempting',
    }
    
    const { default: PrismaClient } = await import('@prisma/client')
    debug.prismaModule.status = 'success'
    debug.prismaModule.type = typeof PrismaClient
    
    // Step 2: Try to create client with no args
    debug.clientCreation = {
      step: 'new PrismaClient()',
      status: 'attempting',
    }
    
    try {
      const client1 = new PrismaClient()
      debug.clientCreation.status = 'success'
      debug.clientCreation.result = 'Created with no args'
      
      // Try to access a property
      try {
        const test = client1.$connect
        debug.clientCreation.$connect = typeof test
      } catch (e: any) {
        debug.clientCreation.$connectError = e.message
      }
    } catch (e: any) {
      debug.clientCreation.status = 'failed'
      debug.clientCreation.error = e.message
      debug.clientCreation.stack = e.stack?.slice(0, 500)
    }
    
    // Step 3: Try with explicit datasourceUrl
    debug.clientCreationWithUrl = {
      step: 'new PrismaClient({ datasourceUrl })',
      status: 'attempting',
    }
    
    try {
      const client2 = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      } as any)
      debug.clientCreationWithUrl.status = 'success'
      debug.clientCreationWithUrl.result = 'Created with datasourceUrl'
    } catch (e: any) {
      debug.clientCreationWithUrl.status = 'failed'
      debug.clientCreationWithUrl.error = e.message
    }
    
    // Step 4: Try with datasources config
    debug.clientCreationWithDatasources = {
      step: 'new PrismaClient({ datasources: { db: { url } } })',
      status: 'attempting',
    }
    
    try {
      const client3 = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      } as any)
      debug.clientCreationWithDatasources.status = 'success'
      debug.clientCreationWithDatasources.result = 'Created with datasources config'
    } catch (e: any) {
      debug.clientCreationWithDatasources.status = 'failed'
      debug.clientCreationWithDatasources.error = e.message
    }
    
  } catch (e: any) {
    debug.error = {
      step: 'fatal',
      message: e.message,
      stack: e.stack?.slice(0, 1000),
    }
  }

  return NextResponse.json(debug)
}