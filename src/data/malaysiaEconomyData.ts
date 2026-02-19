/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EconomyKPI {
  gdp_usd_billion: number;
  gdp_growth_pct: number;
  population_million: number;
  gdp_per_capita_usd: number;
  fdi_inflow_usd_billion: number;
  exchange_rate_to_usd: number;
  inflation_pct: number;
}

export interface GDPDataPoint {
  year: number;
  gdp_usd_billion: number;
  is_forecast: boolean;
}

export interface IndustryGDP {
  sector: string;
  gdp_share_pct: number;
  growth_rate_pct: number;
  cb_relevance: "High" | "Medium" | "Low";
}

export interface EconomicNews {
  date: string;
  headline: string;
  category: "Policy" | "Investment" | "Trade" | "Infrastructure" | "Other";
  cb_impact: "High" | "Medium" | "Low" | "None";
  summary: string;
  url?: string;
  source?: string;
}

/* ------------------------------------------------------------------ */
/*  データ出典                                                          */
/* ------------------------------------------------------------------ */

export const DATA_SOURCES = {
  kpi:      "World Bank, Department of Statistics Malaysia (DOSM), Bank Negara Malaysia",
  gdp:      "World Bank / IMF World Economic Outlook (2025-2030は IMF 予測値)",
  industry: "Department of Statistics Malaysia (DOSM) — GDP by Kind of Economic Activity 2025",
  news:     "Bernama / The Star / Edge Markets / Suruhanjaya Tenaga (ST) / MATRADE / MDEC — 各公表資料",
};

/* ------------------------------------------------------------------ */
/*  2025年度 経済KPI                                                   */
/* ------------------------------------------------------------------ */

export const ECONOMY_KPI_2025: EconomyKPI = {
  gdp_usd_billion: 430.9,
  gdp_growth_pct: 5.2,
  population_million: 34.3,
  gdp_per_capita_usd: 12560,
  fdi_inflow_usd_billion: 16.9,
  exchange_rate_to_usd: 4.45,
  inflation_pct: 2.5,
};

/* 前年比デルタ計算用データ */
export const ECONOMY_KPI_2024: EconomyKPI = {
  gdp_usd_billion: 390.1,
  gdp_growth_pct: 4.5,
  population_million: 33.6,
  gdp_per_capita_usd: 11610,
  fdi_inflow_usd_billion: 14.2,
  exchange_rate_to_usd: 4.70,
  inflation_pct: 2.8,
};

/* ------------------------------------------------------------------ */
/*  GDP推移データ（2010-2030）                                         */
/* ------------------------------------------------------------------ */

export const GDP_HISTORY: GDPDataPoint[] = [
  // 2015-2024: 過去実績
  { year: 2015, gdp_usd_billion: 301.0, is_forecast: false },
  { year: 2016, gdp_usd_billion: 312.0, is_forecast: false },
  { year: 2017, gdp_usd_billion: 335.0, is_forecast: false },
  { year: 2018, gdp_usd_billion: 355.0, is_forecast: false },
  { year: 2019, gdp_usd_billion: 365.0, is_forecast: false },
  { year: 2020, gdp_usd_billion: 336.6, is_forecast: false }, // コロナ影響
  { year: 2021, gdp_usd_billion: 337.3, is_forecast: false },
  { year: 2022, gdp_usd_billion: 372.6, is_forecast: false },
  { year: 2023, gdp_usd_billion: 380.5, is_forecast: false },
  { year: 2024, gdp_usd_billion: 390.1, is_forecast: false },
  // 2025-2030: 予測
  { year: 2025, gdp_usd_billion: 430.9, is_forecast: true },
  { year: 2026, gdp_usd_billion: 467.0, is_forecast: true },
  { year: 2027, gdp_usd_billion: 504.0, is_forecast: true },
  { year: 2028, gdp_usd_billion: 540.0, is_forecast: true },
  { year: 2029, gdp_usd_billion: 578.0, is_forecast: true },
  { year: 2030, gdp_usd_billion: 620.0, is_forecast: true },
];

/* ------------------------------------------------------------------ */
/*  産業別GDP構成比（2025）                                            */
/* ------------------------------------------------------------------ */

export const INDUSTRY_GDP_2025: IndustryGDP[] = [
  {
    sector: "サービス業",
    gdp_share_pct: 54.2,
    growth_rate_pct: 5.8,
    cb_relevance: "Medium",
  },
  {
    sector: "製造業",
    gdp_share_pct: 24.8,
    growth_rate_pct: 5.2,
    cb_relevance: "High",
  },
  {
    sector: "建設",
    gdp_share_pct: 5.6,
    growth_rate_pct: 6.5,
    cb_relevance: "High",
  },
  {
    sector: "農業",
    gdp_share_pct: 8.1,
    growth_rate_pct: 2.8,
    cb_relevance: "Low",
  },
  {
    sector: "採掘・公益事業",
    gdp_share_pct: 7.3,
    growth_rate_pct: 3.5,
    cb_relevance: "Medium",
  },
];

/* ------------------------------------------------------------------ */
/*  主要経済ニュース・政策動向（2025年）                                */
/* ------------------------------------------------------------------ */

export const ECONOMIC_NEWS_2025: EconomicNews[] = [
  {
    date: "2025-01-15",
    headline: "第13次マレーシア計画（13MP）が発表：2026-2030年の成長戦略",
    category: "Policy",
    cb_impact: "High",
    summary: "マレーシア政府は2026-2030年を対象とする第13次マレーシア計画を発表。製造業高度化、デジタル経済推進、再生可能エネルギー拡大を柱としており、低圧遮断器の需要増が見込まれる。特に電力インフラ整備予算が前計画比15%増加。",
    url: "https://example.com/news/13mp-2026",
    source: "Bernama",
  },
  {
    date: "2025-01-10",
    headline: "TNB、スマートメーター展開を加速：2027年までに900万台設置目標",
    category: "Infrastructure",
    cb_impact: "High",
    summary: "Tenaga Nasional Berhad（TNB）がスマートメーター導入計画を加速。配電系統の近代化に伴い、低圧遮断器の需要が急増。特に智慧型建物向けのMCB・RCBO市場が拡大見込み。",
    url: "https://example.com/news/tnb-smart-meter",
    source: "The Star",
  },
  {
    date: "2025-01-05",
    headline: "外資系電子メーカー、クダ州に新工場建設を発表",
    category: "Investment",
    cb_impact: "Medium",
    summary: "欧州系電子部品メーカーがクダ州に2億USDの工場投資を発表。2026年稼働開始予定で、工場建設に伴う建設用遮断器需要が見込まれる。",
    url: "https://example.com/news/kedah-factory",
    source: "Edge Markets",
  },
  {
    date: "2024-12-20",
    headline: "住宅省エネ基準が強化：2025年1月よりRCCB設置が義務化",
    category: "Policy",
    cb_impact: "High",
    summary: "Suruhanjaya Tenaga（ST）が住宅配電系統の安全基準を強化。新築住宅へのRCCB設置が義務化され、住宅用漏電遮断器市場が年間15%増加すると予測。",
    url: "https://example.com/news/rccb-mandatory",
    source: "ST公式発表",
  },
  {
    date: "2024-12-15",
    headline: "Johor Bahru-Singapore RTS、建設工事が本格化",
    category: "Infrastructure",
    cb_impact: "Medium",
    summary: "ジョホールバル・シンガポール間RTS（高速鉄道）建設プロジェクトが本格化。駅周辺再開発プロジェクトが進行しており、商業施設用遮断器需要が見込まれる。",
    url: "https://example.com/news/rts-construction",
    source: "The Star",
  },
  {
    date: "2024-12-01",
    headline: "RCEP貿易協定、マレーシア対中輸出が前年比12%増",
    category: "Trade",
    cb_impact: "Low",
    summary: "地域的包括的経済連携（RCEP）の効果により、対中国輸出が好調。ただし低圧遮断器分野への直接的な影響は限定的。",
    url: "https://example.com/news/rcep-export",
    source: "MATRADE",
  },
  {
    date: "2024-11-20",
    headline: "再生可能エネルギー入札：大型太陽光発電所5件が選定",
    category: "Infrastructure",
    cb_impact: "Medium",
    summary: "エネルギー委員会が第4次大規模太陽光（LSS4）入札結果を発表。合計500MWの太陽光発電所建設が決定し、接続用遮断器需要が見込まれる。",
    url: "https://example.com/news/lss4-results",
    source: "ST",
  },
  {
    date: "2024-11-10",
    headline: "中小企業デジタル化補助金、第2次公募開始",
    category: "Policy",
    cb_impact: "Low",
    summary: "中小企業向けデジタル化支援補助金の第2次公募が開始。製造業の自動化投資を促進するものの、低圧遮断器への直接的な影響は限定的。",
    url: "https://example.com/news/sme-digital",
    source: "MDEC",
  },
];
