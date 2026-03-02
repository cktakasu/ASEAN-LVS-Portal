/* ------------------------------------------------------------------ */
/*  T2 Market & Demand — Malaysia LV CB Market Data                   */
/*  出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"    */
/*  CAGR: 6.8% (2025-2031) — 6Wresearch公表値（全CB帯対象）          */
/*  URL: https://www.6wresearch.com/industry-report/                  */
/*       malaysia-circuit-breaker-market-outlook                      */
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
 * CAGR: 6.8%（2025-2031）— 6Wresearch公表値（全CB帯対象）
 * 出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"
 *       https://www.6wresearch.com/industry-report/malaysia-circuit-breaker-market-outlook
 *
 * 【2020-2023年】6Wresearch歴史的推計値
 *  - Low/Highレンジは一次出典にないため、2025年の不確実性幅（±13%）を適用して推定
 *  - 推定値であることを考慮し、不確実性の幅を持たせて表示
 *
 * 【2024年】6Wresearch実績値
 *  - 最新年の実績値であり、不確実性レンジはなし
 *
 * 【2025-2031年】6Wresearch予測値（Low/Highレンジ含む）
 */
export const CB_MARKET_DATA: MarketDataPoint[] = [
  {
    year: 2020,
    market_size_usd_million: 110,
    market_size_low_usd_million: 96,   // 110 × 0.87 (推定幅±13%)
    market_size_high_usd_million: 127,  // 110 × 1.13
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (historical estimate)",
  },
  {
    year: 2021,
    market_size_usd_million: 118,
    market_size_low_usd_million: 103,  // 118 × 0.87
    market_size_high_usd_million: 136,  // 118 × 1.13
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025",
  },
  {
    year: 2022,
    market_size_usd_million: 128,
    market_size_low_usd_million: 111,  // 128 × 0.87
    market_size_high_usd_million: 147,  // 128 × 1.13
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025",
  },
  {
    year: 2023,
    market_size_usd_million: 138,
    market_size_low_usd_million: 120,  // 138 × 0.87
    market_size_high_usd_million: 159,  // 138 × 1.13
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025",
  },
  {
    year: 2024,
    market_size_usd_million: 144,
    market_size_low_usd_million: undefined,  // 実績値なので不確実性レンジなし
    market_size_high_usd_million: undefined, // 実績値なので不確実性レンジなし
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: false,
    source: "6Wresearch 2025 (実績値)",
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
    // 150 × 1.068^1 = 160.2 → 160 (CAGR 6.8% per 6Wresearch)
    market_size_usd_million: 160,
    market_size_low_usd_million: 139,
    market_size_high_usd_million: 181,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2027,
    // 150 × 1.068^2 = 171.1 → 171
    market_size_usd_million: 171,
    market_size_low_usd_million: 148,
    market_size_high_usd_million: 195,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2028,
    // 150 × 1.068^3 = 182.7 → 183
    market_size_usd_million: 183,
    market_size_low_usd_million: 158,
    market_size_high_usd_million: 210,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2029,
    // 150 × 1.068^4 = 195.2 → 195
    market_size_usd_million: 195,
    market_size_low_usd_million: 169,
    market_size_high_usd_million: 224,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2030,
    // 150 × 1.068^5 = 208.4 → 208
    market_size_usd_million: 208,
    market_size_low_usd_million: 180,
    market_size_high_usd_million: 238,
    scope_definition: "LV CB only, excl. fuses, excl. MV/HV",
    is_forecast: true,
    source: "6Wresearch 2025",
  },
  {
    year: 2031,
    // 150 × 1.068^6 = 222.6 → 223 → CAGR実測: (223/150)^(1/6)-1 ≈ 6.83%
    market_size_usd_million: 223,
    market_size_low_usd_million: 194,
    market_size_high_usd_million: 255,
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
 * 注意: 具体的な数値はエビデンス不十分のため削除。定性情報のみ記載。
 */
export const CB_SECTOR_FOCUS: SectorFocus[] = [
  {
    sector_name: "データセンター",
    sector_overview: "ASEAN域内でデータセンター建設が活発化。ジョホール及びセランゴール州に集中。電気設備への投資によりLV配電盤の需要が発生。",
    sector_market_size: undefined,
    cb_relevance: "High",
    concentration_region: "Johor, Selangor",
    growth_outlook: "very_high",
    cb_demand_per_project: undefined,
    overall_rating: 5,
    year: 2025,
    source: undefined,
  },
  {
    sector_name: "半導体・E&E",
    sector_overview: "ペナン及びケダ州を中心とした半導体・電子機器製造の集積。製造装置ごとに配電盤が必要で、高信頼性のLV遮断器需要が発生。",
    sector_market_size: undefined,
    cb_relevance: "High",
    concentration_region: "Penang, Kedah",
    growth_outlook: "very_high",
    cb_demand_per_project: undefined,
    overall_rating: 5,
    year: 2025,
    source: undefined,
  },
  {
    sector_name: "石油化学",
    sector_overview: "製造業の主要セクター。プラントのモーター制御盤にMCCBが多用される。新設は限定的だが、更新需要が継続的に発生。",
    sector_market_size: undefined,
    cb_relevance: "High",
    concentration_region: "Johor, Pahang, Terengganu",
    growth_outlook: "medium",
    cb_demand_per_project: undefined,
    overall_rating: 4,
    year: 2025,
    source: undefined,
  },
  {
    sector_name: "住宅・商業ビル",
    sector_overview: "住宅建設及び商業ビル開発。1棟ごとに分電盤が必要で、数量ベースではLV遮断器の主要需要先。",
    sector_market_size: undefined,
    cb_relevance: "Medium",
    concentration_region: "全国（特に都市部）",
    growth_outlook: "high",
    cb_demand_per_project: undefined,
    overall_rating: 4,
    year: 2025,
    source: undefined,
  },
  {
    sector_name: "再生可能エネルギー",
    sector_overview: "太陽光を中心とした再生可能エネルギー導入の拡大。PVインバータ周辺のDC MCCBなど、再エネ特有のLV遮断器需要が拡大中。",
    sector_market_size: undefined,
    cb_relevance: "Medium",
    concentration_region: "Sabah, Sarawak, Penang",
    growth_outlook: "high",
    cb_demand_per_project: undefined,
    overall_rating: 4,
    year: 2025,
    source: undefined,
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
    growing_industries: "データセンター, デジタルサービス",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Kuala Lumpur / Putrajaya",
    state_name_ja: "KL / プトラジャヤ",
    gdp_usd_billion: 65.1,
    gdp_national_share_pct: 15.9,
    gdp_growth_pct: 6.2,
    major_industries: "金融, 商業, サービス",
    growing_industries: "MRT3建設, 都市再開発",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Johor",
    state_name_ja: "ジョホール",
    gdp_usd_billion: 40.9,
    gdp_national_share_pct: 9.6,
    gdp_growth_pct: 6.4,
    major_industries: "DC, 物流, 製造, 石油化学",
    growing_industries: "データセンター, JS-SEZ, RTS（2026年末開業）",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Sarawak",
    state_name_ja: "サラワク",
    gdp_usd_billion: 40.4,
    gdp_national_share_pct: 9.0,  // ⑤修正: 9.6%→9.0%（RM148.2B÷RM1,650B）
    gdp_growth_pct: 3.9,          // ④修正: 4.8%→3.9%
    major_industries: "石油ガス, 水力発電, アルミ精錬",
    growing_industries: "グリーン水素, 再エネ重工業",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Penang",
    state_name_ja: "ペナン",
    gdp_usd_billion: 29.9,
    gdp_national_share_pct: 7.1,
    gdp_growth_pct: 4.8,  // ⑦修正: 5.2%→4.8%
    major_industries: "半導体, E&E, 精密機械",
    growing_industries: "半導体増設",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Sabah",
    state_name_ja: "サバ",
    gdp_usd_billion: 25.0,
    gdp_national_share_pct: 5.1,  // ③修正: 5.9%→5.1%（RM84.3B÷RM1,650B）
    gdp_growth_pct: 1.1,          // ②修正: 3.8%→1.1%（全州中最低）
    major_industries: "石油ガス, パーム油, 観光",
    growing_industries: "観光（高付加価値化）, ブルーエコノミー",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Perak",
    state_name_ja: "ペラク",
    gdp_usd_billion: 21.9,
    gdp_national_share_pct: 5.2,
    gdp_growth_pct: 4.4,  // ⑪修正: 4.5%→4.4%
    major_industries: "製造, 農業, 鉱業",
    growing_industries: "—",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
  {
    state_name: "Pahang",
    state_name_ja: "パハン",
    gdp_usd_billion: 18.1,
    gdp_national_share_pct: 4.3,
    gdp_growth_pct: 5.7,  // ⑧修正: 5.3%→5.7%
    major_industries: "鉱業, 農業, 建設",
    growing_industries: "ECRL沿線開発",
    year: 2024,
    source: "DOSM, GDP by State 2024（2025年7月1日発表）",
  },
];

/* ------------------------------------------------------------------ */
/*  出典情報                                                           */
/* ------------------------------------------------------------------ */

export const MARKET_DATA_SOURCES = {
  market_size: '6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"',
  sector_focus: "Mordor Intelligence; Arizton; DOSM; MDEC; 6Wresearch",
  regional_profile: "DOSM, GDP by State 2024（2025年7月1日発表）; 各州政府資料",
};
