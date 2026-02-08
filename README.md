# ASEAN低圧遮断器サイト（部署内向け）

## 概要
ASEAN各国の低圧遮断器に関する情報を、国別に比較・検索できるシンプルな静的サイトです。
トップにASEANマップを配置し、国をクリックしてテーブルを絞り込めます。

## ファイル構成
- `index.html`: 画面本体
- `styles.css`: 見た目
- `app.js`: フィルタ・検索ロジック
- `data/countries.json`: 国別データ
- `data/asean_10m.geojson`: ASEAN 10か国の高精細境界データ
- `data/countries-data.js`: 国別データのJS埋め込み版
- `data/asean-map-data.js`: 地図データのJS埋め込み版
- `assets/fonts/NotoSansJP-wght.ttf`: サイト共通フォント

## 使い方
1. このフォルダでローカルサーバーを起動
```bash
python3 -m http.server 8000
```
2. ブラウザで `http://localhost:8000` を開く

## 実装メモ
- 地図は外部CDNに依存せず、`data/asean-map-data.js` からSVGに直接描画
- フォントは `Noto Sans JP` をローカル同梱して全体に適用

## データ更新方法
- `data/countries.json` を編集
- 各国オブジェクトの `updatedAt` は `YYYY-MM-DD` 形式で更新
- 推奨: 各項目に根拠URLや社内メモIDを追記して監査可能にする

## 次の拡張候補
- 根拠URL列の追加（一次情報リンク）
- 更新者名・レビュー承認者列の追加
- CSVエクスポート機能
- 認証要否チェックリスト（見積前チェック）
