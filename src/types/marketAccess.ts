/* ------------------------------------------------------------------ */
/*  Market Access — Type Definitions                                   */
/* ------------------------------------------------------------------ */

/**
 * LV Switchgear product type union
 */
export type LVProductType = "ACB" | "MCCB" | "MCB" | "RCCB" | "RCBO";

/* ================================================================== */
/*  4-1: Trade & Tariff Regime                                         */
/* ================================================================== */

/**
 * HS Code tariff row — one row per product × HS code combination
 */
export interface TariffRow {
  product_type: LVProductType;
  hs_code: string;
  hs_description: string;
  mfn_rate_pct: number;
  atiga_rate_pct: number;
  jmepa_rate_pct?: number;
  rcep_rate_pct?: number;
  notes?: string;
  source: string;
}

/**
 * Import process step — sequential steps in the import procedure
 */
export interface ImportStep {
  step_number: number;
  step_title: string;
  step_title_en: string;
  responsible_party: string;
  key_actions: string[];
  required_documents?: string[];
  typical_duration?: string;
  notes?: string;
}

/**
 * Import cost component — breakdown of landed cost elements
 */
export interface ImportCostComponent {
  cost_item: string;
  rate_or_amount: string;
  basis: string;
  notes?: string;
  source: string;
}

/* ================================================================== */
/*  4-2: Distribution Structure                                        */
/* ================================================================== */

/**
 * Distribution channel type union
 */
export type DistributionChannelType =
  | "Direct"
  | "National Distributor"
  | "Regional Distributor"
  | "Panel Builder"
  | "E-Commerce"
  | "Retail";

/**
 * Distribution channel characteristics
 */
export interface DistributionChannel {
  channel_type: DistributionChannelType;
  channel_name_ja: string;
  description: string;
  target_customers: string;
  typical_margin_pct?: string;
  volume_share_pct?: string;
  strengths: string[];
  weaknesses: string[];
  representative_players?: string[];
  notes?: string;
}

/**
 * Key distributor / panel builder in the ecosystem
 */
export interface MarketPlayer {
  company_name: string;
  company_type: "Distributor" | "Panel Builder" | "System Integrator" | "Trading Company";
  brands_carried?: string[];
  coverage: string;
  specialization?: string;
  estimated_scale: "Large" | "Medium" | "Small";
  notes?: string;
  source: string;
}

/* ================================================================== */
/*  4-3: Project Procurement Ecosystem                                 */
/* ================================================================== */

/**
 * Procurement process stage — stages in spec-to-order pipeline
 */
export interface ProcurementStage {
  stage_number: number;
  stage_name: string;
  stage_name_en: string;
  key_actors: string[];
  decision_influence: "High" | "Medium" | "Low";
  description: string;
  lv_touchpoint: string;
  notes?: string;
}

/**
 * Procurement type comparison — government vs private
 */
export interface ProcurementTypeComparison {
  dimension: string;
  government: string;
  private_sector: string;
  notes?: string;
}

/**
 * AVL (Approved Vendor List) structure
 */
export interface AVLInfo {
  avl_owner_type: "Government" | "Utility" | "Developer" | "Consultant" | "EPC";
  avl_owner_example: string;
  entry_requirements: string[];
  typical_brands_count?: string;
  renewal_cycle?: string;
  influence_level: "High" | "Medium" | "Low";
  notes?: string;
  source: string;
}

/* ================================================================== */
/*  4-4: Barriers & Facilitators                                       */
/* ================================================================== */

export type BarrierCategory =
  | "Regulatory"
  | "Distribution"
  | "Specification"
  | "Local Content"
  | "Commercial";

export interface MarketBarrier {
  barrier_id: string;
  category: BarrierCategory;
  barrier_name: string;
  barrier_name_en: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  affected_products: LVProductType[] | "All";
  mitigation_hint?: string;
  source: string;
}

export type FacilitatorCategory =
  | "Trade Agreement"
  | "Regulatory Harmonization"
  | "Market Dynamics"
  | "Government Policy";

export interface MarketFacilitator {
  facilitator_id: string;
  category: FacilitatorCategory;
  facilitator_name: string;
  facilitator_name_en: string;
  impact: "High" | "Medium" | "Low";
  description: string;
  relevant_products: LVProductType[] | "All";
  source: string;
}

/* ================================================================== */
/*  Data Sources                                                       */
/* ================================================================== */

export interface MarketAccessDataSources {
  tariff: string;
  import_process: string;
  distribution: string;
  procurement: string;
  barriers: string;
}
