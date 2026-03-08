/* ------------------------------------------------------------------ */
/*  Regulatory Gateway — Malaysia Data                                 */
/* ------------------------------------------------------------------ */

import type {
  PowerSpecs,
  CBSchemeInfo,
  AseanEEMRA,
  CertBody,
  RegulatoryDataSources,
  ProductCertRequirement,
  CertTimelineComparison,
} from "../types/regulatory";

/* ------------------------------------------------------------------ */
/*  Power Specifications                                               */
/* ------------------------------------------------------------------ */

export const MY_POWER_SPECS: PowerSpecs = {
  voltage_lv: {
    single_phase: "240 V",
    three_phase: "415 V",
  },
  frequency: "50 Hz",
  plug_type: "Type G (BS 1363)",
  distribution_system: "TN-S / TN-C-S (Peninsular), varies by region",
  utility_companies: [
    {
      region: "Peninsular Malaysia",
      name: "Tenaga Nasional Berhad",
      abbreviation: "TNB",
      website: "https://www.tnb.com.my",
      notes: "Largest utility, covering ~80% of Malaysia",
    },
    {
      region: "Sabah",
      name: "Sabah Electricity Sdn Bhd",
      abbreviation: "SESB",
      website: "https://www.sesb.com.my",
      notes: "Sabah region only",
    },
    {
      region: "Sarawak",
      name: "Sarawak Energy Berhad",
      abbreviation: "SEB",
      website: "https://www.sarawakenergy.com.my",
      notes: "Independent system from Peninsular Malaysia",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  CB Scheme Compatibility                                            */
/* ------------------------------------------------------------------ */

export const MY_CB_SCHEME: CBSchemeInfo[] = [
  {
    product_category: "ACB",
    cb_acceptance: "Partial",
    national_differences: [
      "Climate conditions (tropical)",
      "Voltage rating (415V system)",
    ],
    time_savings_notes: "CB report can reduce testing time by ~30%",
    additional_requirements: [
      "National deviation review required",
      "SIRIM factory inspection still required",
    ],
  },
  {
    product_category: "MCCB",
    cb_acceptance: "Partial",
    national_differences: [
      "Terminal size requirements",
      "Temperature rise limits",
    ],
    time_savings_notes: "Approximately 2-3 weeks saved in certification process",
  },
  {
    product_category: "MCB",
    cb_acceptance: "Full",
    national_differences: [],
    time_savings_notes: "Full acceptance for MS IEC 60898 aligned products",
    additional_requirements: [],
  },
  {
    product_category: "RCCB",
    cb_acceptance: "Full",
    national_differences: [],
    time_savings_notes: "Full acceptance under IECEE CB Scheme",
  },
  {
    product_category: "RCBO",
    cb_acceptance: "Partial",
    national_differences: [
      "Overcurrent protection characteristics",
    ],
    time_savings_notes: "Partial testing reduction possible",
  },
];

/* ------------------------------------------------------------------ */
/*  ASEAN EE MRA                                                       */
/* ------------------------------------------------------------------ */

export const MY_ASEAN_EE_MRA: AseanEEMRA = {
  country: "Malaysia",
  mra_status: "Active",
  ee_mra_type: "Product Certification",
  accredited_labs: [
    {
      lab_name: "SIRIM QAS International",
      location: "Shah Alam, Selangor",
      accreditation_scope: ["Electrical Equipment", "LV Circuit Breakers"],
      contact: "info@sirimqas.com.my",
    },
    {
      lab_name: "LLenas Test House",
      location: "Klang, Selangor",
      accreditation_scope: ["Electrical Safety Testing"],
    },
  ],
  notes: "Malaysia is a signatory to ASEAN Electrical and Electronic Equipment Mutual Recognition Arrangement (EE MRA)",
};

/* ------------------------------------------------------------------ */
/*  Certification Bodies                                               */
/* ------------------------------------------------------------------ */

export const MY_CERT_BODIES: CertBody[] = [
  {
    name: "SIRIM QAS International Sdn Bhd",
    abbreviation: "SIRIM QAS",
    type: "National",
    scope: ["Product Certification", "Inspection", "Testing"],
    contact_info: {
      address: "Lot 6, Persiaran Dato' Menteri, Section 2, 40700 Shah Alam, Selangor",
      phone: "+60 3 5544 6000",
      email: "info@sirimqas.com.my",
      website: "https://www.sirimqas.com.my",
    },
    services: [
      "SIRIM Certification",
      "ST-SIRIM CoA",
      "IECEE CB Scheme Certification",
      "Factory Audit",
    ],
    notes: "Primary certification body for electrical equipment in Malaysia",
  },
  {
    name: "Suruhanjaya Tenaga",
    abbreviation: "ST / Energy Commission",
    type: "National",
    scope: ["Regulatory Approval", "Energy Commission Registration"],
    contact_info: {
      address: "Level 15, Menara TH, 20 Jalan Sultan Ismail, 50000 Kuala Lumpur",
      phone: "+60 3 2604 9000",
      email: "info@st.gov.my",
      website: "https://www.st.gov.my",
    },
    services: [
      "ST Certificate of Approval",
      "Energy Efficiency Regulations",
      "Installation Permit",
    ],
    notes: "Regulatory authority for energy matters in Malaysia",
  },
];

/* ------------------------------------------------------------------ */
/*  Product Certification Requirements (flattened)                     */
/* ------------------------------------------------------------------ */

export const MY_PRODUCT_CERT_REQUIREMENTS: ProductCertRequirement[] = [
  {
    product_type: "ACB",
    applicable_standard: "MS IEC 60947-2",
    requirement_level: "Voluntary",
    certification_mark: "SIRIM CoA（任意）",
    practical_necessity: "Recommended",
    key_notes: "ST-COA不要。ただし政府案件・大手PJ入札にはSIRIM CoA事実上必須",
  },
  {
    product_type: "MCCB",
    applicable_standard: "MS IEC 60947-2",
    requirement_level: "Voluntary",
    certification_mark: "SIRIM CoA（推奨）",
    practical_necessity: "Recommended",
    key_notes: "法的義務なし。プロジェクト入札・パネルビルダー取引にはCoA推奨",
  },
  {
    product_type: "MCB",
    applicable_standard: "MS IEC 60898",
    requirement_level: "Mandatory",
    certification_mark: "ST-SIRIM CoA",
    practical_necessity: "Required",
    key_notes: "住宅用途では認証必須。ST-SIRIM CoAマーク無しでは販売不可",
  },
  {
    product_type: "RCCB",
    applicable_standard: "MS IEC 61008",
    requirement_level: "Mandatory",
    certification_mark: "ST-SIRIM CoA",
    practical_necessity: "Required",
    key_notes: "漏電遮断器は認証必須。国内市場での販売にST-SIRIM CoA必要",
  },
  {
    product_type: "RCBO",
    applicable_standard: "MS IEC 61009",
    requirement_level: "Mandatory",
    certification_mark: "ST-SIRIM CoA",
    practical_necessity: "Required",
    key_notes: "過電流保護付き漏電遮断器は認証必須",
  },
];

/* ------------------------------------------------------------------ */
/*  CB vs non-CB Timeline Comparison                                   */
/* ------------------------------------------------------------------ */

export const MY_CERT_TIMELINE_COMPARISON: CertTimelineComparison[] = [
  { product_type: "ACB",  with_cb_weeks: 4, without_cb_weeks: 6, time_savings_pct: 33, notes: "CB証書で試験時間約30%削減" },
  { product_type: "MCCB", with_cb_weeks: 4, without_cb_weeks: 7, time_savings_pct: 43, notes: "2〜3週間短縮可能" },
  { product_type: "MCB",  with_cb_weeks: 3, without_cb_weeks: 5, time_savings_pct: 40, notes: "完全受入 — 最大効果" },
  { product_type: "RCCB", with_cb_weeks: 3, without_cb_weeks: 5, time_savings_pct: 40, notes: "完全受入" },
  { product_type: "RCBO", with_cb_weeks: 4, without_cb_weeks: 6, time_savings_pct: 33, notes: "一部受入 — 追加試験あり" },
];

/* ------------------------------------------------------------------ */
/*  Data Sources                                                       */
/* ------------------------------------------------------------------ */

export const REGULATORY_DATA_SOURCES: RegulatoryDataSources = {
  power_specs: "Suruhanjaya Tenaga (ST); TNB System Planning Division",
  standards: "Department of Standards Malaysia (JSM); SIRIM QAS",
  certification: "SIRIM QAS International; Suruhanjaya Tenaga",
  tariff: "Royal Malaysian Customs (KDRM); ASEAN Trade in Goods Agreement",
  cb_scheme: "IECEE CB Scheme; SIRIM QAS International",
};
