import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database.service'

interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  projectType: string
  budgetRange: string
  message: string
  newsletter: boolean
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function sanitizeString(str: string): string {
  return str.trim().slice(0, 1000)
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

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email).toLowerCase(),
      company: sanitizeString(body.company),
      phone: body.phone ? sanitizeString(body.phone) : null,
      projectType: sanitizeString(body.projectType),
      budgetRange: sanitizeString(body.budgetRange),
      message: body.message.trim().slice(0, 5000),
      newsletter: Boolean(body.newsletter),
    }

    // Insert into database
    const result = await db.query(
      `INSERT INTO contact_submissions
       (name, email, company, phone, project_type, budget_range, message, newsletter_opt_in, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.company,
        sanitizedData.phone,
        sanitizedData.projectType,
        sanitizedData.budgetRange,
        sanitizedData.message,
        sanitizedData.newsletter,
      ]
    )

    return NextResponse.json(
      { success: true, id: result.insertId },
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
