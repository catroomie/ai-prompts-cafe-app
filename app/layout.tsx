import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Prompts Cafe | 無料AIプロンプト集',
    template: 'AI Prompts Cafe | %s',
  },
  description: 'ChatGPT・Claude・Geminiで使えるAIプロンプトを無料公開。SNS・デザイン・マーケ・美容まで対応。コピペで即使える。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
