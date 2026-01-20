'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Scale, Heart, AlertTriangle, CheckCircle2, TrendingUp, Loader2, Sparkles, Clock, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { RiskGauge } from './RiskGauge'
import { CountUpNumber } from './CountUpNumber'
import { CustomScenarioInput } from './CustomScenarioInput'
import { ExportDecision } from './ExportDecision'
import { AuthModal } from './AuthModal'
import { MODE_COLORS, ModeId } from '@/lib/constants'

type Scenario = {
  id: string
  title: string
  description: string
  context: string
}

type DecisionMode = {
  id: ModeId
  name: string
  icon: any
  description: string
  tagline: string
}

type Outcome = {
  response: string
  confidence: number
  risk: 'low' | 'medium' | 'high'
  businessImpact: string
  reasoning: string
  provider?: string
  model?: string
  isAI?: boolean
  responseTime?: number
}

const scenarios: Scenario[] = [
  {
    id: 'refund',
    title: 'Customer Refund',
    description: 'Customer requests refund for subscription they used for 3 weeks',
    context: 'Customer: "I want a full refund. Your service didn\'t work as advertised." (Subscription: $499/mo, Used: 21 days, Login frequency: 2x)'
  },
  {
    id: 'hr-policy',
    title: 'HR Policy Question',
    description: 'Employee asks about remote work eligibility during family emergency',
    context: 'Employee: "My parent is in the hospital. Can I work remotely for 2 weeks while I help them?" (Employee tenure: 8 months, Role: Customer Support)'
  },
  {
    id: 'sales-discount',
    title: 'Sales Discount Approval',
    description: 'Sales rep requests 40% discount for enterprise deal',
    context: 'Sales Rep: "Enterprise client wants 40% off annual contract ($120k → $72k). They\'re comparing us to competitors." (Deal size: $120k, Competitor bid: $65k)'
  },
  {
    id: 'compliance',
    title: 'Compliance Escalation',
    description: 'Data access request from customer in regulated industry',
    context: 'Customer: "I need all data you have on me and my team for a regulatory audit." (Industry: Healthcare, Account type: Enterprise, Data scope: 15 users, 2 years)'
  },
  {
    id: 'knowledge',
    title: 'Internal Knowledge Lookup',
    description: 'Support agent asks about handling of expired contracts',
    context: 'Agent: "Customer\'s contract expired 45 days ago but they\'re still using the service. Do we cut them off or send another notice?" (Account value: $12k/year)'
  }
]

const decisionModes: DecisionMode[] = [
  {
    id: 'speed',
    name: 'Speed-first',
    icon: Zap,
    description: 'Optimize for fast resolution',
    tagline: 'Resolve quickly, minimize friction'
  },
  {
    id: 'balanced',
    name: 'Risk-balanced',
    icon: Scale,
    description: 'Balance all factors',
    tagline: 'Weigh risk, policy, and customer needs'
  },
  {
    id: 'compliance',
    name: 'Compliance-first',
    icon: Shield,
    description: 'Prioritize policy adherence',
    tagline: 'Follow policy, minimize liability'
  },
  {
    id: 'customer',
    name: 'Customer-first',
    icon: Heart,
    description: 'Maximize customer satisfaction',
    tagline: 'Retain customer, build loyalty'
  }
]

export function DecisionSimulatorAI() {
  const { data: session, status } = useSession()
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null)
  const [currentOutcome, setCurrentOutcome] = useState<Outcome | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customScenario, setCustomScenario] = useState<Scenario | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [customScenarioCount, setCustomScenarioCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const currentScenario = customScenario || scenarios.find(s => s.id === selectedScenario)
  const currentMode = decisionModes.find(m => m.id === selectedMode)
  const modeColors = selectedMode ? MODE_COLORS[selectedMode] : null

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Check NextAuth session OR localStorage email auth
      const hasSession = status === 'authenticated' && !!session?.user
      const hasLocalAuth = localStorage.getItem('deepxone_user') !== null
      setIsAuthenticated(hasSession || hasLocalAuth)

      // Get custom scenario count from localStorage
      const count = parseInt(localStorage.getItem('deepxone_custom_count') || '0')
      setCustomScenarioCount(count)
    }

    checkAuth()
  }, [session, status])

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setCustomScenario(null)
    setCurrentOutcome(null)
    setError(null)
  }

  const handleModeSelect = (modeId: ModeId) => {
    setSelectedMode(modeId)
    setCurrentOutcome(null)
    setError(null)
  }

  const handleCustomScenarioSubmit = async (scenario: { title: string; context: string }) => {
    // Check if they need to authenticate
    if (!isAuthenticated && customScenarioCount >= 1) {
      // Show auth modal
      setShowAuthModal(true)
      return
    }

    // Save to state
    setCustomScenario({
      id: 'custom',
      title: scenario.title,
      description: scenario.context.slice(0, 100) + '...',
      context: scenario.context
    })
    setSelectedScenario(null)
    setShowCustomInput(false)
    setCurrentOutcome(null)
    setError(null)

    // Increment count in localStorage
    const newCount = customScenarioCount + 1
    setCustomScenarioCount(newCount)
    localStorage.setItem('deepxone_custom_count', newCount.toString())

    // If authenticated, save to database
    if (isAuthenticated) {
      try {
        await fetch('/api/scenarios/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: scenario.title,
            context: scenario.context,
          }),
        })
      } catch (err) {
        console.error('Failed to save scenario:', err)
        // Non-fatal, continue anyway
      }
    }
  }

  const handleCreateCustom = () => {
    // Check if they need to authenticate first
    if (!isAuthenticated && customScenarioCount >= 1) {
      setShowAuthModal(true)
      return
    }

    setShowCustomInput(true)
    setSelectedScenario(null)
    setCustomScenario(null)
    setCurrentOutcome(null)
    setError(null)
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    // Open custom scenario input
    setShowCustomInput(true)
  }

  const handleSimulate = async () => {
    if ((!selectedScenario && !customScenario) || !selectedMode || !currentScenario) return

    setIsLoading(true)
    setError(null)
    setCurrentOutcome(null)

    const startTime = performance.now()

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: currentScenario.context,
          mode: selectedMode,
        }),
      })

      const data = await response.json()
      const responseTime = ((performance.now() - startTime) / 1000).toFixed(1)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate decision')
      }

      setCurrentOutcome({
        response: data.response,
        confidence: data.confidence,
        risk: data.risk,
        businessImpact: data.businessImpact,
        reasoning: data.reasoning,
        provider: data.provider,
        model: data.model,
        isAI: true,
        responseTime: parseFloat(responseTime)
      })

    } catch (err: any) {
      console.error('Simulation error:', err)
      setError(err.message || 'Failed to generate AI decision')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Choose Scenario */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
            1
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Choose a Business Scenario</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                selectedScenario === scenario.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {scenario.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {scenario.description}
              </p>
            </button>
          ))}

          {/* Create Custom Scenario Button */}
          <button
            onClick={handleCreateCustom}
            className={`text-left p-6 rounded-xl border-2 transition-all group ${
              customScenario
                ? 'border-primary bg-primary/10'
                : 'border-dashed border-gray-700 bg-gray-900/30 hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              {customScenario && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {customScenario ? customScenario.title : 'Create Custom Scenario'}
            </h3>
            <p className="text-sm text-text-secondary">
              {customScenario ? 'Custom scenario loaded' : 'Test AI decisions on your own business situations'}
            </p>
          </button>
        </div>
      </div>

      {/* Custom Scenario Input */}
      <AnimatePresence>
        {showCustomInput && (
          <CustomScenarioInput
            onSubmit={handleCustomScenarioSubmit}
            onCancel={() => setShowCustomInput(false)}
          />
        )}
      </AnimatePresence>

      {/* Scenario Context */}
      <AnimatePresence>
        {currentScenario && !showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
              Scenario Context
            </h3>
            <p className="text-text-primary leading-relaxed">
              {currentScenario.context}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Select Decision Mode */}
      {(selectedScenario || customScenario) && !showCustomInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
              2
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Select Decision Mode</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {decisionModes.map((mode) => {
              const Icon = mode.icon
              const colors = MODE_COLORS[mode.id]
              const isSelected = selectedMode === mode.id

              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                  style={{
                    borderColor: isSelected ? colors.primary : undefined,
                    backgroundColor: isSelected ? colors.primary + '15' : undefined
                  }}
                  className={`text-left p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                    isSelected
                      ? 'shadow-lg'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  {/* Gradient overlay for selected mode */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, transparent 100%)`
                      }}
                    />
                  )}

                  <Icon
                    className={`w-8 h-8 mb-3 relative z-10`}
                    style={{ color: isSelected ? colors.primary : '#9CA3AF' }}
                  />
                  <h3 className="text-lg font-semibold text-text-primary mb-2 relative z-10">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-2 relative z-10">
                    {mode.description}
                  </p>
                  <p
                    className="text-xs font-medium relative z-10"
                    style={{ color: colors.primary }}
                  >
                    {mode.tagline}
                  </p>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Simulate Button */}
      {(selectedScenario || customScenario) && selectedMode && !showCustomInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={handleSimulate}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#374151' : modeColors?.primary,
              boxShadow: isLoading ? 'none' : `0 10px 40px ${modeColors?.primary}40`
            }}
            className="disabled:cursor-not-allowed text-white px-12 py-5 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating AI Decision...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Simulate with AI</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger/10 border border-danger/30 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-danger mb-2">
                Error Generating Decision
              </h3>
              <p className="text-text-secondary">
                {error}
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Make sure you've added your API keys to .env.local file.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: View Outcome */}
      <AnimatePresence>
        {currentOutcome && currentMode && modeColors && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold"
                style={{
                  borderColor: modeColors.primary,
                  backgroundColor: modeColors.primary + '20',
                  color: modeColors.primary
                }}
              >
                3
              </div>
              <h2 className="text-2xl font-bold text-text-primary">AI Decision Outcome</h2>

              {/* Provider & Response Time Badges */}
              <div className="ml-auto flex items-center gap-3">
                {currentOutcome.responseTime && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      <span className="text-text-primary font-semibold">{currentOutcome.responseTime}s</span>
                    </span>
                  </div>
                )}
                {currentOutcome.isAI && currentOutcome.provider && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                    style={{
                      backgroundColor: modeColors.primary + '15',
                      borderColor: modeColors.primary + '40'
                    }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: modeColors.primary }} />
                    <span className="text-sm text-text-secondary">
                      Powered by <span className="font-semibold capitalize" style={{ color: modeColors.primary }}>{currentOutcome.provider}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex justify-end mb-6">
              <ExportDecision
                scenario={currentScenario?.context || ''}
                mode={currentMode.name}
                decision={currentOutcome.response}
                confidence={currentOutcome.confidence}
                risk={currentOutcome.risk}
                businessImpact={currentOutcome.businessImpact}
                reasoning={currentOutcome.reasoning}
                responseTime={currentOutcome.responseTime}
                provider={currentOutcome.provider}
              />
            </div>

            <div className="space-y-6">
              {/* AI Response - Hero Display */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border-2 rounded-2xl p-10 relative overflow-hidden"
                style={{
                  borderColor: modeColors.primary + '40',
                  background: `linear-gradient(135deg, ${modeColors.primary}08 0%, transparent 100%)`
                }}
              >
                {/* Decorative gradient orb */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: modeColors.primary }}
                />

                <div className="flex items-start gap-4 relative z-10">
                  {currentMode.icon && (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: modeColors.primary + '20' }}
                    >
                      <currentMode.icon className="w-7 h-7" style={{ color: modeColors.primary }} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3
                      className="text-sm font-bold uppercase tracking-wider mb-3"
                      style={{ color: modeColors.primary }}
                    >
                      {currentMode.name} Decision
                    </h3>
                    <p className="text-2xl text-text-primary font-medium leading-relaxed">
                      {currentOutcome.response}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Metrics Grid - BIGGER & BOLDER */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Confidence Score - HUGE */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6" style={{ color: modeColors.primary }} />
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                      Confidence
                    </h4>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <CountUpNumber
                      value={currentOutcome.confidence}
                      className="text-7xl font-bold text-text-primary"
                    />
                    <span className="text-3xl text-text-secondary font-bold mb-2">%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentOutcome.confidence}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: modeColors.primary }}
                    />
                  </div>
                </motion.div>

                {/* Risk Level - Visual Gauge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-6 h-6" style={{ color: modeColors.primary }} />
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                      Risk Level
                    </h4>
                  </div>
                  <RiskGauge risk={currentOutcome.risk} />
                </motion.div>

                {/* Business Impact */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-8 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6" style={{ color: modeColors.primary }} />
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                      Business Impact
                    </h4>
                  </div>
                  <p className="text-xl text-text-primary leading-relaxed flex-1 flex items-center">
                    {currentOutcome.businessImpact}
                  </p>
                </motion.div>
              </div>

              {/* Reasoning */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8"
              >
                <h4
                  className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                  style={{ color: modeColors.primary }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Decision Reasoning
                </h4>
                <p className="text-lg text-text-primary leading-relaxed">
                  {currentOutcome.reasoning}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
