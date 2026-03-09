/* ------------------------------------------------------------------ */
/*  Malaysia — Strategic Assessment Data                               */
/* ------------------------------------------------------------------ */

import type {
  ScoreAxis,
  SwotData,
  ProductPriority,
  RoadmapPhase,
  RiskItem,
  NextAction,
} from "../types/strategy";

/* ------------------------------------------------------------------ */
/*  S1: 総合評価スコアカード (5軸 / 5点満点)                            */
/* ------------------------------------------------------------------ */

export const MY_SCORE_AXES: ScoreAxis[] = [
  {
    axis: "市場規模・成長性",
    axisEn: "Market Size",
    score: 4.5,
    rationale: "CAGR 6.8%、2031年に約312億円規模。ASEAN域内第2位市場。",
  },
  {
    axis: "規制参入障壁",
    axisEn: "Regulatory",
    score: 3.5,
    rationale: "CB Scheme受入あり（MCB/RCCBはFull）。ST-SIRIM認証が必須で一定のリードタイムが必要。",
  },
  {
    axis: "関税・物流",
    axisEn: "Trade Access",
    score: 4.0,
    rationale: "ATIGA協定で関税0%。ポートクラン・クアラルンプール港の物流インフラが良好。",
  },
  {
    axis: "競争環境",
    axisEn: "Competition",
    score: 3.0,
    rationale: "ABB・Schneider・Siemensが既存シェアを保有。現地メーカーとの価格競争も存在。",
  },
  {
    axis: "戦略的重要性",
    axisEn: "Strategic Fit",
    score: 4.5,
    rationale: "ASEAN第2位市場かつデータセンター・半導体投資が急増。NETR再エネ政策による長期需要が期待。",
  },
];

/* ------------------------------------------------------------------ */
/*  S2: SWOT 分析                                                       */
/* ------------------------------------------------------------------ */

export const MY_SWOT: SwotData = {
  strengths: [
    { text: "CB Scheme活用で認証期間を最大30%短縮可能（MCB/RCCBはFull受入）" },
    { text: "ATIGA・RCEP協定により全製品で実質0%関税" },
    { text: "高品質・高信頼性の製品ブランドで差別化が可能" },
    { text: "英国系規格（BS/IEC）採用で自社規格との整合性が高い" },
  ],
  weaknesses: [
    { text: "現地販売網・代理店ネットワークがまだない" },
    { text: "ST-SIRIM認証取得に6〜12ヶ月のリードタイムが必要" },
    { text: "マレーシア固有の国家差異（National Differences）への仕様対応コスト" },
    { text: "ローカル言語（マレー語）対応・現地サポート体制の未整備" },
  ],
  opportunities: [
    { text: "データセンター建設ラッシュ：2031年までに市場規模2倍超が見込まれる" },
    { text: "NETR（国家エネルギー移行ロードマップ）による再エネ投資の急拡大" },
    { text: "中国+1戦略による製造業FDI流入でMCCB需要が増加" },
    { text: "半導体・E&E産業の継続拡大（CAGR 8.76%）" },
  ],
  threats: [
    { text: "ABB・Schneider・Siemensによる既存チャネル支配とAVL優位性" },
    { text: "中国系ローカルメーカーの低価格製品による価格競争" },
    { text: "MYR為替変動リスク（特に円高局面での競争力低下）" },
    { text: "政府調達におけるバミプトラ優遇政策による参入障壁" },
  ],
};

/* ------------------------------------------------------------------ */
/*  S3: 製品別参入優先度マトリクス                                       */
/* ------------------------------------------------------------------ */

export const MY_PRODUCT_PRIORITIES: ProductPriority[] = [
  {
    product: "MCB",
    cbAcceptance: "Full",
    difficulty: "Low",
    demand: "High",
    demandNote: "住宅・商業ビル",
    priority: 1,
    rationale: "CB即受入、最大ボリューム市場。早期認証取得で量販狙い。",
  },
  {
    product: "RCCB",
    cbAcceptance: "Full",
    difficulty: "Low",
    demand: "Medium",
    demandNote: "安全規制強化",
    priority: 1,
    rationale: "CB Full受入。安全基準強化トレンドで需要増。MCBと同時申請が効率的。",
  },
  {
    product: "MCCB",
    cbAcceptance: "Partial",
    difficulty: "Medium",
    demand: "High",
    demandNote: "製造業・DC",
    priority: 2,
    rationale: "630A以下は0%関税。データセンター・製造業向けで高単価。第2段階で注力。",
  },
  {
    product: "RCBO",
    cbAcceptance: "Partial",
    difficulty: "Medium",
    demand: "Medium",
    demandNote: "住宅高級化",
    priority: 2,
    rationale: "MCB+RCCB機能統合品。高級住宅・オフィス向けで付加価値高い。",
  },
  {
    product: "ACB",
    cbAcceptance: "Partial",
    difficulty: "High",
    demand: "Medium",
    demandNote: "大型施設",
    priority: 3,
    rationale: "大型プロジェクト限定。現地サポート体制確立後に参入。",
  },
];

/* ------------------------------------------------------------------ */
/*  S4: 推奨参入ロードマップ                                             */
/* ------------------------------------------------------------------ */

export const MY_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    label: "Phase 1",
    period: "0–6ヶ月",
    title: "市場準備",
    tasks: [
      { text: "ST-SIRIM認証申請開始（MCB・RCCB優先、CB Scheme活用）" },
      { text: "国内代理店候補のスクリーニング・交渉開始" },
      { text: "マレーシア固有仕様（National Differences）の製品対応確認" },
      { text: "競合製品・価格帯の詳細調査" },
    ],
  },
  {
    phase: 2,
    label: "Phase 2",
    period: "6–12ヶ月",
    title: "初期参入",
    tasks: [
      { text: "MCB・RCCBの認証取得・販売開始" },
      { text: "パネルビルダー・システムインテグレーターへの技術営業" },
      { text: "データセンター・半導体E&Eセクターへの重点アプローチ" },
      { text: "MCCB・RCBOの認証申請開始" },
    ],
  },
  {
    phase: 3,
    label: "Phase 3",
    period: "12–24ヶ月",
    title: "拡大展開",
    tasks: [
      { text: "MCCB・RCBOの認証取得・フルラインナップ展開" },
      { text: "主要ユーザー・EPCのAVL（Approved Vendor List）登録推進" },
      { text: "政府調達・公共インフラ案件への参画検討" },
      { text: "ACB参入可否の判断と現地サポート体制の整備" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  S5: リスクと対策                                                     */
/* ------------------------------------------------------------------ */

export const MY_RISKS: RiskItem[] = [
  {
    risk: "認証取得の遅延",
    impact: "High",
    mitigation: "CB Scheme活用で30%短縮。MCB/RCCBから優先申請し早期に実績構築。",
  },
  {
    risk: "既存競合の価格攻勢",
    impact: "High",
    mitigation: "品質・信頼性・アフターサポートで差別化。価格競争を避けるためDC・E&E高付加価値セクターに集中。",
  },
  {
    risk: "代理店の販売パフォーマンス不足",
    impact: "Medium",
    mitigation: "複数チャネル（全国代理店＋地域代理店）並行展開。定期的なKPIレビューと直販オプション維持。",
  },
  {
    risk: "為替変動（MYR安/円高）",
    impact: "Medium",
    mitigation: "ATIGA 0%関税でコスト余裕を確保。為替ヘッジと現地在庫調整で対応。",
  },
  {
    risk: "バミプトラ優遇による政府調達参入困難",
    impact: "Medium",
    mitigation: "当初は民間セクター（DC・製造業）に集中。現地パートナーとのJV検討で中長期対応。",
  },
];

/* ------------------------------------------------------------------ */
/*  S6: 次のアクション                                                   */
/* ------------------------------------------------------------------ */

export const MY_NEXT_ACTIONS: NextAction[] = [
  {
    text: "ST-SIRIM認証申請の準備を開始する（技術文書・試験レポートの整理）",
    owner: "技術・品質部門",
  },
  {
    text: "マレーシア代理店候補リストを作成し、3社以上にコンタクトする",
    owner: "営業・海外事業部門",
  },
  {
    text: "現地競合製品の価格・仕様調査を実施し、自社ポジショニングを確定する",
    owner: "マーケティング部門",
  },
  {
    text: "データセンター・半導体E&Eセクターのキーアカウントリストを作成する",
    owner: "営業部門",
  },
  {
    text: "製品ラインナップのマレーシア固有仕様（National Differences）への対応要否を確認する",
    owner: "技術部門",
  },
  {
    text: "NETR・FDI政策の最新動向をモニタリングする体制を整備する",
    owner: "海外事業部門",
  },
];
