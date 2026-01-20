import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { authService } from '@/lib/auth/auth.service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await authService.getUserByEmail(session.user.email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's scenarios
    const scenarios = await authService.getUserScenarios(user.id)

    return NextResponse.json({
      scenarios,
    })
  } catch (error: any) {
    console.error('List scenarios error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scenarios', details: error.message },
      { status: 500 }
    )
  }
}
