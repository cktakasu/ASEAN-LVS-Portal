/* ------------------------------------------------------------------ */
/*  Strategic Assessment — Type Definitions                            */
/* ------------------------------------------------------------------ */

/** S1: スコア根拠のデータソース */
export interface ScoreDataSource {
  tabRef: "T1" | "T2" | "T3" | "T4" | "推定";
  dataKey: string;    // 参照データ変数名 (例: "CB_MARKET_CHART_DATA")
  excerpt: string;    // 根拠要約テキスト
}

/** S1: レーダーチャート用スコア軸 */
export interface ScoreAxis {
  axis: string;          // 評価軸ラベル（日本語）
  axisEn: string;        // 英語ラベル（チャート表示用）
  score: number;         // 0–5
  rationale: string;     // 根拠テキスト
  dataSource: ScoreDataSource;
}

/** 競争環境: 競合プロフィール */
export type CompetitorType = "Multinational" | "Chinese" | "Local";
export type MarketPosition = "Strong" | "Moderate" | "Niche";
export type PriceRange = "Premium" | "Mid" | "Economy";
export type StrengthLevel = "High" | "Medium" | "Low";

export interface CompetitorProfile {
  name: string;
  type: CompetitorType;
  marketPosition: MarketPosition;
  priceRange: PriceRange;
  productFocus: string[];
  distributionStrength: StrengthLevel;
  avlPresence: boolean;
  notes: string;
}

/** S2: SWOT 各アイテム */
export interface SwotItem {
  text: string;
}

export interface SwotData {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

/** S3: 製品別参入優先度 */
export type EntryDifficulty = "Low" | "Medium" | "High";
export type MarketDemand = "Low" | "Medium" | "High";
export type EntryPriority = 1 | 2 | 3; // 1=最優先, 2=第2段階, 3=第3段階

export interface ProductPriority {
  product: string;
  cbAcceptance: "Full" | "Partial";
  difficulty: EntryDifficulty;
  demand: MarketDemand;
  demandNote: string;
  priority: EntryPriority;
  rationale: string;
}

/** S4: 参入ロードマップ */
export interface RoadmapTask {
  text: string;
}

export interface RoadmapPhase {
  phase: number;
  label: string;        // "Phase 1"
  period: string;       // "0–6ヶ月"
  title: string;        // "市場準備"
  tasks: RoadmapTask[];
}

/** S5: リスクと対策 */
export type RiskImpact = "High" | "Medium" | "Low";

export interface RiskItem {
  risk: string;
  impact: RiskImpact;
  mitigation: string;
}

/** S6: 次のアクション */
export interface NextAction {
  text: string;
  owner?: string;       // 担当部門ヒント (任意)
}
