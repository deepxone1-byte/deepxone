'use client'

import { Download, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ExportDecisionProps {
  scenario: string
  mode: string
  decision: string
  confidence: number
  risk: string
  businessImpact: string
  reasoning: string
  responseTime?: number
  provider?: string
}

export function ExportDecision({
  scenario,
  mode,
  decision,
  confidence,
  risk,
  businessImpact,
  reasoning,
  responseTime,
  provider
}: ExportDecisionProps) {
  const [copied, setCopied] = useState(false)

  const formatAsText = () => {
    return `DeepXone Decisions™ - AI Decision Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENARIO
${scenario}

DECISION MODE: ${mode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECISION
${decision}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METRICS
• Confidence: ${confidence}%
• Risk Level: ${risk.toUpperCase()}
• Business Impact: ${businessImpact}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REASONING
${reasoning}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METADATA
${provider ? `• AI Provider: ${provider.toUpperCase()}` : ''}
${responseTime ? `• Response Time: ${responseTime}s` : ''}
• Generated: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DeepXone Decisions™
Control the outcome, not just the output.
`
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatAsText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const text = formatAsText()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deepxone-decision-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const text = formatAsText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DeepXone AI Decision',
          text: text,
        })
      } catch (err) {
        console.error('Share failed:', err)
        // Fallback to copy
        handleCopyToClipboard()
      }
    } else {
      // Fallback to copy
      handleCopyToClipboard()
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyToClipboard}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">Copy</span>
          </>
        )}
      </button>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Download</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </button>
    </div>
  )
}
