import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'
import { ServiceCard } from '@/components/ServiceCard'
import { Testimonials } from '@/components/Testimonials'
import { ServicesHero } from '@/components/ServicesHero'
import { ServicesProcess } from '@/components/ServicesProcess'
import { ServicesCTA } from '@/components/ServicesCTA'

export const metadata: Metadata = {
  title: 'AI Implementation Services | DeepXone Decisions',
  description: 'Enterprise AI consulting and implementation services. Decision systems, process automation, custom AI solutions, and strategic consulting.',
}

const services = [
  {
    id: 'decision-systems',
    iconName: 'brain',
    title: 'Decision Systems',
    description: 'AI-powered decision engines that learn your policies, not just patterns. Make consistent, auditable decisions at scale.',
    features: [
      'Policy-based decision automation',
      'Real-time risk assessment',
      'Human-in-the-loop workflows',
      'Full audit trail & compliance',
    ],
  },
  {
    id: 'process-automation',
    iconName: 'cog',
    title: 'Process Automation',
    description: 'Intelligent automation that handles complex workflows while maintaining control and visibility.',
    features: [
      'Workflow analysis & optimization',
      'AI-assisted task routing',
      'Exception handling automation',
      'Performance monitoring',
    ],
  },
  {
    id: 'custom-ai',
    iconName: 'code',
    title: 'Custom AI Solutions',
    description: 'Bespoke AI implementations tailored to your unique business challenges and existing infrastructure.',
    features: [
      'Custom model development',
      'Legacy system integration',
      'API & microservices design',
      'Scalable deployment',
    ],
  },
  {
    id: 'strategy',
    iconName: 'lightbulb',
    title: 'Strategy Consulting',
    description: 'Expert guidance on AI adoption, from opportunity assessment to implementation roadmap.',
    features: [
      'AI readiness assessment',
      'Use case prioritization',
      'ROI analysis & forecasting',
      'Change management support',
    ],
  },
]

export default function ServicesPage() {
  return (
    <PageLayout>
      <ServicesHero />

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} id={service.id}>
              <ServiceCard
                iconName={service.iconName}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Proven Results
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-primary mb-2">60%</p>
              <p className="text-text-secondary">Faster Decision Time</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">85%</p>
              <p className="text-text-secondary">Automation Rate</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">100%</p>
              <p className="text-text-secondary">Audit Compliance</p>
            </div>
          </div>
        </div>
      </section>

      <ServicesProcess />
      <Testimonials />
      <ServicesCTA />
    </PageLayout>
  )
}
