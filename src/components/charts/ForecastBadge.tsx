import React from "react";
import { CHART_FORECAST_COLORS, CHART_BADGE_STYLE } from "../../constants/malaysia";

interface ForecastBadgeProps {
  type: "actual" | "forecast";
  leftPosition: string; // CSS percentage value
}

export const ForecastBadge: React.FC<ForecastBadgeProps> = React.memo(({
  type,
  leftPosition
}) => {
  const backgroundColor = type === "actual"
    ? CHART_FORECAST_COLORS.actualBadge
    : CHART_FORECAST_COLORS.forecastBadge;

  return (
    <div style={{
      ...CHART_BADGE_STYLE.container,
      left: leftPosition,
      transform: "translateX(-50%)",
      backgroundColor,
    }}>
      {type === "actual" ? "Actual" : "Forecast"}
    </div>
  );
});

ForecastBadge.displayName = "ForecastBadge";
