import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← Back</Link>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>Contact</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <p>Questions, feedback, or prompt requests? We'd love to hear from you.</p>
        <div
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <p><strong style={{ color: 'var(--text)' }}>Email</strong></p>
          <a
            href="mailto:hello@ai-prompts-cafe.com"
            className="hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            hello@ai-prompts-cafe.com
          </a>
        </div>
        <p className="text-xs" style={{ color: 'var(--subtext)' }}>
          We typically respond within 2–3 business days.
        </p>
      </div>
    </div>
  )
}
