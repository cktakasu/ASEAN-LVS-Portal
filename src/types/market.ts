/* ------------------------------------------------------------------ */
/*  T2 Market & Demand — Type Definitions                              */
/* ------------------------------------------------------------------ */

/**
 * T2_cb_market.csv 相当
 * マレーシア LV CB 市場規模データポイント（年次）
 */
export interface MarketDataPoint {
  year: number;
  market_size_usd_million: number;
  market_size_low_usd_million?: number;   // レンジ下限（6Wresearch）
  market_size_high_usd_million?: number;  // レンジ上限（6Wresearch）
  scope_definition: string;              // LV CB only, excl. fuses, excl. MV/HV 等
  is_forecast: boolean;
  source?: string;
}

/**
 * T2_demand_drivers.csv 相当
 * 注目市場セクター（セクション2-2用）
 */
export interface SectorFocus {
  sector_name: string;            // セクター名（日本語）
  sector_overview: string;        // セクター概要（2〜3文）
  sector_market_size: string;     // セクター市場規模（単位含む）
  cb_relevance: "High" | "Medium" | "Low";  // LV-CB需要との関連度
  concentration_region?: string;  // 需要集中地域
  growth_outlook: "very_high" | "high" | "medium" | "low";  // 成長見通し（4段階）
  cb_demand_per_project: string;  // 案件あたりCB需要
  overall_rating: number;         // 総合評価（1-5星評価）
  year: number;
  source: string;
  notes?: string;
}

/**
 * T2_regional_profile.csv 相当
 * 州別地域概況（セクション2-3用）
 */
export interface RegionalProfile {
  state_name: string;              // 州名（英語）
  state_name_ja: string;           // 州名（日本語）
  gdp_usd_billion: number;         // GDP（十億ドル）
  gdp_national_share_pct: number;  // 全国GDP比（%）
  gdp_growth_pct: number;          // 成長率（%）
  major_industries: string;        // 主要産業
  growing_industries: string;      // 特に成長している産業
  year: number;
  source: string;
  notes?: string;
}
