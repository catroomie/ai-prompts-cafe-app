'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // まずセッションが既にあるか確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/')
        router.refresh()
        return
      }

      // セッションがない場合はコード交換を試みる
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(() => {
          router.push('/')
          router.refresh()
        })
      } else {
        router.push('/')
        router.refresh()
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--subtext)', fontSize: '14px' }}>ログイン中...</p>
    </div>
  )
}
