'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  projectType: string
  budgetRange: string
  message: string
  newsletter: boolean
}

const projectTypes = [
  'Decision Systems',
  'Process Automation',
  'Custom AI Solution',
  'Strategy Consulting',
  'Other'
]

const budgetRanges = [
  'Under $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000+'
]

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budgetRange: '',
    message: '',
    newsletter: false
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit form')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        budgetRange: '',
        message: '',
        newsletter: false
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-primary mb-2">Thank You!</h3>
        <p className="text-text-secondary mb-6">
          We've received your message and will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary hover:text-blue-400 transition-colors"
        >
          Submit another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-danger/10 border border-danger/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-danger">{errorMessage}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-text-primary text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-text-primary text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-text-primary text-sm font-medium mb-2">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
            placeholder="Your Company"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-text-primary text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="projectType" className="block text-text-primary text-sm font-medium mb-2">
            Project Type *
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Select a project type</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budgetRange" className="block text-text-primary text-sm font-medium mb-2">
            Budget Range *
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Select a budget range</option>
            {budgetRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-text-primary text-sm font-medium mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors resize-none"
          placeholder="Tell us about your project, challenges, and goals..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="newsletter"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
          className="mt-1 w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-primary"
        />
        <label htmlFor="newsletter" className="text-text-secondary text-sm">
          Subscribe to our newsletter for AI insights, industry trends, and company updates.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
      >
        {status === 'submitting' ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  )
}
