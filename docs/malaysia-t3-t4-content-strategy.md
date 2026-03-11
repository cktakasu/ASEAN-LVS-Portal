# Malaysia T3/T4 追加コンテンツ戦略メモ

## 目的

T3 と T4 は単なる「制度説明」ではなく、マーケターが

- この国は本当に狙う価値があるか
- どの製品から入るべきか
- 誰を落とせば売上に変わるか
- 参入障壁に対して勝ち筋があるか

を短時間で判断できる構成にする必要がある。

現状の実装では、T3 は「製品別認証要件」1セクションのみ、T4 は「関税」「流通」「障壁と促進要因」中心で、制度の骨格は見える一方、Go/No-Go 判断に必要な営業実装情報が不足している。

参照:

- [src/MalaysiaPage.tsx](/Users/mogura/Documents/Codex/ASEAN-LVS-Portal/src/MalaysiaPage.tsx)
- [src/data/malaysiaRegulatoryData.ts](/Users/mogura/Documents/Codex/ASEAN-LVS-Portal/src/data/malaysiaRegulatoryData.ts)
- [src/data/malaysiaMarketAccessData.ts](/Users/mogura/Documents/Codex/ASEAN-LVS-Portal/src/data/malaysiaMarketAccessData.ts)

## まず不足している判断軸

マーケター視点では、次の問いに答えられないと「魅力がある国か」は判断しづらい。

- 売れるまでに何か月かかるのか
- 認証取得は単なる手続きか、実質的な参入障壁か
- 価格競争だけの市場なのか、仕様で勝てる市場なのか
- 代理店を取れば入れるのか、設計者・コンサル・AVL を押さえないと無理なのか
- どの製品群は勝ちやすく、どの製品群は消耗戦になるのか
- 大手競合が強い既存市場なのか、新興用途で空白地帯があるのか
- 参入後に必要なサービス体制はどこまで重いのか

## T3 の追加コンテンツ案

T3 の役割は「売ってよいか」ではなく「売れる状態を作る難易度」を示すこと。

### 1. Certification Route Map

製品別に「法的必須」「案件上の事実上必須」「なくても売れる」を明確に分ける。

- 列案: 製品、法的必須、入札必須度、民間案件必須度、主な適用セグメント、想定チャネル、初回取得コスト、初回取得期間、更新要否
- 意義: 認証の重さを、法制度ではなく商流インパクトで見せられる
- 特に有効: ACB/MCCB の「法的には任意だが、実務では必要」を可視化

### 2. Time-to-Revenue タイムライン

認証から売上化までの実務リードタイムを示す。

- 例: 書類準備 → 試験 → 工場監査 → CoA 発行 → 代理店採用 → コンサル面談 → Spec-in → 入札 → 初回受注
- セグメント別に分ける: 住宅、一般商業、工場、データセンター、公共
- 表示方法: ガントチャートまたはステップ別週数
- 意義: 「市場が魅力的でも売上化が遅い」国を見抜ける

### 3. Spec Lock Risk Map

規制そのものより、「誰がブランド固定を起こすか」を見せる。

- 対象: 政府、TNB、大手デベロッパー、M&E コンサル、パネルビルダー
- 列案: 指定主体、指定の強さ、指定理由、突破方法、必要実績、必要現地体制
- 意義: 認証だけ取っても売れない構造を説明できる

### 4. Standard Gap Heatmap

日本品やグローバル標準品が、そのまま入りやすいかを示す。

- 観点: 電圧、周波数、端子仕様、温度条件、盤内実装慣行、試験差分、表示言語、ラベリング
- 色分け: 差分小、差分中、差分大
- 意義: 製品改修コストと SKU 展開難度を早期に判断できる

### 5. Certification Document Checklist

必要書類を「営業開始に必要な最低限」と「大口案件で追加要求されるもの」に分ける。

- 例: CB Report、試験成績書、工場監査、回路図、部材表、英文カタログ、現地代理店情報、保証条件
- 意義: HQ 側の準備負荷が見える

### 6. Renewal / Maintenance Burden

一度取って終わりではない運用負荷を明示する。

- 更新周期
- 工場監査頻度
- モデル追加時の再審査要否
- ラベル変更時の手続き
- 代理店変更時の影響
- 意義: 長期運用コストまで含めて市場魅力度を判断できる

### 7. Certification Economics

認証投資に見合う市場規模があるかを示す。

- 指標案: 製品別想定認証費用、SKU 横展開効率、年間必要売上、回収年数
- 例: MCB は認証負荷が重いが市場が大きい、ACB は件数は少ないが案件単価が高い
- 意義: 「認証難易度」ではなく「認証 ROI」で判断できる

### 8. Regulatory Risk Watchlist

今後ルール変更で収益性が変わる可能性のある論点を並べる。

- 観点: 対象品目追加、SIRIM 運用変更、SST 変更、通関厳格化、省エネ規制、ローカル認証の厳格化
- 意義: 今は売れても中期で厳しくなる市場を見抜ける

## T4 の追加コンテンツ案

T4 の役割は「どう入るか」だけでなく「誰を押さえれば勝てるか」と「儲かる構造か」を見せること。

### 1. Entry Mode Decision Matrix

参入方式を比較して、最適な勝ち筋を絞り込めるようにする。

- 選択肢: 代理店型、パネルビルダー直販型、現地法人型、OEM 供給型、プロジェクト直販型
- 列案: 初期投資、立上げ速度、粗利、ブランド統制、必要人員、向く製品、向く顧客
- 意義: 「魅力のある国か」だけでなく「入るならどの型か」が見える

### 2. Channel Power Map

流通チャネルのシェアではなく、意思決定力を可視化する。

- 軸案: 販売量、ブランド選定力、価格決定力、案件早期関与度、代替提案力
- 対象: National Distributor、Panel Builder、M&E Consultant、Developer、EPC、Utility
- 意義: 真のボトルネックが代理店か設計者かを明確にできる

### 3. Buyer Journey / Influence Flow

案件で誰がいつ意思決定するかを図示する。

- フロー: Developer / Owner → M&E Consultant → Main Con / Electrical Subcon → Panel Builder → Distributor
- 各段階での論点: ブランド指定、価格、納期、承認、実績、アフターサービス
- 意義: マーケ施策を「誰向けに」「いつ打つか」に落とせる

### 4. Price Waterfall

現地で価格競争に勝てるかを把握する。

- 項目: Ex-works、物流、関税、SST、認証費按分、代理店マージン、PB マージン、想定販売価格
- セグメント別に表示: 住宅、商業、産業、インフラ
- 競合比較: 欧州系、中国系、日系
- 意義: 価格の勝ち負けを感覚でなく構造で見られる

### 5. White Space Map

既存大手が強すぎる領域と、入りやすい領域を分ける。

- 軸案: 市場魅力度 × 競争激烈度
- セグメント案: データセンター、半導体、一般工場、住宅、公共、再エネ、EV 充電、O&G
- 意義: 「この国は魅力があるか」ではなく「どの需要ポケットが魅力か」が見える

### 6. Target Account / Project Funnel

市場全体ではなく、実際に追うべき案件母集団を見せる。

- 項目: 重点業界、主要発注者、主要 EPC、主要 M&E Consultant、主要 Panel Builder
- できれば件数感も持たせる: 年間大型案件数、平均案件単価、必要納期レベル
- 意義: TAM の話から実行可能なアカウントベース戦略へ落とせる

### 7. Geographic Priority Map

国全体でなく州・都市単位で優先順位を出す。

- 例: Klang Valley、Johor、Penang、Sabah、Sarawak
- 観点: 産業集積、データセンター投資、建設案件、代理店密度、物流容易性、価格競争度
- 意義: 初期進出エリアを限定できる

### 8. Consultant / Spec-in Capture Playbook

設計指定を取るための実務論点を可視化する。

- 何を出せば採用されやすいか: 単線結線例、短絡容量資料、比較表、BIM/CAD、トレーニング、CPD セミナー
- 誰に効くか: M&E Consultant、Developer、Utility、Panel Builder
- 意義: マーケ施策をイベントや資料投入に落とし込める

### 9. Partner Scorecard

現地代理店や PB 候補を比較できるようにする。

- 指標案: カバー地域、在庫力、技術力、Spec-in 力、政府案件実績、産業案件実績、価格統制力、サービス体制、ブランド競合有無
- 意義: 「代理店が必要」から「どの代理店が正解か」へ進める

### 10. Tender / AVL Playability

案件を取れる市場かどうかを営業現場目線で判定する。

- 項目: 政府案件参入難度、Utility 参入難度、大手デベロッパー AVL 難度、必要納入実績、必要現地法人、必要 Bumi パートナー
- 表示方法: High / Medium / Low の難度マトリクス
- 意義: 口座開設可能性が見える

### 11. Service & Warranty Expectations

売った後に必要な体制まで含めて収益性を判断する。

- 現地で期待されるもの: 盤立会い、トラブル対応、交換在庫、保証年数、技術トレーニング、現場立会い
- 意義: 単なる輸出では成立しない場合を見抜ける

### 12. Win/Loss Factor Summary

最後に「この国で勝つ条件」を短くまとめる。

- 勝てる条件
- 負けやすい条件
- 最初に狙うべき製品
- 避けるべき製品
- 推奨参入チャネル

## マーケター向けに特に効く P1 コンテンツ

先に入れるべき優先度は次の通り。

### P1

- T3 Certification Route Map
- T3 Time-to-Revenue タイムライン
- T3 Certification Economics
- T4 Entry Mode Decision Matrix
- T4 Buyer Journey / Influence Flow
- T4 Price Waterfall
- T4 White Space Map
- T4 Tender / AVL Playability

### P2

- T3 Spec Lock Risk Map
- T3 Standard Gap Heatmap
- T3 Renewal / Maintenance Burden
- T4 Channel Power Map
- T4 Geographic Priority Map
- T4 Partner Scorecard
- T4 Service & Warranty Expectations

### P3

- T3 Regulatory Risk Watchlist
- T3 Document Checklist
- T4 Consultant / Spec-in Capture Playbook
- T4 Target Account / Project Funnel
- T4 Win/Loss Factor Summary

## 画面構成の推奨リデザイン

### T3: Regulatory Gateway

1. Executive Summary
2. Product × Certification Route Map
3. Time-to-Revenue Timeline
4. Certification ROI
5. Standard Gap Heatmap
6. Spec Lock Risk Map
7. Renewal / Maintenance Burden
8. Regulatory Risk Watchlist

T3 は「認証制度の説明」ではなく「参入準備難度ダッシュボード」として再定義した方がよい。

### T4: Market Access

1. Entry Mode Decision Matrix
2. Buyer Journey / Influence Flow
3. Channel Power Map
4. Price Waterfall
5. White Space Map
6. Tender / AVL Playability
7. Geographic Priority Map
8. Partner Scorecard
9. Service Expectations
10. Win/Loss Summary

T4 は「関税説明」よりも「商流攻略マップ」を中心にした方が、マーケターの意思決定に直結する。

## データモデル追加の方向性

もし実装するなら、現行の `regulatory.ts` と `marketAccess.ts` だけでは粒度が足りない。次の型を追加すると拡張しやすい。

### T3 追加型候補

- `CertificationRoute`
- `RevenueTimelineStep`
- `SpecLockOwner`
- `StandardGapItem`
- `CertificationCostModel`
- `RegulatoryWatchItem`
- `MaintenanceRequirement`

### T4 追加型候補

- `EntryModeOption`
- `ChannelPowerScore`
- `BuyerJourneyStep`
- `PriceWaterfallItem`
- `WhiteSpaceSegment`
- `GeographicPriority`
- `PartnerScorecard`
- `TenderAccessRequirement`
- `ServiceExpectation`

## コンテンツ作成の実務順

情報収集と実装は次の順が効率的。

1. T3 の Route Map と T4 の Entry Mode Matrix を作る
2. Buyer Journey と Tender / AVL を作る
3. Price Waterfall と Certification Economics を作る
4. White Space と Geographic Priority を作る
5. 最後に Partner Scorecard と Service Expectations を肉付けする

この順なら、まず「参入可否」と「参入方法」が判断でき、その後にチャネル選定や案件攻略へ深掘りできる。

## 一言でいうと

今の T3/T4 は「制度と流通の説明」としては十分近いが、「この国は本当に取りに行く価値があるか」を決めるにはまだ弱い。

不足しているのは制度知識ではなく、次の3点である。

- 売上化までの時間
- 商流における実権者
- 価格と認証を含めた収益性

この3点を中心に再設計すると、マーケターにとって判断可能な T3/T4 になる。
