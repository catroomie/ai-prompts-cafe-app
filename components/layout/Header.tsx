'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<'ja' | 'en'>('ja')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg" style={{ color: 'var(--accent)' }}>
          ☕ AI Prompts Cafe
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(l => l === 'ja' ? 'en' : 'ja')}
            className="text-sm px-3 py-1 rounded-full border"
            style={{ borderColor: 'var(--border)', color: 'var(--subtext)' }}
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/mypage" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                マイページ
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm px-3 py-1 rounded-full"
                style={{ background: 'var(--tag-bg)', color: 'var(--subtext)' }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-1.5 rounded-full font-medium text-white"
              style={{ background: 'var(--accent)' }}
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
