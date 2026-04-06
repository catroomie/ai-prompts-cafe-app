import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'プライバシーポリシー' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← トップに戻る</Link>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>プライバシーポリシー</h1>
      <p className="text-xs mb-10" style={{ color: 'var(--subtext)' }}>最終更新日：2026年4月</p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
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
            {[
              {
                name: 'Supabase',
                desc: '認証情報・お気に入りデータのホスティング',
                url: 'https://supabase.com/privacy',
              },
              {
                name: 'Google OAuth',
                desc: 'Googleアカウントを使ったログイン機能の提供',
                url: 'https://policies.google.com/privacy',
              },
              {
                name: 'Vercel',
                desc: 'サービスのホスティング・アクセスログの収集',
                url: 'https://vercel.com/legal/privacy-policy',
              },
              {
                name: 'Beehiiv',
                desc: 'ニュースレターの配信（購読者のみ対象）',
                url: 'https://www.beehiiv.com/privacy',
              },
            ].map(({ name, desc, url }) => (
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
      </div>
    </div>
  )
}
