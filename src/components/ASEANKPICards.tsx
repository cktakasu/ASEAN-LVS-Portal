import React from "react";
import type { ASEANAggregateKPI } from "../data/aseanOverviewData";

type Props = {
  data: ASEANAggregateKPI;
};

export const ASEANKPICards = React.memo(function ASEANKPICards({ data }: Props) {
  const cards = [
    {
      label: "ASEAN合計 GDP",
      value: data.total_gdp_usd_trillion.toFixed(1),
      unit: "兆 USD（2024年推計）",
    },
    {
      label: "ASEAN 総人口",
      value: (data.total_population_million / 100).toFixed(1),
      unit: "億人",
    },
    {
      label: "GDP成長率（加重平均）",
      value: data.weighted_avg_growth_pct.toFixed(1),
      unit: "% / 年（IMF WEO 2024）",
    },
    {
      label: "対象国数",
      value: String(data.country_count),
      unit: "カ国（詳細ページ 1カ国対応済み）",
    },
  ];

  return (
    <div className="asean-kpi-grid">
      {cards.map((card) => (
        <div key={card.label} className="asean-kpi-card">
          <p className="asean-kpi-label">{card.label}</p>
          <p className="asean-kpi-value">{card.value}</p>
          <p className="asean-kpi-unit">{card.unit}</p>
        </div>
      ))}
    </div>
  );
});
