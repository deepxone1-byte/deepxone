import { Metadata } from 'next'
import { PageLayout } from '@/components/PageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | DeepXone Decisions',
  description: 'DeepXone privacy policy - how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Data Accessed</h2>
            <p className="text-text-secondary leading-relaxed mb-4">When you sign in with Google, DeepXone accesses the following data:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong className="text-text-primary">Email address:</strong> Used for authentication and sending user-requested information</li>
              <li><strong className="text-text-primary">Name:</strong> Used to personalize your experience on the platform</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-4">
              <strong className="text-text-primary">Note:</strong> You have the right to create an email address and name specifically for accessing your DeepXone account. You are not required to use your primary personal email or real name.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Data Usage</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Your email address is used only for:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Authentication (signing in to your account)</li>
              <li>Sending user-requested information such as:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Decision simulation results</li>
                  <li>Saved scenarios and configurations</li>
                  <li>Account-related notifications you have requested</li>
                </ul>
              </li>
              <li>Marketing communications (only if you have explicitly opted in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Marketing Communications</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We only send marketing emails to users who have explicitly opted in. Marketing communications may include:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Newsletters with AI insights and industry trends</li>
              <li>Product updates and new feature announcements</li>
              <li>Promotional offers and special events</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-4">
              <strong className="text-text-primary">Your choice matters:</strong> You can opt out of marketing communications at any time by visiting our <a href="/unsubscribe" className="text-primary hover:underline">unsubscribe page</a> or clicking the unsubscribe link in any marketing email. Opting out of marketing does not affect transactional emails related to your account or active projects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Data Sharing</h2>
            <p className="text-text-secondary leading-relaxed">
              We do not sell, rent, or share your Google user data with any third parties. Your data is only used to provide the DeepXone service to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Data Storage & Protection</h2>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>All data is encrypted in transit using HTTPS</li>
              <li>We store only the minimum data necessary to provide the service</li>
              <li>We never store your Google password</li>
              <li>Demo environment data is not persisted after your session ends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Data Retention & Deletion</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Your data is retained while your account is active. To delete your data:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Revoke access anytime via your <a href="https://myaccount.google.com/permissions" className="text-primary hover:underline">Google Account permissions</a></li>
              <li>Request account deletion by contacting privacy@deepxone.com</li>
              <li>Upon request, your data will be deleted within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              For questions about this privacy policy, contact us at: <a href="mailto:privacy@deepxone.com" className="text-primary hover:underline">privacy@deepxone.com</a>
            </p>
          </section>
        </div>
      </section>
    </PageLayout>
  )
}
