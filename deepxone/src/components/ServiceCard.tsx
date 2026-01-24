'use client'

import { Brain, Cog, Code, Lightbulb, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  cog: Cog,
  code: Code,
  lightbulb: Lightbulb,
}

interface ServiceCardProps {
  iconName: string
  title: string
  description: string
  features: string[]
}

export function ServiceCard({ iconName, title, description, features }: ServiceCardProps) {
  const Icon = iconMap[iconName] || Brain

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="text-text-secondary text-sm flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
