'use client'

import { CheckCircle2 } from 'lucide-react'

const trustItems = [
  'No customer data stored in demos',
  'No training on demo inputs',
  'Enterprise-ready design',
  'Human override always available',
]

export function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
          Security & Trust
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <p className="text-text-secondary">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
