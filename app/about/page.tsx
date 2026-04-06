import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← トップに戻る</Link>
      </div>

      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text)' }}>About</h1>

      <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>AI Prompts Cafeとは</h2>
          <p>
            ChatGPT・Claude・Geminiなど主要なAIツールですぐに使えるプロンプトを無料で公開しているサービスです。
            SNS・デザイン・マーケティング・美容・ライティング・ビジネス・コードなど幅広いカテゴリに対応しており、
            コピペで即使えるプロンプトを厳選して掲載しています。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>運営について</h2>
          <p>
            本サービスは個人が運営しています。AIをもっと手軽に・実用的に使いたいという思いから立ち上げました。
            プロンプトは定期的に追加・更新しています。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>使い方</h2>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>カテゴリまたは検索でプロンプトを探す</li>
            <li>「開く」でプロンプト全文を確認する</li>
            <li>コピーしてChatGPT・Claude・Geminiに貼り付けて使う</li>
            <li>アカウント登録でお気に入りを保存できる</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>ニュースレター</h2>
          <p className="mb-4">
            毎週、厳選プロンプトをメールでお届けしています。無料で登録できます。
          </p>
          <a
            href="https://ai-prompts-cafe.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)' }}
          >
            無料で登録する →
          </a>
        </section>
      </div>
    </div>
  )
}
