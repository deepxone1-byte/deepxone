'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process request')
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <PageLayout>
      <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-primary-pink mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-text-primary mb-4">Unsubscribe from Marketing Emails</h1>
          <p className="text-text-secondary">
            Enter your email address below to opt out of marketing communications from DeepXone.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">You've Been Unsubscribed</h3>
            <p className="text-text-secondary mb-4">
              You will no longer receive marketing emails from DeepXone. Please note that you may still receive transactional emails related to any active projects or inquiries.
            </p>
            <p className="text-text-secondary text-sm">
              Changed your mind? <a href="/contact" className="text-primary hover:underline">Contact us</a> to re-subscribe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-danger/10 border border-danger/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-danger">{errorMessage}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-text-primary text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all"
            >
              {status === 'submitting' ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                'Unsubscribe'
              )}
            </button>

            <p className="text-text-secondary text-sm text-center">
              By unsubscribing, you will no longer receive newsletters, promotional offers, or marketing updates. You will still receive important transactional communications.
            </p>
          </form>
        )}
      </section>
    </PageLayout>
  )
}
