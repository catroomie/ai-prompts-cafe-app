import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← Back</Link>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
      <p className="text-xs mb-8" style={{ color: 'var(--subtext)' }}>Last updated: April 2026</p>

      <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>1. Information we collect</h2>
          <p>When you create an account, we collect your email address and, if you sign in with Google, your name and profile photo. We also store prompts you save as favorites.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>2. How we use your information</h2>
          <p>Your information is used solely to provide and improve the service — account management, saving favorites, and sending our newsletter if you subscribe. We do not sell your data.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>3. Third-party services</h2>
          <ul className="list-disc list-inside flex flex-col gap-1 mt-1">
            <li><strong style={{ color: 'var(--text)' }}>Supabase</strong> — authentication and database hosting</li>
            <li><strong style={{ color: 'var(--text)' }}>Google OAuth</strong> — optional sign-in method</li>
            <li><strong style={{ color: 'var(--text)' }}>Beehiiv</strong> — newsletter delivery (only if you subscribe)</li>
            <li><strong style={{ color: 'var(--text)' }}>Vercel</strong> — hosting and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>4. Cookies</h2>
          <p>We use cookies only for authentication. No advertising or tracking cookies are used.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>5. Your rights</h2>
          <p>You may request deletion of your account and data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>6. Contact</h2>
          <p>Questions? <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">Contact us here.</Link></p>
        </section>
      </div>
    </div>
  )
}
