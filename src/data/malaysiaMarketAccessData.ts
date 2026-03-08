/* ------------------------------------------------------------------ */
/*  Market Access — Malaysia Data                                      */
/* ------------------------------------------------------------------ */

import type {
  TariffRow,
  ImportStep,
  ImportCostComponent,
  DistributionChannel,
  MarketPlayer,
  ProcurementStage,
  ProcurementTypeComparison,
  AVLInfo,
  MarketBarrier,
  MarketFacilitator,
  MarketAccessDataSources,
} from "../types/marketAccess";

/* ================================================================== */
/*  4-1: Tariff Data                                                   */
/* ================================================================== */

export const MY_TARIFF_DATA: TariffRow[] = [
  {
    product_type: "ACB",
    hs_code: "8536.20.19",
    hs_description: "自動遮断器（定格電圧1,000V以下、1,000A超）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "※暫定値 — JKDM Advance Ruling推奨",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
  {
    product_type: "MCCB",
    product_label: "MCCB (630A超〜1600A)",
    hs_code: "8536.20.19",
    hs_description: "自動遮断器（定格電圧1,000V以下、630A超）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "ACBと同HSコード。ST-SIRIM緩和傾向 ※暫定値",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
  {
    product_type: "MCCB",
    product_label: "MCCB (630A以下)",
    hs_code: "8536.20.11",
    hs_description: "自動遮断器（定格電圧1,000V以下、630A以下）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "※暫定値 — JKDM Advance Ruling推奨",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
  {
    product_type: "MCB",
    hs_code: "8536.20.11",
    hs_description: "自動遮断器（定格電圧1,000V以下、125A以下）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "ST-SIRIM CoA必須 ※暫定値",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
  {
    product_type: "RCCB",
    hs_code: "8536.30.10",
    hs_description: "漏電遮断器（定格電圧1,000V以下）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "ST-SIRIM CoA必須 ※暫定値",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
  {
    product_type: "RCBO",
    hs_code: "8536.30.10",
    hs_description: "過電流保護付漏電遮断器（定格電圧1,000V以下）",
    mfn_rate_pct: 15,
    atiga_rate_pct: 0,
    jmepa_rate_pct: 0,
    rcep_rate_pct: 5,
    notes: "ST-SIRIM CoA必須 ※暫定値",
    source: "JKDM PDK 2025; AHTN 2022; Trademo関税DB",
  },
];

/* ================================================================== */
/*  4-1: Import Process Steps                                          */
/* ================================================================== */

export const MY_IMPORT_STEPS: ImportStep[] = [
  {
    step_number: 1,
    step_title: "事前認証取得",
    step_title_en: "Obtain Pre-Certification",
    responsible_party: "メーカー / 輸出者",
    key_actions: [
      "ST-SIRIM CoA取得（MCB/RCCB/RCBOは必須）",
      "SIRIM CoA取得（ACB/MCCBは推奨）",
      "CB証書の準備（あれば）",
    ],
    required_documents: ["CB Test Report", "製品技術資料", "工場検査報告書"],
    typical_duration: "3-8週間（製品による）",
    notes: "※暫定 — T3認証情報と連動",
  },
  {
    step_number: 2,
    step_title: "輸出入許可・申告準備",
    step_title_en: "Prepare Import Declaration",
    responsible_party: "輸入者 / カスタムブローカー",
    key_actions: [
      "輸入ライセンス確認",
      "通関申告書類（K1/K2フォーム）作成",
      "HS コード分類確認",
    ],
    required_documents: ["Commercial Invoice", "Packing List", "B/L or AWB", "CoA証明書"],
    typical_duration: "2-3営業日",
    notes: "※暫定",
  },
  {
    step_number: 3,
    step_title: "税関申告・検査",
    step_title_en: "Customs Declaration & Inspection",
    responsible_party: "Royal Malaysian Customs (KDRM)",
    key_actions: [
      "uCustoms電子申告",
      "関税・SST（Sales and Service Tax）計算",
      "物理検査（リスクベース）",
    ],
    required_documents: ["K1 Import Declaration", "CoA certificates"],
    typical_duration: "1-3営業日",
    notes: "※暫定",
  },
  {
    step_number: 4,
    step_title: "通関・国内配送",
    step_title_en: "Clearance & Domestic Distribution",
    responsible_party: "輸入者 / 物流会社",
    key_actions: [
      "関税・SST支払い",
      "貨物引取り",
      "倉庫入庫 / 直送",
    ],
    typical_duration: "1-2営業日",
    notes: "※暫定",
  },
];

/* ================================================================== */
/*  4-1: Import Cost Components                                        */
/* ================================================================== */

export const MY_IMPORT_COSTS: ImportCostComponent[] = [
  {
    cost_item: "関税（MFN）",
    rate_or_amount: "15%",
    basis: "CIF価格",
    notes: "ATIGA適用時は0%",
    source: "KDRM (TBC)",
  },
  {
    cost_item: "SST (Sales Tax)",
    rate_or_amount: "10%",
    basis: "CIF + 関税",
    notes: "電気機器標準税率",
    source: "KDRM (TBC)",
  },
  {
    cost_item: "通関手数料",
    rate_or_amount: "RM 50-200/件",
    basis: "申告件数",
    notes: "ブローカー手数料別途",
    source: "業界ヒアリング (TBC)",
  },
  {
    cost_item: "SIRIM検査費用",
    rate_or_amount: "RM 2,000-10,000",
    basis: "製品カテゴリー別",
    notes: "初回認証時のみ",
    source: "SIRIM QAS (TBC)",
  },
];

/* ================================================================== */
/*  4-2: Distribution Channels                                         */
/* ================================================================== */

export const MY_DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  {
    channel_type: "National Distributor",
    channel_name_ja: "国内総代理店",
    description: "ブランドの国内独占/準独占代理店。在庫・技術サポート・価格設定を管理",
    target_customers: "パネルビルダー、地域代理店、大規模エンドユーザー",
    typical_margin_pct: "15-25%",
    volume_share_pct: "~40%",
    strengths: ["広いネットワーク", "在庫保有", "技術サポート"],
    weaknesses: ["マージン上乗せ", "ブランド戦略への影響力"],
    representative_players: ["TBD — 要調査"],
    notes: "※暫定データ",
  },
  {
    channel_type: "Panel Builder",
    channel_name_ja: "パネルビルダー",
    description: "配電盤を組立製造。LV機器の最大の直接ユーザー。メーカーから直接購入or代理店経由",
    target_customers: "工事会社、ディベロッパー、エンドユーザー",
    typical_margin_pct: "20-35%（盤込み）",
    volume_share_pct: "~30%",
    strengths: ["技術的影響力", "仕様提案力", "直接需要"],
    weaknesses: ["価格感度高い", "複数ブランド使い分け"],
    representative_players: ["TBD — 要調査"],
    notes: "※暫定データ",
  },
  {
    channel_type: "Regional Distributor",
    channel_name_ja: "地域代理店",
    description: "特定地域・州をカバーする中小代理店。地場の工事会社・小規模PBにサービス提供",
    target_customers: "地場工事会社、中小パネルビルダー、小売店",
    typical_margin_pct: "10-20%",
    volume_share_pct: "~15%",
    strengths: ["地域密着", "小口対応"],
    weaknesses: ["在庫薄い", "技術力限定的"],
    representative_players: ["TBD — 要調査"],
    notes: "※暫定データ",
  },
  {
    channel_type: "Direct",
    channel_name_ja: "メーカー直販",
    description: "大型プロジェクト・OEM向けにメーカーが直接販売。現地法人or海外営業拠点経由",
    target_customers: "大規模EPC、ユーティリティ、OEM",
    typical_margin_pct: "—",
    volume_share_pct: "~10%",
    strengths: ["マージン最大化", "技術サポート直接提供"],
    weaknesses: ["リソース集約的", "小口不向き"],
    representative_players: ["Schneider Electric MY", "ABB MY", "Siemens MY"],
    notes: "※暫定データ — 外資大手のみ直販体制あり",
  },
  {
    channel_type: "E-Commerce",
    channel_name_ja: "Eコマース",
    description: "Shopee/Lazada等のオンラインマーケットプレイス。MCB/RCCBなど小型品中心",
    target_customers: "小規模工事会社、DIYユーザー、電気店",
    typical_margin_pct: "5-15%",
    volume_share_pct: "~5%",
    strengths: ["広いリーチ", "価格透明性"],
    weaknesses: ["技術サポートなし", "偽造品リスク"],
    representative_players: ["Shopee", "Lazada"],
    notes: "※暫定データ — 成長チャネルだが金額ベースでは小さい",
  },
];

/* ================================================================== */
/*  4-2: Key Market Players                                            */
/* ================================================================== */

export const MY_MARKET_PLAYERS: MarketPlayer[] = [
  {
    company_name: "TBD — 主要ディストリビューター A",
    company_type: "Distributor",
    brands_carried: ["TBD"],
    coverage: "Peninsular Malaysia",
    estimated_scale: "Large",
    notes: "※要調査 — プレースホルダー",
    source: "業界ヒアリング (TBC)",
  },
  {
    company_name: "TBD — 主要パネルビルダー A",
    company_type: "Panel Builder",
    brands_carried: ["TBD"],
    coverage: "Selangor / KL",
    specialization: "産業用MCC・配電盤",
    estimated_scale: "Large",
    notes: "※要調査 — プレースホルダー",
    source: "業界ヒアリング (TBC)",
  },
];

/* ================================================================== */
/*  4-3: Procurement Stages                                            */
/* ================================================================== */

export const MY_PROCUREMENT_STAGES: ProcurementStage[] = [
  {
    stage_number: 1,
    stage_name: "基本設計・仕様策定",
    stage_name_en: "Basic Design & Specification",
    key_actors: ["M&Eコンサルタント", "建築設計事務所"],
    decision_influence: "High",
    description: "M&Eコンサルタントが電気設計を行い、LV機器の仕様（定格・規格・ブランド指定の有無）を決定",
    lv_touchpoint: "ブランド指定 or 'or equivalent' 仕様がここで決まる。コンサルタントへの技術提案が重要",
    notes: "※暫定",
  },
  {
    stage_number: 2,
    stage_name: "入札・見積",
    stage_name_en: "Tendering & Quotation",
    key_actors: ["工事会社（Main Con）", "電気サブコン"],
    decision_influence: "Medium",
    description: "工事会社がM&E仕様書に基づき、パネルビルダーやディストリビューターから見積を取得",
    lv_touchpoint: "価格競争力と納期が重要。パネルビルダーが代替品を提案することがある",
    notes: "※暫定",
  },
  {
    stage_number: 3,
    stage_name: "パネルビルダー選定・発注",
    stage_name_en: "Panel Builder Selection & Order",
    key_actors: ["パネルビルダー", "工事会社"],
    decision_influence: "Medium",
    description: "パネルビルダーがLV機器を選定・調達し、配電盤を設計・製造",
    lv_touchpoint: "パネルビルダーの既存取引関係・在庫状況が最終ブランド選定に強く影響",
    notes: "※暫定",
  },
  {
    stage_number: 4,
    stage_name: "製造・検査・納入",
    stage_name_en: "Manufacturing, Testing & Delivery",
    key_actors: ["パネルビルダー", "M&Eコンサルタント"],
    decision_influence: "Low",
    description: "配電盤の組立・型式試験・現場据付",
    lv_touchpoint: "品質・納期が評価される。次回案件のリピートに影響",
    notes: "※暫定",
  },
];

/* ================================================================== */
/*  4-3: Government vs Private Procurement                             */
/* ================================================================== */

export const MY_PROCUREMENT_COMPARISON: ProcurementTypeComparison[] = [
  {
    dimension: "入札方式",
    government: "公開入札（ePerolehan）が原則。透明性要件あり",
    private_sector: "指名入札・随意契約が一般的。関係性重視",
    notes: "※暫定",
  },
  {
    dimension: "仕様決定者",
    government: "JKR（公共事業局）/ 政府指定M&Eコンサルタント",
    private_sector: "ディベロッパー指定のM&Eコンサルタント",
    notes: "※暫定",
  },
  {
    dimension: "ブランド要件",
    government: "AVL（Approved Vendor List）記載ブランドのみ",
    private_sector: "'or equivalent'条項が多い。ただしディベロッパーAVLあり",
    notes: "※暫定",
  },
  {
    dimension: "Bumiputera要件",
    government: "Bumiputera企業優遇あり（加点 or 資格要件）",
    private_sector: "基本なし（ただし政府系ディベロッパーは例外）",
    notes: "※暫定",
  },
  {
    dimension: "決定までのリードタイム",
    government: "3-12ヶ月（予算・承認プロセス）",
    private_sector: "1-6ヶ月",
    notes: "※暫定",
  },
  {
    dimension: "支払条件",
    government: "進捗払い。遅延リスクあり",
    private_sector: "多様（前払い〜NET60日）",
    notes: "※暫定",
  },
];

/* ================================================================== */
/*  4-3: AVL Information                                               */
/* ================================================================== */

export const MY_AVL_INFO: AVLInfo[] = [
  {
    avl_owner_type: "Government",
    avl_owner_example: "JKR（公共事業局）",
    entry_requirements: [
      "SIRIM CoA（製品認証）",
      "現地代理店 or サービス体制",
      "過去の納入実績",
      "財務健全性証明",
    ],
    typical_brands_count: "3-5ブランド/カテゴリー",
    renewal_cycle: "年次レビュー",
    influence_level: "High",
    notes: "※暫定 — 政府案件では事実上必須",
    source: "JKR / 業界ヒアリング (TBC)",
  },
  {
    avl_owner_type: "Utility",
    avl_owner_example: "TNB（テナガ・ナショナル）",
    entry_requirements: [
      "ST-SIRIM CoA",
      "TNB独自試験合格",
      "品質管理体制の審査",
    ],
    typical_brands_count: "限定的（2-4ブランド）",
    renewal_cycle: "不定期",
    influence_level: "High",
    notes: "※暫定 — 電力インフラ案件で重要",
    source: "TNB / 業界ヒアリング (TBC)",
  },
  {
    avl_owner_type: "Developer",
    avl_owner_example: "大手ディベロッパー（SP Setia等）",
    entry_requirements: [
      "SIRIM CoA or 同等認証",
      "競争力ある価格",
      "安定供給実績",
    ],
    typical_brands_count: "3-6ブランド/カテゴリー",
    renewal_cycle: "プロジェクト単位",
    influence_level: "Medium",
    notes: "※暫定",
    source: "業界ヒアリング (TBC)",
  },
];

/* ================================================================== */
/*  4-4: Market Barriers                                               */
/* ================================================================== */

export const MY_MARKET_BARRIERS: MarketBarrier[] = [
  {
    barrier_id: "B01",
    category: "Regulatory",
    barrier_name: "SIRIM / ST認証要件",
    barrier_name_en: "SIRIM / ST Certification Requirements",
    severity: "High",
    description: "MCB・RCCB・RCBOはST-SIRIM CoAが法的に必須。ACB・MCCBも入札参加に事実上必要。取得に3-8週間+費用",
    affected_products: "All",
    mitigation_hint: "CB証書活用で期間短縮可能（T3参照）",
    source: "SIRIM QAS; ST",
  },
  {
    barrier_id: "B02",
    category: "Distribution",
    barrier_name: "既存代理店ネットワークの寡占",
    barrier_name_en: "Established Distributor Networks",
    severity: "High",
    description: "主要ディストリビューターが欧州大手ブランドと長期独占契約。新規ブランドの棚取りが困難",
    affected_products: "All",
    mitigation_hint: "パネルビルダー直接アプローチが代替経路",
    source: "業界ヒアリング (TBC)",
  },
  {
    barrier_id: "B03",
    category: "Specification",
    barrier_name: "M&Eコンサルタントのブランド指定慣行",
    barrier_name_en: "M&E Consultant Brand Specification Practice",
    severity: "Medium",
    description: "M&Eコンサルタントが設計段階で特定ブランドを指定する慣行。'or equivalent'条項があっても実質的にブランド固定",
    affected_products: "All",
    mitigation_hint: "コンサルタントへの継続的技術情報提供が鍵",
    source: "業界ヒアリング (TBC)",
  },
  {
    barrier_id: "B04",
    category: "Local Content",
    barrier_name: "Bumiputera優遇政策",
    barrier_name_en: "Bumiputera Preference Policy",
    severity: "Medium",
    description: "政府調達ではBumiputera企業への加点/優遇があり、外資系直販にはハンディキャップ",
    affected_products: "All",
    mitigation_hint: "Bumi資本のパートナー起用で対応可能",
    source: "Government Procurement Guidelines (TBC)",
  },
  {
    barrier_id: "B05",
    category: "Commercial",
    barrier_name: "価格競争（中国製品）",
    barrier_name_en: "Price Competition from Chinese Products",
    severity: "Medium",
    description: "中国メーカー（Chint, Delixi等）が低価格で市場浸透。住宅・小規模商業セグメントで特に影響大",
    affected_products: ["MCB", "MCCB", "RCCB"],
    mitigation_hint: "品質・信頼性の差別化、産業用途への集中",
    source: "業界ヒアリング (TBC)",
  },
];

/* ================================================================== */
/*  4-4: Market Facilitators                                           */
/* ================================================================== */

export const MY_MARKET_FACILITATORS: MarketFacilitator[] = [
  {
    facilitator_id: "F01",
    category: "Trade Agreement",
    facilitator_name: "ATIGA（ASEAN物品貿易協定）",
    facilitator_name_en: "ATIGA (ASEAN Trade in Goods Agreement)",
    impact: "High",
    description: "ASEAN域内製造品は関税0%。タイ・ベトナム等の工場からの輸出にコスト優位性",
    relevant_products: "All",
    source: "ASEAN Secretariat",
  },
  {
    facilitator_id: "F02",
    category: "Trade Agreement",
    facilitator_name: "JMEPA（日・マレーシアEPA）",
    facilitator_name_en: "JMEPA (Japan-Malaysia EPA)",
    impact: "Medium",
    description: "日本からの直接輸出で優遇関税適用。原産地証明が必要",
    relevant_products: "All",
    source: "Ministry of Economy, Trade and Industry (TBC)",
  },
  {
    facilitator_id: "F03",
    category: "Regulatory Harmonization",
    facilitator_name: "ASEAN EE MRA",
    facilitator_name_en: "ASEAN EE Mutual Recognition Arrangement",
    impact: "Medium",
    description: "ASEAN域内での電気電子機器の試験報告書相互承認。認証取得コスト削減の可能性",
    relevant_products: "All",
    source: "ASEAN Secretariat; SIRIM QAS",
  },
  {
    facilitator_id: "F04",
    category: "Market Dynamics",
    facilitator_name: "急成長する需要セクター",
    facilitator_name_en: "Rapidly Growing Demand Sectors",
    impact: "High",
    description: "データセンター・半導体等の成長分野で新規需要創出。既存ブランド固定が弱い新興セグメント",
    relevant_products: "All",
    source: "T2セクター分析参照",
  },
  {
    facilitator_id: "F05",
    category: "Government Policy",
    facilitator_name: "NETR（国家エネルギー転換ロードマップ）",
    facilitator_name_en: "National Energy Transition Roadmap",
    impact: "Medium",
    description: "再エネ・EV・グリーンインフラ投資拡大により、新しいLV機器カテゴリーの需要創出",
    relevant_products: ["MCB", "MCCB", "RCCB", "RCBO"],
    source: "経済省 NETR 2023",
  },
];

/* ================================================================== */
/*  Data Sources                                                       */
/* ================================================================== */

export const MARKET_ACCESS_DATA_SOURCES: MarketAccessDataSources = {
  tariff: "JKDM PDK 2025; AHTN 2022分類; Trademo関税DB; ST/SIRIMガイドライン（2026年3月時点）",
  import_process: "KDRM; MITI; 業界ヒアリング (TBC)",
  distribution: "業界ヒアリング; 各社ウェブサイト (TBC)",
  procurement: "CIDB; JKR; 業界ヒアリング (TBC)",
  barriers: "SIRIM QAS; ST; 業界ヒアリング (TBC)",
};
