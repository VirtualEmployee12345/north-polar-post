import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/orders - Create a new order after Stripe checkout
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Validate Stripe checkout session
    // TODO: Create order and letters
    // TODO: Return success response
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order created (placeholder)' 
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/orders?sessionId=xxx - Get order by Stripe session ID
// GET /api/orders?orderId=xxx - Get order by order ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const orderId = searchParams.get('orderId')
    
    if (!sessionId && !orderId) {
      return NextResponse.json(
        { success: false, error: 'sessionId or orderId required' },
        { status: 400 }
      )
    }
    
    // Fetch order with letters
    const order = await prisma.order.findFirst({
      where: sessionId 
        ? { stripeCheckoutSessionId: sessionId }
        : { id: orderId! },
      include: {
        letters: {
          orderBy: { sequenceNumber: 'asc' }
        }
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Format dates for display
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    // Format letter scheduled dates nicely
    const getLetterDisplayDate = (date: Date, index: number) => {
      const d = new Date(date)
      const dec25 = new Date(d.getFullYear(), 11, 25) // Dec 25
      const daysUntilChristmas = Math.ceil((dec25.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilChristmas > 20) return 'Early December'
      if (daysUntilChristmas > 10) return 'Mid-December'
      return 'Just before Christmas Eve'
    }
    
    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        childName: order.childName,
        orderNumber: `NP-${order.id.slice(-6).toUpperCase()}`,
        orderDate: formatDate(order.createdAt),
        total: `$${order.amount.toFixed(2)}`,
        status: order.status,
        letters: order.letters.map((letter, idx) => ({
          sequenceNumber: letter.sequenceNumber,
          scheduledDate: getLetterDisplayDate(letter.sendDate, idx),
          status: letter.status
        }))
      }
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
