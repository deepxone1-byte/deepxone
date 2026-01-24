'use client'

import { Target, Shield, Users, Zap } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Outcome-Focused',
    description: 'We measure success by the business outcomes we deliver, not the complexity of our solutions.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'Every AI decision should be explainable, auditable, and aligned with your policies.',
  },
  {
    icon: Users,
    title: 'Human-Centric',
    description: 'AI should augment human decision-making, not replace accountability.',
  },
  {
    icon: Zap,
    title: 'Practical Innovation',
    description: 'We deploy proven solutions that work today, not vaporware from tomorrow.',
  },
]

export function AboutValues() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">Our Values</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
          >
            <value.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">{value.title}</h3>
            <p className="text-text-secondary">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
