'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-800/50 rounded-2xl p-12 text-center">
        <h2 className="text-4xl font-bold text-text-primary mb-6">
          Let's Build Something Together
        </h2>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Ready to see how AI can transform your decision-making? We'd love to hear about your challenges.
        </p>
        <Link
          href="/contact"
          className="bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-lg font-semibold text-xl transition-colors inline-flex items-center gap-2"
        >
          Get in Touch
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </section>
  )
}
