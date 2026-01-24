'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Phone, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="tel:+6479488700"
              className="hidden sm:flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">647 948 8700</span>
            </a>
            <a
              href="https://cal.com/deep-xone-umqzaq"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex flex-col items-center gap-1 group"
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://cal.com/deep-xone-umqzaq&bgcolor=111827&color=ffffff"
                alt="Book a demo"
                className="w-12 h-12 rounded"
              />
              <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">
                Book Demo
              </span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-800 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-4 text-text-secondary hover:text-text-primary hover:bg-gray-900/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <a
                  href="tel:+6479488700"
                  className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">647 948 8700</span>
                </a>
                <a
                  href="https://cal.com/deep-xone-umqzaq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Book Demo
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
