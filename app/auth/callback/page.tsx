'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('ログイン中...')

  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')
    const errorDesc = params.get('error_description')

    if (errorParam) {
      setStatus(`エラー: ${errorDesc || errorParam}`)
      setTimeout(() => router.push('/login'), 4000)
      return
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          setStatus(`認証エラー: ${error.message}`)
          setTimeout(() => router.push('/login'), 4000)
        } else if (data.session) {
          setStatus('成功！')
          router.push('/')
          router.refresh()
        } else {
          setStatus('セッションなし')
          setTimeout(() => router.push('/login'), 4000)
        }
      })
    } else {
      setStatus('コードなし - ログインページへ')
      setTimeout(() => router.push('/login'), 3000)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p style={{ color: 'var(--text)', fontSize: '16px' }}>{status}</p>
      <p style={{ color: 'var(--subtext)', fontSize: '12px' }}>このページは自動で移動します</p>
    </div>
  )
}
