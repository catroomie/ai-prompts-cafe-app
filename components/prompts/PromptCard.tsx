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
    <article
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-base leading-snug" style={{ color: 'var(--text)' }}>
          {prompt.title}
        </h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap category-${prompt.category}`}>
          {prompt.category}
        </span>
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--subtext)' }}>
        {description}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewDetail(prompt)}
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          プロンプトを見る
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            borderColor: copied ? '#22c55e' : 'var(--border)',
            color: copied ? '#22c55e' : 'var(--subtext)',
          }}
        >
          {copied ? '✓ コピー済' : 'コピー'}
        </button>
        <FavoriteButton
          promptId={prompt.id}
          isFavorited={favoriteIds.has(prompt.id)}
          onFavoriteChange={onFavoriteChange}
        />
      </div>
    </article>
  )
}
