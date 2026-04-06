import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { LanguageProvider } from '@/lib/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = 'https://ai-prompts-cafe-app.vercel.app'
const SITE_NAME = 'AI Prompts Cafe'
const SITE_TITLE = '無料AIプロンプト集｜ChatGPT・Claude・Gemini対応 | AI Prompts Cafe'
const SITE_DESC = 'ChatGPT・Claude・Geminiで使えるAIプロンプトを無料公開。SNS投稿・デザイン・マーケティング・美容・ライティング・コードまで対応。コピペで即使える実用プロンプト集。'

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'AIプロンプト', 'プロンプト集', '無料', 'ChatGPT', 'Claude', 'Gemini',
    'SNS', 'マーケティング', 'コピーライティング', 'AI活用', 'プロンプトエンジニアリング',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `無料AIプロンプト集 | ${SITE_NAME}`,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `無料AIプロンプト集 | ${SITE_NAME}`,
    description: 'ChatGPT・Claude・Geminiで使えるAIプロンプトを無料公開。コピペで即使える。',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'AI Prompts Cafe',
    statusBarStyle: 'default',
  },
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
