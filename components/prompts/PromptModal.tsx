'use client'

import { useEffect, useState } from 'react'
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{prompt.title}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--subtext)' }}>{description}</p>
          </div>
          <button onClick={onClose} className="text-xl" style={{ color: 'var(--subtext)' }}>✕</button>
        </div>
        <div
          className="rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
          style={{ background: '#f8f6f4', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          {prompt.content}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ background: copied ? '#22c55e' : 'var(--accent)' }}
          >
            {copied ? '✓ コピーしました' : 'プロンプトをコピー'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--subtext)' }}
          >
            閉じる
          </button>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: '#fff5f0', border: '1px solid #f0c4aa' }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            無料で使えるプロンプト20個を今すぐ受け取る
          </p>
          <a
            href="https://ai-prompts-cafe.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            無料で受け取る →
          </a>
        </div>
      </div>
    </div>
  )
}
