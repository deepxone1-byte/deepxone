'use client'

import { Quote } from 'lucide-react'

interface Testimonial {
  quote: string
  name: string
  title: string
  company: string
}

const testimonials: Testimonial[] = [
  {
    quote: "DeepXone transformed how we handle customer service decisions. Our response time dropped by 60% while maintaining compliance.",
    name: "Sarah Chen",
    title: "VP of Operations",
    company: "TechCorp Inc."
  },
  {
    quote: "The ability to simulate different decision modes before deployment gave us confidence we never had with other AI solutions.",
    name: "Michael Rodriguez",
    title: "Chief Risk Officer",
    company: "Financial Services Co."
  },
  {
    quote: "Finally, an AI system that understands our policies and doesn't just pattern-match. The ROI has been exceptional.",
    name: "Jennifer Park",
    title: "Director of Innovation",
    company: "Enterprise Solutions Ltd."
  }
]

export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
        What Our Clients Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
          >
            <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
            <p className="text-text-secondary mb-6 italic">"{testimonial.quote}"</p>
            <div>
              <p className="text-text-primary font-semibold">{testimonial.name}</p>
              <p className="text-text-secondary text-sm">{testimonial.title}</p>
              <p className="text-primary text-sm">{testimonial.company}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
