# 日々珈琲 — Eleventy Sample LP

清澄白河の自家焙煎カフェ「日々珈琲」のサンプルLPです。
Eleventy (11ty) + GitHub Pages で運用します。デザインは要件定義 → 完成イメージ合意 → 実装の順で、Museと対話しながら制作しました（経緯は `REQUIREMENTS.md`）。

## 構成
- `src/index.njk` — LP本体（Hero / Concept / メニュー / 豆の販売 / ギャラリー / 店舗案内）
- `src/_data/*.json` — 店舗情報・メニュー・豆（編集すればLPに反映）
- `src/_includes/` — レイアウト / ヘッダー / フッター
- `src/css/style.css` — 明朝×余白×罫線の日本語タイポ設計。素のCSSのみ
- `src/js/main.js` — スクロール時のフェードのみ
- `src/img/` — AI生成した店舗写真（WebP最適化済み）
- `.github/workflows/deploy.yml` — mainへpushで自動デプロイ

## Lighthouse対策（モバイル/デスクトップ全カテゴリ100をローカル計測で確認）
- 画像: `@11ty/eleventy-img` で AVIF/WebP/JPEG の複数幅を生成、`width/height` 付与で CLS 0
- CSS/JS は HTML にインライン化し、リクエストは初期表示で6本・転送量 約193KBまで削減
- フォント: 見出しの Shippori Mincho は使用文字だけのサブセット（単一ファイル 58KB、`scripts/build-fonts.py` で再生成）。本文ゴシックは端末フォント
- テキスト色のコントラスト比は WCAG AA 以上を確保

## ローカル
```bash
npm install
npm start        # http://localhost:8080
npm run build:gh # GitHub Pages用ビルド
```

公開先: https://inovue.github.io/muse-11ty-lp/
