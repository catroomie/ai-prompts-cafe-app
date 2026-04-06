'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  promptId: string
  isFavorited: boolean
  onFavoriteChange: (promptId: string, isFav: boolean) => void
}

export default function FavoriteButton({ promptId, isFavorited, onFavoriteChange }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleClick = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('prompt_id', promptId)
      onFavoriteChange(promptId, false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, prompt_id: promptId })
      onFavoriteChange(promptId, true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-9 h-9 flex items-center justify-center rounded-lg border transition-colors"
      style={{
        borderColor: isFavorited ? '#ec4899' : 'var(--border)',
        background: isFavorited ? '#fdf2f8' : 'transparent',
      }}
      aria-label={isFavorited ? 'お気に入り解除' : 'お気に入りに追加'}
    >
      <span style={{ color: isFavorited ? '#ec4899' : 'var(--subtext)' }}>
        {isFavorited ? '♥' : '♡'}
      </span>
    </button>
  )
}
