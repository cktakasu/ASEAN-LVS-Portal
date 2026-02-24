import { useNavigate } from "react-router-dom";
import type { ASEANCountryCard } from "../data/aseanOverviewData";

type Props = {
  countries: ASEANCountryCard[];
};

function formatGDP(billion: number): string {
  if (billion >= 1000) {
    return (billion / 1000).toFixed(1) + " 兆";
  }
  return Math.round(billion) + " 十億";
}

export function CountryNavCards({ countries }: Props) {
  const navigate = useNavigate();

  return (
    <div className="country-nav-grid">
      {countries.map((c) => (
        <div
          key={c.iso3}
          className={`country-nav-card${c.hasDetailPage ? " country-nav-card--linked" : ""}`}
          onClick={() => {
            if (c.hasDetailPage && c.detailRoute) {
              navigate(c.detailRoute);
            }
          }}
        >
          <span
            className={`country-nav-badge ${c.hasDetailPage ? "country-nav-badge--ready" : "country-nav-badge--soon"}`}
          >
            {c.hasDetailPage ? "詳細あり" : "準備中"}
          </span>

          <p className="country-nav-name-ja">{c.nameJa}</p>
          <p className="country-nav-name-en">{c.nameEn}</p>
          <p className="country-nav-desc">{c.descriptionJa}</p>

          <div className="country-nav-kpis">
            <div className="country-nav-kpi-item">
              <span className="country-nav-kpi-val">
                USD {formatGDP(c.gdp_usd_billion_2024)}
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
}
