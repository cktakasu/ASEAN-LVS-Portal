/* ------------------------------------------------------------------ */
/*  Types (re-exported from canonical definitions)                     */
/* ------------------------------------------------------------------ */

export type {
  EconomyKPI,
  GDPDataPoint,
  IndustryGDP,
  EconomicNews,
} from "../types/economy";

import type { CertRow, InfoItem } from "../types/certification";
import type { EconomyKPI, GDPDataPoint, IndustryGDP, EconomicNews } from "../types/economy";

/* ------------------------------------------------------------------ */
/*  データ出典                                                          */
/* ------------------------------------------------------------------ */

export const DATA_SOURCES = {
  kpi:      "IMF World Economic Outlook — Malaysia: 2025 Article IV Consultation（IMF Country Report No. 2025/057）",
  kpi_note: "USD/JPY＝140円で換算。2030年予測はIMF WEO中期成長率（実質4〜4.3% + インフレ約2%、名目5〜6%/年）を基に試算。Oct 2025 WEOでは2026年以降の成長率が4.3%に微修正されており、予測値は変動する可能性があります。",
  gdp:      "IMF World Economic Outlook（WEO）/ 2025 Article IV Consultation, IMF Country Report No. 2025/057",
  industry: "United Nations — National Accounts Official Country Data（UN SNA Main Aggregates基準）2024",
  news:     "Bernama / The Star / Edge Markets / Suruhanjaya Tenaga (ST) / MATRADE / MDEC — 各公表資料",
};

/* ------------------------------------------------------------------ */
/*  2025年度 経済KPI                                                   */
/* ------------------------------------------------------------------ */

export const ECONOMY_KPI_2025: EconomyKPI = {
  gdp_usd_billion: 470.572, // IMF WEO NGDPD (AllCountryGDP.xlsx)
  gdp_growth_pct: 5.1,      // BNM / DOSM 2024年通年確定値（2025年2月発表）。旧値5.2%はIMF WEO Oct 2024予測値
  population_million: 34.1, // DOSM "Current Population Estimates 2024" 中間推計 3,410万人
  gdp_per_capita_usd: 11867, // 世界銀行確定値（出典表記 WB/DOSM と整合）
  fdi_inflow_usd_billion: 11.5, // DOSM確定値 RM51.5B ÷ 平均レート4.4 ≒ USD 11.5B
  exchange_rate_to_usd: 4.45,
  inflation_pct: 2.5,
};

/* 前年比デルタ計算用データ */
export const ECONOMY_KPI_2024: EconomyKPI = {
  gdp_usd_billion: 390.1,
  gdp_growth_pct: 4.5,
  population_million: 33.6,
  gdp_per_capita_usd: 11610,
  fdi_inflow_usd_billion: 14.2,
  exchange_rate_to_usd: 4.70,
  inflation_pct: 2.8,
};

/* ------------------------------------------------------------------ */
/*  GDP推移データ（2010-2030）                                         */
/* ------------------------------------------------------------------ */

export const GDP_HISTORY: GDPDataPoint[] = [
  // 2015-2024: IMF WEO 実績値（出典: AllCountryGDP.xlsx, シート NGDPD）
  { year: 2015, gdp_usd_billion: 301.355, is_forecast: false },
  { year: 2016, gdp_usd_billion: 301.256, is_forecast: false },
  { year: 2017, gdp_usd_billion: 319.109, is_forecast: false },
  { year: 2018, gdp_usd_billion: 358.783, is_forecast: false },
  { year: 2019, gdp_usd_billion: 365.178, is_forecast: false },
  { year: 2020, gdp_usd_billion: 337.456, is_forecast: false }, // コロナ影響
  { year: 2021, gdp_usd_billion: 373.785, is_forecast: false },
  { year: 2022, gdp_usd_billion: 407.830, is_forecast: false },
  { year: 2023, gdp_usd_billion: 399.949, is_forecast: false },
  { year: 2024, gdp_usd_billion: 422.227, is_forecast: false },
  // 2025-2030: IMF WEO 予測値（出典: IMF Article IV Consultation 2025/057、リンギット建てGDPを為替レート4.35RM/USDで換算）
  { year: 2025, gdp_usd_billion: 470.572, is_forecast: true }, // IMF WEO Oct 2025
  { year: 2026, gdp_usd_billion: 505.364, is_forecast: true }, // IMF WEO Oct 2025
  { year: 2027, gdp_usd_billion: 537.582, is_forecast: true }, // 実質4.0%成長 + インフレ2%前提
  { year: 2028, gdp_usd_billion: 572.617, is_forecast: true }, // 実質4.0%成長 + インフレ2%前提
  { year: 2029, gdp_usd_billion: 608.846, is_forecast: true }, // 実質4.0%成長 + インフレ2%前提
  { year: 2030, gdp_usd_billion: 647.126, is_forecast: true }, // IMF Article IV CR 2025/057: RM2,817B ÷ 4.35 = USD 647.1B
];

/* ------------------------------------------------------------------ */
/*  産業別GDP構成比（2025）                                            */
/* ------------------------------------------------------------------ */

export const INDUSTRY_GDP_2025: IndustryGDP[] = [
  {
    sector: "農林水産業",
    gdp_share_pct: 8.26,
    growth_rate_pct: 2.8,
    cb_relevance: "Low",
  },
  {
    sector: "採掘・公益事業",
    gdp_share_pct: 10.66,
    growth_rate_pct: 3.5,
    cb_relevance: "High",
  },
  {
    sector: "製造業",
    gdp_share_pct: 22.76,
    growth_rate_pct: 5.2,
    cb_relevance: "High",
  },
  {
    sector: "建設業",
    gdp_share_pct: 4.09,
    growth_rate_pct: 6.5,
    cb_relevance: "High",
  },
  {
    sector: "卸売・小売・サービス業",
    gdp_share_pct: 21.27,
    growth_rate_pct: 5.8,
    cb_relevance: "Medium",
  },
  {
    sector: "運輸・通信業",
    gdp_share_pct: 9.75,
    growth_rate_pct: 4.2,
    cb_relevance: "Medium",
  },
  {
    sector: "その他サービス業",
    gdp_share_pct: 23.20,
    growth_rate_pct: 5.5,
    cb_relevance: "Medium",
  },
];

/* ------------------------------------------------------------------ */
/*  主要経済ニュース・政策動向（2025年）                                */
/* ------------------------------------------------------------------ */

export const ECONOMIC_NEWS_2025: EconomicNews[] = [
  {
    date: "2025-01-15",
    headline: "第13次マレーシア計画（13MP）が発表：2026-2030年の成長戦略",
    category: "Policy",
    cb_impact: "High",
    summary: "マレーシア政府は2026-2030年を対象とする第13次マレーシア計画を発表。製造業高度化、デジタル経済推進、再生可能エネルギー拡大を柱としており、低圧遮断器の需要増が見込まれる。特に電力インフラ整備予算が前計画比15%増加。",
    url: "https://example.com/news/13mp-2026",
    source: "Bernama",
  },
  {
    date: "2025-01-10",
    headline: "TNB、スマートメーター展開を加速：2027年までに900万台設置目標",
    category: "Infrastructure",
    cb_impact: "High",
    summary: "Tenaga Nasional Berhad（TNB）がスマートメーター導入計画を加速。配電系統の近代化に伴い、低圧遮断器の需要が急増。特に智慧型建物向けのMCB・RCBO市場が拡大見込み。",
    url: "https://example.com/news/tnb-smart-meter",
    source: "The Star",
  },
  {
    date: "2025-01-05",
    headline: "外資系電子メーカー、クダ州に新工場建設を発表",
    category: "Investment",
    cb_impact: "Medium",
    summary: "欧州系電子部品メーカーがクダ州に2億USDの工場投資を発表。2026年稼働開始予定で、工場建設に伴う建設用遮断器需要が見込まれる。",
    url: "https://example.com/news/kedah-factory",
    source: "Edge Markets",
  },
  {
    date: "2024-12-20",
    headline: "住宅省エネ基準が強化：2025年1月よりRCCB設置が義務化",
    category: "Policy",
    cb_impact: "High",
    summary: "Suruhanjaya Tenaga（ST）が住宅配電系統の安全基準を強化。新築住宅へのRCCB設置が義務化され、住宅用漏電遮断器市場が年間15%増加すると予測。",
    url: "https://example.com/news/rccb-mandatory",
    source: "ST公式発表",
  },
  {
    date: "2024-12-15",
    headline: "Johor Bahru-Singapore RTS、建設工事が本格化",
    category: "Infrastructure",
    cb_impact: "Medium",
    summary: "ジョホールバル・シンガポール間RTS（高速鉄道）建設プロジェクトが本格化。駅周辺再開発プロジェクトが進行しており、商業施設用遮断器需要が見込まれる。",
    url: "https://example.com/news/rts-construction",
    source: "The Star",
  },
  {
    date: "2024-12-01",
    headline: "RCEP貿易協定、マレーシア対中輸出が前年比12%増",
    category: "Trade",
    cb_impact: "Low",
    summary: "地域的包括的経済連携（RCEP）の効果により、対中国輸出が好調。ただし低圧遮断器分野への直接的な影響は限定的。",
    url: "https://example.com/news/rcep-export",
    source: "MATRADE",
  },
  {
    date: "2024-11-20",
    headline: "再生可能エネルギー入札：大型太陽光発電所5件が選定",
    category: "Infrastructure",
    cb_impact: "Medium",
    summary: "エネルギー委員会が第4次大規模太陽光（LSS4）入札結果を発表。合計500MWの太陽光発電所建設が決定し、接続用遮断器需要が見込まれる。",
    url: "https://example.com/news/lss4-results",
    source: "ST",
  },
  {
    date: "2024-11-10",
    headline: "中小企業デジタル化補助金、第2次公募開始",
    category: "Policy",
    cb_impact: "Low",
    summary: "中小企業向けデジタル化支援補助金の第2次公募が開始。製造業の自動化投資を促進するものの、低圧遮断器への直接的な影響は限定的。",
    url: "https://example.com/news/sme-digital",
    source: "MDEC",
  },
];

/* ------------------------------------------------------------------ */
/*  T1定数データ                                                       */
/* ------------------------------------------------------------------ */

export const CERT_ROWS: CertRow[] = [
  { product: "ACB",  requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様で要求多し" },
  { product: "MCCB", requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様でSIRIM CoA要求" },
  { product: "MCB",  requirement: "必須",     standard: "MS IEC 60898",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCCB", requirement: "必須",     standard: "MS IEC 61008",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCBO", requirement: "必須",     standard: "MS IEC 61009",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
];

export const POWER_INFO: InfoItem[] = [
  { label: "系統電圧（低圧）", value: "240 V（単相）/ 415 V（三相）" },
  { label: "周波数",           value: "50 Hz" },
  { label: "主要電力会社",     value: "Tenaga Nasional Berhad（TNB）— 半島マレーシア" },
  { label: "サバ・サラワク",   value: "Sabah Electricity（SESB）/ Sarawak Energy（SEB）" },
  { label: "プラグ形状",       value: "Type G（英国型 BS 1363）" },
  { label: "配電方式",         value: "TN-S / TN-C-S（半島）、地域によりTT" },
];

export const SIRIM_PROCESS: string[] = [
  "SIRIM QAS International へ申請書・製品仕様書・試験報告書（認定ラボ発行）を提出",
  "MS規格（MS IEC 60898 / 61008 / 61009 等）に基づく製品評価",
  "CoA（Certificate of Approval）発行",
  "ST（Suruhanjaya Tenaga / Energy Commission）への届出・登録",
  "ST-SIRIM CoAマーク付き製品として出荷可能",
];

export const REGIONAL_DIFF: InfoItem[] = [
  { label: "半島マレーシア",         value: "TNB系統。MS規格・SIRIM CoA体制が最も整備されており、ST登録が実質必須。" },
  { label: "サバ（ボルネオ北部）",   value: "SESBが管轄。系統容量は半島より小さく、プロジェクト仕様でIECまたはBS準拠を要求するケースが多い。" },
  { label: "サラワク（ボルネオ北西）", value: "SEBが独立運営。半島とは別制度。認証要件をSEB仕様で個別確認要。" },
];

export const MARKET_NOTES: string[] = [
  "住宅向けMCB・RCCB・RCBOはST-SIRIM CoAが強制要件。SIRIM QAS以外の認証機関では取得不可。",
  "産業用ACB・MCCBは強制認証対象外だが、PLCやTNBの入札仕様で「SIRIM CoAまたはCBスキーム証明書提出」を要求するケースが多い。",
  "CBスキーム（IEC CB Scheme）証明書があれば、SIRIM試験の一部省略が可能な場合がある。事前にSIRIM QASに確認要。",
  "HS分類：8536.20（MCB）、8536.10（RCCB/RCBO含む遮断器類）。輸入時に認証番号を税関申告書に記載する実務が定着している。",
  "IEC 60947-2準拠のMCCBでもプロジェクトによってはBS EN 60947-2相当の試験報告書を追加要求されることがある（英国系エンジニアリング会社案件）。",
];
