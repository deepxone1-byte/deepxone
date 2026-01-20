import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { buildPrompt, DecisionMode } from './prompts'

export interface AIDecisionResult {
  response: string
  confidence: number
  risk: 'low' | 'medium' | 'high'
  businessImpact: string
  reasoning: string
  provider: 'openai' | 'anthropic'
  model: string
}

interface ParsedResponse {
  decision: string
  confidence: number
  risk: 'low' | 'medium' | 'high'
  impact: string
  reasoning: string
}

function parseAIResponse(text: string): ParsedResponse {
  const lines = text.split('\n').filter(line => line.trim())

  const result: any = {
    decision: '',
    confidence: 75,
    risk: 'medium',
    impact: '',
    reasoning: ''
  }

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()

    if (key.toLowerCase().includes('decision')) {
      result.decision = value
    } else if (key.toLowerCase().includes('confidence')) {
      const num = parseInt(value.replace(/\D/g, ''))
      result.confidence = isNaN(num) ? 75 : Math.min(100, Math.max(0, num))
    } else if (key.toLowerCase().includes('risk')) {
      const riskValue = value.toLowerCase()
      if (riskValue.includes('low')) result.risk = 'low'
      else if (riskValue.includes('high')) result.risk = 'high'
      else result.risk = 'medium'
    } else if (key.toLowerCase().includes('impact')) {
      result.impact = value
    } else if (key.toLowerCase().includes('reasoning')) {
      result.reasoning = value
    }
  }

  return result as ParsedResponse
}

export async function getAIDecision(
  scenario: string,
  mode: DecisionMode,
  provider?: 'openai' | 'anthropic'
): Promise<AIDecisionResult> {
  const selectedProvider = provider || (process.env.AI_PROVIDER as 'openai' | 'anthropic') || 'anthropic'

  const { system, user } = buildPrompt(mode, scenario)

  if (selectedProvider === 'anthropic') {
    return getAnthropicDecision(system, user, mode)
  } else {
    return getOpenAIDecision(system, user, mode)
  }
}

async function getAnthropicDecision(
  systemPrompt: string,
  userPrompt: string,
  mode: DecisionMode
): Promise<AIDecisionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  })

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'

  const message = await anthropic.messages.create({
    model: model,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = parseAIResponse(responseText)

  return {
    response: parsed.decision,
    confidence: parsed.confidence,
    risk: parsed.risk,
    businessImpact: parsed.impact,
    reasoning: parsed.reasoning,
    provider: 'anthropic',
    model: model
  }
}

async function getOpenAIDecision(
  systemPrompt: string,
  userPrompt: string,
  mode: DecisionMode
): Promise<AIDecisionResult> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1024
  })

  const responseText = completion.choices[0]?.message?.content || ''
  const parsed = parseAIResponse(responseText)

  return {
    response: parsed.decision,
    confidence: parsed.confidence,
    risk: parsed.risk,
    businessImpact: parsed.impact,
    reasoning: parsed.reasoning,
    provider: 'openai',
    model: model
  }
}
