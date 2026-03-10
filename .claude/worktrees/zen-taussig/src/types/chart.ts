/* ------------------------------------------------------------------ */
/*  Chart Type Definitions                                             */
/* ------------------------------------------------------------------ */

import type { GDPDataPoint } from "./economy";

/**
 * チャート描画用データアイテム
 */
export interface ChartDataItem {
  year: number;
  actual?: number | null;
  forecast?: number | null;
  [key: string]: number | null | undefined;
}

/**
 * 国別GDPデータ
 */
export interface CountryGDP {
  iso3: string;
  nameJa: string;
  color: string;
  data: GDPDataPoint[];
}

/**
 * Recharts Tooltipの型定義
 */
export interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey?: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number | string;
}
