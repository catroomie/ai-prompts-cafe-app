import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AI Prompts Cafe | 無料AIプロンプト集'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fff5f0 0%, #ffecd8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* アイコン */}
        <div style={{ fontSize: 80, marginBottom: 24 }}>☕</div>

        {/* サイト名 */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: '#b46432',
            marginBottom: 20,
            letterSpacing: '-1px',
          }}
        >
          AI Prompts Cafe
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#333',
            marginBottom: 16,
          }}
        >
          すぐ使えるAIプロンプト集
        </div>

        {/* サブテキスト */}
        <div
          style={{
            fontSize: 22,
            color: '#888',
            background: 'rgba(255,255,255,0.6)',
            padding: '10px 28px',
            borderRadius: '999px',
          }}
        >
          ChatGPT・Claude・Gemini対応 ｜ 96種類を無料公開
        </div>
      </div>
    ),
    { ...size }
  )
}
