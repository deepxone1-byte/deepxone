'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Scale, Heart, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'

type Scenario = {
  id: string
  title: string
  description: string
  context: string
}

type DecisionMode = {
  id: string
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

// Simulated AI outcomes for different scenario + mode combinations
const outcomes: Record<string, Record<string, Outcome>> = {
  refund: {
    speed: {
      response: 'Approve partial refund of $166 (pro-rated for unused period).',
      confidence: 85,
      risk: 'low',
      businessImpact: 'Quick resolution, minimal review needed',
      reasoning: 'Standard refund policy applied automatically'
    },
    balanced: {
      response: 'Offer $249 credit toward next billing cycle + free premium support consultation.',
      confidence: 78,
      risk: 'medium',
      businessImpact: 'Potential retention, moderate cost',
      reasoning: 'Balances customer satisfaction with revenue retention'
    },
    compliance: {
      response: 'Deny refund. Terms clearly state no refunds after 14 days. Offer support consultation to resolve stated issues.',
      confidence: 92,
      risk: 'medium',
      businessImpact: 'Policy adherence, possible escalation',
      reasoning: 'Strict adherence to published terms of service'
    },
    customer: {
      response: 'Approve full $499 refund + extend free trial for one month if they want to try again.',
      confidence: 65,
      risk: 'high',
      businessImpact: 'High cost, strong goodwill gesture',
      reasoning: 'Prioritizes long-term relationship over short-term revenue'
    }
  },
  'hr-policy': {
    speed: {
      response: 'Approve 2 weeks remote work immediately.',
      confidence: 88,
      risk: 'low',
      businessImpact: 'Fast approval, minimal disruption',
      reasoning: 'Standard family emergency accommodation'
    },
    balanced: {
      response: 'Approve 2 weeks remote + check-in after 1 week to assess ongoing needs.',
      confidence: 82,
      risk: 'low',
      businessImpact: 'Supportive with oversight',
      reasoning: 'Combines empathy with operational awareness'
    },
    compliance: {
      response: 'Approve 1 week remote, then require PTO or unpaid leave for week 2 per remote work policy.',
      confidence: 90,
      risk: 'medium',
      businessImpact: 'Policy consistent, may frustrate employee',
      reasoning: 'Remote work policy limits emergency coverage to 5 days'
    },
    customer: {
      response: 'Approve 3 weeks remote work + flexible hours as needed.',
      confidence: 70,
      risk: 'medium',
      businessImpact: 'High flexibility, potential team impact',
      reasoning: 'Maximizes employee support during crisis'
    }
  },
  'sales-discount': {
    speed: {
      response: 'Approve 25% discount ($90k final). Request executive sign-off for anything higher.',
      confidence: 80,
      risk: 'medium',
      businessImpact: 'Fast deal closure, moderate margin impact',
      reasoning: 'Splits difference to close quickly'
    },
    balanced: {
      response: 'Approve 30% discount ($84k) + quarterly business review commitment from client.',
      confidence: 75,
      risk: 'medium',
      businessImpact: 'Competitive pricing with engagement clause',
      reasoning: 'Discount justified by strategic partnership terms'
    },
    compliance: {
      response: 'Deny 40% discount. Maximum allowable is 20% ($96k) per pricing policy. Escalate to VP if client won\'t accept.',
      confidence: 95,
      risk: 'high',
      businessImpact: 'Risk losing deal, maintains pricing integrity',
      reasoning: 'Pricing guardrails prevent margin erosion'
    },
    customer: {
      response: 'Approve 40% discount ($72k) to match competitor and secure enterprise logo.',
      confidence: 60,
      risk: 'high',
      businessImpact: 'Win deal but set precedent for discounting',
      reasoning: 'Prioritizes customer acquisition over margin'
    }
  },
  compliance: {
    speed: {
      response: 'Export standard data package. Send within 3 business days.',
      confidence: 82,
      risk: 'medium',
      businessImpact: 'Quick turnaround, possible incomplete data',
      reasoning: 'Standard export process without detailed review'
    },
    balanced: {
      response: 'Verify request scope with customer, prepare full audit-compliant data export with 5-day timeline.',
      confidence: 85,
      risk: 'low',
      businessImpact: 'Thorough response, slightly longer timeline',
      reasoning: 'Confirms requirements before comprehensive export'
    },
    compliance: {
      response: 'Engage legal team to verify HIPAA requirements. Prepare certified data export with attestation. 10-day timeline.',
      confidence: 95,
      risk: 'low',
      businessImpact: 'Fully compliant, slower response',
      reasoning: 'Healthcare data requires regulatory compliance verification'
    },
    customer: {
      response: 'Assign dedicated compliance specialist to work directly with customer. Export data in their preferred format within 2 days.',
      confidence: 72,
      risk: 'medium',
      businessImpact: 'High-touch service, resource intensive',
      reasoning: 'White-glove treatment for enterprise relationship'
    }
  },
  knowledge: {
    speed: {
      response: 'Send final notice with 7-day grace period, then suspend service.',
      confidence: 88,
      risk: 'low',
      businessImpact: 'Clear timeline, protects revenue',
      reasoning: 'Standard collections process for expired contracts'
    },
    balanced: {
      response: 'Call customer to discuss renewal. If no response in 3 days, send suspension notice.',
      confidence: 80,
      risk: 'low',
      businessImpact: 'Personal touch before enforcement',
      reasoning: 'Attempts to retain customer before service interruption'
    },
    compliance: {
      response: 'Suspend service immediately. Contract terms specify no grace period beyond 30 days.',
      confidence: 92,
      risk: 'medium',
      businessImpact: 'Strict enforcement, potential customer loss',
      reasoning: 'Contract terms require immediate suspension after 30 days'
    },
    customer: {
      response: 'Continue service for 30 more days. Assign account manager to facilitate renewal discussion.',
      confidence: 68,
      risk: 'high',
      businessImpact: 'Extended free service, strong retention effort',
      reasoning: 'Prioritizes relationship preservation for high-value account'
    }
  }
}

export function DecisionSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)

  const currentScenario = scenarios.find(s => s.id === selectedScenario)
  const currentMode = decisionModes.find(m => m.id === selectedMode)
  const currentOutcome = selectedScenario && selectedMode ? outcomes[selectedScenario]?.[selectedMode] : null

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setShowOutcome(false)
  }

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
    setShowOutcome(false)
  }

  const handleSimulate = () => {
    if (selectedScenario && selectedMode) {
      setShowOutcome(true)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success'
      case 'medium': return 'text-warning'
      case 'high': return 'text-danger'
      default: return 'text-text-secondary'
    }
  }

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/10 border-success/30'
      case 'medium': return 'bg-warning/10 border-warning/30'
      case 'high': return 'bg-danger/10 border-danger/30'
      default: return 'bg-gray-800'
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
        </div>
      </div>

      {/* Scenario Context */}
      <AnimatePresence>
        {currentScenario && (
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
      {selectedScenario && (
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
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${
                    selectedMode === mode.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${selectedMode === mode.id ? 'text-primary' : 'text-text-secondary'}`} />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-2">
                    {mode.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {mode.tagline}
                  </p>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Simulate Button */}
      {selectedScenario && selectedMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={handleSimulate}
            className="bg-primary hover:bg-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Zap className="w-5 h-5" />
            Simulate Decision
          </button>
        </motion.div>
      )}

      {/* Step 3: View Outcome */}
      <AnimatePresence>
        {showOutcome && currentOutcome && currentMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
                3
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Decision Outcome</h2>
            </div>

            <div className="space-y-6">
              {/* AI Response */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-8">
                <div className="flex items-start gap-3 mb-4">
                  {currentMode.icon && <currentMode.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-1">
                      {currentMode.name} Decision
                    </h3>
                    <p className="text-xl text-text-primary font-medium leading-relaxed">
                      {currentOutcome.response}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Confidence Score */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                      Confidence
                    </h4>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-text-primary">
                      {currentOutcome.confidence}
                    </span>
                    <span className="text-xl text-text-secondary mb-1">%</span>
                  </div>
                  <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentOutcome.confidence}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className={`border rounded-xl p-6 ${getRiskBgColor(currentOutcome.risk)}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {currentOutcome.risk === 'low' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${getRiskColor(currentOutcome.risk)}`} />
                    )}
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                      Risk Level
                    </h4>
                  </div>
                  <span className={`text-3xl font-bold capitalize ${getRiskColor(currentOutcome.risk)}`}>
                    {currentOutcome.risk}
                  </span>
                </div>

                {/* Business Impact */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                      Business Impact
                    </h4>
                  </div>
                  <p className="text-text-primary leading-relaxed">
                    {currentOutcome.businessImpact}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Decision Reasoning
                </h4>
                <p className="text-text-primary leading-relaxed">
                  {currentOutcome.reasoning}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
