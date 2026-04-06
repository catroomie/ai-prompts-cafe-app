'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Prompt } from '@/lib/types'

interface Props {
  prompt: Prompt | null
  lang: 'ja' | 'en'
  onClose: () => void
}

export default function PromptModal({ prompt, lang, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!prompt) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prompt, onClose])

  if (!prompt) return null

  const description = lang === 'ja' ? prompt.description_ja : (prompt.description_en || prompt.description_ja)
  const tx = {
    copy: lang === 'en' ? 'Copy prompt' : 'プロンプトをコピー',
    copied: lang === 'en' ? '✓ Copied!' : '✓ コピーしました',
    close: lang === 'en' ? 'Close' : '閉じる',
    premiumTitle: lang === 'en' ? '🔒 Premium Content' : '🔒 プレミアムコンテンツ',
    premiumDesc: lang === 'en'
      ? 'Sign up free to unlock this prompt and get weekly AI prompt picks.'
      : '無料登録するとこのプロンプトが使えます。毎週新しいプロンプトも届きます。',
    premiumCta: lang === 'en' ? 'Sign up free →' : '無料で登録する →',
    newsletterTitle: lang === 'en' ? 'Join free. Get fresh AI prompts every week.' : '無料で使えるプロンプト20個を今すぐ受け取る',
    newsletterCta: lang === 'en' ? 'Subscribe free →' : '無料で受け取る →',
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
    } catch {
      const el = document.createElement('textarea')
      el.value = prompt.content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'var(--card-bg)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {prompt.content_type !== 'prompt' && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    prompt.content_type === 'template'
                      ? { background: '#f5f3ff', color: '#8b5cf6' }
                      : { background: '#ecfdf5', color: '#059669' }
                  }
                >
                  {prompt.content_type.toUpperCase()}
                </span>
              )}
              {prompt.is_premium ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#b45309' }}>PREMIUM</span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>FREE</span>
              )}
            </div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{prompt.title}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--subtext)' }}>{description}</p>
          </div>
          <button onClick={onClose} className="text-xl shrink-0" style={{ color: 'var(--subtext)' }}>✕</button>
        </div>

        {/* Content area */}
        {prompt.is_premium ? (
          // Premium: blur overlay
          <div className="relative rounded-xl overflow-hidden">
            <div
              className="rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap select-none"
              style={{ background: '#f8f6f4', color: 'var(--text)', border: '1px solid var(--border)', filter: 'blur(4px)', userSelect: 'none' }}
              aria-hidden="true"
            >
              {prompt.content}
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)' }}
            >
              <p className="text-2xl">🔒</p>
              <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{tx.premiumTitle}</p>
              <p className="text-sm" style={{ color: 'var(--subtext)' }}>{tx.premiumDesc}</p>
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)' }}
                onClick={onClose}
              >
                {tx.premiumCta}
              </Link>
            </div>
          </div>
        ) : (
          // Free: show full content
          <div
            className="rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
            style={{ background: '#f8f6f4', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            {prompt.content}
          </div>
        )}

        {/* Actions */}
        {!prompt.is_premium && (
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors"
              style={{ background: copied ? '#22c55e' : 'var(--accent)' }}
            >
              {copied ? tx.copied : tx.copy}
            </button>
            {prompt.external_url && (
              <a
                href={prompt.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-medium text-white text-center transition-opacity hover:opacity-80"
                style={{ background: '#8b5cf6' }}
              >
                Open →
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium border"
              style={{ borderColor: 'var(--border)', color: 'var(--subtext)' }}
            >
              {tx.close}
            </button>
          </div>
        )}

        {/* Newsletter CTA (free content only) */}
        {!prompt.is_premium && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: '#fff5f0', border: '1px solid #f0c4aa' }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
              {tx.newsletterTitle}
            </p>
            <a
              href="https://ai-prompts-cafe.beehiiv.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              {tx.newsletterCta}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
