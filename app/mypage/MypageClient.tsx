'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'
import type { Prompt } from '@/lib/types'
import PromptCard from '@/components/prompts/PromptCard'
import PromptModal from '@/components/prompts/PromptModal'

const t = {
  ja: {
    title: 'マイページ',
    favorites: (n: number) => `お気に入り (${n})`,
    empty: 'お気に入りがまだありません',
    browse: 'プロンプトを探す →',
  },
  en: {
    title: 'My page',
    favorites: (n: number) => `Favorites (${n})`,
    empty: 'No favorites yet',
    browse: 'Browse prompts →',
  },
}

interface Props {
  username: string
  prompts: Prompt[]
}

export default function MypageClient({ username, prompts }: Props) {
  const { lang } = useLang()
  const tx = t[lang]
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(prompts.map(p => p.id)))
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  const handleFavoriteChange = (promptId: string, isFav: boolean) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (isFav) next.add(promptId)
      else next.delete(promptId)
      return next
    })
  }

  const visiblePrompts = prompts.filter(p => favoriteIds.has(p.id))

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{tx.title}</h1>
        <p className="text-sm" style={{ color: 'var(--subtext)' }}>{username}</p>
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          {tx.favorites(visiblePrompts.length)}
        </h2>
        {visiblePrompts.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--subtext)' }}>{tx.empty}</p>
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{tx.browse}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                lang={lang}
                onViewDetail={setSelectedPrompt}
                favoriteIds={favoriteIds}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </section>
      <PromptModal prompt={selectedPrompt} lang={lang} relatedPrompts={[]} onSelect={setSelectedPrompt} onClose={() => setSelectedPrompt(null)} />
    </div>
  )
}
