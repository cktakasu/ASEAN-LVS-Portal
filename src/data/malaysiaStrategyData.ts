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
    rationale: "公開調査ページは2025〜2031年CAGR 6.8%を示す一方、絶対市場規模と低圧範囲は公開情報だけでは未検証。スコアは暫定値。",
    dataSource: {
      tabRef: "T2",
      dataKey: "CB_MARKET_CHART_DATA",
      excerpt: "6Wresearch公開要約: CAGR 6.8%（2025–2031）。USD 150M→223Mは有料本文未確認の内部仮定。",
    },
  },
  {
    axis: "規制参入障壁",
    axisEn: "Regulatory",
    score: 3.5,
    rationale: "MCB/RCCB/RCBOの規制対象とCoA要件は一次情報で確認。製品別CB報告書の受入範囲と総リードタイムは個別確認が必要。",
    dataSource: {
      tabRef: "T3",
      dataKey: "MY_PRODUCT_CERT_REQUIREMENTS / MY_CB_SCHEME",
      excerpt: "ST 2024 Guidelines/FAQ: MCB・RCCB・RCBOのregulated scopeを確認。ACB/MCCBとCB受入区分は要追加確認。",
    },
  },
  {
    axis: "関税・物流",
    axisEn: "Trade Access",
    score: 4.0,
    rationale: "ATIGA協定で関税0%。ポートクラン・クアラルンプール港の物流インフラが良好。",
    dataSource: {
      tabRef: "T4",
      dataKey: "MY_TARIFF_DATA",
      excerpt: "全CB製品のATIGA税率0%、JMEPA 0%。出典: JKDM PDK 2025",
    },
  },
  {
    axis: "競争環境",
    axisEn: "Competition",
    score: 3.0,
    rationale: "ABB・Schneider・Siemensが既存シェアを保有。Fuji Electric・Terasaki等の日系も存在。価格競争もある。",
    dataSource: {
      tabRef: "推定",
      dataKey: "MY_COMPETITORS / MY_MARKET_BARRIERS",
      excerpt: "Multinational 3社 + 日系2社 + 中国系2社が競合。正確なシェアデータは推定値。",
    },
  },
  {
    axis: "戦略的重要性",
    axisEn: "Strategic Fit",
    score: 4.5,
    rationale: "データセンター・E&Eの大型承認投資とエネルギー移行政策を一次情報で確認。遮断器需要への換算は内部推定。",
    dataSource: {
      tabRef: "T2",
      dataKey: "CB_SECTOR_FOCUS",
      excerpt: "MIDA: DC/クラウド承認投資RM114.7bn（2021–2023）、E&E承認投資RM55.8bn（2024）。需要換算は要追加調査。",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  S2: SWOT 分析                                                       */
/* ------------------------------------------------------------------ */

export const MY_SWOT: SwotData = {
  strengths: [
    { text: "有効なIECEE CB報告書を活用できる可能性（受入範囲と短縮効果は製品別に要確認）" },
    { text: "ATIGA・RCEP協定により全製品で実質0%関税" },
    { text: "高品質・高信頼性の製品ブランドで差別化が可能" },
    { text: "英国系規格（BS/IEC）採用で自社規格との整合性が高い" },
  ],
  weaknesses: [
    { text: "現地販売網・代理店ネットワークがまだない" },
    { text: "CoA・試験・製品認証の総リードタイムと費用が未確定（計画レンジは内部仮定）" },
    { text: "マレーシア固有の国家差異（National Differences）への仕様対応コスト" },
    { text: "ローカル言語（マレー語）対応・現地サポート体制の未整備" },
  ],
  opportunities: [
    { text: "MIDA公表のDC・クラウド承認投資RM114.7bn（2021〜2023）を背景とする配電需要機会" },
    { text: "NETR（国家エネルギー移行ロードマップ）による再エネ投資の急拡大" },
    { text: "中国+1戦略による製造業FDI流入でMCCB需要が増加" },
    { text: "MIDA公表のE&E承認投資RM55.8bn（2024）を背景とする産業需要機会" },
  ],
  threats: [
    { text: "ABB・Schneider・Siemensによる既存チャネル支配とAVL優位性" },
    { text: "中国系ローカルメーカーの低価格製品による価格競争" },
    { text: "Fuji Electric・Terasaki等の日系メーカーの既存プレゼンスとブランド力" },
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
    cbAcceptance: "要確認",
    difficulty: "Low",
    demand: "High",
    demandNote: "住宅・商業ビル",
    priority: 1,
    rationale: "規制対象は確認済み。CB報告書の受入条件をST/SIRIMへ確認後、住宅・商業向け優先度を確定。",
  },
  {
    product: "RCCB",
    cbAcceptance: "要確認",
    difficulty: "Low",
    demand: "Medium",
    demandNote: "安全規制強化",
    priority: 1,
    rationale: "規制対象は確認済み。CB受入条件と同時申請の可否はST/SIRIMへ要確認。",
  },
  {
    product: "MCCB",
    cbAcceptance: "要確認",
    difficulty: "Medium",
    demand: "High",
    demandNote: "製造業・DC",
    priority: 2,
    rationale: "630A以下は0%関税。データセンター・製造業向けで高単価。第2段階で注力。",
  },
  {
    product: "RCBO",
    cbAcceptance: "要確認",
    difficulty: "Medium",
    demand: "Medium",
    demandNote: "住宅高級化",
    priority: 2,
    rationale: "MCB+RCCB機能統合品。高級住宅・オフィス向けで付加価値高い。",
  },
  {
    product: "ACB",
    cbAcceptance: "要確認",
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
/*  S6: アクション                                                      */
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
