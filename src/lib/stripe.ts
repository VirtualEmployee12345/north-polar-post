import Stripe from 'stripe'

// Lazy initialization - only create client when actually used
let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia',
    })
  }
  return stripeClient
}

// Export for backward compatibility - getter that throws if used before init
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    const client = getStripe()
    const value = client[prop as keyof Stripe]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

export default stripe
