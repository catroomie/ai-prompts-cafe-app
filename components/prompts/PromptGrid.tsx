'use client'

import { useState, useMemo, useCallback } from 'react'
import { useLang } from '@/lib/LanguageContext'
import type { Prompt } from '@/lib/types'
import PromptCard from './PromptCard'
import PromptModal from './PromptModal'

const CATEGORIES = ['SNS', 'Design', 'Marketing', 'Beauty', 'Writing', 'Business', 'Code'] as const
const PAGE_SIZE = 16

const t = {
  ja: {
    heroTitle: '無料AIプロンプト集｜ChatGPT・Claude・Gemini対応',
    heroSub: '豊富なプロンプトをコピペで即使える',
    searchPlaceholder: 'プロンプトを検索...',
    all: 'すべて',
    count: (n: number) => `${n} 件`,
    loadMore: 'もっと見る',
    inlineCta: '無料で使えるプロンプト20個を今すぐ受け取る',
    inlineCtaSub: '＋毎週使えるプロンプトを配信',
    inlineCtaBtn: '無料で受け取る →',
    newsletterLabel: 'Newsletter',
    newsletterTitle: '週1でプロンプトを届けます',
    newsletterDesc: '無料登録で厳選プロンプトをメールで受け取れる',
    newsletterBtn: '無料で登録する →',
    supportLabel: 'Support',
    supportTitle: '役に立ったら応援してください',
    supportDesc: 'コーヒー1杯分のサポートが励みになります',
    supportBtn: '☕ コーヒーをおごる',
    footerDesc: 'ChatGPT・Claude・Geminiで使えるAIプロンプトを無料公開。SNS・デザイン・マーケ・美容など幅広いカテゴリに対応。コピペで即使えます。',
    footerLinks: 'リンク',
    newsletter: 'メールマガジン',
    buyMeCoffee: 'Buy Me a Coffee',
    about: 'About',
    terms: '利用規約',
    contact: 'Contact',
    privacy: 'プライバシーポリシー',
    copyright: '© 2026 AI Prompts Cafe. All rights reserved.',
  },
  en: {
    heroTitle: 'Free AI Prompt Library | ChatGPT · Claude · Gemini',
    heroSub: 'Copy and use AI prompts instantly',
    searchPlaceholder: 'Search prompts...',
    all: 'All',
    count: (n: number) => `${n} result${n === 1 ? '' : 's'}`,
    loadMore: 'Load more',
    inlineCta: 'Join free. Get fresh AI prompts every week.',
    inlineCtaSub: '+ weekly prompts delivered to your inbox',
    inlineCtaBtn: 'Subscribe free →',
    newsletterLabel: 'Newsletter',
    newsletterTitle: 'Fresh AI prompts, every week',
    newsletterDesc: 'Sign up free and get curated prompts delivered to your inbox',
    newsletterBtn: 'Subscribe free →',
    supportLabel: 'Support',
    supportTitle: 'Found this useful?',
    supportDesc: 'Buy me a coffee and keep this project going',
    supportBtn: '☕ Buy me a coffee',
    footerDesc: 'Free AI prompts for ChatGPT, Claude, and Gemini. Covering SNS, design, marketing, beauty, and more. Copy and use instantly.',
    footerLinks: 'Links',
    newsletter: 'Newsletter',
    buyMeCoffee: 'Buy Me a Coffee',
    about: 'About',
    terms: 'Terms of Use',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    copyright: '© 2026 AI Prompts Cafe. All rights reserved.',
  },
}

interface Props {
  prompts: Prompt[]
  initialFavoriteIds: string[]
}

export default function PromptGrid({ prompts, initialFavoriteIds }: Props) {
  const { lang } = useLang()
  const tx = t[lang]
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

  const relatedPrompts = useMemo(() => {
    if (!selectedPrompt) return []
    return prompts
      .filter(p => p.category === selectedPrompt.category && p.id !== selectedPrompt.id)
      .slice(0, 3)
  }, [selectedPrompt, prompts])

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
      {/* ① ヒーロー */}
      <section
        style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}
        className="py-10 px-5 text-center"
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {tx.heroTitle}
        </h1>
        <p className="text-sm" style={{ color: 'var(--subtext)' }}>
          {tx.heroSub}
        </p>
      </section>

      {/* ② 検索 + フィルター（sticky） */}
      <div
        className="sticky z-40 px-5 py-3"
        style={{
          top: '56px', /* header h-14 = 56px */
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <input
            type="text"
            placeholder={tx.searchPlaceholder}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
          />
          <div className="flex flex-wrap gap-2">
            {(['all', ...CATEGORIES] as const).map(cat => {
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={
                    isActive
                      ? { background: 'var(--text)', color: '#fff', borderColor: 'var(--text)' }
                      : { color: 'var(--subtext)', borderColor: 'var(--border)', background: 'transparent' }
                  }
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--tag-bg)'
                      e.currentTarget.style.color = 'var(--text)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--subtext)'
                    }
                  }}
                >
                  {cat === 'all' ? tx.all : cat}
                </button>
              )
            })}
          </div>
          <p className="text-xs" style={{ color: 'var(--subtext)' }}>{tx.count(filtered.length)}</p>
        </div>
      </div>

      {/* ③ カードグリッド */}
      <div className="max-w-6xl mx-auto px-5 pt-5">
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
              {index === 31 && hasMore && (
                <div
                  key="cta-inline"
                  className="col-span-full rounded-xl p-6 text-center flex flex-col items-center gap-3"
                  style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}
                >
                  <p className="font-bold" style={{ color: 'var(--text)' }}>{tx.inlineCta}</p>
                  <p className="text-sm" style={{ color: 'var(--subtext)' }}>{tx.inlineCtaSub}</p>
                  <a
                    href="https://ai-prompts-cafe.beehiiv.com/subscribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {tx.inlineCtaBtn}
                  </a>
                </div>
              )}
            </>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(c => c + PAGE_SIZE)}
              className="px-8 py-2.5 rounded-full border-2 text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              {tx.loadMore}
            </button>
          </div>
        )}

        {/* CTAセクション（全件表示後） */}
        {!hasMore && (
          <div className="mt-12 mb-4">
            <div
              className="rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center justify-center"
              style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>{tx.newsletterLabel}</p>
                <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{tx.newsletterTitle}</p>
                <p className="text-sm" style={{ color: 'var(--subtext)' }}>{tx.newsletterDesc}</p>
                <a
                  href="https://ai-prompts-cafe.beehiiv.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--accent)' }}
                >
                  {tx.newsletterBtn}
                </a>
              </div>
              <div className="hidden sm:block w-px self-stretch" style={{ background: 'var(--border)' }} />
              <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>{tx.supportLabel}</p>
                <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{tx.supportTitle}</p>
                <p className="text-sm" style={{ color: 'var(--subtext)' }}>{tx.supportDesc}</p>
                <a
                  href="https://buymeacoffee.com/aipromptscafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: '#FFDD00', color: '#000' }}
                >
                  {tx.supportBtn}
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
          <div className="flex flex-col gap-2 max-w-xs">
            <p className="font-bold" style={{ color: 'var(--accent)' }}>☕ AI Prompts Cafe</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--subtext)' }}>
              {tx.footerDesc}
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{tx.footerLinks}</p>
              <a href="https://ai-prompts-cafe.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.newsletter}</a>
              <a href="https://buymeacoffee.com/aipromptscafe" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.buyMeCoffee}</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Info</p>
              <a href="/about" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.about}</a>
              <a href="/terms" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.terms}</a>
              <a href="/privacy" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.privacy}</a>
              <a href="/contact" className="text-xs hover:underline" style={{ color: 'var(--subtext)' }}>{tx.contact}</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--subtext)' }}>
            {tx.copyright}
          </p>
        </div>
      </footer>

      {/* モーダル */}
      <PromptModal
        prompt={selectedPrompt}
        lang={lang}
        relatedPrompts={relatedPrompts}
        onSelect={setSelectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  )
}
