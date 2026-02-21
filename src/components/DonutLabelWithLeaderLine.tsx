import React from "react";

interface DonutLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  payload?: {
    sector?: string;
    gdp_share_pct?: number;
    cb_relevance?: string;
  };
}

// CB関連性カラー
const cbRelevanceColor = (relevance: string): string =>
  relevance === "High" ? "#dc3545" :
  relevance === "Medium" ? "#d97706" :
  "#6c757d";

// ドーナツチャート用カスタムラベル（リード線付き）
export const DonutLabelWithLeaderLine: React.FC<DonutLabelProps> = React.memo(({
  cx,
  cy,
  midAngle,
  outerRadius,
  payload,
}) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined ||
    !payload?.sector ||
    payload.gdp_share_pct === undefined ||
    !payload.cb_relevance
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const leaderLineLength = 20;
  const horizontalLineLength = 25;
  const labelOffset = 6;

  const angleRad = -midAngle * RADIAN;
  const isRight = Math.cos(angleRad) >= 0;

  const lineStartX = cx + outerRadius * Math.cos(angleRad);
  const lineStartY = cy + outerRadius * Math.sin(angleRad);
  const elbowX = cx + (outerRadius + leaderLineLength) * Math.cos(angleRad);
  const elbowY = cy + (outerRadius + leaderLineLength) * Math.sin(angleRad);
  const lineEndX = isRight ? elbowX + horizontalLineLength : elbowX - horizontalLineLength;
  const lineEndY = elbowY;

  const textAnchor = isRight ? "start" : "end";
  const textX = isRight ? lineEndX + labelOffset : lineEndX - labelOffset;
  const textY = elbowY;
  const color = cbRelevanceColor(payload.cb_relevance);

  return (
    <g>
      <line x1={lineStartX} y1={lineStartY} x2={elbowX} y2={elbowY} stroke={color} strokeWidth={1.5} opacity={0.8} />
      <line x1={elbowX} y1={elbowY} x2={lineEndX} y2={lineEndY} stroke={color} strokeWidth={1.5} opacity={0.8} />
      <circle cx={lineEndX} cy={lineEndY} r={3} fill={color} />
      <text x={textX} y={textY - 9} textAnchor={textAnchor} dominantBaseline="middle" fontSize="14px" fill={color} fontWeight={600}>
        {payload.sector}
      </text>
      <text x={textX} y={textY + 10} textAnchor={textAnchor} dominantBaseline="middle" fontSize="13px" fill={color} opacity={0.85} fontWeight={500}>
        {payload.gdp_share_pct.toFixed(1)}%
      </text>
    </g>
  );
});

DonutLabelWithLeaderLine.displayName = "DonutLabelWithLeaderLine";

// CB関連性カラー関数（他コンポーネントでも使用）
export { cbRelevanceColor };
