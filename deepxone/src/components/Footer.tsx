'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Linkedin, Twitter, Phone, Mail } from 'lucide-react'

const footerNavigation = {
  services: [
    { name: 'Decision Systems', href: '/services#decision-systems' },
    { name: 'Process Automation', href: '/services#process-automation' },
    { name: 'Custom AI Solutions', href: '/services#custom-ai' },
    { name: 'Strategy Consulting', href: '/services#strategy' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/company/deepxone', icon: Linkedin },
  { name: 'X', href: 'https://x.com/deepxone', icon: Twitter },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-text-secondary max-w-sm">
              Control the outcome, not just the output. Enterprise AI decision systems that learn your policies, not just patterns.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="tel:+6479488700"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">647 948 8700</span>
              </a>
              <a
                href="mailto:contact@deepxone.com"
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@deepxone.com</span>
              </a>
            </div>
            <p className="text-text-secondary text-sm text-center md:text-right">
              © {new Date().getFullYear()} DeepXone Decisions™. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
