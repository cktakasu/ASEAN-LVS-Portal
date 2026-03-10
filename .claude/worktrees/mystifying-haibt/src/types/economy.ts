/* ------------------------------------------------------------------ */
/*  Economy Type Definitions                                           */
/* ------------------------------------------------------------------ */

/**
 * 経済KPIデータ
 */
export interface EconomyKPI {
  gdp_usd_billion: number;
  gdp_growth_pct: number;
  population_million: number;
  gdp_per_capita_usd: number;
  fdi_inflow_usd_billion: number;
  exchange_rate_to_usd: number;
  inflation_pct: number;
}

/**
 * GDPデータポイント（実績・予測フラグ付き）
 */
export interface GDPDataPoint {
  year: number;
  gdp_usd_billion: number;
  is_forecast: boolean;
}

/**
 * 産業別GDPデータ
 */
export interface IndustryGDP {
  sector: string;
  gdp_share_pct: number;
  growth_rate_pct: number;
  cb_relevance: "High" | "Medium" | "Low";
}

/**
 * 経済ニュース記事
 */
export interface EconomicNews {
  date: string;
  headline: string;
  category: "Policy" | "Investment" | "Trade" | "Infrastructure" | "Other";
  cb_impact: "High" | "Medium" | "Low" | "None";
  summary: string;
  url?: string;
  source?: string;
}

/**
 * データソース情報
 */
export interface DataSources {
  kpi: string;
  kpi_note: string;
  gdp: string;
  industry: string;
  news: string;
}
