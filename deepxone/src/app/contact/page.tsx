import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'
import { ContactForm } from '@/components/ContactForm'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | DeepXone Decisions',
  description: 'Get in touch with DeepXone. Tell us about your AI implementation needs and we\'ll help you find the right solution.',
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '647 948 8700',
    href: 'tel:+6479488700',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'contact@deepxone.com',
    href: 'mailto:contact@deepxone.com',
  },
  {
    icon: Clock,
    title: 'Response Time',
    content: 'Within 24 hours',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Let's Talk
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto">
            Tell us about your AI implementation needs. We'll help you find the right solution.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {contactInfo.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-semibold mb-1">{item.title}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-text-secondary hover:text-primary transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-text-secondary">{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Book Demo Card */}
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-800/50 rounded-xl p-6">
              <h3 className="text-text-primary font-semibold mb-2">Prefer a Live Demo?</h3>
              <p className="text-text-secondary text-sm mb-4">
                Skip the form and book a call directly with our team.
              </p>
              <a
                href="https://cal.com/deep-xone-umqzaq"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Have Questions?
          </h2>
          <p className="text-text-secondary mb-6">
            Check out our FAQ for quick answers to common questions about our services and process.
          </p>
          <a
            href="/faq"
            className="text-primary hover:text-blue-400 font-semibold transition-colors"
          >
            View Frequently Asked Questions →
          </a>
        </div>
      </section>
    </PageLayout>
  )
}
