import React from "react";
import { Tooltip } from "recharts";
import type { TooltipProps } from "../../types/chart";
import type { TooltipPayloadItem } from "../../types/chart";
import { ASEAN_GDP_COMPARISON } from "../../data/aseanGdpData";

interface GDPChartTooltipProps {
  usdJpy: number;
}

export const GDPChartTooltip: React.FC<GDPChartTooltipProps> = React.memo(({ usdJpy }) => {
  const renderTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div style={{ backgroundColor: "rgba(255,255,255,0.97)", border: "1px solid #ccc", padding: "10px 14px", borderRadius: "4px", lineHeight: "1.7", minWidth: "150px" }}>
        <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#333" }}>{label}</p>
        {payload.map((p: TooltipPayloadItem) => {
          if (p.value == null) return null;

          const jpy = p.value;
          const usdB = (jpy / usdJpy * 1000).toFixed(1);
          let displayName = p.name;

          if (displayName === "malaysia") {
            displayName = "マレーシア";
          } else if (displayName === "actual") {
            displayName = "マレーシア（実績）";
          } else if (displayName === "forecast") {
            displayName = "マレーシア（予測）";
          } else {
            const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === displayName);
            if (country) displayName = country.nameJa;
          }

          return (
            <p key={p.name} style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>
              <span style={{ color: p.color, fontWeight: 600 }}>●</span>
              {" "}{displayName}: 約{jpy.toFixed(1)}兆円
              <span style={{ fontSize: "0.8rem", color: "#666" }}> (USD {usdB}B)</span>
            </p>
          );
        })}
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tooltip content={renderTooltip as any} />;
});

GDPChartTooltip.displayName = "GDPChartTooltip";
