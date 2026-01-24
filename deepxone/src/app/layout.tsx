import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { Analytics } from '@/components/Analytics'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DeepXone Decisions™ - Enterprise AI Decision Systems',
    template: '%s | DeepXone Decisions',
  },
  description: 'AI consulting and implementation services. Decision systems that learn your policies, not just patterns. Explainable, auditable AI for enterprise.',
  keywords: [
    'AI consulting',
    'enterprise AI',
    'decision systems',
    'AI implementation',
    'process automation',
    'machine learning',
    'artificial intelligence',
    'business automation',
    'AI strategy',
    'compliance AI',
  ],
  authors: [{ name: 'DeepXone' }],
  creator: 'DeepXone',
  publisher: 'DeepXone',
  metadataBase: new URL('https://deepxone.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deepxone.com',
    siteName: 'DeepXone Decisions',
    title: 'DeepXone Decisions™ - Enterprise AI Decision Systems',
    description: 'AI consulting and implementation services. Decision systems that learn your policies, not just patterns.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeepXone Decisions - Enterprise AI Decision Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepXone Decisions™ - Enterprise AI Decision Systems',
    description: 'AI consulting and implementation services. Decision systems that learn your policies, not just patterns.',
    images: ['/og-image.png'],
    creator: '@deepxone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
