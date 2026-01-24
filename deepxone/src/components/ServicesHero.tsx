'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ServicesHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
          AI Implementation Services
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto">
          We help enterprises deploy AI that makes decisions you can trust, audit, and explain.
        </p>
        <Link
          href="/contact"
          className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors"
        >
          Start Your Project
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
