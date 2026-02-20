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
}

/**
 * 産業別GDPデータ
 */
export interface IndustryGDP {
  industry: string;
  gdp_share_pct: number;
  gdp_usd_billion: number;
}

/**
 * 経済ニュース記事
 */
export interface EconomicNews {
  id: string;
  date: string;
  category: string;
  headline: string;
  summary: string;
  url: string;
  impact_level: "high" | "medium" | "low";
}

/**
 * データソース情報
 */
export interface DataSources {
  gdp: string;
  kpi_note: string;
  industry: string;
  news: string;
}
