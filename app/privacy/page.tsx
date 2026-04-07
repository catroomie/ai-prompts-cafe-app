'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function PrivacyPage() {
  const { lang } = useLang()
  const isEn = lang === 'en'

  const thirdParties = isEn
    ? [
        { name: 'Supabase', desc: 'Hosting of authentication data and favorites', url: 'https://supabase.com/privacy' },
        { name: 'Google OAuth', desc: 'Sign-in with Google account', url: 'https://policies.google.com/privacy' },
        { name: 'Vercel', desc: 'Service hosting and access log collection', url: 'https://vercel.com/legal/privacy-policy' },
        { name: 'Beehiiv', desc: 'Newsletter delivery (subscribers only)', url: 'https://www.beehiiv.com/privacy' },
      ]
    : [
        { name: 'Supabase', desc: '認証情報・お気に入りデータのホスティング', url: 'https://supabase.com/privacy' },
        { name: 'Google OAuth', desc: 'Googleアカウントを使ったログイン機能の提供', url: 'https://policies.google.com/privacy' },
        { name: 'Vercel', desc: 'サービスのホスティング・アクセスログの収集', url: 'https://vercel.com/legal/privacy-policy' },
        { name: 'Beehiiv', desc: 'ニュースレターの配信（購読者のみ対象）', url: 'https://www.beehiiv.com/privacy' },
      ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>
          {isEn ? '← Back to top' : '← トップに戻る'}
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
        {isEn ? 'Privacy Policy' : 'プライバシーポリシー'}
      </h1>
      <p className="text-xs mb-10" style={{ color: 'var(--subtext)' }}>
        {isEn ? 'Last updated: April 2026' : '最終更新日：2026年4月'}
      </p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        {isEn ? (
          <>
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 1 — Information we collect</h2>
              <p className="mb-3">The Service may collect the following information:</p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>Email address (when registering by email)</li>
                <li>Name and profile picture (when signing in with Google)</li>
                <li>IDs of prompts saved as favorites</li>
                <li>Access logs and usage data (automatically collected by Vercel)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 2 — How we use your information</h2>
              <p className="mb-3">Collected information is used solely for the following purposes:</p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>Sign-in and account management</li>
                <li>Providing the favorites feature</li>
                <li>Service improvement and bug fixes</li>
                <li>Newsletter delivery (subscribers only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 3 — Third-party sharing</h2>
              <p>
                Personal information collected will not be provided, sold, or shared with third parties, except as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 4 — Third-party services</h2>
              <p className="mb-3">The Service uses the following third-party services:</p>
              <div className="flex flex-col gap-4">
                {thirdParties.map(({ name, desc, url }) => (
                  <div key={name} className="rounded-xl px-4 py-3" style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}>
                    <p className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{name}</p>
                    <p className="mb-1">{desc}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                      View privacy policy →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 5 — Cookies</h2>
              <p>
                The Service uses cookies to maintain your login session. No advertising or tracking cookies are used.
                You may disable cookies in your browser settings, but doing so may prevent the login feature from working correctly.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 6 — Data security</h2>
              <p>
                Collected personal information is managed appropriately and reasonable security measures are taken to prevent unauthorised access, leakage, or tampering.
                However, complete security over the internet cannot be guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 7 — Deletion and access requests</h2>
              <p>
                To request account deletion or the disclosure, correction, or deletion of your data, please contact us via the{' '}
                <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">contact form</Link>.
                We will respond within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 8 — Policy updates</h2>
              <p>
                This policy may be updated as necessary. We will notify users of significant changes within the Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 9 — Contact</h2>
              <p>
                For questions about this policy, please <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">contact us here</Link>.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第1条（取得する情報）</h2>
              <p className="mb-3">本サービスでは、以下の情報を取得することがあります：</p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>メールアドレス（メール登録時）</li>
                <li>氏名・プロフィール画像（Google認証でログインした場合）</li>
                <li>お気に入り登録したプロンプトのID</li>
                <li>アクセスログ・利用状況（Vercelによる自動取得）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第2条（利用目的）</h2>
              <p className="mb-3">取得した情報は以下の目的のみに使用します：</p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>ログイン・アカウント管理</li>
                <li>お気に入り機能の提供</li>
                <li>サービスの改善・不具合対応</li>
                <li>ニュースレターの配信（登録した場合のみ）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第3条（第三者提供）</h2>
              <p>
                取得した個人情報は、法令に基づく場合を除き、第三者に提供・販売・共有することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第4条（外部サービスの利用）</h2>
              <p className="mb-3">本サービスでは以下の外部サービスを利用しています：</p>
              <div className="flex flex-col gap-4">
                {thirdParties.map(({ name, desc, url }) => (
                  <div key={name} className="rounded-xl px-4 py-3" style={{ background: 'var(--tag-bg)', border: '1px solid var(--border)' }}>
                    <p className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{name}</p>
                    <p className="mb-1">{desc}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                      プライバシーポリシーを確認 →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第5条（Cookieについて）</h2>
              <p>
                本サービスはログイン状態の維持のためにCookieを使用しています。
                広告・トラッキング目的のCookieは使用していません。
                ブラウザの設定によりCookieを無効にすることも可能ですが、その場合ログイン機能が正常に動作しない場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第6条（情報の管理）</h2>
              <p>
                取得した個人情報は適切に管理し、不正アクセス・漏洩・改ざん等が起きないよう合理的な安全措置を講じます。
                ただし、インターネット上での完全な安全性を保証するものではありません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第7条（情報の削除・開示請求）</h2>
              <p>
                アカウントの削除や取得情報の開示・訂正・削除を希望する場合は、
                <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">お問い合わせフォーム</Link>よりご連絡ください。
                合理的な範囲で対応いたします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第8条（ポリシーの変更）</h2>
              <p>
                本ポリシーは必要に応じて更新することがあります。
                重要な変更がある場合はサービス上でお知らせします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第9条（お問い合わせ）</h2>
              <p>
                本ポリシーに関するご質問は <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">こちら</Link> からご連絡ください。
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
