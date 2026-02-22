import React from "react";
import { ReferenceArea, ReferenceLine } from "recharts";
import { CHART_REFERENCE_CONFIG } from "../../constants/malaysia";

interface ForecastReferenceAreaProps {
  boundaryYear: number;
  forecastEndYear: number;
}

export const ForecastReferenceArea: React.FC<ForecastReferenceAreaProps> = React.memo(({
  boundaryYear,
  forecastEndYear
}) => (
  <>
    <ReferenceArea
      x1={boundaryYear}
      x2={forecastEndYear}
      {...CHART_REFERENCE_CONFIG.forecastArea}
    />
    <ReferenceLine
      x={boundaryYear}
      {...CHART_REFERENCE_CONFIG.boundaryLine}
    />
  </>
));

ForecastReferenceArea.displayName = "ForecastReferenceArea";
