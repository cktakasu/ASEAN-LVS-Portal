/* ------------------------------------------------------------------ */
/*  Malaysia Page Constants                                            */
/* ------------------------------------------------------------------ */

// チャート設定定数
export const CHART_CONFIG = {
  height: 530,
  margin: { top: 10, right: 30, left: 20, bottom: 30 },
  legend: {
    bottom: 80,
    right: 60,
  },
  yAxisStep: 20,
  transitionDuration: 400,
  lineStrokeWidth: 2.5,
  dashArray: "6 4",
} as const;

// Font sizes
export const FONT_SIZE = {
  small: "0.78rem",
  medium: "0.85rem",
  large: "0.9rem",
  xlarge: "0.95rem",
  xxlarge: "1rem",
  xxxlarge: "1.1rem",
  header: "1.2rem",
} as const;

// Colors
export const COLOR = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  secondary: "#666",
  secondaryLight: "#888",
  tertiary: "#999",
  error: "#dc3545",
  success: "#28a745",
  warning: "#fd7e14",
  info: "#17a2b8",
  text: "#333",
  textLight: "#666",
  disabled: "#999",
  white: "#fff",
  gray: "#e0e0e0",
  lightGray: "#f5f5f5",
} as const;

// Spacing
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "24px",
  xxxl: "32px",
} as const;

// Common styles (純粋な定数オブジェクト)
export const STYLES = {
  flex: {
    center: { display: "flex", justifyContent: "center", alignItems: "center" } as const,
    centerColumn: { display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" as const },
    between: { display: "flex", justifyContent: "space-between", alignItems: "center" } as const,
    wrap: { display: "flex", flexWrap: "wrap" } as const,
  },
  margin: {
    lg: { marginTop: SPACING.lg, marginBottom: SPACING.lg } as const,
  },
  fontSize: {
    small: { fontSize: FONT_SIZE.small } as const,
    medium: { fontSize: FONT_SIZE.medium } as const,
    large: { fontSize: FONT_SIZE.large } as const,
  },
  color: {
    primary: { color: COLOR.primary } as const,
    secondary: { color: COLOR.secondary } as const,
    tertiary: { color: COLOR.tertiary } as const,
    text: { color: COLOR.text } as const,
  },
} as const;
