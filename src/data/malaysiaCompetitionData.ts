/* ------------------------------------------------------------------ */
/*  Malaysia — Competition Landscape Data                              */
/*  ※ 市場シェアは公開情報から推定。実態調査での更新を推奨。           */
/* ------------------------------------------------------------------ */

import type { CompetitorProfile } from "../types/strategy";

export const MY_COMPETITORS: CompetitorProfile[] = [
  {
    name: "Schneider Electric",
    type: "Multinational",
    marketPosition: "Strong",
    priceRange: "Premium",
    productFocus: ["MCB", "MCCB", "RCCB", "RCBO", "ACB"],
    distributionStrength: "High",
    avlPresence: true,
    notes: "市場最大手。EasyPact/PowerPactシリーズで全製品カテゴリをカバー。全国代理店網が充実しており、AVL登録実績も豊富。",
  },
  {
    name: "ABB",
    type: "Multinational",
    marketPosition: "Strong",
    priceRange: "Premium",
    productFocus: ["MCB", "MCCB", "ACB"],
    distributionStrength: "High",
    avlPresence: true,
    notes: "System Pro M / SACE シリーズ。産業・インフラ・データセンター案件に強み。SchneiderとともにAVLのデファクトスタンダード。",
  },
  {
    name: "Siemens",
    type: "Multinational",
    marketPosition: "Moderate",
    priceRange: "Premium",
    productFocus: ["MCB", "MCCB", "ACB"],
    distributionStrength: "Medium",
    avlPresence: true,
    notes: "3RV/3VAシリーズ。製造業セグメントに強みを持つが、ABB・Schneiderと比べるとプレゼンスはやや低い。",
  },
  {
    name: "Chint",
    type: "Chinese",
    marketPosition: "Moderate",
    priceRange: "Economy",
    productFocus: ["MCB", "RCCB", "MCCB"],
    distributionStrength: "Medium",
    avlPresence: false,
    notes: "住宅・小規模商業向けで低価格攻勢。Multinationalブランドの40〜60%程度の価格帯。住宅建設ブームで存在感を増している。",
  },
  {
    name: "Delixi",
    type: "Chinese",
    marketPosition: "Niche",
    priceRange: "Economy",
    productFocus: ["MCB", "RCCB"],
    distributionStrength: "Low",
    avlPresence: false,
    notes: "Chintと同様の低価格ポジション。住宅向け小売チャネルで一定の流通量あり。プロジェクト案件への参入は限定的。",
  },
];

export const COMPETITION_DATA_NOTE =
  "※ 市場ポジション・流通力は公開情報および業界一般知識に基づく推定値です。正確な市場シェアデータは別途調査が必要です。";
