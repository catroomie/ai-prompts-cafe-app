'use client'

import { useState, useMemo, useCallback } from 'react'
import { useLang } from '@/lib/LanguageContext'
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
  const { lang } = useLang()
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
      {/* ① ヒーロー：タイトル・説明のみ（コーヒーボタン削除） */}
      <section
        style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #ffeee6 100%)', borderBottom: '1px solid var(--border)' }}
        className="py-10 px-5 text-center"
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          無料AIプロンプト集｜ChatGPT・Claude・Gemini対応
        </h1>
        <p className="text-sm" style={{ color: 'var(--subtext)' }}>
          豊富なプロンプトをコピペで即使える
        </p>
      </section>

      {/* ② 検索 + フィルター + カード一覧 */}
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

        {/* カードグリッド */}
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
              {/* グリッド内CTA（32枚目付近） */}
              {index === 31 && hasMore && (
                <div
                  key="cta-inline"
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

        {/* もっと見るボタン */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(c => c + PAGE_SIZE)}
              className="px-8 py-2.5 rounded-full border-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              もっと見る
            </button>
          </div>
        )}

        {/* ③ CTAセクション（もっと見るの下 or 全件表示後） */}
        {!hasMore && (
          <div className="mt-12 mb-4">
            <div
              className="rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #ffeee6 100%)', border: '1px solid #f0c4aa' }}
            >
              {/* メール登録 */}
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Newsletter</p>
                <p className="font-bold text-base" style={{ color: 'var(--text)' }}>週1でプロンプトを届けます</p>
                <p className="text-sm" style={{ color: 'var(--subtext)' }}>無料登録で厳選プロンプトをメールで受け取れる</p>
                <a
                  href="https://ai-prompts-cafe.beehiiv.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--accent)' }}
                >
                  無料で登録する →
                </a>
              </div>

              {/* 区切り */}
              <div className="hidden sm:block w-px self-stretch" style={{ background: '#f0c4aa' }} />

              {/* Buy Me a Coffee */}
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Support</p>
                <p className="font-bold text-base" style={{ color: 'var(--text)' }}>役に立ったら応援してください</p>
                <p className="text-sm" style={{ color: 'var(--subtext)' }}>コーヒー1杯分のサポートが励みになります</p>
                <a
                  href="https://buymeacoffee.com/aipromptscafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: '#FFDD00', color: '#000' }}
                >
                  ☕ コーヒーをおごる
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ④ フッター */}
      <footer
        className="mt-8 py-10 px-5"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--card-bg)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
          {/* サイト説明 */}
          <div className="flex flex-col gap-2 max-w-xs">
            <p className="font-bold" style={{ color: 'var(--accent)' }}>☕ AI Prompts Cafe</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--subtext)' }}>
              ChatGPT・Claude・Geminiで使えるAIプロンプトを無料公開。SNS・デザイン・マーケ・美容など幅広いカテゴリに対応。コピペで即使えます。
            </p>
          </div>

          {/* リンク */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>リンク</p>
            <a href="https://ai-prompts-cafe.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>メールマガジン</a>
            <a href="https://buymeacoffee.com/aipromptscafe" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>Buy Me a Coffee</a>
          </div>
        </div>

        {/* コピーライト */}
        <div className="max-w-6xl mx-auto mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--subtext)' }}>
            © 2025 AI Prompts Cafe. All rights reserved.
          </p>
        </div>
      </footer>

      {/* モーダル */}
      <PromptModal
        prompt={selectedPrompt}
        lang={lang}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  )
}
