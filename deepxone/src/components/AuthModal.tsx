'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, Sparkles, X } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      // Store session in localStorage for client-side auth check
      localStorage.setItem('deepxone_user', JSON.stringify(data.user))
      localStorage.setItem('deepxone_session', data.sessionId)

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Email sign in error:', err)
      setError(err.message || 'Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Redirect to Google OAuth
      await signIn('google', {
        callbackUrl: window.location.href,
      })
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 border-2 border-primary/40 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Unlock Unlimited Scenarios
            </h2>
            <p className="text-text-secondary">
              Sign in to test any business decision with AI
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-900 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-colors mb-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                  fill="#4285F4"
                />
                <path
                  d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                  fill="#34A853"
                />
                <path
                  d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-text-secondary">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Email address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 text-sm text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Continue with Email</span>
                </>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-text-secondary text-center mb-3">
              What you get:
            </p>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Unlimited custom scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Save scenarios to your account</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Export & share AI decisions</span>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <p className="mt-4 text-xs text-center text-text-secondary">
            We'll never spam you. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
