import { NextRequest, NextResponse } from 'next/server'
import { getAIDecision } from '@/lib/ai/service'
import { DecisionMode } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario, mode, provider } = body

    if (!scenario || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: scenario and mode' },
        { status: 400 }
      )
    }

    if (!['speed', 'balanced', 'compliance', 'customer'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be: speed, balanced, compliance, or customer' },
        { status: 400 }
      )
    }

    const result = await getAIDecision(
      scenario,
      mode as DecisionMode,
      provider as 'openai' | 'anthropic' | undefined
    )

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('AI Decision Error:', error)

    if (error.message?.includes('API_KEY not configured')) {
      return NextResponse.json(
        { error: 'AI provider not configured. Please add API keys to .env.local' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate AI decision', details: error.message },
      { status: 500 }
    )
  }
}
