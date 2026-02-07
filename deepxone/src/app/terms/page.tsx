import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | DeepXone Decisions',
  description: 'DeepXone terms of service - the terms and conditions governing your use of our website and services.',
}

export default function TermsPage() {
  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using the DeepXone Decisions website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Description of Services</h2>
            <p className="text-text-secondary leading-relaxed">
              DeepXone provides AI consulting and implementation services, including AI decision systems, process automation, custom AI solutions, and strategic consulting. Our website includes informational content and a demonstration environment for showcasing our technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Demo Environment</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Our online demo is provided for demonstration and evaluation purposes only. By using the demo, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>The demo is not intended for production use or critical business decisions</li>
              <li>Results are for illustrative purposes and may not reflect actual production performance</li>
              <li>You will not input sensitive, confidential, or personally identifiable information</li>
              <li>We do not store or retain demo inputs beyond the session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">4. User Conduct</h2>
            <p className="text-text-secondary leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Use the Services for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Upload malicious code or content</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated systems to access the Services without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Intellectual Property</h2>
            <p className="text-text-secondary leading-relaxed">
              All content, features, and functionality of our Services, including but not limited to text, graphics, logos, and software, are owned by DeepXone or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Consulting Services</h2>
            <p className="text-text-secondary leading-relaxed">
              Consulting and implementation services are provided under separate agreements. These Terms govern use of our website and demo environment only. Specific service terms, deliverables, pricing, and obligations will be defined in individual service agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-text-secondary leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEEPXONE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Indemnification</h2>
            <p className="text-text-secondary leading-relaxed">
              You agree to indemnify and hold harmless DeepXone and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising out of your use of the Services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">10. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Services after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">11. Governing Law</h2>
            <p className="text-text-secondary leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">12. Contact Information</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 text-text-secondary">
              <p>DeepXone Decisions</p>
              <p>Email: support@deepxone.com</p>
              <p>Phone: 647 948 8700</p>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  )
}
