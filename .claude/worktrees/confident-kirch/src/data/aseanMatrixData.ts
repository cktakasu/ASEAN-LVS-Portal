/**
 * ASEAN トップページ マトリクスデータ
 * - 参入優先度マトリクス（10カ国 × 5軸）
 * - 需要ドライバー比較（10カ国 × 5セクター）
 * - 製品カテゴリ定義（5製品）
 */

/* ------------------------------------------------------------------ */
/*  参入優先度マトリクス                                                */
/*  スコア: 1=最低 〜 5=最優先                                         */
/* ------------------------------------------------------------------ */

export const ENTRY_PRIORITY_AXES = [
  "市場規模",
  "成長率",
  "認証容易さ",
  "日系プレゼンス",
  "インフラ投資",
] as const;

export interface EntryPriorityRow {
  iso3: string;
  nameJa: string;
  /** [市場規模, 成長率, 認証容易さ, 日系プレゼンス, インフラ投資] */
  scores: [number, number, number, number, number];
  total: number;
}

export const ENTRY_PRIORITY_DATA: EntryPriorityRow[] = [
  { iso3: "IDN", nameJa: "インドネシア", scores: [5, 4, 2, 4, 5], total: 20 },
  { iso3: "VNM", nameJa: "ベトナム",     scores: [3, 5, 3, 4, 4], total: 19 },
  { iso3: "MYS", nameJa: "マレーシア",   scores: [3, 3, 4, 4, 4], total: 18 },
  { iso3: "THA", nameJa: "タイ",         scores: [4, 2, 4, 5, 3], total: 18 },
  { iso3: "PHL", nameJa: "フィリピン",   scores: [3, 4, 3, 3, 3], total: 16 },
  { iso3: "SGP", nameJa: "シンガポール", scores: [2, 2, 5, 3, 2], total: 14 },
  { iso3: "KHM", nameJa: "カンボジア",   scores: [1, 4, 4, 2, 3], total: 14 },
  { iso3: "LAO", nameJa: "ラオス",       scores: [1, 3, 3, 1, 2], total: 10 },
  { iso3: "BRN", nameJa: "ブルネイ",     scores: [1, 2, 3, 2, 2], total: 10 },
  { iso3: "MMR", nameJa: "ミャンマー",   scores: [1, 1, 2, 1, 2], total:  7 },
];

/* ------------------------------------------------------------------ */
/*  需要ドライバー比較                                                  */
/*  強度: 1=軽微 〜 5=主要需要                                        */
/* ------------------------------------------------------------------ */

export const DEMAND_SECTORS = [
  "住宅建設",
  "データセンター",
  "製造業",
  "インフラ整備",
  "商業施設",
] as const;

export interface DemandDriverRow {
  iso3: string;
  nameJa: string;
  /** [住宅建設, データセンター, 製造業, インフラ整備, 商業施設] */
  scores: [number, number, number, number, number];
}

export const DEMAND_DRIVER_DATA: DemandDriverRow[] = [
  { iso3: "IDN", nameJa: "インドネシア", scores: [5, 3, 4, 5, 4] },
  { iso3: "MYS", nameJa: "マレーシア",   scores: [3, 5, 4, 3, 4] },
  { iso3: "THA", nameJa: "タイ",         scores: [3, 3, 5, 3, 4] },
  { iso3: "VNM", nameJa: "ベトナム",     scores: [4, 4, 5, 4, 3] },
  { iso3: "PHL", nameJa: "フィリピン",   scores: [5, 3, 3, 4, 4] },
  { iso3: "SGP", nameJa: "シンガポール", scores: [2, 5, 3, 2, 4] },
  { iso3: "KHM", nameJa: "カンボジア",   scores: [4, 2, 4, 3, 3] },
  { iso3: "MMR", nameJa: "ミャンマー",   scores: [3, 1, 2, 3, 2] },
  { iso3: "LAO", nameJa: "ラオス",       scores: [2, 1, 2, 4, 2] },
  { iso3: "BRN", nameJa: "ブルネイ",     scores: [2, 2, 2, 2, 3] },
];

/* ------------------------------------------------------------------ */
/*  製品カテゴリ定義                                                    */
/* ------------------------------------------------------------------ */

export interface ProductDefRow {
  code: string;
  nameJa: string;
  nameEn: string;
  usageJa: string;
  currentRange: string;
  standard: string;
}

export const PRODUCT_DEF_ROWS: ProductDefRow[] = [
  {
    code: "ACB",
    nameJa: "気中遮断器",
    nameEn: "Air Circuit Breaker",
    usageJa: "大型変電設備・工場幹線",
    currentRange: "630A〜6,300A",
    standard: "IEC 60947-2",
  },
  {
    code: "MCCB",
    nameJa: "配線用遮断器",
    nameEn: "Molded Case Circuit Breaker",
    usageJa: "工場・ビル分電設備",
    currentRange: "32A〜1,600A",
    standard: "IEC 60947-2",
  },
  {
    code: "MCB",
    nameJa: "小型遮断器",
    nameEn: "Miniature Circuit Breaker",
    usageJa: "住宅・小型商業施設",
    currentRange: "〜125A",
    standard: "IEC 60898-1",
  },
  {
    code: "RCCB",
    nameJa: "漏電遮断器",
    nameEn: "Residual Current Circuit Breaker",
    usageJa: "住宅接地漏電保護",
    currentRange: "〜125A（一般63A）",
    standard: "IEC 61008-1",
  },
  {
    code: "RCBO",
    nameJa: "漏電・過電流遮断器",
    nameEn: "Residual Current Breaker with Overcurrent",
    usageJa: "住宅・商業複合保護",
    currentRange: "〜125A（一般63A）",
    standard: "IEC 61009-1",
  },
];
