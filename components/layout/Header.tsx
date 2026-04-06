'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/lib/LanguageContext'
import type { User } from '@supabase/supabase-js'

type ToastType = 'logout' | 'lang-en' | 'lang-ja' | null

const t = {
  ja: {
    mypage: 'マイページ',
    signout: 'ログアウト',
    signin: 'ログイン',
    toastLogout: '✓ ログアウトしました',
    toastEn: '🌐 Switched to English',
    toastJa: '🌐 日本語に切り替えました',
    langHint: 'Switch to English',
  },
  en: {
    mypage: 'My page',
    signout: 'Sign out',
    signin: 'Sign in',
    toastLogout: '✓ Signed out',
    toastEn: '🌐 Switched to English',
    toastJa: '🌐 日本語に切り替えました',
    langHint: '日本語に切り替え',
  },
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const { lang, setLang } = useLang()
  const [toast, setToast] = useState<ToastType>(null)
  const [langAnimating, setLangAnimating] = useState(false)
  const supabase = createClient()
  const tx = t[lang]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const showToast = (type: ToastType) => {
    setToast(type)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    showToast('logout')
  }

  const handleLangToggle = () => {
    setLangAnimating(true)
    setTimeout(() => {
      const next = lang === 'ja' ? 'en' : 'ja'
      setLang(next)
      showToast(next === 'en' ? 'lang-en' : 'lang-ja')
      setLangAnimating(false)
    }, 120)
  }

  const toastMessages: Record<string, string> = {
    logout: tx.toastLogout,
    'lang-en': '🌐 Switched to English',
    'lang-ja': '🌐 日本語に切り替えました',
  }
  const toastMessage = toast ? toastMessages[toast] : ''

  return (
    <>
      <header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: 'var(--text)' }}>
            ☕ AI Prompts Cafe
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLangToggle}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-medium cursor-pointer select-none"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--subtext)',
                background: 'transparent',
                transition: 'all 0.2s ease',
                opacity: langAnimating ? 0.4 : 1,
                transform: langAnimating ? 'scale(0.92)' : 'scale(1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--tag-bg)'
                e.currentTarget.style.borderColor = '#999'
                e.currentTarget.style.color = 'var(--text)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--subtext)'
              }}
              title={lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>{lang === 'ja' ? 'EN' : 'JA'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/mypage" className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {tx.mypage}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1 rounded-full transition-all hover:opacity-70 cursor-pointer"
                  style={{ background: 'var(--tag-bg)', color: 'var(--subtext)' }}
                >
                  {tx.signout}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded-full font-medium text-white transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)' }}
              >
                {tx.signin}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* トースト通知 */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: `translateX(-50%) translateY(${toast ? '0' : '80px'})`,
          opacity: toast ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          background: '#333',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 500,
          zIndex: 9999,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {toastMessage}
      </div>
    </>
  )
}
