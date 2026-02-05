// Handwrytten API client with retry logic
// Documentation: https://www.handwrytten.com/api/documentation

interface HandwryttenAddress {
  first_name?: string
  last_name?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country?: string
}

interface HandwryttenCardRequest {
  stationery_id: string
  message: string
  recipient: HandwryttenAddress
  sender?: HandwryttenAddress
  card_style?: string
  font_style?: string
  ink_color?: string
}

interface HandwryttenCardResponse {
  success: boolean
  card_id?: string
  status?: string
  message?: string
  error?: string
}

const HANDWRYTTEN_API_BASE = 'https://api.handwrytten.com/v1'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000

class HandwryttenClient {
  private apiKey: string
  private stationeryId: string

  constructor() {
    this.apiKey = process.env.HANDWRYTTEN_API_KEY!
    this.stationeryId = process.env.HANDWRYTTEN_STATIONERY_ID!

    if (!this.apiKey) {
      throw new Error('HANDWRYTTEN_API_KEY environment variable is not set')
    }
    if (!this.stationeryId) {
      throw new Error('HANDWRYTTEN_STATIONERY_ID environment variable is not set')
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      // If rate limited or server error, retry
      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt
        console.log(`Handwrytten API error ${response.status}, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})...`)
        await this.sleep(delay)
        return this.fetchWithRetry(url, options, attempt + 1)
      }

      return response
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt
        console.log(`Handwrytten API network error, retrying in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})...`)
        await this.sleep(delay)
        return this.fetchWithRetry(url, options, attempt + 1)
      }
      throw error
    }
  }

  async sendCard(
    message: string,
    recipient: {
      childName: string
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  ): Promise<HandwryttenCardResponse> {
    try {
      // Split child name into first/last (Handwrytten requires separate fields)
      const nameParts = recipient.childName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ' '

      const payload: HandwryttenCardRequest = {
        stationery_id: this.stationeryId,
        message: message,
        recipient: {
          first_name: firstName,
          last_name: lastName,
          address1: recipient.line1,
          address2: recipient.line2,
          city: recipient.city,
          state: recipient.state,
          zip: recipient.postalCode,
          country: recipient.country,
        },
        // Optional styling - can be customized
        font_style: 'script',
        ink_color: 'black',
      }

      const response = await this.fetchWithRetry(
        `${HANDWRYTTEN_API_BASE}/cards`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        card_id: data.card?.id || data.id,
        status: data.card?.status || data.status,
        message: 'Card created successfully',
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Handwrytten API error:', errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async getCardStatus(cardId: string): Promise<HandwryttenCardResponse> {
    try {
      const response = await this.fetchWithRetry(
        `${HANDWRYTTEN_API_BASE}/cards/${cardId}`,
        { method: 'GET' }
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        card_id: data.id,
        status: data.status,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}

// Singleton instance
let clientInstance: HandwryttenClient | null = null

export function getHandwryttenClient(): HandwryttenClient {
  if (!clientInstance) {
    clientInstance = new HandwryttenClient()
  }
  return clientInstance
}

export default getHandwryttenClient
