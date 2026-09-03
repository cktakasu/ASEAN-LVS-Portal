/* ------------------------------------------------------------------ */
/*  T6 Research Vault — Type Definitions                              */
/* ------------------------------------------------------------------ */

export type EvidenceStatus = "Confirmed" | "Inference" | "Unverified";

export interface ResearchSource {
  id: string;
  label: string;
  publisher: string;
  url: string;
  checked_on: string;
}

export interface ResearchCard {
  title: string;
  value: string;
  detail: string;
  status: EvidenceStatus;
  source_ids: string[];
}

export interface ResearchTableColumn {
  key: string;
  label: string;
}

export interface ResearchTableRow {
  id: string;
  status: EvidenceStatus;
  source_ids: string[];
  values: Record<string, string>;
}

export interface ResearchTable {
  columns: ResearchTableColumn[];
  rows: ResearchTableRow[];
}

export interface ResearchInsight {
  title: string;
  body: string;
  status: EvidenceStatus;
  source_ids: string[];
}

export interface ResearchSection {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  description?: string;
  cards?: ResearchCard[];
  table?: ResearchTable;
  insights?: ResearchInsight[];
  note?: string;
}
