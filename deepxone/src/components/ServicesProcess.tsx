'use client'

import { ArrowRight } from 'lucide-react'

const processSteps = [
  { step: 1, title: 'Discovery', description: 'Deep dive into your business processes, challenges, and goals.' },
  { step: 2, title: 'Design', description: 'Architecture and solution design tailored to your requirements.' },
  { step: 3, title: 'Development', description: 'Iterative implementation with continuous feedback loops.' },
  { step: 4, title: 'Deployment', description: 'Phased rollout with monitoring and optimization.' },
  { step: 5, title: 'Support', description: 'Ongoing maintenance, updates, and strategic guidance.' },
]

export function ServicesProcess() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
        Our Process
      </h2>
      <div className="grid md:grid-cols-5 gap-6">
        {processSteps.map((item, idx) => (
          <div key={idx} className="relative">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center h-full">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm">{item.description}</p>
            </div>
            {idx < processSteps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
