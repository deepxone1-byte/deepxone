import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'
import { AboutValues } from '@/components/AboutValues'
import { AboutTeam } from '@/components/AboutTeam'
import { AboutCTA } from '@/components/AboutCTA'

export const metadata: Metadata = {
  title: 'About Us | DeepXone Decisions',
  description: 'Learn about DeepXone - our mission to help enterprises deploy AI that makes decisions you can trust, audit, and explain.',
}

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            About DeepXone
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto">
            We're on a mission to help enterprises deploy AI that makes decisions you can trust, audit, and explain.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-6">Our Mission</h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              AI is changing how businesses operate, but most AI deployments fail because they can't be trusted.
              Models make confident wrong decisions, lack transparency, and don't align with business policies.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed mt-4">
              We founded DeepXone to solve this. Our decision systems learn your policies—not just patterns—so
              every AI decision is explainable, auditable, and aligned with your business rules.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                DeepXone was born from a simple observation: enterprise AI projects kept failing not because the
                technology wasn't ready, but because businesses couldn't trust the decisions AI was making.
              </p>
              <p>
                We saw compliance teams reject AI tools because they couldn't explain their reasoning. We saw
                customer service teams override AI suggestions because they contradicted company policy. We saw
                executives hesitate to automate decisions because the risk was too high.
              </p>
              <p>
                So we built something different. Our platform doesn't just predict—it decides according to your
                rules, explains its reasoning, and knows when to escalate to humans. It's AI that works the way
                your business actually operates.
              </p>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">2023</p>
                <p className="text-text-secondary">Founded</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">Enterprise</p>
                <p className="text-text-secondary">Focus</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">Global</p>
                <p className="text-text-secondary">Reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutValues />
      <AboutTeam />
      <AboutCTA />
    </PageLayout>
  )
}
