'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          router.push('/')
          router.refresh()
        } else {
          router.push('/login')
        }
      })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/')
          router.refresh()
        } else {
          router.push('/login')
        }
      })
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--subtext)', fontSize: '14px' }}>ログイン中...</p>
    </div>
  )
}
