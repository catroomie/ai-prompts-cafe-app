# projects/

このフォルダには、メインの AI Prompts Cafe サイトとは独立した、開発中のアプリを入れていきます。各アプリは自分のフォルダの中に `package.json` を持つ、それぞれ単独で動くプロジェクトです。

## 一覧

- `people-memo/` — 大切な人のことを忘れないためのメモアプリ
- `google-review-helper/` — Googleマップの口コミ対応・改善提案を一目で確認できる検証用デモ（AI連携なし、サンプルデータ）

## 動かし方

```bash
cd projects/<アプリ名>
npm install
npm run dev
```
