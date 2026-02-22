/* ------------------------------------------------------------------ */
/*  T2 Market & Demand — Malaysia LV CB Market Data                   */
/*  出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"    */
/* ------------------------------------------------------------------ */

import type {
  MarketDataPoint,
  SectorFocus,
  RegionalProfile,
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
    year: 2020,
    market_size_usd_million: 110,
    market_size_low_usd_million: 95,
    market_size_high_usd_million: 125,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate; range reflects inter-source variance)",
  },
  {
    year: 2021,
    market_size_usd_million: 118,
    market_size_low_usd_million: 103,
    market_size_high_usd_million: 133,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate; range reflects inter-source variance)",
  },
  {
    year: 2022,
    market_size_usd_million: 128,
    market_size_low_usd_million: 112,
    market_size_high_usd_million: 144,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate; range reflects inter-source variance)",
  },
  {
    year: 2023,
    market_size_usd_million: 138,
    market_size_low_usd_million: 120,
    market_size_high_usd_million: 156,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate; range reflects inter-source variance)",
  },
  {
    year: 2024,
    market_size_usd_million: 144,
    market_size_low_usd_million: 126,
    market_size_high_usd_million: 162,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate; range reflects inter-source variance)",
  },
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
/*  ② 注目市場（T2_demand_drivers.csv）                              */
/* ------------------------------------------------------------------ */

/**
 * 注目市場セクター
 * LV遮断器の販売先として注目すべきセクター
 * 出典: Mordor Intelligence; Arizton; DOSM; MDEC; 6Wresearch
 */
export const CB_SECTOR_FOCUS: SectorFocus[] = [
  {
    sector_name: "データセンター",
    sector_overview: "ASEAN建設中DC容量の60%超がマレーシアに集中。143件承認済み、総投資額RM 144.4B。電気設備がDC建設コストの約40%を占め、LV配電盤の需要が直接発生する。",
    sector_market_size: "USD 6.14B (2025)",
    cb_relevance: "High",
    concentration_region: "Johor, Selangor",
    growth_outlook: "very_high",
    cb_demand_per_project: "200-500個/案件",
    overall_rating: 5,
    year: 2025,
    source: "Mordor Intelligence; Arizton",
  },
  {
    sector_name: "半導体・E&E",
    sector_overview: "世界のチップパッケージングの13%を担う。Intel RM30B/10年、Infineon SiC工場等の増設が続く。クリーンルーム・製造装置ごとに配電盤が必要で、高信頼性のLV遮断器需要が発生。",
    sector_market_size: "USD 10.85B (2025)",
    cb_relevance: "High",
    concentration_region: "Penang, Kedah",
    growth_outlook: "very_high",
    cb_demand_per_project: "150-400個/案件",
    overall_rating: 5,
    year: 2025,
    source: "Mordor Intelligence; DOSM",
  },
  {
    sector_name: "石油化学",
    sector_overview: "PETRONAS起点でマレーシア製造業GDPの柱。プラントのモーター制御盤にMCCBが多用される。新設は限定的だが、老朽更新需要が継続的に発生する。",
    sector_market_size: "MCC市場 USD 5.8B (2025)",
    cb_relevance: "High",
    concentration_region: "Johor, Pahang, Terengganu",
    growth_outlook: "medium",
    cb_demand_per_project: "100-300個/案件",
    overall_rating: 4,
    year: 2025,
    source: "6Wresearch",
  },
  {
    sector_name: "住宅・商業ビル",
    sector_overview: "年間15万戸の住宅着工計画。住宅建設が建設市場の44.3%を占める。1棟ごとに分電盤が必要で、数量ベースではLV遮断器の最大需要先。",
    sector_market_size: "建設市場 USD 41.2B (2026)",
    cb_relevance: "Medium",
    concentration_region: "全国（特に都市部）",
    growth_outlook: "high",
    cb_demand_per_project: "20-50個/棟",
    overall_rating: 4,
    year: 2025,
    source: "DOSM; CIDB",
  },
  {
    sector_name: "再生可能エネルギー",
    sector_overview: "太陽光中心に年間1.4GW追加目標。2035年までに累積30GW到達見込み。PVインバータ周辺のDC MCCBなど、再エネ特有のLV遮断器需要が新規市場として拡大中。",
    sector_market_size: "RE容量 10.56GW (2025)",
    cb_relevance: "Medium",
    concentration_region: "Sabah, Sarawak, Penang",
    growth_outlook: "high",
    cb_demand_per_project: "30-80個/サイト",
    overall_rating: 4,
    year: 2025,
    source: "SEDA; NETR 2.0",
  },
];

/* ------------------------------------------------------------------ */
/*  ③ 地域概況（T2_regional_profile.csv）                             */
/* ------------------------------------------------------------------ */

/**
 * 州別地域概況
 * 州別のGDP・主要産業・成長産業を一覧で示す
 * 出典: DOSM; ASEAN Briefing; 各州政府資料
 */
export const CB_REGIONAL_PROFILE: RegionalProfile[] = [
  {
    state_name: "Selangor",
    state_name_ja: "セランゴール",
    gdp_usd_billion: 106.0,
    gdp_national_share_pct: 25.9,
    gdp_growth_pct: 6.3,
    major_industries: "サービス, E&E製造, デジタル, 製薬",
    growing_industries: "DC（Google USD 2B投資、Cyberjaya集積）, デジタルサービス",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Kuala Lumpur / Putrajaya",
    state_name_ja: "クアラルンプール / プトラジャヤ",
    gdp_usd_billion: 65.1,
    gdp_national_share_pct: 15.9,
    gdp_growth_pct: 5.5,
    major_industries: "金融, 商業, サービス",
    growing_industries: "MRT3建設（RM 45B）, 都市再開発",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Johor",
    state_name_ja: "ジョホール",
    gdp_usd_billion: 40.9,
    gdp_national_share_pct: 9.6,
    gdp_growth_pct: 6.4,
    major_industries: "DC, 物流, 製造, 石油化学",
    growing_industries: "DC（42+案件、ASEAN最大集積）, JS-SEZ, RTS（2026年末開業）",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Sarawak",
    state_name_ja: "サラワク",
    gdp_usd_billion: 40.4,
    gdp_national_share_pct: 9.6,
    gdp_growth_pct: 4.8,
    major_industries: "石油ガス, 水力発電, アルミ精錬",
    growing_industries: "グリーン水素, 再エネ重工業（Baleh Dam 1,285MW追加）",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Penang",
    state_name_ja: "ペナン",
    gdp_usd_billion: 29.9,
    gdp_national_share_pct: 7.1,
    gdp_growth_pct: 5.2,
    major_industries: "半導体, E&E, 精密機械",
    growing_industries: "半導体増設（Intel RM 30B/10年、Infineon SiC工場）",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Sabah",
    state_name_ja: "サバ",
    gdp_usd_billion: 25.0,
    gdp_national_share_pct: 5.9,
    gdp_growth_pct: 3.8,
    major_industries: "石油ガス, パーム油, 観光",
    growing_industries: "観光（高付加価値化）, ブルーエコノミー",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Perak",
    state_name_ja: "ペラク",
    gdp_usd_billion: 21.9,
    gdp_national_share_pct: 5.2,
    gdp_growth_pct: 4.5,
    major_industries: "製造, 農業, 鉱業",
    growing_industries: "—",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
  {
    state_name: "Pahang",
    state_name_ja: "パハン",
    gdp_usd_billion: 18.1,
    gdp_national_share_pct: 4.3,
    gdp_growth_pct: 5.3,
    major_industries: "鉱業, 農業, 建設",
    growing_industries: "ECRL沿線開発",
    year: 2024,
    source: "DOSM; ASEAN Briefing",
  },
];

/* ------------------------------------------------------------------ */
/*  出典情報                                                           */
/* ------------------------------------------------------------------ */

export const MARKET_DATA_SOURCES = {
  market_size: '6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"',
  sector_focus: "Mordor Intelligence; Arizton; DOSM; MDEC; 6Wresearch",
  regional_profile: "DOSM; ASEAN Briefing; 各州政府資料",
};
