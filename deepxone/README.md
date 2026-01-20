# DeepXone Decisions™

**Executive-Focused AI Decision Simulator**

> "Control the outcome, not just the output."

## Overview

DeepXone Decisions™ is an AI-powered decision simulator that allows business leaders to **see how AI-driven decisions change outcomes before deployment**.

It shows **consequences, risk, and confidence** — live.

## Features

- **Interactive Decision Simulator** - Live scenario testing with instant feedback
- **Multiple Decision Modes** - Speed-first, Risk-balanced, Compliance-first, Customer-first
- **Real Business Scenarios** - Customer refunds, HR policies, sales approvals, compliance, knowledge lookup
- **Visual Risk Assessment** - Confidence scores, risk levels, business impact indicators
- **Enterprise Design** - Dark, professional aesthetic built for executive audiences

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd deepxone
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

## Design System

### Colors

- Background: `#0E1116` (Deep Charcoal)
- Primary: `#3B82F6` (Decision Blue)
- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Text Primary: `#E5E7EB`
- Text Secondary: `#9CA3AF`

### Brand Personality

- Calm authority
- Enterprise-safe
- Trust-focused
- Clear over clever
- Strategic, not technical

## Project Structure

```
deepxone/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── DecisionSimulator.tsx
│       └── Logo.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Current Implementation

### MVP Scope (V1)

✅ Homepage with hero section
✅ Interactive decision simulator
✅ 5 business scenarios
✅ 4 decision modes
✅ Outcome comparison with metrics
✅ Visual indicators (confidence, risk, impact)
✅ Responsive design

### What This Demonstrates

Without explicitly explaining it, the simulator shows:
- Policy-aware decision making
- AI guardrails in action
- Risk evaluation logic
- Governance controls
- Trade-off analysis

These capabilities can be revealed in sales conversations.

## Next Steps

### Technical Enhancements

- [ ] Connect to real AI models (OpenAI, Anthropic, etc.)
- [ ] Policy ingestion system
- [ ] Custom scenario builder
- [ ] Decision history and audit logs
- [ ] A/B comparison mode (compare two decision modes side-by-side)
- [ ] Export reports functionality

### Business Features

- [ ] Executive demo booking system
- [ ] Email capture for live scenarios
- [ ] Integration with enterprise tools
- [ ] Multi-tenant architecture
- [ ] SSO/SAML authentication

### Marketing

- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Case studies section
- [ ] Video demo embed
- [ ] Customer testimonials

## Philosophy

**Decisions over models**
**Outcomes over outputs**
**Visibility over automation**
**Trust before scale**

## License

Proprietary - © 2026 DeepXone Decisions™

---

**DeepXone Decisions™** - Because AI answers become business actions.
