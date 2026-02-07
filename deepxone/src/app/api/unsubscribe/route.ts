import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database.service'

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = body.email?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Update marketing opt-in status for this email in contact_submissions
    await db.query(
      `UPDATE contact_submissions
       SET newsletter_opt_in = FALSE, unsubscribed_at = NOW()
       WHERE email = ?`,
      [email]
    )

    // Also insert into a dedicated unsubscribe log for compliance tracking
    await db.query(
      `INSERT INTO marketing_unsubscribes (email, unsubscribed_at, ip_address)
       VALUES (?, NOW(), ?)
       ON DUPLICATE KEY UPDATE unsubscribed_at = NOW()`,
      [email, request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown']
    )

    return NextResponse.json(
      { success: true, message: 'Successfully unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request. Please try again later.' },
      { status: 500 }
    )
  }
}
