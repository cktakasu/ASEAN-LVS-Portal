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
 * T2_cb_product_mix.csv 相当
 * 機種別構成比（ドーナツチャート用）
 */
export interface ProductMixItem {
  product_type: string;   // ACB / MCCB / ELCB / MCB / RCBO / RCCB
  share_pct: number;
}

/**
 * T2_cb_application_mix.csv 相当
 * 用途別構成比（ドーナツチャート用）
 */
export interface ApplicationMixItem {
  application: string;
  share_pct: number;
}

/**
 * T2_demand_drivers.csv 相当
 * 需要ドライバー（テーブル + ヒートマップ用）
 * ※ primary_product_types は削除済み
 */
export interface DemandDriver {
  driver_name: string;
  category: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  time_horizon?: string;          // 例: "2025-2031"
  policy_reference?: string;      // 例: "13MP; NETR 2.0"
  acb_relevance: number;          // 0-5
  mccb_relevance: number;         // 0-5
  elcb_relevance: number;         // 0-5
  mcb_relevance: number;          // 0-5
  rcbo_relevance: number;         // 0-5
  rccb_relevance: number;         // 0-5
  relevance_source: string;       // スコア根拠（IEC規格 / Schneider EIG / 6Wresearch）
  notes?: string;
}

/**
 * T2_mega_projects.csv 相当
 * メガプロジェクト一覧（フィルタ付きテーブル用）
 */
export interface MegaProject {
  project_name: string;
  sector: string;
  location: string;
  value_usd_million?: number;
  status: "Planned" | "Ongoing" | "Completed" | "Cancelled";
  expected_completion?: string;
  cb_types: string;
  notes?: string;
}
