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
  payload?: readonly TooltipPayloadItem[];
  label?: number | string;
}

/**
 * Recharts Tooltip content function type
 * Compatible with recharts internal TooltipContentProps
 */
export type TooltipContentFunction = (props: {
  active?: boolean;
  payload?: readonly TooltipPayloadItem[];
  label?: number | string;
}) => React.ReactNode;
