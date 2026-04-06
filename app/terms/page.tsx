import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: '利用規約' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--subtext)' }}>← トップに戻る</Link>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>利用規約</h1>
      <p className="text-xs mb-10" style={{ color: 'var(--subtext)' }}>最終更新日：2026年4月</p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: 'var(--subtext)' }}>
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
          <p>
            ただし、以下の行為は禁止します：
          </p>
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
      </div>
    </div>
  )
}
