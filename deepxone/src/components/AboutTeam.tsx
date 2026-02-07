'use client'

import { User } from 'lucide-react'

const team = [
  {
    name: 'Nade Azeez',
    role: 'CEO',
    initials: 'NA',
  },
  {
    name: 'Sasha Amow',
    role: 'Manager, Operations',
    initials: 'SA',
  },
  {
    name: 'John Moss',
    role: 'DevOps Manager',
    initials: 'JM',
  },
  {
    name: 'Sharon Faria',
    role: 'Manager, PMO',
    initials: 'SF',
  },
]

export function AboutTeam() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-text-primary mb-4 text-center">Meet the Team</h2>
      <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
        The people behind DeepXone driving innovation and delivering results.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-primary/50 transition-colors group"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-pink to-primary-purple rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">{member.initials}</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">{member.name}</h3>
            <p className="text-primary text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
