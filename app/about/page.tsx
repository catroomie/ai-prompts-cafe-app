import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← Back</Link>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>About</h1>
      <div className="flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <p>
          <strong style={{ color: 'var(--text)' }}>AI Prompts Cafe</strong> is a free library of AI prompts for ChatGPT, Claude, and Gemini.
        </p>
        <p>
          We curate practical, copy-and-use prompts across categories like SNS, design, marketing, beauty, writing, business, and code — so you can get more done with AI, faster.
        </p>
        <p>
          New prompts are added regularly. Subscribe to our newsletter to get fresh picks delivered to your inbox every week.
        </p>
        <div className="pt-4">
          <a
            href="https://ai-prompts-cafe.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)' }}
          >
            Subscribe to the newsletter →
          </a>
        </div>
      </div>
    </div>
  )
}
