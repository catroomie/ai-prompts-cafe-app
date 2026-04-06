import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MypageClient from './MypageClient'
import type { Prompt } from '@/lib/types'

export const metadata: Metadata = { title: 'My page' }

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

  const username = profile?.username || user.email || ''

  return <MypageClient username={username} prompts={favoritePrompts} />
}
