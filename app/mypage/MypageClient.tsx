'use client'

import { useState } from 'react'
import type { Prompt } from '@/lib/types'
import PromptCard from '@/components/prompts/PromptCard'
import PromptModal from '@/components/prompts/PromptModal'

interface Props { prompts: Prompt[] }

export default function MypageClient({ prompts }: Props) {
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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.filter(p => favoriteIds.has(p.id)).map(prompt => (
          <PromptCard key={prompt.id} prompt={prompt} lang="ja" onViewDetail={setSelectedPrompt} favoriteIds={favoriteIds} onFavoriteChange={handleFavoriteChange} />
        ))}
      </div>
      <PromptModal prompt={selectedPrompt} lang="ja" onClose={() => setSelectedPrompt(null)} />
    </>
  )
}
