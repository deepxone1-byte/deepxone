import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeepXone Decisions™ - Simulate AI Decisions Before Deployment',
  description: 'See how different AI decision modes change risk, confidence, and outcomes — in real time.',
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
      </body>
    </html>
  )
}
