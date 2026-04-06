import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MypageClient from './MypageClient'
import type { Prompt } from '@/lib/types'

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: favorites } = await supabase
    .from('favorites')
    .select('id, prompt_id, created_at, prompts(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const favoritePrompts = (favorites || [])
    .map((f: any) => f.prompts)
    .filter(Boolean) as Prompt[]

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>マイページ</h1>
        <p className="text-sm" style={{ color: 'var(--subtext)' }}>{profile?.username || user.email}</p>
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          お気に入り ({favoritePrompts.length})
        </h2>
        {favoritePrompts.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--subtext)' }}>お気に入りがまだありません</p>
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>プロンプトを探す →</Link>
          </div>
        ) : (
          <MypageClient prompts={favoritePrompts} />
        )}
      </section>
    </div>
  )
}
