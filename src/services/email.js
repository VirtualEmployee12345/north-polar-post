import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM || 'North Polar Post <letters@northpolarpost.com>'

let resendClient = null

function getResendClient() {
  if (!resendClient) {
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(resendApiKey)
  }
  return resendClient
}

async function sendEmail({ to, subject, text }) {
  if (!to) {
    console.warn('Email send skipped: missing recipient')
    return { ok: false, skipped: true }
  }

  try {
    const client = getResendClient()
    await client.emails.send({
      from: resendFrom,
      to,
      subject,
      text,
    })
    return { ok: true }
  } catch (error) {
    console.error('Resend email error:', error)
    return { ok: false, error }
  }
}

export async function sendOrderConfirmation(order) {
  const schedule = Array.isArray(order.adjustedSchedule) ? order.adjustedSchedule : []
  const scheduleLines = schedule
    .map(item => `Letter ${item.sequence}: ${new Date(item.sendDate).toLocaleDateString('en-US')}`)
    .join('\n')

  return sendEmail({
    to: order.email,
    subject: 'Your North Polar Post order is confirmed',
    text: `Thank you for your order!\n\nChild: ${order.childName}\nCity: ${order.city}\n\nExpected mail schedule:\n${scheduleLines || 'We will send your letters soon.'}\n\nWe will email you when each letter ships. Please note that USPS does not provide tracking for handwritten letters.`,
  })
}

export async function sendLetterShippedNotification(order, letter) {
  return sendEmail({
    to: order.email,
    subject: `Letter ${letter.sequenceNumber} has shipped`,
    text: `Good news! Letter ${letter.sequenceNumber} for ${order.childName} has been sent.\n\nThere is no tracking for handwritten letters, but it is now on its way to ${order.city}.`,
  })
}

export async function sendLateOrderNotification(order, lateType) {
  let message = 'Your order was placed close to Christmas, so we are adjusting the mailing schedule.'
  if (lateType === 'after_dec_10') {
    message = 'Your order arrived after December 10. We will skip Letter 1 and send Letters 2 and 3 on an accelerated schedule.'
  }
  if (lateType === 'after_dec_20') {
    message = 'Your order arrived after December 20. We will send Letter 3 with the Official Nice List certificate only.'
  }

  return sendEmail({
    to: order.email,
    subject: 'Important update about your letter schedule',
    text: `${message}\n\nWe appreciate your understanding and will do everything we can to make it magical.`,
  })
}

export async function sendDlqAlert(letterId, error) {
  const alertTo = process.env.DLQ_ALERT_EMAIL
  if (!alertTo) {
    console.warn('DLQ alert skipped: missing DLQ_ALERT_EMAIL')
    return { ok: false, skipped: true }
  }

  return sendEmail({
    to: alertTo,
    subject: 'North Polar Post DLQ alert',
    text: `Letter ${letterId} failed after retries and was moved to the DLQ.\n\nError: ${error}`,
  })
}
