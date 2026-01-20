'use client'

import { DecisionSimulatorAI } from '@/components/DecisionSimulatorAI'
import { Logo } from '@/components/Logo'
import { ArrowRight, Shield, Zap, CheckCircle2, Phone } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-6">
              <a href="tel:+6479488700" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">647 948 8700</span>
              </a>
              <a href="https://cal.com/deep-xone-umqzaq" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://cal.com/deep-xone-umqzaq&bgcolor=111827&color=ffffff"
                  alt="Book a demo"
                  className="w-12 h-12 rounded"
                />
                <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">Book Demo</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            AI mistakes don't look like bugs.
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            They look like confident wrong decisions.
          </p>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto">
            See how different AI decision modes change risk, confidence, and outcomes — in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#simulator" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors">
              Run a Live Scenario
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="https://cal.com/deep-xone-umqzaq" target="_blank" rel="noopener noreferrer" className="border-2 border-gray-700 hover:border-gray-600 text-text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Book Executive Demo
            </a>
          </div>
        </div>
      </section>

      {/* Main Simulator Section */}
      <section id="simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <DecisionSimulatorAI />
      </section>


      {/* Where It Fits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
          Where DeepXone Fits
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Customer Service', desc: 'Refund decisions, escalations, policy guidance' },
            { icon: CheckCircle2, title: 'Compliance', desc: 'Risk assessment, regulatory alignment' },
            { icon: Zap, title: 'Sales Approvals', desc: 'Discount authorization, deal structure' },
            { icon: Shield, title: 'HR Workflows', desc: 'Policy questions, internal guidance' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Security & Trust
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'No customer data stored in demos',
              'No training on demo inputs',
              'Enterprise-ready design',
              'Human override always available',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <p className="text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-800/50 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Simulate decisions with your own policies.
          </h2>
          <a href="https://cal.com/deep-xone-umqzaq" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-lg font-semibold text-xl transition-colors inline-flex items-center gap-2">
            Schedule a Live Walkthrough
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <div className="text-center md:text-right">
              <p className="text-text-primary text-sm mb-1">
                Contact: 647 948 8700
              </p>
              <p className="text-text-secondary text-sm">
                © 2026 DeepXone Decisions™. Control the outcome, not just the output.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
