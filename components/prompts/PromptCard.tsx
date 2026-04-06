'use client'

import { useState } from 'react'
import type { Prompt } from '@/lib/types'
import FavoriteButton from './FavoriteButton'

interface Props {
  prompt: Prompt
  lang: 'ja' | 'en'
  onViewDetail: (prompt: Prompt) => void
  favoriteIds: Set<string>
  onFavoriteChange: (promptId: string, isFav: boolean) => void
}

export default function PromptCard({ prompt, lang, onViewDetail, favoriteIds, onFavoriteChange }: Props) {
  const [copied, setCopied] = useState(false)

  const description = lang === 'ja' ? prompt.description_ja : (prompt.description_en || prompt.description_ja)
  const tx = {
    viewPrompt: lang === 'en' ? 'View prompt' : 'プロンプトを見る',
    copy: lang === 'en' ? 'Copy' : 'コピー',
    copied: lang === 'en' ? '✓ Copied' : '✓ コピー済',
    premium: lang === 'en' ? '🔒 Premium' : '🔒 プレミアム',
    open: lang === 'en' ? 'Open →' : '開く →',
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

  // Badge styles per content_type
  const contentTypeBadgeStyle: Record<string, React.CSSProperties> = {
    template: { background: '#f5f3ff', color: '#8b5cf6' },
    system: { background: '#ecfdf5', color: '#059669' },
  }

  return (
    <article
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-base leading-snug" style={{ color: 'var(--text)' }}>
          {prompt.title}
        </h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap category-${prompt.category}`}>
          {prompt.category}
        </span>
      </div>

      {/* Badge row: content_type + is_premium */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {prompt.content_type !== 'prompt' && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={contentTypeBadgeStyle[prompt.content_type]}
          >
            {prompt.content_type.toUpperCase()}
          </span>
        )}
        {prompt.is_premium ? (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: '#fef9c3', color: '#b45309' }}
          >
            PREMIUM
          </span>
        ) : (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: '#f0fdf4', color: '#15803d' }}
          >
            FREE
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--subtext)' }}>
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {prompt.is_premium ? (
          // Premium: lock button that opens modal (shows upgrade CTA)
          <button
            onClick={() => onViewDetail(prompt)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: '#fef9c3', color: '#b45309', border: '1px solid #fcd34d' }}
          >
            {tx.premium}
          </button>
        ) : prompt.external_url && prompt.content_type !== 'prompt' ? (
          // Template / System with external link
          <>
            <a
              href={prompt.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)' }}
            >
              {tx.open}
            </a>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: copied ? '#22c55e' : 'var(--border)',
                color: copied ? '#22c55e' : 'var(--subtext)',
              }}
            >
              {copied ? tx.copied : tx.copy}
            </button>
          </>
        ) : (
          // Normal free prompt
          <>
            <button
              onClick={() => onViewDetail(prompt)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: 'var(--accent)' }}
            >
              {tx.viewPrompt}
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: copied ? '#22c55e' : 'var(--border)',
                color: copied ? '#22c55e' : 'var(--subtext)',
              }}
            >
              {copied ? tx.copied : tx.copy}
            </button>
          </>
        )}
        <FavoriteButton
          promptId={prompt.id}
          isFavorited={favoriteIds.has(prompt.id)}
          onFavoriteChange={onFavoriteChange}
        />
      </div>
    </article>
  )
}
