import React from "react";
import type { ASEANCountryCard } from "../data/aseanOverviewData";

type Props = {
  countries: ASEANCountryCard[];
};

function formatGDP(billion: number): string {
  return "USD " + Math.round(billion).toLocaleString() + " B";
}

export const CountryNavCards = React.memo(function CountryNavCards({ countries }: Props) {
  return (
    <div className="country-nav-grid">
      {countries.map((c) => (
        <div
          key={c.iso3}
          className={`country-nav-card${c.hasDetailPage ? " country-nav-card--active" : " country-nav-card--inactive"}`}
        >
          <div className="country-nav-name-row">
            <p className="country-nav-name-ja">{c.nameJa}</p>
            {c.hasDetailPage
              ? <span className="country-nav-badge country-nav-badge--available">詳細あり</span>
              : <span className="country-nav-badge country-nav-badge--soon">準備中</span>}
          </div>
          <p className="country-nav-desc">{c.descriptionJa}</p>

          <div className="country-nav-kpis">
            <div className="country-nav-kpi-item">
              <span className="country-nav-kpi-val">
                {formatGDP(c.gdp_usd_billion_2024)}
              </span>
              <span className="country-nav-kpi-lbl">GDP（2024）</span>
            </div>
            <div className="country-nav-kpi-item">
              <span className="country-nav-kpi-val">
                {c.population_million >= 1
                  ? Math.round(c.population_million) + " 百万人"
                  : Math.round(c.population_million * 10) / 10 + " 百万人"}
              </span>
              <span className="country-nav-kpi-lbl">人口</span>
            </div>
            <div className="country-nav-kpi-item">
              <span className="country-nav-kpi-val">{c.voltage}</span>
              <span className="country-nav-kpi-lbl">電圧 / 周波数</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
