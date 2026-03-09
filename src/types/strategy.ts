/* ------------------------------------------------------------------ */
/*  Strategic Assessment — Type Definitions                            */
/* ------------------------------------------------------------------ */

/** S1: レーダーチャート用スコア軸 */
export interface ScoreAxis {
  axis: string;          // 評価軸ラベル（日本語）
  axisEn: string;        // 英語ラベル（チャート表示用）
  score: number;         // 0–5
  rationale: string;     // 根拠テキスト
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
