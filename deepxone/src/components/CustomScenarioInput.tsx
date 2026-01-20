'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, FileText, Sparkles } from 'lucide-react'

interface CustomScenarioInputProps {
  onSubmit: (scenario: { title: string; context: string }) => void
  onCancel: () => void
}

export function CustomScenarioInput({ onSubmit, onCancel }: CustomScenarioInputProps) {
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !context.trim()) return

    // For MVP, just submit directly
    // In production, you'd validate email and save to database
    onSubmit({
      title: title.trim(),
      context: context.trim()
    })
  }

  const exampleScenarios = [
    {
      title: 'Vendor Contract Renewal',
      context: 'Vendor wants 15% price increase for annual software renewal. Current spend: $50k/year. Contract expires in 30 days. Alternative vendors available but require migration.'
    },
    {
      title: 'Team Expansion Request',
      context: 'Engineering manager requests 3 additional developers. Current team: 8 people. Backlog: 6 months. Budget: Can accommodate 2 new hires this quarter.'
    },
    {
      title: 'Customer Feature Request',
      context: 'Enterprise customer (paying $100k/year) demands specific feature in 2 weeks or they\'ll churn. Feature estimated at 3 weeks dev time. Affects product roadmap.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border-2 border-primary/40 rounded-2xl p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Create Custom Scenario</h3>
            <p className="text-sm text-text-secondary">Test AI decisions on your actual business situations</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wide">
            Scenario Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Urgent Customer Escalation"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
            maxLength={100}
          />
          <div className="text-xs text-text-secondary mt-1 text-right">
            {title.length}/100
          </div>
        </div>

        {/* Context Input */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wide">
            Scenario Details
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the situation with key details: what happened, relevant numbers, timeframes, constraints, etc.&#10;&#10;Example: Customer demands refund for $5,000 annual contract after using service for 2 months. Claims product doesn't meet expectations. Usage logs show 45 logins across team. Contract has no refund clause."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors min-h-[200px] resize-y"
            maxLength={1000}
          />
          <div className="text-xs text-text-secondary mt-1 text-right">
            {context.length}/1000
          </div>
        </div>

        {/* Example Scenarios */}
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
            Need Inspiration? Try These:
          </label>
          <div className="grid gap-3">
            {exampleScenarios.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTitle(example.title)
                  setContext(example.context)
                }}
                className="text-left p-4 bg-gray-800/30 border border-gray-700 rounded-lg hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-text-primary mb-1">{example.title}</div>
                    <div className="text-sm text-text-secondary line-clamp-2">{example.context}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !context.trim()}
            className="flex-1 bg-primary hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Use This Scenario
          </button>
          <button
            onClick={onCancel}
            className="px-8 py-4 border-2 border-gray-700 hover:border-gray-600 text-text-primary rounded-xl font-semibold text-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}
