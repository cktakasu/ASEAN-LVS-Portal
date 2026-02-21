import React from "react";
// Inline styles to avoid circular dependency with constants
const STYLES = {
  flex: {
    center: { display: "flex", justifyContent: "center", alignItems: "center" } as const,
  },
};
const FONT_SIZE = { small: "0.78rem" };
const COLOR = { text: "#333" };

interface LegendItemProps {
  color: string;
  label: string;
  isSolid: boolean;
}

export const LegendItem: React.FC<LegendItemProps> = React.memo(({ color, label, isSolid }) => {
  const dashArray = isSolid ? undefined : "6 4";

  return (
    <div style={{ ...STYLES.flex.center, gap: "6px", fontSize: FONT_SIZE.small }}>
      <svg width={20} height={2} style={{ display: "block" }}>
        <line
          x1={0}
          y1={1}
          x2={20}
          y2={1}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashArray}
        />
      </svg>
      <span style={{ color: COLOR.text }}>{label}</span>
    </div>
  );
});

LegendItem.displayName = "LegendItem";
