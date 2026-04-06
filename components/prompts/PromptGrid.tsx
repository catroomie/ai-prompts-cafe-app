'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Prompt } from '@/lib/types'
import PromptCard from './PromptCard'
import PromptModal from './PromptModal'

const CATEGORIES = ['SNS', 'Design', 'Marketing', 'Beauty', 'Writing', 'Business', 'Code'] as const
const PAGE_SIZE = 16

interface Props {
  prompts: Prompt[]
  initialFavoriteIds: string[]
}

export default function PromptGrid({ prompts, initialFavoriteIds }: Props) {
  const [lang, setLang] = useState<'ja' | 'en'>('ja')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds))

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      if (category !== 'all' && p.category !== category) return false
      if (search) {
        const q = search.toLowerCase()
        const desc = lang === 'ja' ? p.description_ja : (p.description_en || p.description_ja)
        if (!p.title.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [prompts, category, search, lang])

  const displayed = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  const handleFavoriteChange = useCallback((promptId: string, isFav: boolean) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (isFav) next.add(promptId)
      else next.delete(promptId)
      return next
    })
  }, [])

  const handleCategory = (cat: string) => {
    setCategory(cat)
    setDisplayCount(PAGE_SIZE)
  }
  const handleSearch = (q: string) => {
    setSearch(q)
    setDisplayCount(PAGE_SIZE)
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #ffeee6 100%)', borderBottom: '1px solid var(--border)' }} className="py-10 px-5 text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          すぐ使えるAIプロンプト集
        </h1>
        <p className="text-sm mb-5" style={{ color: 'var(--subtext)' }}>
          ChatGPT・Claude・Gemini対応。コピペで即使える。
        </p>
        <a
          href="https://buymeacoffee.com/aipromptscafe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          ☕ コーヒー1杯おごる
        </a>
      </section>

      {/* Search + Filters */}
      <div className="max-w-6xl mx-auto px-5 py-5">
        <div className="flex flex-col gap-3 mb-5">
          <input
            type="text"
            placeholder="プロンプトを検索..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === 'all' ? 'text-white border-transparent' : 'border-gray-200'}`}
              style={category === 'all' ? { background: 'var(--accent)' } : { color: 'var(--subtext)' }}
            >
              すべて
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === cat ? 'text-white border-transparent' : 'border-gray-200'}`}
                style={category === cat ? { background: 'var(--accent)' } : { color: 'var(--subtext)' }}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--subtext)' }}>{filtered.length} 件</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((prompt, index) => (
            <>
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                lang={lang}
                onViewDetail={setSelectedPrompt}
                favoriteIds={favoriteIds}
                onFavoriteChange={handleFavoriteChange}
              />
              {/* CTA card after 32nd item */}
              {index === 31 && hasMore && (
                <div
                  key="cta"
                  className="col-span-full rounded-xl p-6 text-center flex flex-col items-center gap-3"
                  style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #ffeee6 100%)', border: '1.5px solid #f0c4aa' }}
                >
                  <p className="font-bold" style={{ color: 'var(--text)' }}>無料で使えるプロンプト20個を今すぐ受け取る</p>
                  <p className="text-sm" style={{ color: 'var(--subtext)' }}>＋毎週使えるプロンプトを配信</p>
                  <a
                    href="https://ai-prompts-cafe.beehiiv.com/subscribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    無料で受け取る →
                  </a>
                </div>
              )}
            </>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(c => c + PAGE_SIZE)}
              className="px-8 py-2.5 rounded-full border-2 text-sm font-semibold transition-colors"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              もっと見る
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <PromptModal
        prompt={selectedPrompt}
        lang={lang}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  )
}
