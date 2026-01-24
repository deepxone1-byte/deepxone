import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'
import { FAQAccordion } from '@/components/FAQAccordion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | DeepXone Decisions',
  description: 'Find answers to common questions about DeepXone AI implementation services, our process, pricing, and security practices.',
}

const faqCategories = [
  {
    title: 'Services & Solutions',
    items: [
      {
        question: 'What types of AI solutions does DeepXone provide?',
        answer: 'We specialize in enterprise AI decision systems, process automation, custom AI solutions, and strategic consulting. Our focus is on AI that makes explainable, auditable decisions aligned with your business policies—not just pattern matching.',
      },
      {
        question: 'What industries do you work with?',
        answer: 'We work across multiple industries including financial services, healthcare, retail, manufacturing, and professional services. Our solutions are particularly valuable for organizations that need compliant, auditable decision-making at scale.',
      },
      {
        question: 'Can you integrate with our existing systems?',
        answer: 'Yes. We design our solutions to integrate with your existing technology stack, whether that\'s legacy systems, modern cloud infrastructure, or hybrid environments. We provide APIs, webhooks, and custom connectors as needed.',
      },
      {
        question: 'Do you provide ongoing support after implementation?',
        answer: 'Absolutely. We offer comprehensive support packages including monitoring, maintenance, optimization, and strategic guidance. We\'re invested in your long-term success, not just the initial deployment.',
      },
    ],
  },
  {
    title: 'Process & Timeline',
    items: [
      {
        question: 'How does your engagement process work?',
        answer: 'Our process includes five phases: Discovery (understanding your needs), Design (solution architecture), Development (iterative implementation), Deployment (phased rollout), and Support (ongoing optimization). Each phase involves close collaboration with your team.',
      },
      {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary based on scope and complexity. A focused decision system might take 8-12 weeks, while a comprehensive enterprise transformation could span 6-12 months. We\'ll provide detailed timeline estimates during the Discovery phase.',
      },
      {
        question: 'What level of involvement is required from our team?',
        answer: 'We need engagement from key stakeholders during Discovery and Design, plus access to subject matter experts throughout development. We\'ll work with you to minimize disruption while ensuring the solution meets your needs.',
      },
    ],
  },
  {
    title: 'Pricing & Investment',
    items: [
      {
        question: 'How is pricing structured?',
        answer: 'We offer flexible pricing models including project-based fixed fees, retainer arrangements, and hybrid models. Pricing depends on scope, complexity, and support requirements. We provide detailed proposals after understanding your specific needs.',
      },
      {
        question: 'What ROI can we expect?',
        answer: 'ROI varies by use case, but typical outcomes include 40-70% reduction in decision time, 50-85% automation rates for routine decisions, and significant compliance cost savings. We help you build a business case with realistic projections during Discovery.',
      },
      {
        question: 'Do you offer pilot programs?',
        answer: 'Yes. For larger engagements, we often recommend starting with a focused pilot project to demonstrate value and refine the approach before scaling. This reduces risk and builds confidence in the solution.',
      },
    ],
  },
  {
    title: 'Security & Compliance',
    items: [
      {
        question: 'How do you handle data security?',
        answer: 'Security is foundational to our approach. We use encryption at rest and in transit, implement strict access controls, and follow security best practices. We can deploy solutions in your cloud environment or private infrastructure if required.',
      },
      {
        question: 'Is my data used to train AI models?',
        answer: 'No. We never use your data to train models for other clients. Your data remains your data. Our demo environment specifically does not store or train on any inputs.',
      },
      {
        question: 'Can your solutions meet regulatory compliance requirements?',
        answer: 'Yes. Our decision systems are designed with compliance in mind, providing full audit trails, explainable decisions, and human-in-the-loop capabilities. We work with organizations in regulated industries including finance and healthcare.',
      },
      {
        question: 'Do you sign NDAs and data processing agreements?',
        answer: 'Yes. We\'re happy to sign NDAs before detailed discussions and comprehensive data processing agreements as part of any engagement. We take data protection seriously.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto">
            Find answers to common questions about our services, process, and how we can help your organization.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-text-primary mb-6">{category.title}</h2>
              <FAQAccordion items={category.items} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-800/50 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            We're happy to discuss your specific situation and answer any questions you might have.
          </p>
          <Link
            href="/contact"
            className="bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-lg font-semibold text-xl transition-colors inline-flex items-center gap-2"
          >
            Contact Us
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
