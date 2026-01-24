// Analytics event tracking utilities

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

export function trackEvent({ action, category, label, value }: GTagEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Pre-defined tracking events
export const analytics = {
  // Form events
  contactFormSubmit: (projectType: string) =>
    trackEvent({
      action: 'submit',
      category: 'contact_form',
      label: projectType,
    }),

  contactFormError: (error: string) =>
    trackEvent({
      action: 'error',
      category: 'contact_form',
      label: error,
    }),

  newsletterSignup: () =>
    trackEvent({
      action: 'subscribe',
      category: 'newsletter',
    }),

  // CTA clicks
  bookDemoClick: (location: string) =>
    trackEvent({
      action: 'click',
      category: 'cta',
      label: `book_demo_${location}`,
    }),

  getStartedClick: (page: string) =>
    trackEvent({
      action: 'click',
      category: 'cta',
      label: `get_started_${page}`,
    }),

  // Demo interactions
  simulatorRun: (scenario: string) =>
    trackEvent({
      action: 'run',
      category: 'simulator',
      label: scenario,
    }),

  simulatorModeChange: (mode: string) =>
    trackEvent({
      action: 'mode_change',
      category: 'simulator',
      label: mode,
    }),

  // Navigation
  pageView: (page: string) =>
    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: page,
    }),

  externalLinkClick: (url: string) =>
    trackEvent({
      action: 'click',
      category: 'external_link',
      label: url,
    }),
}
