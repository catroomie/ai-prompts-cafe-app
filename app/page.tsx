import PromptGrid from '@/components/prompts/PromptGrid'
import type { Prompt } from '@/lib/types'
import promptsData from '@/data/prompts.json'

const SUPABASE_CONFIGURED =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'

function getJsonPrompts(): Prompt[] {
  return (promptsData as any[]).map((p) => ({
    id: p.id,
    legacy_id: p.id,
    title: p.title,
    description_ja: p.description_ja,
    description_en: p.description_en ?? null,
    category: p.category,
    content: p.content,
    content_type: p.content_type ?? 'prompt',
    is_premium: p.is_premium ?? false,
    external_url: p.external_url ?? null,
    status: 'approved',
    submitted_by: null,
    copy_count: 0,
    created_at: new Date().toISOString(),
  })) as Prompt[]
}

export default async function Home() {
  let prompts: Prompt[] = []
  let favoriteIds: string[] = []

  if (SUPABASE_CONFIGURED) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      if (error) throw error
      prompts = data || []

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: favs } = await supabase
          .from('favorites')
          .select('prompt_id')
          .eq('user_id', user.id)
        favoriteIds = (favs || []).map((f) => f.prompt_id)
      }
    } catch {
      prompts = getJsonPrompts()
    }
  } else {
    prompts = getJsonPrompts()
  }

  return <PromptGrid prompts={prompts} initialFavoriteIds={favoriteIds} />
}
