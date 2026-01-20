import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/auth.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Create or get user
    const user = await authService.createEmailUser(email, name)

    // Create session
    const sessionId = await authService.createSession(user.id)

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      sessionId,
    })
  } catch (error: any) {
    console.error('Email auth error:', error)
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    )
  }
}
