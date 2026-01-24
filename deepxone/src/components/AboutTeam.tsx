'use client'

import { Users } from 'lucide-react'

const team = [
  {
    name: 'Leadership Team',
    role: 'Executive',
    description: 'Decades of combined experience in enterprise AI, software engineering, and business transformation.',
  },
  {
    name: 'AI Engineers',
    role: 'Technical',
    description: 'Deep expertise in machine learning, natural language processing, and decision systems.',
  },
  {
    name: 'Solution Architects',
    role: 'Strategy',
    description: 'Specialists in enterprise integration, scalability, and security best practices.',
  },
]

export function AboutTeam() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">Our Team</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-gray-700 transition-colors"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">{member.name}</h3>
            <p className="text-primary text-sm mb-3">{member.role}</p>
            <p className="text-text-secondary text-sm">{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
