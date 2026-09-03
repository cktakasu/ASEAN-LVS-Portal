/* ------------------------------------------------------------------ */
/*  T6: Market Intelligence Hub — Type Definitions                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  S1: Business Environment                                          */
/* ------------------------------------------------------------------ */

export interface BusinessEnvKPI {
  label: string;
  labelJa: string;
  value: string | number;
  unit: string;
  rank?: string;
  trend?: "improving" | "stable" | "declining";
  ratingColor: "green" | "yellow" | "orange" | "red";
  note: string;
}

export interface BusinessEnvSubScore {
  subject: string;
  score: number;
}

export interface BusinessEnvironment {
  kpis: BusinessEnvKPI[];
  subScores: BusinessEnvSubScore[];
  taxIncentives: string[];
  source: string;
}

/* ------------------------------------------------------------------ */
/*  S2: Competitive Intelligence                                      */
/* ------------------------------------------------------------------ */

export interface CompetitorIntelligence {
  name: string;
  country: string;
  flag: string;
  estimatedSharePct: number;
  estimatedShareRangePct: readonly [number, number];
  pricePositioning: "Premium" | "Standard" | "Economy";
  products: string[];
  hasLocalOffice: boolean;
  officeCities: string[];
  annualRevEstUsd: number; // 推定売上（USD M）
  annualRevenueRangeUsdM: readonly [number, number];
  strength: string[];
  weakness: string[];
  radarScores: {
    price: number;        // 価格競争力（高=安い）
    brand: number;        // ブランド認知
    tech: number;         // 技術スペック
    service: number;      // サービス品質
    delivery: number;     // 納期対応力
  };
}

/* ------------------------------------------------------------------ */
/*  S3: Customer Segments                                             */
/* ------------------------------------------------------------------ */

export interface CustomerSegment {
  id: string;
  nameJa: string;
  nameEn: string;
  marketSizeUsdM: number;
  growthRatePct: number;
  avgOrderUsd: number;
  decisionCycleMonths: number;
  decisionMaker: string;
  primaryProducts: string[];
  purchaseCriteria: { label: string; weight: number }[];
  entryBarriers: { barrier: string; severity: "High" | "Medium" | "Low" }[];
  keyCompanies: string[];
  color: string;
}

/* ------------------------------------------------------------------ */
/*  S4: Product Market Size                                           */
/* ------------------------------------------------------------------ */

export interface ProductMarketSize {
  product: string;
  marketSizeUsdM2025: number;
  marketSizeUsdM2031: number;
  cagr: number;
  priceRangeUsd: string;
  demandDrivers: string[];
  primarySegments: string[];
}

/* ------------------------------------------------------------------ */
/*  S5: Distribution Channels                                         */
/* ------------------------------------------------------------------ */

export interface DistributionChannel {
  id: string;
  nameJa: string;
  nameEn: string;
  description: string;
  marginStructure: string[];
  keyPlayers: string[];
  minInvestmentUsd: number;
  setupMonths: number;
  pros: string[];
  cons: string[];
  recommendedFor: string;
}

/* ------------------------------------------------------------------ */
/*  S6: Certification Process                                         */
/* ------------------------------------------------------------------ */

export interface CertStep {
  step: number;
  phase: string;
  durationWeeks: number;
  body: string;
  documents: string[];
  costMyr: number;
  notes: string;
}

export interface CertProductPath {
  product: string;
  cbScheme: "Full" | "Partial" | "None";
  totalWeeksWithCBRange: readonly [number, number];
  totalWeeksWithoutCBRange: readonly [number, number];
  totalCostMyrWithCBRange: readonly [number, number];
  totalCostMyrWithoutCBRange: readonly [number, number];
  steps: CertStep[];
}

/* ------------------------------------------------------------------ */
/*  S7: Investment Analysis                                           */
/* ------------------------------------------------------------------ */

export interface CashFlowYear {
  year: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  fixedCost: number;
  variableCost: number;
  operatingProfit: number;
  cumulativeCF: number;
}

export interface InvestmentScenario {
  name: string;
  nameJa: string;
  color: string;
  revenueMultiplier: number;
  breakEvenMonth: number | null;
  roi3YearPct: number;
  npv5YearUsd: number;
  irrPct: number | null;
}

export interface InvestmentAnalysis {
  initialInvestmentUsd: number;
  year0OperatingCostUsd: number;
  initialBreakdown: { label: string; usd: number }[];
  annualFixedCostUsd: number;
  annualFixedBreakdown: { label: string; usd: number }[];
  cashFlow: CashFlowYear[];
  scenarios: InvestmentScenario[];
  sensitivityAnalysis: {
    parameter: string;
    baseCase: string;
    optimistic: string;
    pessimistic: string;
    roiImpactPct: number;
  }[];
}

/* ------------------------------------------------------------------ */
/*  S8: Scenario Analysis                                             */
/* ------------------------------------------------------------------ */

export interface MarketScenario {
  name: string;
  nameJa: string;
  probability: number;
  color: string;
  marketSize2031UsdM: number;
  cagr: number;
  keyAssumptions: string[];
  triggers: string[];
  recommendedStrategy: string;
  investmentStance: string;
}

/* ------------------------------------------------------------------ */
/*  S9: KPI Dashboard                                                 */
/* ------------------------------------------------------------------ */

export interface KPIItem {
  category: string;
  metric: string;
  unit: string;
  targetY1: number | string;
  targetY2: number | string;
  targetY3: number | string;
  frequency: string;
  priority: "High" | "Medium" | "Low";
}

export type SourceEvidenceStatus =
  | "一次情報で確認"
  | "公開情報に基づく推定"
  | "内部仮定"
  | "シミュレーション値"
  | "要追加調査";

export interface T6DataSource {
  id: string;
  sourceName: string;
  title: string;
  url: string;
  publishedOrReferenceYear: string;
  accessedOn: string;
  supports: string;
  status: SourceEvidenceStatus;
}
