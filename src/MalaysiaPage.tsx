import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Coordinate = [number, number];

type Geometry = {
  type: string;
  coordinates?: unknown;
};

type Feature = {
  properties?: {
    iso3?: string;
    name?: string;
  };
  geometry?: Geometry;
};

type CertRow = {
  product: string;
  requirement: string;
  standard: string;
  authority: string;
  note: string;
};

type InfoItem = {
  label: string;
  value: string;
};

type TabDef = {
  id: string;
  label: string;
  sublabel: string;
};

type GdpTrendPoint = {
  year: number;
  actual: number | null;
  forecast: number | null;
};

type GdpSector = {
  sector: string;
  share: number;
  cb_relevance: "High" | "Medium" | "Low";
};

type NewsItem = {
  date: string;
  category: "Policy" | "Investment" | "Infrastructure" | "Trade" | "Other";
  headline: string;
  summary: string;
  cb_impact: "High" | "Medium" | "Low" | "None";
};

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS: TabDef[] = [
  { id: "t1", label: "Country Profile",      sublabel: "Is this country worth targeting?" },
  { id: "t2", label: "Market & Demand",      sublabel: "Where is the demand?" },
  { id: "t3", label: "Regulatory Gateway",   sublabel: "What is required to sell here?" },
  { id: "t4", label: "Competitive Landscape",sublabel: "Who are we competing against?" },
  { id: "t5", label: "Our Position",         sublabel: "Where do we stand?" },
  { id: "t6", label: "Strategic Assessment", sublabel: "What should we do?" },
];

/* ------------------------------------------------------------------ */
/*  T1 static data — Section 1: Economic KPIs                         */
/* ------------------------------------------------------------------ */

const T1_KPI = {
  gdp_usd_billion: 430.9,
  gdp_growth_pct: 5.2,
  population_million: 34.3,
  gdp_per_capita_usd: 12560,
  fdi_inflow_usd_billion: 16.9,
  exchange_rate_to_usd: 4.45,
};

/* ------------------------------------------------------------------ */
/*  T1 static data — Section 2: GDP Trend 2019–2027                   */
/*  2024 is the connection point (appears in both actual & forecast)   */
/* ------------------------------------------------------------------ */

const GDP_TREND: GdpTrendPoint[] = [
  { year: 2019, actual: 365.3, forecast: null  },
  { year: 2020, actual: 337.0, forecast: null  },
  { year: 2021, actual: 372.7, forecast: null  },
  { year: 2022, actual: 406.3, forecast: null  },
  { year: 2023, actual: 430.2, forecast: null  },
  { year: 2024, actual: 430.9, forecast: 430.9 },
  { year: 2025, actual: null,  forecast: 458.2 },
  { year: 2026, actual: null,  forecast: 485.0 },
  { year: 2027, actual: null,  forecast: 513.8 },
];

/* ------------------------------------------------------------------ */
/*  T1 static data — Section 3: GDP Composition by sector             */
/* ------------------------------------------------------------------ */

const GDP_COMPOSITION: GdpSector[] = [
  { sector: "Services",        share: 54.2, cb_relevance: "Medium" },
  { sector: "Manufacturing",   share: 23.4, cb_relevance: "High"   },
  { sector: "Mining & Energy", share:  9.1, cb_relevance: "Low"    },
  { sector: "Construction",    share:  5.8, cb_relevance: "High"   },
  { sector: "Agriculture",     share:  5.1, cb_relevance: "Low"    },
  { sector: "Finance",         share:  2.4, cb_relevance: "Medium" },
];

/* ------------------------------------------------------------------ */
/*  T1 static data — Section 4: Power infrastructure                  */
/* ------------------------------------------------------------------ */

const POWER_INFO: InfoItem[] = [
  { label: "系統電圧（低圧）", value: "240 V（単相）/ 415 V（三相）" },
  { label: "周波数",           value: "50 Hz" },
  { label: "プラグ形状",       value: "Type G（英国型 BS 1363）" },
  { label: "配電方式",         value: "TN-S / TN-C-S（半島）、地域によりTT" },
  { label: "主要電力会社",     value: "Tenaga Nasional Berhad（TNB）— 半島マレーシア" },
  { label: "サバ・サラワク",   value: "Sabah Electricity（SESB）/ Sarawak Energy（SEB）" },
  { label: "電化率",           value: "99.9%（2024年）" },
  { label: "再エネ目標",       value: "40% by 2035（NETR・RE NKRA）" },
];

/* ------------------------------------------------------------------ */
/*  T1 static data — Section 5: Economic news                         */
/* ------------------------------------------------------------------ */

const ECONOMIC_NEWS: NewsItem[] = [
  {
    date: "2024-10",
    category: "Investment",
    headline: "AWS、マレーシアに2037年までUSD 60億ドル投資を表明",
    summary: "データセンター建設の急拡大により、Johor・クランバレー周辺でのLV配電盤需要が大幅増加する見込み。ACB・MCCBの需要が主に増加。",
    cb_impact: "High",
  },
  {
    date: "2024-09",
    category: "Investment",
    headline: "NVIDIA、マレーシア政府とAIインフラ整備で提携合意",
    summary: "大型データセンター増設計画が後押し。高信頼性LV配電システムの需要拡大が見込まれる。",
    cb_impact: "High",
  },
  {
    date: "2023-08",
    category: "Policy",
    headline: "国家エネルギー転換ロードマップ（NETR）発表：再エネ比率40%目標（2035年）",
    summary: "太陽光・風力発電の急拡大に伴い、MCCB・RCCBの大量需要が想定。インバーター対応の遮断器規格への注目が高まる。",
    cb_impact: "High",
  },
  {
    date: "2024-01",
    category: "Infrastructure",
    headline: "Johor-Singapore経済特区（JS-SEZ）正式始動",
    summary: "製造業・ICT・ヘルスケア産業の集積が加速。インフラ整備フェーズでの大型LV配電盤需要が生じる。",
    cb_impact: "High",
  },
  {
    date: "2024-06",
    category: "Trade",
    headline: "半導体・EV関連FDIが過去最高水準——2023年比40%増",
    summary: "クリーンルーム施設・テスト工場の新設が相次ぐ。精密電源品質が求められるためACB・MCCBの高品位品への需要が増大。",
    cb_impact: "Medium",
  },
];

/* ------------------------------------------------------------------ */
/*  Existing data (cert, SIRIM, regional — to be moved to T3 later)   */
/* ------------------------------------------------------------------ */

const CERT_ROWS: CertRow[] = [
  { product: "ACB",  requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様で要求多し" },
  { product: "MCCB", requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様でSIRIM CoA要求" },
  { product: "MCB",  requirement: "必須",     standard: "MS IEC 60898",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCCB", requirement: "必須",     standard: "MS IEC 61008",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCBO", requirement: "必須",     standard: "MS IEC 61009",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
];

const SIRIM_PROCESS: string[] = [
  "SIRIM QAS International へ申請書・製品仕様書・試験報告書（認定ラボ発行）を提出",
  "MS規格（MS IEC 60898 / 61008 / 61009 等）に基づく製品評価",
  "CoA（Certificate of Approval）発行",
  "ST（Suruhanjaya Tenaga / Energy Commission）への届出・登録",
  "ST-SIRIM CoAマーク付き製品として出荷可能",
];

const REGIONAL_DIFF: InfoItem[] = [
  { label: "半島マレーシア",           value: "TNB系統。MS規格・SIRIM CoA体制が最も整備されており、ST登録が実質必須。" },
  { label: "サバ（ボルネオ北部）",     value: "SESBが管轄。系統容量は半島より小さく、プロジェクト仕様でIECまたはBS準拠を要求するケースが多い。" },
  { label: "サラワク（ボルネオ北西）", value: "SEBが独立運営。半島とは別制度。認証要件をSEB仕様で個別確認要。" },
];

const MARKET_NOTES: string[] = [
  "住宅向けMCB・RCCB・RCBOはST-SIRIM CoAが強制要件。SIRIM QAS以外の認証機関では取得不可。",
  "産業用ACB・MCCBは強制認証対象外だが、PLCやTNBの入札仕様で「SIRIM CoAまたはCBスキーム証明書提出」を要求するケースが多い。",
  "CBスキーム（IEC CB Scheme）証明書があれば、SIRIM試験の一部省略が可能な場合がある。事前にSIRIM QASに確認要。",
  "HS分類：8536.20（MCB）、8536.10（RCCB/RCBO含む遮断器類）。輸入時に認証番号を税関申告書に記載する実務が定着している。",
  "IEC 60947-2準拠のMCCBでもプロジェクトによってはBS EN 60947-2相当の試験報告書を追加要求されることがある（英国系エンジニアリング会社案件）。",
];

/* ------------------------------------------------------------------ */
/*  Constants / helpers                                                */
/* ------------------------------------------------------------------ */

const CB_RELEVANCE_COLOR: Record<string, string> = {
  High:   "#0066cc",
  Medium: "#5e8fbf",
  Low:    "#b0bec5",
};

const CATEGORY_BADGE_CLASS: Record<string, string> = {
  Policy:         "badge--policy",
  Investment:     "badge--investment",
  Infrastructure: "badge--infrastructure",
  Trade:          "badge--trade",
  Other:          "badge--other",
};

const IMPACT_BADGE_CLASS: Record<string, string> = {
  High:   "badge--impact-high",
  Medium: "badge--impact-medium",
  Low:    "badge--impact-low",
  None:   "badge--other",
};

const CATEGORY_LABEL: Record<string, string> = {
  Policy:         "政策",
  Investment:     "投資",
  Infrastructure: "インフラ",
  Trade:          "通商",
  Other:          "その他",
};

const IMPACT_LABEL: Record<string, string> = {
  High:   "CB需要 High",
  Medium: "CB需要 Medium",
  Low:    "CB需要 Low",
  None:   "CB影響 なし",
};

/* ------------------------------------------------------------------ */
/*  T1 sub-components                                                  */
/* ------------------------------------------------------------------ */

function MalaysiaMap(): React.JSX.Element {
  const [geoFeatures, setGeoFeatures] = useState<Feature[]>([]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string>("");

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const base = import.meta.env.BASE_URL;
        const res = await fetch(`${base}data/asean_10m.geojson`, { cache: "no-store" });
        if (!res.ok) throw new Error("地図データの読み込みに失敗しました");
        const data = (await res.json()) as { features: Feature[] };
        const malaysiaFeature = data.features.find((f) => f.properties?.iso3 === "MYS");
        if (malaysiaFeature) {
          setGeoFeatures([malaysiaFeature]);
        }
      } catch (error) {
        setMapError("地図データを読み込めません");
      }
    };
    void loadMapData();
  }, []);

  const mapSvg = useMemo(() => {
    if (geoFeatures.length === 0) return null;

    const feature = geoFeatures[0];
    if (!feature.geometry || !feature.geometry.coordinates) return null;

    const coords = feature.geometry.coordinates as Coordinate[][][];
    let pathData = "";
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    for (const polygon of coords) {
      for (const ring of polygon) {
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i];
          minX = Math.min(minX, lon);
          maxX = Math.max(maxX, lon);
          minY = Math.min(minY, lat);
          maxY = Math.max(maxY, lat);
          pathData += `${i === 0 ? "M" : "L"}${lon.toFixed(2)} ${(90 - lat).toFixed(2)} `;
        }
        pathData += "Z ";
      }
    }

    const width = 800;
    const height = 500;
    const padding = 40;
    const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="malaysia-map" style={{ width: "100%", maxWidth: "800px" }}>
        <path
          d={pathData}
          className="malaysia-shape"
          style={{
            fill: selectedRegion ? "#0066cc" : hoveredRegion ? "#3d8bfd" : "#e0e8f5",
            stroke: "#0066cc",
            strokeWidth: "1.5",
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: "fill 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoveredRegion("Malaysia")}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => setSelectedRegion(selectedRegion === "Malaysia" ? null : "Malaysia")}
        />
        {(hoveredRegion === "Malaysia" || selectedRegion === "Malaysia") && (
          <text x="50%" y="45%" textAnchor="middle" className="region-label" style={{ fontSize: "18px", fontWeight: "bold", fill: "#0066cc" }}>
            MALAYSIA
          </text>
        )}
      </svg>
    );
  }, [geoFeatures, hoveredRegion, selectedRegion]);

  return (
    <div className="malaysia-map-container" style={{ textAlign: "center", margin: "24px 0" }}>
      <p style={{ marginBottom: "12px", color: "#666", fontSize: "14px" }}>地図をクリックしてマレーシアを選択</p>
      {mapError ? <p style={{ color: "#c00" }}>{mapError}</p> : mapSvg}
      {selectedRegion && <p style={{ marginTop: "12px", color: "#0066cc", fontWeight: "bold" }}>✓ {selectedRegion} が選択されました</p>}
    </div>
  );
}

function KpiGrid(): React.JSX.Element {
  const cards = [
    { label: "GDP（名目）",    value: `USD ${T1_KPI.gdp_usd_billion}B`,                 sub: "Nominal GDP (2024)" },
    { label: "GDP 成長率",     value: `+${T1_KPI.gdp_growth_pct}%`,                     sub: "Real GDP Growth (2024)", highlight: true },
    { label: "人口",           value: `${T1_KPI.population_million}M`,                  sub: "Population (2024)" },
    { label: "1人当たり GDP",  value: `USD ${T1_KPI.gdp_per_capita_usd.toLocaleString()}`, sub: "GDP per Capita (2024)" },
    { label: "FDI 流入額",    value: `USD ${T1_KPI.fdi_inflow_usd_billion}B`,           sub: "FDI Inflows (2024)" },
    { label: "対 USD 為替",   value: `MYR ${T1_KPI.exchange_rate_to_usd}`,              sub: "Annual Avg Exchange Rate" },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <div key={c.label} className={`kpi-card${c.highlight ? " kpi-card--highlight" : ""}`}>
          <span className="kpi-card__label">{c.label}</span>
          <span className="kpi-card__value">{c.value}</span>
          <span className="kpi-card__sub">{c.sub}</span>
        </div>
      ))}
    </div>
  );
}

function GdpTrendChart(): React.JSX.Element {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={GDP_TREND} margin={{ top: 8, right: 32, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `${v}B`}
            domain={[300, 560]}
          />
          <Tooltip formatter={(v: number | undefined) => v != null ? [`USD ${v}B`, ""] : ["-", ""]} />
          <ReferenceLine
            x={2024}
            stroke="#ccc"
            strokeDasharray="4 4"
            label={{ value: "実績 / 予測", position: "insideTopRight", fontSize: 11, fill: "#999" }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="実績"
            stroke="#0066cc"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#0066cc" }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="予測"
            stroke="#ff8c00"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: "#ff8c00" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ textAlign: "right", margin: "4px 32px 0", fontSize: 11, color: "var(--text-sub)" }}>
        出典: World Bank / IMF WEO 2024。予測値は IMF ベースライン。
      </p>
    </div>
  );
}

function GdpCompositionChart(): React.JSX.Element {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={GDP_COMPOSITION}
          margin={{ top: 4, right: 60, left: 16, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => `${v}%`}
            domain={[0, 60]}
          />
          <YAxis
            type="category"
            dataKey="sector"
            tick={{ fontSize: 12 }}
            width={130}
          />
          <Tooltip formatter={(v: number | undefined) => v != null ? [`${v}%`, "GDP 構成比"] : ["-", "GDP 構成比"]} />
          <Bar dataKey="share" radius={[0, 4, 4, 0]}>
            {GDP_COMPOSITION.map((entry) => (
              <Cell key={entry.sector} fill={CB_RELEVANCE_COLOR[entry.cb_relevance]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="cb-relevance-legend">
        {(["High", "Medium", "Low"] as const).map((r) => (
          <span key={r} className="cb-relevance-item">
            <span className="cb-dot" style={{ background: CB_RELEVANCE_COLOR[r] }} />
            CB需要 {r}
          </span>
        ))}
      </div>
      <p style={{ textAlign: "right", margin: "4px 0 0", fontSize: 11, color: "var(--text-sub)" }}>
        出典: DOSM Malaysia（2024年推計値）
      </p>
    </div>
  );
}

function EconomicNewsList(): React.JSX.Element {
  return (
    <ul className="news-list">
      {ECONOMIC_NEWS.map((news) => (
        <li
          key={news.headline}
          className={`news-item news-item--${news.cb_impact.toLowerCase()}`}
        >
          <div className="news-item__meta">
            <span className="news-item__date">{news.date}</span>
            <span className={`badge ${CATEGORY_BADGE_CLASS[news.category]}`}>
              {CATEGORY_LABEL[news.category]}
            </span>
            <span className={`badge ${IMPACT_BADGE_CLASS[news.cb_impact]}`}>
              {IMPACT_LABEL[news.cb_impact]}
            </span>
          </div>
          <div className="news-item__body">
            <p className="news-item__headline">{news.headline}</p>
            <p className="news-item__summary">{news.summary}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  T1 tab content                                                     */
/* ------------------------------------------------------------------ */

function T1CountryProfile(): React.JSX.Element {
  return (
    <>
      {/* Section 0 — Interactive Map */}
      <section className="content-block fade-in" style={{ marginTop: "24px" }}>
        <p className="section-kicker">INTERACTIVE MAP</p>
        <h2>マレーシア地図</h2>
        <p className="section-subline">Malaysia — Geographic Overview</p>
        <MalaysiaMap />
      </section>

      {/* Section 1 — Economic KPIs */}
      <section className="content-block fade-in">
        <p className="section-kicker">ECONOMIC KPIs</p>
        <h2>経済概況</h2>
        <p className="section-subline">Malaysia — Key Economic Indicators (2024)</p>
        <KpiGrid />
      </section>

      {/* Section 2 — GDP Trend */}
      <section className="content-block fade-in">
        <p className="section-kicker">GDP TREND</p>
        <h2>GDP 推移</h2>
        <p className="section-subline">過去実績（2019–2024）＋予測（2025–2027）　単位: 十億 USD</p>
        <article className="reference-block">
          <GdpTrendChart />
        </article>
      </section>

      {/* Section 3 — GDP Composition */}
      <section className="content-block fade-in">
        <p className="section-kicker">GDP COMPOSITION</p>
        <h2>産業別 GDP 構成比</h2>
        <p className="section-subline">CB市場への関連度（High / Medium / Low）で色分け</p>
        <article className="reference-block">
          <GdpCompositionChart />
        </article>
      </section>

      {/* Section 4 — Power Infrastructure */}
      <section className="content-block fade-in">
        <p className="section-kicker">POWER INFRASTRUCTURE</p>
        <h2>電力インフラ基本情報</h2>
        <p className="section-subline">系統電圧・周波数・プラグ規格・主要電力会社</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                {POWER_INFO.map((item) => (
                  <tr key={item.label}>
                    <td><strong>{item.label}</strong></td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* Section 5 — Economic News */}
      <section className="content-block fade-in">
        <p className="section-kicker">ECONOMIC NEWS</p>
        <h2>主要経済ニュース</h2>
        <p className="section-subline">CB市場に影響を与える政策・投資・インフラ動向</p>
        <article className="reference-block">
          <EconomicNewsList />
        </article>
      </section>

      {/* ---- Below: existing sections (to be reorganised into T3) ---- */}

      <section className="content-block fade-in">
        <p className="section-kicker">PRODUCT-CATEGORY CERTIFICATION REQUIREMENTS</p>
        <h2>製品別 認証要件</h2>
        <p className="section-subline">Low-Voltage Circuit Breakers — Malaysia</p>
        <article className="reference-block">
          <h3>認証要件一覧</h3>
          <div className="table-wrap">
            <table className="requirements-table">
              <thead>
                <tr>
                  <th>製品</th>
                  <th>認証</th>
                  <th>適用規格</th>
                  <th>認証機関</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {CERT_ROWS.map((row) => (
                  <tr key={row.product}>
                    <td><strong>{row.product}</strong></td>
                    <td
                      style={{
                        color: row.requirement === "必須" ? "#c00" : row.requirement === "条件付き" ? "#885500" : "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {row.requirement}
                    </td>
                    <td>{row.standard}</td>
                    <td>{row.authority}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="country-procedure">
            <strong>必要手続き：</strong>
            SIRIM製品認証 → ST（Energy Commission）ラベル取得 → CoA発行
          </p>
        </article>
        <article className="reference-block">
          <h3>SIRIM認証プロセス</h3>
          <ol className="notes-list">
            {SIRIM_PROCESS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="content-block fade-in">
        <p className="section-kicker">REGIONAL DIFFERENCES</p>
        <h2>地域別 留意点</h2>
        <p className="section-subline">半島マレーシア・サバ・サラワクの制度差</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table">
              <thead>
                <tr>
                  <th>地域</th>
                  <th>留意点</th>
                </tr>
              </thead>
              <tbody>
                {REGIONAL_DIFF.map((item) => (
                  <tr key={item.label}>
                    <td><strong>{item.label}</strong></td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="content-block fade-in">
        <p className="section-kicker">MARKET &amp; PRACTICAL NOTES</p>
        <h2>市場・実務ノート</h2>
        <article className="reference-block">
          <ol className="notes-list">
            {MARKET_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </article>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder for unimplemented tabs                                 */
/* ------------------------------------------------------------------ */

function TabPlaceholder({ tab }: { tab: TabDef }): React.JSX.Element {
  return (
    <section className="content-block fade-in" style={{ marginTop: "24px", textAlign: "center" }}>
      <p className="section-kicker">{tab.label.toUpperCase()}</p>
      <h2>{tab.sublabel}</h2>
      <p className="section-subline" style={{ marginTop: "16px" }}>
        準備中です。
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function MalaysiaPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("t1");

  const renderTab = () => {
    if (activeTab === "t1") return <T1CountryProfile />;
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return null;
    return <TabPlaceholder tab={tab} />;
  };

  return (
    <div className="fade-in">
      <header className="my-page-header">
        <div className="my-page-header-top">
          <button
            className="my-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to top page"
          >
            Back to ASEAN Overview →
          </button>
          <p className="hero-kicker" style={{ margin: 0 }}>COUNTRY PROFILE — MALAYSIA</p>
        </div>
        <div className="my-page-header-body">
          <h1 style={{ margin: 0 }}>Malaysia</h1>
          <p className="hero-sub" style={{ margin: 0 }}>LV Circuit Breaker Market Intelligence</p>
        </div>
      </header>

      <nav className="tab-nav" aria-label="Dashboard tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-nav-item${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-nav-label">{tab.label}</span>
            <span className="tab-nav-sublabel">{tab.sublabel}</span>
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
}
