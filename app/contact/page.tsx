'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function ContactPage() {
  const { lang } = useLang()
  const isEn = lang === 'en'

  const faqs = isEn
    ? [
        {
          q: 'Can I request a specific prompt?',
          a: 'Yes! Send us an email with the category or use case you have in mind. We will review your request and consider adding it.',
        },
        {
          q: 'Can I use prompts on my own site?',
          a: 'Personal use is freely permitted. Redistribution or commercial reuse without permission is not allowed. See the Terms of Service for details.',
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, please contact us by email and we will take care of it promptly.',
        },
      ]
    : [
        {
          q: 'プロンプトのリクエストはできますか？',
          a: 'はい、ご希望のカテゴリや用途をメールでお知らせください。内容を確認のうえ、掲載を検討します。',
        },
        {
          q: 'プロンプトを自分のサイトで使ってもいいですか？',
          a: '個人利用は自由です。商業目的での転載・再配布はご遠慮ください。詳しくは利用規約をご確認ください。',
        },
        {
          q: 'アカウントの削除はできますか？',
          a: 'はい、メールにてお申し付けください。速やかに対応いたします。',
        },
      ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>
          {isEn ? '← Back to top' : '← トップに戻る'}
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text)' }}>Contact</h1>

      <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        <section>
          <p>
            {isEn
              ? 'Feel free to reach out with any questions, feedback, or prompt requests. We typically reply within 2–3 business days.'
              : 'ご質問・フィードバック・プロンプトのリクエストなど、お気軽にご連絡ください。通常2〜3営業日以内にご返信します。'}
          </p>
        </section>

        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {isEn ? 'Email' : 'メールアドレス'}
            </p>
            <a
              href="mailto:hello@ai-prompts-cafe.com"
              className="hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              hello@ai-prompts-cafe.com
            </a>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {isEn ? 'Newsletter' : 'ニュースレター'}
            </p>
            <a
              href="https://ai-prompts-cafe.beehiiv.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              ai-prompts-cafe.beehiiv.com
            </a>
          </div>
        </div>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>
            {isEn ? 'Frequently asked questions' : 'よくあるお問い合わせ'}
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl px-4 py-3" style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}>
                <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{q}</p>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
