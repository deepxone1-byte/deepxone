import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { authService } from '@/lib/auth/auth.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, context } = body

    if (!title || !context) {
      return NextResponse.json(
        { error: 'Title and context are required' },
        { status: 400 }
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

    // Save scenario
    const scenarioId = await authService.saveScenario(user.id, title, context)

    return NextResponse.json({
      success: true,
      scenarioId,
    })
  } catch (error: any) {
    console.error('Save scenario error:', error)
    return NextResponse.json(
      { error: 'Failed to save scenario', details: error.message },
      { status: 500 }
    )
  }
}
