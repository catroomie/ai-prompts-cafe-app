This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## simply（シンプリー）— カメラと現像

`/simply` は、この Next.js アプリに含まれるカメラ兼写真加工アプリです。撮影から仕上げまでブラウザ内で完結し、画像はサーバーに送信されません。

### 撮る（`components/simply/CameraView.tsx`）

- 前面 / 背面カメラの切り替え、4:3・1:1・16:9 のフレーム
- 3分割グリッド、セルフタイマー（3秒 / 10秒）、シャッター中のカウントダウン
- ピンチとボタンによるズーム（端末が光学ズームに対応していればハードウェア側、非対応ならデジタルズーム）
- 露出補正（EV）、ライト（トーチ）、前面カメラの鏡像保存の切り替え
- フィルムストリップはライブ映像から生成した見本を表示
- カメラが使えない環境では手持ちの写真を読み込んで編集できます

### 仕上げる（`components/simply/EditorView.tsx`）

- フィルター10種（強度 0〜100）
- 調整10項目：露出・コントラスト・ハイライト・シャドウ・彩度・色温度・色かぶり・フェード・周辺光量・粒状感
- 構図：縦横比、拡大、ドラッグでの位置決め、90度回転、左右反転
- 長押しで加工前と比較、ワンタップでリセット
- 保存は共有シート（iOS なら「画像を保存」）を優先し、非対応ならダウンロード

### 実装メモ

- 画像処理は `components/simply/lib/render.ts` の 1 パスのピクセル処理。プレビューは画面サイズに縮小した状態で処理し、書き出し時のみ長辺 4096px までの原寸で再計算します。
- フィルターの定義は `components/simply/lib/presets.ts`。トーンカーブ的な調整値に加えて、影とハイライトへの色付け（スプリットトーン）を持ちます。
- カメラのライブプレビューは CSS フィルターによる近似で、確定した仕上がりは撮影後の現像時に適用されます。
