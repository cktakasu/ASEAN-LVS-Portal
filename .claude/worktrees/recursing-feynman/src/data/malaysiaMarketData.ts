/* ------------------------------------------------------------------ */
/*  T2 Market & Demand — Malaysia LV CB Market Data                   */
/*  出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"    */
/* ------------------------------------------------------------------ */

import type {
  MarketDataPoint,
  ProductMixItem,
  ApplicationMixItem,
  DemandDriver,
  MegaProject,
} from "../types/market";

/* ------------------------------------------------------------------ */
/*  ① 市場規模データ（T2_cb_market）                                  */
/* ------------------------------------------------------------------ */

/**
 * マレーシア LV CB 市場規模（年次）
 * スコープ: LV CB only, excl. fuses, excl. MV/HV
 * CAGR: 約 6.0%（2025-2031）
 * 出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"
 */
export const CB_MARKET_DATA: MarketDataPoint[] = [
  {
    year: 2025,
    market_size_usd_million: 150,
    market_size_low_usd_million: 130,
    market_size_high_usd_million: 170,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025",
  },
  {
    year: 2026,
    market_size_usd_million: 159,
    market_size_low_usd_million: 138,
    market_size_high_usd_million: 180,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2027,
    market_size_usd_million: 169,
    market_size_low_usd_million: 146,
    market_size_high_usd_million: 193,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2028,
    market_size_usd_million: 179,
    market_size_low_usd_million: 155,
    market_size_high_usd_million: 205,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2029,
    market_size_usd_million: 190,
    market_size_low_usd_million: 165,
    market_size_high_usd_million: 218,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2030,
    market_size_usd_million: 202,
    market_size_low_usd_million: 175,
    market_size_high_usd_million: 231,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2031,
    market_size_usd_million: 213,
    market_size_low_usd_million: 185,
    market_size_high_usd_million: 244,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
];

/** 市場規模チャート用に band_width（high - low）を付加したデータ */
export const CB_MARKET_CHART_DATA = CB_MARKET_DATA.map((d) => ({
  ...d,
  band_width:
    d.market_size_high_usd_million != null &&
    d.market_size_low_usd_million != null
      ? d.market_size_high_usd_million - d.market_size_low_usd_million
      : undefined,
}));

/* ------------------------------------------------------------------ */
/*  ② 機種別構成比（T2_cb_product_mix）                               */
/* ------------------------------------------------------------------ */

/**
 * 2025年 機種別シェア
 * 出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"
 */
export const CB_PRODUCT_MIX: ProductMixItem[] = [
  { product_type: "MCCB", share_pct: 38 },
  { product_type: "MCB",  share_pct: 28 },
  { product_type: "ACB",  share_pct: 14 },
  { product_type: "RCCB", share_pct: 10 },
  { product_type: "RCBO", share_pct: 7  },
  { product_type: "ELCB", share_pct: 3  },
];

/* ------------------------------------------------------------------ */
/*  ③ 用途別構成比（T2_cb_application_mix）                            */
/* ------------------------------------------------------------------ */

/**
 * 2025年 用途別シェア
 * 出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"
 */
export const CB_APPLICATION_MIX: ApplicationMixItem[] = [
  { application: "製造業・工業",     share_pct: 32 },
  { application: "商業建築",         share_pct: 23 },
  { application: "住宅",             share_pct: 20 },
  { application: "インフラ・公益事業", share_pct: 12 },
  { application: "データセンター",   share_pct: 9  },
  { application: "その他",           share_pct: 4  },
];

/* ------------------------------------------------------------------ */
/*  ④ 需要ドライバー（T2_demand_drivers）                              */
/* ------------------------------------------------------------------ */

/**
 * 需要ドライバー（ヒートマップスコア付き）
 * スコア定義: 5=主要用途 / 4=標準使用 / 3=補助的 / 2=限定的 / 1=ほぼなし / 0=不適用
 * スコア根拠3層: IEC規格 > Schneider EIG / ABB Tech Paper > 6Wresearch
 */
export const CB_DEMAND_DRIVERS: DemandDriver[] = [
  {
    driver_name: "Data Center Boom",
    category: "ICT",
    description:
      "ジョホール州を中心に42件超のDC建設が進行。AWS・Microsoft・Googleが計約104億USDを投資予定。大電流幹線でACB・MCCBが主力、漏電保護は限定的。",
    impact: "High",
    time_horizon: "2025-2031",
    policy_reference: "Malaysia DC Investment Policy; MDEC",
    acb_relevance: 5,
    mccb_relevance: 5,
    elcb_relevance: 2,
    mcb_relevance: 3,
    rcbo_relevance: 2,
    rccb_relevance: 2,
    relevance_source: "IEC 60947-2; Schneider EIG Ch.A; 6Wresearch",
  },
  {
    driver_name: "13MP Infrastructure",
    category: "Infrastructure",
    description:
      "第13次マレーシア計画（2026-2030）の公共インフラ投資。道路・港湾・空港整備で配電盤需要増。幹線はACB/MCCB、末端はMCB/RCCB。",
    impact: "High",
    time_horizon: "2026-2030",
    policy_reference: "13MP; Budget 2025",
    acb_relevance: 4,
    mccb_relevance: 5,
    elcb_relevance: 3,
    mcb_relevance: 4,
    rcbo_relevance: 2,
    rccb_relevance: 3,
    relevance_source: "IEC 60364-7-712; Schneider EIG Ch.H; 6Wresearch",
  },
  {
    driver_name: "Semiconductor Expansion",
    category: "Manufacturing",
    description:
      "ペナン・クダ州の半導体ファブ拡張（Intel・Infineon等）。クリーンルーム電源でACB/MCCB需要大。ELCBは精密機器保護に一部使用。",
    impact: "High",
    time_horizon: "2025-2029",
    policy_reference: "New Investment Policy; MIDA",
    acb_relevance: 4,
    mccb_relevance: 5,
    elcb_relevance: 3,
    mcb_relevance: 4,
    rcbo_relevance: 2,
    rccb_relevance: 2,
    relevance_source: "IEC 60947-2; ABB Tech Paper No.7; 6Wresearch",
  },
  {
    driver_name: "Renewable Energy 35%",
    category: "Energy",
    description:
      "NETR 2.0目標：2035年に再エネ比率35%。太陽光DC-AC変換インバータ出口にMCCB/MCB使用。住宅用太陽光でRCBOも増加。",
    impact: "Medium",
    time_horizon: "2025-2035",
    policy_reference: "NETR 2.0; LSS5",
    acb_relevance: 2,
    mccb_relevance: 4,
    elcb_relevance: 2,
    mcb_relevance: 4,
    rcbo_relevance: 3,
    rccb_relevance: 2,
    relevance_source: "IEC 60364-7-712; Schneider EIG Ch.E; 6Wresearch",
  },
  {
    driver_name: "Residential Construction",
    category: "Residential",
    description:
      "都市部住宅着工件数増加（13MP住宅目標60万戸）。住宅盤にMCB・RCCB・RCBOがST義務。ACBは不適用。",
    impact: "Medium",
    time_horizon: "2025-2030",
    policy_reference: "13MP Housing; ST Regulation",
    acb_relevance: 1,
    mccb_relevance: 2,
    elcb_relevance: 4,
    mcb_relevance: 5,
    rcbo_relevance: 4,
    rccb_relevance: 5,
    relevance_source: "IEC 60898-1; IEC 61008; IEC 61009; MS IEC 60364",
  },
  {
    driver_name: "Penang Transport Infra",
    category: "Infrastructure",
    description:
      "ペナンLRT Mutiara Line（2026年着工予定）および周辺再開発。駅舎・車両基地の幹線・分電盤にACB/MCCB集中使用。",
    impact: "Medium",
    time_horizon: "2026-2031",
    policy_reference: "Penang LRT; 13MP",
    acb_relevance: 4,
    mccb_relevance: 5,
    elcb_relevance: 2,
    mcb_relevance: 4,
    rcbo_relevance: 2,
    rccb_relevance: 2,
    relevance_source: "IEC 60947-2; Schneider EIG Ch.B; 6Wresearch",
  },
];

/* ------------------------------------------------------------------ */
/*  ⑤ メガプロジェクト一覧（T2_mega_projects）                        */
/* ------------------------------------------------------------------ */

/**
 * マレーシア主要メガプロジェクト
 * LV CB 需要に直結する大型案件を収録
 */
export const CB_MEGA_PROJECTS: MegaProject[] = [
  {
    project_name: "Johor DC Cluster（42 プロジェクト）",
    sector: "ICT",
    location: "Johor",
    value_usd_million: 39080,
    status: "Ongoing",
    expected_completion: "2028",
    cb_types: "ACB, MCCB",
    notes: "ジョホール州に集中するDCキャンパス群。TNB専用変電所も新設予定。",
  },
  {
    project_name: "Microsoft Malaysia Cloud Region",
    sector: "ICT",
    location: "Selangor / Johor",
    value_usd_million: 2200,
    status: "Ongoing",
    expected_completion: "2026",
    cb_types: "ACB, MCCB, MCB",
    notes: "Azure リージョン設立。UPS幹線にACB、PDU分岐にMCCB/MCB。",
  },
  {
    project_name: "AWS Malaysia Cloud Region",
    sector: "ICT",
    location: "未開示",
    value_usd_million: 6200,
    status: "Planned",
    expected_completion: "2027",
    cb_types: "ACB, MCCB, MCB",
    notes: "2024年5月発表。首都圏または南部に建設予定。",
  },
  {
    project_name: "Google DC Investment",
    sector: "ICT",
    location: "未開示",
    value_usd_million: 2000,
    status: "Planned",
    expected_completion: "2027",
    cb_types: "ACB, MCCB",
    notes: "2024年発表。ジョホールまたはセランゴール有力。",
  },
  {
    project_name: "Penang LRT Mutiara Line",
    sector: "Infrastructure",
    location: "Penang",
    value_usd_million: 3700,
    status: "Ongoing",
    expected_completion: "2030",
    cb_types: "ACB, MCCB, MCB",
    notes: "ペナン島内の架空鉄道。変電所・駅舎配電盤に多用途CB使用。",
  },
  {
    project_name: "MRT3 Circle Line",
    sector: "Infrastructure",
    location: "KL / Selangor",
    value_usd_million: 10000,
    status: "Planned",
    expected_completion: "2031",
    cb_types: "ACB, MCCB, MCB, RCBO",
    notes: "クランバレー第3 MRT環状線。22駅を計画、入札準備中。",
  },
  {
    project_name: "Sungai Klang Link（スマートシティ）",
    sector: "Infrastructure",
    location: "Selangor",
    value_usd_million: 2000,
    status: "Planned",
    expected_completion: "2030",
    cb_types: "MCCB, MCB, RCCB",
    notes: "クランバレー新都市開発。住宅・商業・交通複合。",
  },
  {
    project_name: "Trans-Borneo Railway",
    sector: "Infrastructure",
    location: "Sabah / Sarawak",
    value_usd_million: undefined,
    status: "Planned",
    expected_completion: "2035+",
    cb_types: "ACB, MCCB",
    notes: "ボルネオ横断鉄道構想。詳細設計未完了。SESBとの調整必要。",
  },
  {
    project_name: "JB ART（軽量輸送）",
    sector: "Infrastructure",
    location: "Johor Bahru",
    value_usd_million: undefined,
    status: "Planned",
    expected_completion: "2028",
    cb_types: "MCCB, MCB",
    notes: "ジョホールバル市内ART（自律型軌道輸送）。JS-SEZ内連絡。",
  },
  {
    project_name: "Gamuda 585 MWp 太陽光発電",
    sector: "Energy",
    location: "未開示",
    value_usd_million: undefined,
    status: "Ongoing",
    expected_completion: "2026",
    cb_types: "MCCB, MCB, RCBO",
    notes: "LSS5入札採択案件。インバータ出口MCCBおよびSCADA配電にMCB。",
  },
];

/* ------------------------------------------------------------------ */
/*  出典情報                                                           */
/* ------------------------------------------------------------------ */

export const MARKET_DATA_SOURCES = {
  market_size: '6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"',
  product_mix: '6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"',
  application_mix: '6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"',
  demand_drivers:
    "IEC 60947-2 / 60898-1 / 61008 / 61009 / 60364-7-712; Schneider Electric EIG (electrical-installation.org); ABB Technical Application Papers; 6Wresearch",
  mega_projects:
    "MDEC / MIDA / EPU / Bernama / The Edge Markets / 各社プレスリリース（2024-2025）",
};
