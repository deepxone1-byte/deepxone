import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | DeepXone Decisions',
  description: 'DeepXone privacy policy - how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Introduction</h2>
            <p className="text-text-secondary leading-relaxed">
              DeepXone Decisions ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-4">We may collect information about you in a variety of ways:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong className="text-text-primary">Personal Data:</strong> Name, email address, phone number, company name, and job title that you voluntarily provide when contacting us or using our services.</li>
              <li><strong className="text-text-primary">Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and navigation patterns.</li>
              <li><strong className="text-text-primary">Technical Data:</strong> IP address, browser type, device information, and operating system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">3. How We Use Your Information</h2>
            <p className="text-text-secondary leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Deliver the services you request</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Demo Environment Data</h2>
            <p className="text-text-secondary leading-relaxed">
              Our online demo environment is designed for demonstration purposes only. We do not store, retain, or use any data entered into the demo for training AI models. All demo inputs are processed in real-time and not persisted after your session ends.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-text-secondary leading-relaxed mb-4">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong className="text-text-primary">Service Providers:</strong> Third parties who assist us in operating our business (hosting, analytics, email services)</li>
              <li><strong className="text-text-primary">Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-text-primary">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Data Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Data Retention</h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Cookies and Tracking</h2>
            <p className="text-text-secondary leading-relaxed">
              We use cookies and similar tracking technologies to analyze trends, administer the website, and gather demographic information. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">10. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">11. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 text-text-secondary">
              <p>DeepXone Decisions</p>
              <p>Email: contact@deepxone.com</p>
              <p>Phone: 647 948 8700</p>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  )
}
