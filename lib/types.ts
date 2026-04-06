export type Category = 'SNS' | 'Design' | 'Marketing' | 'Beauty' | 'Writing' | 'Business' | 'Code'

export type ContentType = 'prompt' | 'template' | 'system'

export interface Prompt {
  id: string
  legacy_id: string | null
  title: string
  description_ja: string
  description_en: string | null
  category: Category
  content: string
  content_type: ContentType
  is_premium: boolean
  external_url: string | null
  status: string
  submitted_by: string | null
  copy_count: number
  created_at: string
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  role: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  prompt_id: string
  created_at: string
}
