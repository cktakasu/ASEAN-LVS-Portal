マレーシアページは下記のような内容を実装したい。

# LV遮断器市場インテリジェンスダッシュボード — 設計仕様書
 
## 1. プロジェクト概要
 
### 1-1. 目的
ASEAN各国（初期はマレーシア）のLV（低圧）遮断器市場を俯瞰し、戦略的意思決定を導き出すための情報基盤をStreamlitで構築する。
 
### 1-2. 設計原則
- **意思決定逆算設計**: 「最終的にどんな判断をするか」から逆算し、その判断に必要な情報だけを配置する
- **規格・認証は参入の生命線**: 規格適合・認証取得は「なければ売れない」情報として独立した層で厚く扱う
- **運用継続性の組み込み**: 毎年アップデートすることを前提とし、年次更新作業を最小化する設計にする。完成して終わりではない
 
### 1-3. 技術スタック
- Python + Streamlit
- グラフ: Plotly / Altair
- 地図: Folium（必要に応じて）
- データ管理: CSV（APIは使用しない）
- 実行環境: Mac Studio M4 Max（macOS最新版）
 
---
 
## 2. 意思決定フローとタブ構成
 
ダッシュボードは6つのタブで構成される。左から右へ進むほど粒度が細かくなり、タブを順番に見ていけば自然と戦略立案に至る。
市場を知る → 需要の所在を知る → 参入条件を知る → 競争環境を知る → 自社の立ち位置を知る → 打ち手を決める T1 T2 T3 T4 T5 T6
 
| タブ | 名称 | 戦略的問い |
|---|---|---|
| T1 | Country Profile | この国は攻める価値があるか？ |
| T2 | Market & Demand | どこに需要があるのか？何が求められているのか？ |
| T3 | Regulatory Gateway | 売るために何が必要か？（規格・認証・通関） |
| T4 | Competitive Landscape | 誰と戦うのか？彼らの強みと弱みは？空白はどこか？ |
| T5 | Our Position | 我々は今どこにいるのか？ |
| T6 | Strategic Assessment | では、何をすべきか？ |
 
---
 
## 3. 全体UIレイアウト
 
### 3-1. サイドバー
- 国選択セレクター（MY/TH/VN/ID/PH/SG）
- 年度選択セレクター（data/配下のディレクトリを自動検出）
- 通貨表示切替（USD / 現地通貨）
- エクスポートボタン（CSV / PDF）
 
### 3-2. メインエリア
- タブ切替（T1～T6）
- 各タブ内はセクションごとに区切り、見出しで構造化
 
### 3-3. フッター
- データ更新日時（CSVのupdated_dateの最古値を表示）
- データ出典の注意書き
- バージョン番号
 
---
 
## 4. 機種定義（全ファイル共通）
 
機種を扱うすべてのファイルで以下の6種を使用する。表示順もこの順序で統一する。
 
| 順序 | product_type | 正式名称 | 主要適用IEC規格 | 利用カテゴリ |
|---|---|---|---|---|
| 1 | ACB | Air Circuit Breaker | IEC 60947-2 | Cat_B（選択性） |
| 2 | MCCB | Moulded Case Circuit Breaker | IEC 60947-2 | Cat_A（非選択性） |
| 3 | ELCB | Earth Leakage Circuit Breaker | IEC 61008-1 / IEC 61009-1 | N/A |
| 4 | MCB | Miniature Circuit Breaker | IEC 60898-1 | N/A |
| 5 | RCBO | Residual Current Breaker with Overcurrent Protection | IEC 61009-1 | N/A |
| 6 | RCCB | Residual Current Circuit Breaker | IEC 61008-1 | N/A |
 
---
 
## 5. 対象国定義
 
| コード | 国名 | 通貨 | Phase |
|---|---|---|---|
| MY | Malaysia | MYR | Phase 1（初期） |
| TH | Thailand | THB | Phase 1 |
| VN | Vietnam | VND | Phase 1 |
| ID | Indonesia | IDR | Phase 1 |
| PH | Philippines | PHP | Phase 1 |
| SG | Singapore | SGD | Phase 1 |
 
---
 
## 6. CSV共通ルール
 
- エンコーディング: UTF-8（BOMなし）
- 区切り文字: カンマ
- 全ファイルの末尾に以下の共通カラムを配置する:
  - `country_code`: TEXT。ISO 3166-1 alpha-2（MY/TH/VN/ID/PH/SG）
  - `year`: INTEGER。データが属する年度（例: 2025）
  - `updated_date`: TEXT。yyyy-mm-dd形式。その行を最後に更新した日付
  - `source`: TEXT。データ出典URL、またはレポート名。複数はセミコロン区切り
  - `notes`: TEXT。自由記述メモ。空欄可
- 機種別カラムを持つファイルでは `product_type` と `product_type_order` を使用する
  - `product_type`: TEXT。値は ACB/MCCB/ELCB/MCB/RCBO/RCCB のいずれか
  - `product_type_order`: INTEGER。ACB=1, MCCB=2, ELCB=3, MCB=4, RCBO=5, RCCB=6
- ファイル格納パス: `data/{year}/`（例: `data/2025/T1_economy.csv`）
- 空テンプレートは `data/templates/` に格納
 
---
 
## 7. 各タブのセクション定義とCSVテンプレート
 
---
 
### T1 — Country Profile（3ファイル）
 
#### T1 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| 経済KPI | GDP、成長率、人口、1人当たりGDP、FDI、為替 | KPIカード群 | T1_economy.csv |
| GDP推移 | 過去5年+予測3年 | 折れ線グラフ | T1_economy.csv（複数年度分を結合） |
| 産業別GDP構成比 | 製造業、建設、サービス等 | 横棒グラフ / ドーナツ | T1_gdp_composition.csv |
| 電力インフラ基礎 | 電圧/周波数/プラグ/電化率/再エネ目標 | テーブル | T1_economy.csv |
| 主要経済ニュース | 政策・投資ニュース | テキストリスト | T1_economic_news.csv |
 
#### ファイル01: T1_economy.csv
 
用途: 対象国の主要経済指標を年度ごとに保持する。1行＝1国×1年度。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| gdp_usd_billion | FLOAT | ○ | GDP（名目、十億ドル） | 430.9 |
| gdp_growth_pct | FLOAT | ○ | GDP成長率（%） | 5.2 |
| population_million | FLOAT | ○ | 人口（百万人） | 34.3 |
| gdp_per_capita_usd | FLOAT | ○ | 1人当たりGDP（ドル） | 12560 |
| fdi_inflow_usd_billion | FLOAT | △ | FDI流入額（十億ドル） | 16.9 |
| exchange_rate_to_usd | FLOAT | ○ | 対USドル年平均為替レート | 4.45 |
| inflation_pct | FLOAT | △ | インフレ率（%） | 2.5 |
| voltage | TEXT | ○ | 商用電圧 | 230V/400V |
| frequency_hz | INTEGER | ○ | 商用周波数 | 50 |
| plug_type | TEXT | ○ | プラグ規格 | Type G |
| country_code | TEXT | ○ | 国コード | MY |
| year | INTEGER | ○ | 年度 | 2025 |
| updated_date | TEXT | ○ | 更新日 | 2025-04-15 |
| source | TEXT | ○ | 出典 | World Bank; IMF WEO |
| notes | TEXT | | メモ | |
 
#### ファイル02: T1_gdp_composition.csv
 
用途: 産業別GDP構成比。1行＝1国×1年度×1セクター。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| sector | TEXT | ○ | 産業セクター名 | Manufacturing |
| gdp_share_pct | FLOAT | ○ | GDP構成比（%） | 23.4 |
| growth_rate_pct | FLOAT | △ | 当該セクターの成長率（%） | 6.1 |
| cb_relevance | TEXT | △ | CB需要との関連度（High/Medium/Low） | High |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | DOSM Malaysia |
| notes | TEXT | | | |
 
#### ファイル03: T1_economic_news.csv
 
用途: 主要経済ニュース・政策情報の時系列蓄積。1行＝1ニュース。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| date | TEXT | ○ | ニュース日付（yyyy-mm-dd） | 2025-03-10 |
| headline | TEXT | ○ | 見出し | AWS pledges USD 6B investment in Malaysia by 2037 |
| category | TEXT | ○ | カテゴリ（Policy/Investment/Trade/Infrastructure/Other） | Investment |
| cb_impact | TEXT | △ | CB市場への影響度（High/Medium/Low/None） | High |
| summary | TEXT | △ | 要約（1～2文） | データセンター建設に伴いLV配電盤需要が急増する見込み |
| url | TEXT | △ | 記事URL | https://... |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Reuters |
| notes | TEXT | | | |
 
---
 
### T2 — Market & Demand（5ファイル）
 
#### T2 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| LV-CB市場KPI | 市場規模、CAGR、予測値、ASEAN順位 | KPIカード | T2_cb_market.csv |
| 市場規模推移 | 過去5年+予測5年 | 折れ線グラフ | T2_cb_market.csv |
| 機種別構成比 | ACB/MCCB/ELCB/MCB/RCBO/RCCB | ドーナツ | T2_cb_product_mix.csv |
| 用途別構成比 | 製造業/商業/インフラ/住宅/DC/再エネ | ドーナツ | T2_cb_application_mix.csv |
| 需要ドライバー一覧 | セクター名、規模、成長率、CB関連度 | テーブル | T2_demand_drivers.csv |
| セクター×機種ヒートマップ | DC/半導体/太陽光等 × ACB/MCCB/MCB等 | ヒートマップ | T2_demand_drivers.csv（primary_product_typesから生成） |
| 需要集中エリア | 州・地域別 | 地図 or 棒グラフ | T2_demand_drivers.csv（regionから集計） |
| メガプロジェクト一覧 | 個別案件リスト | テーブル（フィルタ付） | T2_mega_projects.csv |
 
#### ファイル04: T2_cb_market.csv
 
用途: LV遮断器市場の規模推移（実績＋予測）。1行＝1国×1データ年。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| data_year | INTEGER | ○ | データが示す年（グラフX軸） | 2023 |
| market_size_usd_million | FLOAT | ○ | 市場規模（百万ドル） | 850.0 |
| market_size_local_million | FLOAT | △ | 市場規模（現地通貨、百万） | 3782.5 |
| local_currency | TEXT | △ | 現地通貨コード | MYR |
| is_forecast | BOOLEAN | ○ | 予測値か実績値か（TRUE=予測） | FALSE |
| cagr_pct | FLOAT | △ | CAGR（期間はnotesに記述） | 9.67 |
| asean_rank | INTEGER | △ | ASEAN域内市場規模順位 | 2 |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | 6Wresearch; Ken Research |
| notes | TEXT | | | CAGR期間: 2025-2033 |
 
#### ファイル05: T2_cb_product_mix.csv

用途: 機種別構成比。1行＝1国×1年度×1機種。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | MCCB |
| product_type_order | INTEGER | ○ | 表示順 | 2 |
| share_pct | FLOAT | ○ | 構成比（%） | 45.0 |
| market_size_usd_million | FLOAT | △ | 当該機種の市場規模（百万ドル） | 382.5 |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | GMI Insights |
| notes | TEXT | | | |
 
#### ファイル06: T2_cb_application_mix.csv
 
用途: 用途別構成比。1行＝1国×1年度×1用途。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| application | TEXT | ○ | 用途名 | Data Center |
| share_pct | FLOAT | ○ | 構成比（%） | 18.0 |
| growth_rate_pct | FLOAT | △ | 当該用途の成長率（%） | 10.8 |
| primary_product_types | TEXT | △ | 主に必要な機種（カンマ区切り） | ACB,MCCB |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | MarketsandMarkets |
| notes | TEXT | | | |
 
#### ファイル07: T2_demand_drivers.csv
 
用途: 需要ドライバー一覧。1行＝1国×1年度×1ドライバー。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| driver_name | TEXT | ○ | ドライバー名 | Data Center Boom |
| sector | TEXT | ○ | 関連産業 | ICT |
| market_size_usd_billion | FLOAT | △ | セクター市場規模（十億ドル） | 6.14 |
| growth_rate_pct | FLOAT | △ | 成長率（%） | 10.86 |
| forecast_year | INTEGER | △ | 予測目標年 | 2031 |
| cb_relevance | TEXT | ○ | CB需要との関連度（High/Medium/Low） | High |
| primary_product_types | TEXT | △ | 需要が大きい機種（カンマ区切り） | ACB,MCCB |
| key_projects | TEXT | △ | 主要プロジェクト名 | Johor DC cluster (42 projects) |
| region | TEXT | △ | 需要集中地域 | Johor |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Fortune Business Insights |
| notes | TEXT | | | |
 
#### ファイル08: T2_mega_projects.csv
 
用途: メガプロジェクト案件一覧。1行＝1プロジェクト。

| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| project_name | TEXT | ○ | プロジェクト名 | Penang LRT Mutiara Line |
| sector | TEXT | ○ | 産業セクター | Infrastructure |
| region | TEXT | ○ | 所在地（州/都市） | Penang |
| investment_usd_million | FLOAT | △ | 投資額（百万ドル） | 2500.0 |
| investment_local_million | FLOAT | △ | 投資額（現地通貨、百万） | 11125.0 |
| local_currency | TEXT | △ | 現地通貨コード | MYR |
| start_year | INTEGER | △ | 開始年 | 2025 |
| end_year | INTEGER | △ | 完了予定年 | 2030 |
| status | TEXT | ○ | ステータス（Planned/Ongoing/Completed/Cancelled） | Ongoing |
| cb_demand_types | TEXT | △ | 需要が見込まれる機種（カンマ区切り） | ACB,MCCB,MCB |
| cb_demand_level | TEXT | △ | CB需要規模感（Large/Medium/Small） | Large |
| owner_developer | TEXT | △ | 事業主体 | Penang State Government |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | The Star |
| notes | TEXT | | | |

---

### T3 — Regulatory Gateway（8ファイル）
 
#### T3 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| 3-1 電力基本仕様 | 電圧/周波数/プラグ/配電方式 | パネル | T3_power_specs.csv |
| 3-2 機種別適用規格マトリクス | 機種×規格番号・名称・強制/任意 | テーブル | T3_standards_matrix.csv |
| 3-3 機種別認証フロー | 各機種のステップ・期間・費用 | フローチャート＋テーブル（機種タブ切替） | T3_cert_flow.csv |
| 3-4 機種別CB Scheme対応 | CB証書の受理可否・国家差異 | テーブル | T3_cb_scheme.csv |
| 3-5 ASEAN EE MRA | 相互認証対象・認定ラボ一覧 | テーブル | T3_asean_mra.csv |
| 3-6 認証機関情報 | 機関名・役割・連絡先 | テーブル | T3_cert_bodies.csv |
| 3-7 関税・通関 | 機種別HSコード・税率・必要書類 | テーブル | T3_tariff.csv |
| 3-8 自社製品認証ステータス | 機種×シリーズの認証取得状況 | テーブル（ステータス色分け） | T3_own_cert_status.csv |
 
#### ファイル09: T3_power_specs.csv
 
用途: 電力基本仕様。1行＝1国×1年度。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| voltage | TEXT | ○ | 商用電圧 | 230V/400V |
| frequency_hz | INTEGER | ○ | 周波数 | 50 |
| plug_type | TEXT | ○ | プラグ規格 | Type G |
| distribution_system | TEXT | △ | 配電方式 | TN-CS |
| utility_company | TEXT | △ | 主要電力会社 | Tenaga Nasional Berhad (TNB) |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Energy Commission Malaysia |
| notes | TEXT | | | |
 
#### ファイル10: T3_standards_matrix.csv
 
用途: 機種別×国別の適用規格マトリクス。T3の中核テーブル。1行＝1国×1機種。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | MCCB |
| product_type_order | INTEGER | ○ | 表示順（1-6） | 2 |
| iec_standard | TEXT | ○ | IEC国際規格番号 | IEC 60947-2 |
| iec_version | TEXT | ○ | IEC規格の版数/年 | 2024 (Ed.6) |
| national_standard | TEXT | ○ | 当該国の国家規格番号 | MS IEC 60947-2 |
| national_version | TEXT | ○ | 国家規格の版数/年 | 2007 |
| utilization_category | TEXT | ○ | 利用カテゴリ（Cat_A/Cat_B/N/A） | Cat_A |
| scope_summary | TEXT | ○ | 適用範囲概要 | 産業・商業用途。定格≤1000VAC/1500VDC。非選択性 |
| rated_current_range | TEXT | △ | 定格電流範囲 | 16A-1600A |
| rated_voltage_max | TEXT | △ | 最大定格電圧 | 1000VAC / 1500VDC |
| mandatory_voluntary | TEXT | ○ | 強制/任意（Mandatory/Voluntary） | Mandatory |
| related_standards | TEXT | △ | 関連規格（セミコロン区切り） | IEC 60947-1 (General rules) |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Energy Commission GP/ST/NO.37/2024 |
| notes | TEXT | | | |
 
#### ファイル11: T3_cert_flow.csv
 
用途: 機種別の認証取得フロー。1行＝1国×1機種×1ステップ。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | ACB |
| product_type_order | INTEGER | ○ | 表示順 | 1 |
| step_number | INTEGER | ○ | ステップ番号（1始まり） | 1 |
| step_name | TEXT | ○ | ステップ名 | IECEE CB証書の取得 |
| description | TEXT | ○ | 詳細説明 | IECEE認定NCBでIEC 60947-2 Cat.Bに基づく型式試験を実施しCB証書を取得する |
| required_documents | TEXT | △ | 必要書類（セミコロン区切り） | 試験申込書; 製品図面; 回路図; 部品リスト |
| responsible_body | TEXT | △ | 実施主体 | IECEE認定NCB（例: JET, UL, TÜV） |
| estimated_duration_months | TEXT | △ | 所要期間目安（月） | 2-4 |
| estimated_cost_range | TEXT | △ | 概算費用 | USD 15,000-30,000 |
| cb_certificate_applicable | BOOLEAN | △ | CB証書保有時にスキップ可能か | FALSE |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | SIRIM QAS; Energy Commission |
| notes | TEXT | | | ACBはIcw試験が追加のため試験期間が長い |
 
#### ファイル12: T3_cb_scheme.csv
 
用途: 機種別のIECEE CB Scheme対応状況。1行＝1国×1機種。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | MCCB |
| product_type_order | INTEGER | ○ | 表示順 | 2 |
| cb_scheme_category | TEXT | ○ | CB Schemeの製品カテゴリ | INST |
| cb_scheme_standard | TEXT | ○ | CB Schemeで使用するIEC規格 | IEC 60947-2 |
| accepted_in_country | BOOLEAN | ○ | 当該国でCB証書が受理されるか | TRUE |
| national_differences_exist | BOOLEAN | ○ | 国家差異（ND）の有無 | TRUE |
| national_differences_detail | TEXT | △ | NDの具体的内容 | 追加の絶縁耐電圧試験要求 |
| time_saving_months | TEXT | △ | CB証書保有時の期間短縮目安（月） | 3-5 |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | IECEE; SIRIM QAS |
| notes | TEXT | | | |
 
#### ファイル13: T3_asean_mra.csv
 
用途: ASEAN EE MRAの活用状況。1行＝1機関。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| body_name | TEXT | ○ | 試験機関/認証機関名 | SIRIM QAS International |
| body_type | TEXT | ○ | 種別（Testing_Lab/Certification_Body） | Certification_Body |
| listed_for_countries | TEXT | ○ | MRA認定対象国（カンマ区切り） | MY,TH,PH,VN |
| product_scope | TEXT | △ | 対象製品範囲 | Low voltage switchgear (IEC 60947 series) |
| designating_body | TEXT | △ | 指定機関 | DSM Malaysia |
| country_code | TEXT | ○ | 当該機関が所在する国 | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | asean.org MRA listing |
| notes | TEXT | | | |
 
#### ファイル14: T3_cert_bodies.csv
 
用途: 認証関連機関の連絡先。1行＝1機関。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| body_name | TEXT | ○ | 機関名 | SIRIM QAS International |
| body_type | TEXT | ○ | 種別（Testing/Certification/Regulatory/NCB） | Certification |
| role_description | TEXT | ○ | 役割 | 製品試験および認証の実施。SIRIM認証マーク発行 |
| applicable_product_types | TEXT | ○ | 対象機種（カンマ区切り） | ACB,MCCB,ELCB,MCB,RCBO,RCCB |
| address | TEXT | △ | 所在地 | Shah Alam, Selangor, Malaysia |
| phone | TEXT | △ | 電話番号 | +603-5544-6400 |
| email | TEXT | △ | メールアドレス | |
| website | TEXT | ○ | Webサイト | https://www.sirim-qas.com.my |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | sirim-qas.com.my |
| notes | TEXT | | | |
 
#### ファイル15: T3_tariff.csv
 
用途: 機種別の関税・通関情報。1行＝1国×1機種。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | MCCB |
| product_type_order | INTEGER | ○ | 表示順 | 2 |
| hs_code | TEXT | ○ | HSコード | 8536.20 |
| hs_code_detail | TEXT | △ | 細分類 | 8536.20.29 |
| mfn_duty_pct | FLOAT | △ | MFN関税率（%） | 5.0 |
| atiga_duty_pct | FLOAT | △ | ATIGA優遇税率（%） | 0.0 |
| other_fta_duty | TEXT | △ | その他FTA税率 | RCEP: 0%; AJCEP: 0% |
| vat_gst_pct | FLOAT | △ | 付加価値税/GST（%） | 8.0 |
| origin_cert_required | BOOLEAN | △ | 原産地証明が必要か | TRUE |
| required_documents | TEXT | △ | 通関必要書類（セミコロン区切り） | CoA; テストレポート; ST-SIRIMラベル証明; Invoice; Packing List |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Malaysia Customs; ATIGA Schedule |
| notes | TEXT | | | |
 
#### ファイル16: T3_own_cert_status.csv
 
用途: 自社製品の機種別×国別の認証取得ステータス。T3最重要管理テーブル。1行＝1国×1機種×1製品シリーズ。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| product_type | TEXT | ○ | 機種コード | ACB |
| product_type_order | INTEGER | ○ | 表示順 | 1 |
| product_series | TEXT | ○ | 自社製品シリーズ名 | （社内名を記入） |
| model_range | TEXT | ○ | 型番範囲 | （型番を記入） |
| rated_current_range | TEXT | ○ | 定格電流範囲 | 630A-4000A |
| rated_voltage | TEXT | ○ | 定格電圧 | 690VAC |
| iec_standard | TEXT | ○ | 対応IEC規格 | IEC 60947-2 |
| utilization_category | TEXT | ○ | 利用カテゴリ（Cat_A/Cat_B/N/A） | Cat_B |
| national_standard | TEXT | ○ | 当該国の国家規格 | MS IEC 60947-2 |
| cb_cert_status | TEXT | ○ | CB証書ステータス（obtained/in_progress/not_started/expired） | obtained |
| cb_cert_number | TEXT | △ | CB証書番号 | |
| cb_cert_expiry | TEXT | △ | CB証書有効期限（yyyy-mm-dd） | 2028-03-15 |
| national_cert_status | TEXT | ○ | 国内認証ステータス（同上4値） | in_progress |
| national_cert_number | TEXT | △ | 国内認証番号 | |
| national_cert_expiry | TEXT | △ | 国内認証有効期限 | |
| coa_status | TEXT | ○ | CoA/販売許可ステータス（同上4値） | not_started |
| coa_number | TEXT | △ | CoA番号 | |
| coa_expiry | TEXT | △ | CoA有効期限 | |
| overall_status | TEXT | ○ | 総合ステータス（sellable/in_progress/not_started/expiring_soon/expired） | in_progress |
| priority | TEXT | △ | 優先度（High/Medium/Low） | High |
| next_action | TEXT | △ | 次に取るべきアクション | SIRIM QASへ試験申請書を提出 |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | 社内認証管理台帳 |
| notes | TEXT | | | |
 
---
 
### T4 — Competitive Landscape（4ファイル）
 
#### T4 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| グローバル競合プロファイル | 企業概要・シェア・強み弱み | テーブル | T4_competitors.csv |
| ASEAN拠点詳細 | 工場/営業所/R&D等の一覧 | テーブル | T4_competitor_facilities.csv |
| 機種別製品ライン比較 | 各社×各機種の主力シリーズ・定格・特徴 | 比較テーブル | T4_competitor_products.csv |
| 競合レーダーチャート | 価格/製品幅/現地生産/チャネル/認証/IoT | レーダーチャート | T4_competitors.csvから生成（将来的にスコア列追加） |
| ローカルプレイヤー | パネルビルダー・代理店・商社一覧 | テーブル | T4_local_players.csv |
| チャネル構造 | メーカー→代理店→PB→エンドユーザー | フローチャート＋ドーナツ | T4_local_players.csvから集計 |
| 競合動向メモ | 新製品・工場拡張・M&A等のニュース | テキストリスト | T4_competitors.csvのnotes列、または別途蓄積 |
 
#### ファイル17: T4_competitors.csv
 
用途: グローバル競合メーカーのプロファイル。1行＝1国×1企業。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| company_name | TEXT | ○ | 企業名 | Schneider Electric |
| headquarters | TEXT | ○ | 本社所在地 | Rueil-Malmaison, France |
| global_revenue_usd_billion | FLOAT | △ | グローバル売上（十億ドル） | 36.4 |
| global_lvcb_share_pct | FLOAT | △ | グローバルLV-CBシェア推定（%） | 12.0 |
| main_product_types | TEXT | ○ | 主力機種（カンマ区切り） | ACB,MCCB,ELCB,MCB,RCBO,RCCB |
| key_series_acb | TEXT | △ | ACB主力シリーズ名 | MasterPact MTZ |
| key_series_mccb | TEXT | △ | MCCB主力シリーズ名 | Compact NSX |
| key_series_elcb | TEXT | △ | ELCB主力シリーズ名 | |
| key_series_mcb | TEXT | △ | MCB主力シリーズ名 | Acti9 iC60 |
| key_series_rcbo | TEXT | △ | RCBO主力シリーズ名 | Acti9 iDPN Vigi |
| key_series_rccb | TEXT | △ | RCCB主力シリーズ名 | Acti9 iID |
| strengths | TEXT | △ | 強み | 圧倒的なチャネル網。IoT対応（EcoStruxure） |
| weaknesses | TEXT | △ | 弱み | 価格が高い |
| asean_strategy_summary | TEXT | △ | ASEAN戦略概要 | インドネシアCikarangにETO工場。域内チャネル網が最も厚い |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | Annual Report; Semiconductor Insight |
| notes | TEXT | | | |
 
#### ファイル18: T4_competitor_facilities.csv
 
用途: 競合のASEAN域内拠点詳細。1行＝1企業×1拠点。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| company_name | TEXT | ○ | 企業名 | Terasaki Electric |
| facility_type | TEXT | ○ | 拠点タイプ（Factory/Sales_Office/R_and_D/Agent/Distributor） | Factory |
| facility_country | TEXT | ○ | 拠点所在国コード | MY |
| facility_city | TEXT | ○ | 所在都市 | Shah Alam, Selangor |
| products_manufactured | TEXT | △ | 製造品目（工場の場合） | MCCB,MCB,ELCB |
| employee_count | TEXT | △ | 従業員数概算 | 200-500 |
| established_year | INTEGER | △ | 設立年 | 1985 |
| certification_held | TEXT | △ | 取得認証（セミコロン区切り） | SIRIM; ISO 9001 |
| country_code | TEXT | ○ | 対象国（facility_countryと同一） | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | terasaki.com.my; TEEAM directory |
| notes | TEXT | | | LV-CB専業メーカーとしてASEAN唯一の現地工場 |
 
#### ファイル19: T4_competitor_products.csv
 
用途: 競合の機種別製品ライン比較。1行＝1国×1企業×1機種。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| company_name | TEXT | ○ | 企業名 | ABB |
| product_type | TEXT | ○ | 機種コード | ACB |
| product_type_order | INTEGER | ○ | 表示順 | 1 |
| series_name | TEXT | ○ | シリーズ名 | Emax 2 |
| rated_current_range | TEXT | △ | 定格電流範囲 | 630A-6300A |
| rated_voltage_max | TEXT | △ | 最大定格電圧 | 690VAC |
| breaking_capacity_max | TEXT | △ | 最大遮断容量 | 150kA (415V) |
| iec_standard | TEXT | △ | 対応IEC規格 | IEC 60947-2 |
| features | TEXT | △ | 主な特徴 | Ekip Trip Unit; IoT対応; Ekip Power Controller |
| price_positioning | TEXT | △ | 価格帯（Premium/Mid/Economy） | Premium |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | new.abb.com |
| notes | TEXT | | | |
 
#### ファイル20: T4_local_players.csv
 
用途: パネルビルダー・代理店・商社等の一覧。1行＝1企業。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| company_name | TEXT | ○ | 企業名 | TAMCO Switchgear Sdn Bhd |
| player_type | TEXT | ○ | 種別（Panel_Builder/Distributor/Trading_Company/System_Integrator） | Panel_Builder |
| city | TEXT | △ | 所在都市 | Klang, Selangor |
| handled_brands | TEXT | △ | 取扱メーカー（カンマ区切り） | Schneider,ABB,Siemens |
| specialization | TEXT | △ | 得意分野 | MV/LV switchgear for industrial |
| scale | TEXT | △ | 規模感（Large/Medium/Small） | Large |
| website | TEXT | △ | Webサイト | https://www.tamco.com.my |
| is_potential_partner | BOOLEAN | △ | 自社パートナー候補か | TRUE |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | tamco.com.my; TEEAM |
| notes | TEXT | | | |
 
---
 
### T5 — Our Position（3ファイル）
 
#### T5 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| 売上KPI | 直近年度売上、前年比、シェア推定 | KPIカード | T5_own_sales.csv |
| 売上推移 | 年度別売上の過去推移 | 棒グラフ＋折れ線 | T5_own_sales.csv |
| 機種別売上構成 | ACB/MCCB/ELCB/MCB/RCBO/RCCB | ドーナツ | T5_own_sales.csv（product_typeでフィルタ） |
| チャネル別売上構成 | 代理店/PB/直販/OEM | ドーナツ | T5_own_sales.csv（channelでフィルタ） |
| 主要顧客リスト | 顧客名、業種、取引額、年数 | テーブル | T5_own_customers.csv |
| 課題・気づきメモ | 定性情報の蓄積 | テキストリスト | T5_own_memo.csv |
 
#### ファイル21: T5_own_sales.csv
 
用途: 自社売上推移。1行＝1国×1会計年度×1機種×1チャネルの組み合わせ。全体合計はproduct_type=ALL, channel=ALLで記録する。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| fiscal_year | INTEGER | ○ | 会計年度 | 2024 |
| sales_usd_thousand | FLOAT | △ | 売上（千ドル） | 350.0 |
| sales_local_thousand | FLOAT | △ | 売上（現地通貨、千単位） | 1557.5 |
| local_currency | TEXT | △ | 現地通貨コード | MYR |
| sales_quantity_units | INTEGER | △ | 販売数量（台） | 4500 |
| yoy_growth_pct | FLOAT | △ | 前年比成長率（%） | 8.5 |
| estimated_market_share_pct | FLOAT | △ | 推定市場シェア（%） | 0.5 |
| product_type | TEXT | ○ | 機種コード（全体合計はALL） | ALL |
| product_type_order | INTEGER | ○ | 表示順（ALLは0） | 0 |
| channel | TEXT | ○ | チャネル（Distributor/Panel_Builder/Direct/OEM/ALL） | ALL |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | 社内販売管理システム |
| notes | TEXT | | | |
 
#### ファイル22: T5_own_customers.csv
 
用途: 主要顧客リスト。1行＝1顧客。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| customer_name | TEXT | ○ | 顧客名 | （顧客企業名） |
| customer_type | TEXT | ○ | 種別（Panel_Builder/Distributor/End_User/OEM） | Panel_Builder |
| sector | TEXT | △ | 業種 | Switchgear Manufacturing |
| city | TEXT | △ | 所在地 | Kuala Lumpur |
| annual_sales_usd_thousand | FLOAT | △ | 年間取引額概算（千ドル） | 50.0 |
| primary_product_types | TEXT | △ | 主な取引機種（カンマ区切り） | MCCB,MCB |
| relationship_years | INTEGER | △ | 取引年数 | 5 |
| growth_potential | TEXT | △ | 成長余地（High/Medium/Low） | Medium |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | ○ | | 社内CRM |
| notes | TEXT | | | |
 
#### ファイル23: T5_own_memo.csv
 
用途: 定性的な気づき・課題メモの時系列蓄積。1行＝1メモ。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| date | TEXT | ○ | 記録日（yyyy-mm-dd） | 2025-04-15 |
| category | TEXT | ○ | カテゴリ（Strength/Weakness/Opportunity/Threat/Issue/Action） | Weakness |
| content | TEXT | ○ | 内容 | ACBの認証が未取得のため大型案件に参加できていない |
| priority | TEXT | △ | 優先度（High/Medium/Low） | High |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | | | |
| notes | TEXT | | | |
 
---
 
### T6 — Strategic Assessment（1ファイル）
 
#### T6 セクション構成
 
| セクション | 内容 | 表示形式 | 使用CSV |
|---|---|---|---|
| セグメント別機会スコア | 市場規模/成長率/参入障壁/競争/自社適合度 → 総合スコア | テーブル＋バブルチャート | T6_opportunity_scores.csv |
| SWOT | 自由記述 | 4象限パネル | T5_own_memo.csv（categoryでフィルタ） |
| アクションプラン | フェーズ×施策×担当×KPI | タイムラインテーブル | T6_opportunity_scores.csv |
| 投資・リソース見積 | 各施策のコスト・人員・期間 | テーブル | T6_opportunity_scores.csv |
| 年次振り返りメモ | 前年計画vs実績 | テキストパネル | T5_own_memo.csv |
 
#### ファイル24: T6_opportunity_scores.csv
 
用途: セグメント別の機会スコアリング。1行＝1セグメント。
 
| カラム名 | データ型 | 必須 | 説明 | 入力例 |
|---|---|---|---|---|
| segment_name | TEXT | ○ | セグメント名 | Data Center - ACB/MCCB |
| target_product_types | TEXT | ○ | 対象機種（カンマ区切り） | ACB,MCCB |
| market_size_score | INTEGER | ○ | 市場規模スコア（1-10） | 8 |
| growth_rate_score | INTEGER | ○ | 成長率スコア（1-10） | 9 |
| entry_barrier_score | INTEGER | ○ | 参入障壁スコア（1-10。高い=参入しやすい） | 5 |
| competition_score | INTEGER | ○ | 競争強度スコア（1-10。高い=競争が緩い） | 4 |
| our_fit_score | INTEGER | ○ | 自社適合度スコア（1-10） | 7 |
| total_score | FLOAT | ○ | 総合スコア（加重平均） | 6.6 |
| phase | TEXT | △ | 実行フェーズ（Short_0-6M/Mid_6-12M/Long_1-3Y） | Short_0-6M |
| action_plan | TEXT | △ | 具体的施策 | Johor DCプロジェクト向けにパネルビルダー3社への提案活動開始 |
| kpi | TEXT | △ | 成果指標 | 案件引合い3件獲得 |
| responsible | TEXT | △ | 担当者/部門 | 海外営業部 |
| country_code | TEXT | ○ | | MY |
| year | INTEGER | ○ | | 2025 |
| updated_date | TEXT | ○ | | 2025-04-15 |
| source | TEXT | | | 社内戦略会議 |
| notes | TEXT | | | スコア加重: 市場規模25%, 成長率25%, 参入障壁20%, 競争15%, 自社適合15% |
 
---
 
## 8. ディレクトリ構成
 
project_root/ ├── app.py # Streamlitメインアプリ ├── pages/ # マルチページ構成 │ ├── 1_T1_Country_Profile.py │ ├── 2_T2_Market_Demand.py │ ├── 3_T3_Regulatory_Gateway.py │ ├── 4_T4_Competitive_Landscape.py │ ├── 5_T5_Our_Position.py │ └── 6_T6_Strategic_Assessment.py ├── utils/ # 共通ユーティリティ │ ├── data_loader.py # CSV読み込み関数群 │ ├── chart_helpers.py # グラフ描画関数群 │ └── constants.py # 定数定義 ├── data/ │ ├── 2025/ # 年度別データ │ │ ├── T1_economy.csv │ │ ├── T1_gdp_composition.csv │ │ ├── T1_economic_news.csv │ │ ├── T2_cb_market.csv │ │ ├── T2_cb_product_mix.csv │ │ ├── T2_cb_application_mix.csv │ │ ├── T2_demand_drivers.csv │ │ ├── T2_mega_projects.csv │ │ ├── T3_power_specs.csv │ │ ├── T3_standards_matrix.csv │ │ ├── T3_cert_flow.csv │ │ ├── T3_cb_scheme.csv │ │ ├── T3_asean_mra.csv │ │ ├── T3_cert_bodies.csv │ │ ├── T3_tariff.csv │ │ ├── T3_own_cert_status.csv │ │ ├── T4_competitors.csv │ │ ├── T4_competitor_facilities.csv │ │ ├── T4_competitor_products.csv │ │ ├── T4_local_players.csv │ │ ├── T5_own_sales.csv │ │ ├── T5_own_customers.csv │ │ ├── T5_own_memo.csv │ │ └── T6_opportunity_scores.csv │ ├── 2026/ # 翌年は2025をコピーして差分更新 │ └── templates/ # 空テンプレート（新国追加用） │ ├── T1_economy_template.csv │ └── ...（全24ファイル分） ├── changelog.md # 変更履歴 ├── UPDATE_GUIDE.md # 年次更新手順書 ├── requirements.txt # Python依存パッケージ └── README.md # プロジェクト概要
 
 
---
 
## 9. constants.py 定義内容
 
```python
"""
ASEAN LV Circuit Breaker Market Intelligence Dashboard
定数定義ファイル
"""
 
# 機種コードと表示順
PRODUCT_TYPES = [
    {"code": "ACB",  "order": 1, "name": "Air Circuit Breaker",                                      "iec_primary": "IEC 60947-2",              "category": "Cat_B"},
    {"code": "MCCB", "order": 2, "name": "Moulded Case Circuit Breaker",                             "iec_primary": "IEC 60947-2",              "category": "Cat_A"},
    {"code": "ELCB", "order": 3, "name": "Earth Leakage Circuit Breaker",                            "iec_primary": "IEC 61008-1 / IEC 61009-1","category": "N/A"},
    {"code": "MCB",  "order": 4, "name": "Miniature Circuit Breaker",                                "iec_primary": "IEC 60898-1",              "category": "N/A"},
    {"code": "RCBO", "order": 5, "name": "Residual Current Breaker with Overcurrent Protection",     "iec_primary": "IEC 61009-1",              "category": "N/A"},
    {"code": "RCCB", "order": 6, "name": "Residual Current Circuit Breaker",                         "iec_primary": "IEC 61008-1",              "category": "N/A"},
]
 
PRODUCT_TYPE_ORDER = {pt["code"]: pt["order"] for pt in PRODUCT_TYPES}
PRODUCT_TYPE_NAMES = {pt["code"]: pt["name"] for pt in PRODUCT_TYPES}
 
# 対象国
COUNTRIES = [
    {"code": "MY", "name": "Malaysia",    "currency": "MYR", "phase": 1},
    {"code": "TH", "name": "Thailand",    "currency": "THB", "phase": 1},
    {"code": "VN", "name": "Vietnam",     "currency": "VND", "phase": 1},
    {"code": "ID", "name": "Indonesia",   "currency": "IDR", "phase": 1},
    {"code": "PH", "name": "Philippines", "currency": "PHP", "phase": 1},
    {"code": "SG", "name": "Singapore",   "currency": "SGD", "phase": 1},
]
 
COUNTRY_NAMES = {c["code"]: c["name"] for c in COUNTRIES}
COUNTRY_CURRENCIES = {c["code"]: c["currency"] for c in COUNTRIES}
 
# 認証ステータス値
CERT_STATUS_VALUES = ["obtained", "in_progress", "not_started", "expired"]
OVERALL_STATUS_VALUES = ["sellable", "in_progress", "not_started", "expiring_soon", "expired"]
 
# ステータス表示色
STATUS_COLORS = {
    "sellable":       "#28a745",  # 緑
    "obtained":       "#28a745",
    "in_progress":    "#ffc107",  # 黄
    "not_started":    "#6c757d",  # グレー
    "expiring_soon":  "#fd7e14",  # オレンジ
    "expired":        "#dc3545",  # 赤
}
 
# ステータス表示ラベル（日本語）
STATUS_LABELS_JA = {
    "sellable":       "販売可",
    "obtained":       "取得済",
    "in_progress":    "進行中",
    "not_started":    "未着手",
    "expiring_soon":  "期限間近",
    "expired":        "期限切れ",
}
 
# CSVファイル一覧（タブ別）
CSV_FILES = {
    "T1": [
        "T1_economy.csv",
        "T1_gdp_composition.csv",
        "T1_economic_news.csv",
    ],
    "T2": [
        "T2_cb_market.csv",
        "T2_cb_product_mix.csv",
        "T2_cb_application_mix.csv",
        "T2_demand_drivers.csv",
        "T2_mega_projects.csv",
    ],
    "T3": [
        "T3_power_specs.csv",
        "T3_standards_matrix.csv",
        "T3_cert_flow.csv",
        "T3_cb_scheme.csv",
        "T3_asean_mra.csv",
        "T3_cert_bodies.csv",
        "T3_tariff.csv",
        "T3_own_cert_status.csv",
    ],
    "T4": [
        "T4_competitors.csv",
        "T4_competitor_facilities.csv",
        "T4_competitor_products.csv",
        "T4_local_players.csv",
    ],
    "T5": [
        "T5_own_sales.csv",
        "T5_own_customers.csv",
        "T5_own_memo.csv",
    ],
    "T6": [
        "T6_opportunity_scores.csv",
    ],
}
 
# 共通カラム（全CSVの末尾に配置）
COMMON_COLUMNS = ["country_code", "year", "updated_date", "source", "notes"]
10. 年次更新手順
毎年アップデートすることを前提とした運用設計。
 
10-1. 更新作業フロー
ステップ             作業内容             所要時間目安
1            前年ディレクトリをコピー: cp -r data/2025 data/2026          5分
2            T1 経済データ更新（世界銀行、IMF、各国統計局）           2時間
3            T2 市場データ更新（調査レポート、業界団体資料）           3時間
4            T3 規格・認証更新（IEC規格改訂、認証ステータス変更）              2時間
5            T4 競合情報更新（新工場、新製品、M&A）          3時間
6            T5 自社実績更新（社内データ反映）         1時間
7            T6 戦略評価更新（前年振り返り＋新年度スコア再評価）    2時間
8            changelog.md更新           15分
9            動作確認・デプロイ         30分
合計: 約14時間 ≒ 2営業日/国
 
10-2. 更新を容易にする仕組み
全CSVにsource列を設け、翌年「どこからデータを取ったか」を辿れるようにする
updated_date列で古いデータを一目で発見できる
data/templates/に空テンプレートを置き、新国追加時はコピーしてcountry_codeを書き換えるだけ
Streamlitアプリ側はCSV読み込みパスをdata/{year}/で動的に切り替える
年度セレクターをサイドバーに設け、過去データとの比較も可能にする
グラフ描画関数は共通化し、CSVのカラム構造が同じなら国・年度を問わず同じコードで描画する
changelog.mdに全変更を記録する
10-3. T3認証ステータスの更新チェックリスト
#            確認項目             頻度
1            IEC規格の改訂有無（webstore.iec.ch）     年1回
2            国家規格の改訂有無（各国規格機関サイト）           年1回
3            自社製品の認証取得/更新/失効の反映        年1回+随時
4            関税率の変更（ATIGA/FTA）      年1回
5            新機種・新シリーズの行追加        随時
6            認証機関情報の更新（連絡先・URL変更、新MRA認定ラボ）        年1回
11. ファイル一覧サマリ
#            ファイル名          タブ       行の単位             機種別
01          T1_economy.csv T1         国×年度             ×
02          T1_gdp_composition.csv  T1         国×年度×セクター         ×
03          T1_economic_news.csv    T1         国×ニュース1件             ×
04          T2_cb_market.csv             T2         国×データ年      ×
05          T2_cb_product_mix.csv    T2         国×年度×機種  ○
06          T2_cb_application_mix.csv            T2         国×年度×用途  ×
07          T2_demand_drivers.csv    T2         国×年度×ドライバー     ×
08          T2_mega_projects.csv      T2         国×プロジェクト             ×
09          T3_power_specs.csv         T3         国×年度             ×
10          T3_standards_matrix.csv  T3         国×機種             ○
11          T3_cert_flow.csv T3         国×機種×ステップ         ○
12          T3_cb_scheme.csv            T3         国×機種             ○
13          T3_asean_mra.csv            T3         国×機関             ×
14          T3_cert_bodies.csv           T3         国×機関             ×
15          T3_tariff.csv        T3         国×機種             ○
16          T3_own_cert_status.csv    T3         国×機種×シリーズ         ○
17          T4_competitors.csv          T4         国×企業             ×
18          T4_competitor_facilities.csv           T4         国×企業×拠点  ×
19          T4_competitor_products.csv          T4         国×企業×機種  ○
20          T4_local_players.csv         T4         国×企業             ×
21          T5_own_sales.csv             T5         国×年度×機種×チャネル            ○
22          T5_own_customers.csv     T5         国×顧客             ×
23          T5_own_memo.csv           T5         国×メモ1件      ×
24          T6_opportunity_scores.csv             T6         国×セグメント   ○
合計: 24ファイル/国/年度。機種別カラム（product_type, product_type_order）を持つファイル: 10ファイル。
 
12. 実装指示
上記の設計仕様に基づき、以下の順で実装すること:
 
data/templates/ に全24ファイルの空テンプレート（ヘッダ行のみ）を生成する
data/2025/ に全24ファイルをダミーデータ入りで生成する（マレーシア1国分）
utils/constants.py を上記定義通りに作成する
utils/data_loader.py を作成する（年度・国コードを引数にCSVを読み込む汎用関数）
utils/chart_helpers.py を作成する（KPIカード、ドーナツ、折れ線、棒グラフ、ヒートマップ、レーダーチャートの共通描画関数）
app.py をサイドバー（国選択・年度選択・通貨切替・エクスポート）付きで作成する
pages/ 配下に各タブのページを作成し、対応するCSVを読み込んで表示する
requirements.txt を生成する（streamlit, plotly, altair, folium, pandas等）
README.md と UPDATE_GUIDE.md を生成する
