import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const failedLetters = await prisma.failedLetter.findMany({
      where: { resolved: false },
      include: {
        letter: {
          include: {
            order: true,
          },
        },
      },
      orderBy: {
        lastAttemptAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      failedLetters,
    })
  } catch (error) {
    console.error('DLQ fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch DLQ' },
      { status: 500 }
    )
  }
}
