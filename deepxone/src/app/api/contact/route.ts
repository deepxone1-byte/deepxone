import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database.service'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email/email.service'

interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  projectType: string
  budgetRange: string
  message: string
  marketingOptIn: boolean
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function sanitizeString(str: string): string {
  return str.trim().slice(0, 1000)
}

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DX-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.company || !body.projectType || !body.budgetRange || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate reference ID
    const referenceId = generateReferenceId()

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email).toLowerCase(),
      company: sanitizeString(body.company),
      phone: body.phone ? sanitizeString(body.phone) : null,
      projectType: sanitizeString(body.projectType),
      budgetRange: sanitizeString(body.budgetRange),
      message: body.message.trim().slice(0, 5000),
      marketingOptIn: body.marketingOptIn ? 1 : 0,
    }

    // Insert into database
    const result = await db.query(
      `INSERT INTO contact_submissions
       (reference_id, name, email, company, phone, project_type, budget_range, message, newsletter_opt_in, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        referenceId,
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.company,
        sanitizedData.phone,
        sanitizedData.projectType,
        sanitizedData.budgetRange,
        sanitizedData.message,
        sanitizedData.marketingOptIn,
      ]
    )

    // Send email notifications (don't await - fire and forget)
    const emailData = {
      referenceId,
      name: sanitizedData.name,
      email: sanitizedData.email,
      company: sanitizedData.company,
      phone: sanitizedData.phone,
      projectType: sanitizedData.projectType,
      budgetRange: sanitizedData.budgetRange,
      message: sanitizedData.message,
      marketingOptIn: Boolean(sanitizedData.marketingOptIn),
    }

    // Send notifications in background
    sendContactNotification(emailData).catch(console.error)
    sendContactConfirmation(emailData).catch(console.error)

    return NextResponse.json(
      { success: true, id: result.insertId, referenceId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    )
  }
}
