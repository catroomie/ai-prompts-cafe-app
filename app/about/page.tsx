'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function AboutPage() {
  const { lang } = useLang()
  const isEn = lang === 'en'

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>
          {isEn ? '← Back to top' : '← トップに戻る'}
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text)' }}>About</h1>

      <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
            {isEn ? 'What is AI Prompts Cafe?' : 'AI Prompts Cafeとは'}
          </h2>
          <p>
            {isEn
              ? 'AI Prompts Cafe is a free library of ready-to-use prompts for major AI tools including ChatGPT, Claude, and Gemini. We cover a wide range of categories — SNS, design, marketing, beauty, writing, business, and code — with carefully curated prompts you can copy and use instantly.'
              : 'ChatGPT・Claude・Geminiなど主要なAIツールですぐに使えるプロンプトを無料で公開しているサービスです。SNS・デザイン・マーケティング・美容・ライティング・ビジネス・コードなど幅広いカテゴリに対応しており、コピペで即使えるプロンプトを厳選して掲載しています。'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
            {isEn ? 'About this service' : '運営について'}
          </h2>
          <p>
            {isEn
              ? 'This service is independently operated. It was created out of a desire to make AI more accessible and practical for everyone. Prompts are added and updated regularly.'
              : '本サービスは個人が運営しています。AIをもっと手軽に・実用的に使いたいという思いから立ち上げました。プロンプトは定期的に追加・更新しています。'}
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
            {isEn ? 'How to use' : '使い方'}
          </h2>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            {isEn ? (
              <>
                <li>Browse by category or search for a prompt</li>
                <li>Click "Open" to view the full prompt text</li>
                <li>Copy and paste it into ChatGPT, Claude, or Gemini</li>
                <li>Create an account to save your favorites</li>
              </>
            ) : (
              <>
                <li>カテゴリまたは検索でプロンプトを探す</li>
                <li>「開く」でプロンプト全文を確認する</li>
                <li>コピーしてChatGPT・Claude・Geminiに貼り付けて使う</li>
                <li>アカウント登録でお気に入りを保存できる</li>
              </>
            )}
          </ol>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
            {isEn ? 'Newsletter' : 'ニュースレター'}
          </h2>
          <p className="mb-4">
            {isEn
              ? 'We send a weekly selection of curated prompts by email. Free to subscribe.'
              : '毎週、厳選プロンプトをメールでお届けしています。無料で登録できます。'}
          </p>
          <a
            href="https://ai-prompts-cafe.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)' }}
          >
            {isEn ? 'Subscribe for free →' : '無料で登録する →'}
          </a>
        </section>
      </div>
    </div>
  )
}
