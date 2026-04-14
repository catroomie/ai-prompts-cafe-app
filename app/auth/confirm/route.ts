export const runtime = 'edge'

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const forwardedHost = request.headers.get('x-forwarded-host')
  const redirectBase = forwardedHost ? `https://${forwardedHost}` : origin

  if (code) {
    const cookieStore = await cookies()
    // リダイレクトレスポンスを先に作り、そこにクッキーをセットする
    const response = NextResponse.redirect(`${redirectBase}/`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // レスポンスオブジェクトに直接クッキーをセット
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
  }

  return NextResponse.redirect(`${redirectBase}/login`)
}
