# ASEAN低圧配制事業ポータル

## 概要
ASEAN各国の低圧配制に関する情報を、地図と比較テーブルで横断確認できる社内向けポータルです。
地図上の国をクリックすると、その国へズームし、比較テーブルを絞り込みます。同じ国を再クリックすると全体表示へ戻ります。

## 技術スタック
- React 18
- TypeScript
- Vite
- SVG（GeoJSONをクライアントで描画）
- フォント: Noto Sans JP（ローカル同梱）

## ファイル構成
- `index.html`: Viteエントリ
- `src/main.tsx`: React起動
- `src/App.tsx`: 画面構成・地図ロジック・絞り込み
- `src/styles.css`: サイト全体スタイル
- `public/data/countries.json`: 比較テーブルデータ
- `public/data/asean_context_10m.geojson`: ASEAN中心の周辺国含む地図データ
- `public/data/asean_10m.geojson`: ASEAN地図データ（フォールバック）
- `public/fonts/NotoSansJP-wght.ttf`: サイト共通フォント

## 開発環境起動
1. 依存関係をインストール
```bash
npm install
```
2. 開発サーバー起動（8080固定）
```bash
npm run dev
```
3. ブラウザで `http://localhost:8080` を開く

## 本番ビルド
```bash
npm run build
npm run preview
```

## データ更新
- 比較テーブル: `public/data/countries.json` を編集
- 地図: `public/data/asean_context_10m.geojson`（必要時 `public/data/asean_10m.geojson`）を差し替え
