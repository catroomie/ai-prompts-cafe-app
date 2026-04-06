'use client'

import { useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) { setMessage('Supabaseが設定されていません'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` }
    })
    setMessage(error ? error.message : '確認メールを送信しました。メールをご確認ください。')
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured()) { setMessage('Supabaseが設定されていません'); return }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/confirm` }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>☕ AI Prompts Cafe</Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--subtext)' }}>新規登録</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <button onClick={handleGoogleLogin} className="w-full py-3 rounded-xl border text-sm font-medium mb-4 flex items-center justify-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Googleで登録
          </button>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-2" style={{ background: 'var(--card-bg)', color: 'var(--subtext)' }}>またはメールで</span></div>
          </div>
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--border)' }} />
            <input type="password" placeholder="パスワード（8文字以上）" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--border)' }} />
            {message && <p className={`text-xs ${message.includes('送信') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>
          <p className="text-center text-xs mt-4" style={{ color: 'var(--subtext)' }}>
            すでにアカウントをお持ちの方は <Link href="/login" style={{ color: 'var(--accent)' }}>ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
