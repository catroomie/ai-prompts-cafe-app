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
  const [hovered, setHovered] = useState(false)

  const description = lang === 'ja' ? prompt.description_ja : (prompt.description_en || prompt.description_ja)
  const tx = {
    open: lang === 'en' ? 'Open' : '開く',
    copy: lang === 'en' ? 'Copy' : 'コピー',
    copied: lang === 'en' ? '✓ Copied' : '✓ コピー済',
    premium: lang === 'en' ? '🔒 Premium' : '🔒 プレミアム',
    openLink: lang === 'en' ? 'Open →' : '開く →',
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const contentTypeBadgeStyle: Record<string, React.CSSProperties> = {
    template: { background: '#f2f0f8', color: '#7060a8' },
    system: { background: '#f0f5f2', color: '#3a8060' },
  }

  return (
    <article
      onClick={() => onViewDetail(prompt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        minHeight: '180px',
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-base leading-snug flex-1" style={{ color: 'var(--text)' }}>
          {prompt.title}
        </h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 category-${prompt.category}`}>
          {prompt.category}
        </span>
      </div>

      {/* Badges: content_type + PREMIUM only */}
      {(prompt.content_type !== 'prompt' || prompt.is_premium) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {prompt.content_type !== 'prompt' && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={contentTypeBadgeStyle[prompt.content_type]}>
              {prompt.content_type.toUpperCase()}
            </span>
          )}
          {prompt.is_premium && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#b45309' }}>
              PREMIUM
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--subtext)' }}>
        {description}
      </p>

      {/* Actions — stopPropagation so clicks don't open modal */}
      <div className="flex items-center gap-2 mt-auto" onClick={e => e.stopPropagation()}>
        {prompt.is_premium ? (
          <button
            onClick={() => onViewDetail(prompt)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: '#fef9c3', color: '#b45309', border: '1px solid #fcd34d' }}
          >
            {tx.premium}
          </button>
        ) : prompt.external_url && prompt.content_type !== 'prompt' ? (
          <>
            <a
              href={prompt.external_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)' }}
            >
              {tx.openLink}
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
          <>
            <button
              onClick={() => onViewDetail(prompt)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--accent)' }}
            >
              {tx.open}
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
