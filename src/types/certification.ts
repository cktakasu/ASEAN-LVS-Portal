/* ------------------------------------------------------------------ */
/*  Certification Type Definitions                                     */
/* ------------------------------------------------------------------ */

/**
 * 製品認証要件行
 */
export interface CertRow {
  product: string;
  requirement: string;
  standard: string;
  authority: string;
  note: string;
}

/**
 * 基本情報項目
 */
export interface InfoItem {
  label: string;
  value: string;
}

/**
 * タブ定義
 */
export interface TabDef {
  id: string;
  label: string;
  sublabel: string;
}
