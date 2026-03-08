/* ------------------------------------------------------------------ */
/*  Regulatory Gateway — Type Definitions                              */
/* ------------------------------------------------------------------ */

/**
 * Power Specifications
 */
export interface PowerSpecs {
  voltage_lv: {
    single_phase: string;
    three_phase: string;
  };
  frequency: string;
  plug_type: string;
  distribution_system: string;
  utility_companies: UtilityCompany[];
}

export interface UtilityCompany {
  region: string;
  name: string;
  abbreviation?: string;
  website?: string;
  notes?: string;
}

/**
 * CB Scheme Compatibility
 */
export interface CBSchemeInfo {
  product_category: string;
  cb_acceptance: "Full" | "Partial" | "Not Accepted";
  national_differences: string[];
  time_savings_notes?: string;
  additional_requirements?: string[];
}

/**
 * ASEAN EE MRA
 */
export interface AseanEEMRA {
  country: string;
  mra_status: "Active" | "Pending" | "Not Applicable";
  ee_mra_type?: "Product Certification" | "Test Report Mutual Recognition";
  accredited_labs: AccreditedLab[];
  notes?: string;
}

export interface AccreditedLab {
  lab_name: string;
  location: string;
  accreditation_scope?: string[];
  contact?: string;
}

/**
 * Certification Bodies
 */
export interface CertBody {
  name: string;
  abbreviation: string;
  type: "National" | "International" | "Private";
  scope: string[];
  contact_info: ContactInfo;
  services: string[];
  notes?: string;
}

export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Product Certification Requirement — flattened per-product row
 */
export interface ProductCertRequirement {
  product_type: "ACB" | "MCCB" | "MCB" | "RCCB" | "RCBO";
  applicable_standard: string;
  requirement_level: "Mandatory" | "Voluntary";
  certification_mark: string;
  practical_necessity: "Required" | "Recommended" | "Optional";
  key_notes: string;
}

/**
 * CB vs non-CB timeline comparison per product
 */
export interface CertTimelineComparison {
  product_type: "ACB" | "MCCB" | "MCB" | "RCCB" | "RCBO";
  with_cb_weeks: number;
  without_cb_weeks: number;
  time_savings_pct: number;
  notes?: string;
}

/**
 * Data sources metadata
 */
export interface RegulatoryDataSources {
  power_specs: string;
  standards: string;
  certification: string;
  tariff: string;
  cb_scheme?: string;
}
