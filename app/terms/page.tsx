'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function TermsPage() {
  const { lang } = useLang()
  const isEn = lang === 'en'

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>
          {isEn ? '← Back to top' : '← トップに戻る'}
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
        {isEn ? 'Terms of Service' : '利用規約'}
      </h1>
      <p className="text-xs mb-10" style={{ color: 'var(--subtext)' }}>
        {isEn ? 'Last updated: April 2026' : '最終更新日：2026年4月'}
      </p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
        {isEn ? (
          <>
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 1 — Purpose and applicability</h2>
              <p>
                These Terms of Service ("Terms") set out the conditions for using AI Prompts Cafe ("the Service"). By using the Service, you agree to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 2 — Purpose of the service</h2>
              <p>
                The Service publishes prompts for use with AI tools (ChatGPT, Claude, Gemini, etc.) for informational purposes only. The content is provided as a reference and does not guarantee any specific outcome or result.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 3 — Disclaimer</h2>
              <p className="mb-3">
                The operator bears no responsibility for any results, outcomes, or damages arising from the use of prompts on this Service. Users use the Service at their own discretion and risk.
              </p>
              <p>
                The output of AI tools may vary depending on the service, version, or configuration used. The operator makes no warranties regarding the accuracy, completeness, or usefulness of any output.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 4 — Use and redistribution of content</h2>
              <p className="mb-3">
                Copying and using prompts from this Service for personal purposes is freely permitted.
              </p>
              <p>The following activities are prohibited:</p>
              <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5">
                <li>Reproducing or redistributing Service content without permission</li>
                <li>Using Service content for commercial purposes</li>
                <li>Using the Service's brand or name without the operator's consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 5 — Account use</h2>
              <p className="mb-3">
                The Service provides account registration. The following activities are prohibited:
              </p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>Unauthorised access to or impersonation of another user's account</li>
                <li>Registering an account with false information</li>
                <li>Transferring or lending your account to a third party</li>
                <li>Actions that place excessive load on the Service's systems</li>
                <li>Any other action the operator deems inappropriate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 6 — Changes and suspension of service</h2>
              <p>
                The operator may modify, add, remove, temporarily suspend, or terminate the Service without prior notice. The operator is not liable for any damages incurred by users as a result.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 7 — Changes to the Terms</h2>
              <p>
                The operator may update these Terms as necessary. Continued use of the Service after changes are made constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Article 8 — Contact</h2>
              <p>
                For inquiries regarding these Terms, please <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">contact us here</Link>.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第1条（目的・適用）</h2>
              <p>
                本利用規約（以下「本規約」）は、AI Prompts Cafe（以下「本サービス」）の利用に関する条件を定めるものです。
                本サービスを利用した時点で、本規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第2条（サービスの目的）</h2>
              <p>
                本サービスは、AIツール（ChatGPT・Claude・Gemini等）で活用できるプロンプトを情報提供目的で掲載しています。
                掲載内容はあくまで参考情報であり、特定の成果や結果を保証するものではありません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第3条（免責事項）</h2>
              <p className="mb-3">
                本サービスのプロンプトを利用したことによる結果・成果・損害について、運営者は一切の責任を負いません。
                利用者は自己の判断と責任のもとで本サービスを利用するものとします。
              </p>
              <p>
                また、AIツールの出力内容は利用するサービスの仕様・バージョン等により異なる場合があります。
                出力結果の正確性・完全性・有用性についても、運営者は保証しません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第4条（コンテンツの利用・転載）</h2>
              <p className="mb-3">
                本サービスに掲載しているプロンプトは、個人的な利用を目的としたコピー・使用は自由です。
              </p>
              <p>ただし、以下の行為は禁止します：</p>
              <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5">
                <li>本サービスのコンテンツを無断で転載・再配布すること</li>
                <li>本サービスのコンテンツを商業目的で二次利用すること</li>
                <li>運営者に無断で本サービスのブランド・名称を使用すること</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第5条（アカウント利用）</h2>
              <p className="mb-3">
                本サービスはアカウント登録機能を提供しています。アカウントの利用にあたり、以下の行為を禁止します：
              </p>
              <ul className="list-disc list-inside flex flex-col gap-1.5">
                <li>他者のアカウントへの不正アクセス・なりすまし</li>
                <li>虚偽の情報を用いたアカウント登録</li>
                <li>第三者へのアカウントの譲渡・貸与</li>
                <li>本サービスのシステムに過度な負荷を与える行為</li>
                <li>その他、運営者が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第6条（サービスの変更・停止）</h2>
              <p>
                運営者は、事前の通知なく本サービスの内容の変更・追加・削除、または一時停止・終了を行うことがあります。
                これにより利用者に生じた損害について、運営者は責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第7条（規約の変更）</h2>
              <p>
                運営者は必要に応じて本規約を変更することがあります。変更後に本サービスを利用した場合、
                変更後の規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>第8条（お問い合わせ）</h2>
              <p>
                本規約に関するお問い合わせは <Link href="/contact" style={{ color: 'var(--accent)' }} className="hover:underline">こちら</Link> からご連絡ください。
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
