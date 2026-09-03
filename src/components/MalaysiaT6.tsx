/* ------------------------------------------------------------------ */
/*  T6: Market Intelligence Hub                                        */
/*  マーケット・インテリジェンス・ハブ                                  */
/*  出典確認済み情報と明示したシミュレーションを組み合わせた市場分析       */
/* ------------------------------------------------------------------ */

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";

import {
  MY_BUSINESS_ENV,
  MY_COMPETITORS_INTEL,
  COMPETITOR_NOTE,
  MY_CUSTOMER_SEGMENTS,
  MY_PRODUCT_MARKET,
  MY_DISTRIBUTION_CH,
  MY_CERT_PATHS,
  CERT_NOTE,
  MY_INVESTMENT,
  INVESTMENT_ASSUMPTIONS,
  MY_SCENARIOS,
  MY_KPIS,
  T6_DATA_SOURCES,
} from "../data/malaysiaT6Data";

/* ------------------------------------------------------------------ */
/*  Shared style constants                                             */
/* ------------------------------------------------------------------ */

const ACCENT = "#fd7e14";
const RESPONSIVE_CHART_INITIAL_DIMENSION = { width: 1, height: 1 };
const SECTION_KICKER: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: ACCENT,
  margin: "0 0 6px",
};
const SECTION_H2: React.CSSProperties = { fontSize: "24px", margin: "0 0 6px", color: "#1d1d1f" };
const SECTION_SUB: React.CSSProperties = { fontSize: "0.85rem", color: "#666", margin: "0 0 20px" };
const SOURCE_NOTE: React.CSSProperties = { fontSize: "0.72rem", color: "#bbb", marginTop: "10px" };

const badge = (bg: string, fg: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 9px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: 600,
  backgroundColor: bg,
  color: fg,
});

const rangeMidpoint = ([min, max]: readonly [number, number]): number => (min + max) / 2;
const formatRange = ([min, max]: readonly [number, number]): string =>
  `${min.toLocaleString()}〜${max.toLocaleString()}`;

/* ------------------------------------------------------------------ */
/*  S1: Business Environment                                          */
/* ------------------------------------------------------------------ */

function S1BusinessEnvironment(): React.JSX.Element {
  const radarData = MY_BUSINESS_ENV.subScores;

  const kpiColor = (c: "green" | "yellow" | "orange" | "red") => {
    const map = { green: "#27ae60", yellow: "#f39c12", orange: "#e67e22", red: "#e74c3c" };
    return map[c];
  };

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>BUSINESS ENVIRONMENT</p>
        <h2 style={SECTION_H2}>ビジネス環境評価</h2>
        <p style={SECTION_SUB}>
          マレーシアへの参入可否を判断するためのマクロ環境評価。参照年と検証状況は「データソース・免責事項」に記載。
        </p>

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {MY_BUSINESS_ENV.kpis.map((kpi) => (
            <div
              key={kpi.label}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderLeft: `4px solid ${kpiColor(kpi.ratingColor)}`,
                borderRadius: "8px",
                padding: "16px 20px",
              }}
            >
              <p style={{ margin: "0 0 2px", fontSize: "0.72rem", color: "#888", fontWeight: 600, textTransform: "uppercase" }}>
                {kpi.label}
              </p>
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "0.9rem", color: "#333" }}>{kpi.labelJa}</p>
              <p style={{ margin: "4px 0 2px", fontSize: "1.8rem", fontWeight: 800, color: kpiColor(kpi.ratingColor), lineHeight: 1.1 }}>
                {kpi.value}
                <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#666", marginLeft: "4px" }}>{kpi.unit}</span>
              </p>
              {kpi.rank && (
                <p style={{ margin: "2px 0 6px", fontSize: "0.78rem", color: "#888" }}>{kpi.rank}</p>
              )}
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#555", lineHeight: 1.5 }}>{kpi.note}</p>
              {kpi.trend && (
                <span
                  style={{
                    ...badge(
                      kpi.trend === "improving" ? "#e8f5e9" : kpi.trend === "stable" ? "#f5f5f5" : "#fce4ec",
                      kpi.trend === "improving" ? "#2e7d32" : kpi.trend === "stable" ? "#666" : "#c62828"
                    ),
                    marginTop: "8px",
                  }}
                >
                  {kpi.trend === "improving" ? "↑ 改善" : kpi.trend === "stable" ? "→ 安定" : "↓ 低下"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Sub-scores radar + tax incentives */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 320px" }}>
            <p style={{ fontWeight: 700, marginBottom: "8px", fontSize: "0.9rem" }}>Doing Business サブスコア</p>
            <ResponsiveContainer width={320} height={260} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#555" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#aaa" }} tickCount={4} />
                <Radar name="Score" dataKey="score" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: "0.72rem", color: "#aaa", textAlign: "center" }}>
              出典: World Bank Doing Business 2020（最終版）
            </p>
          </div>

          <div style={{ flex: "1 1 300px" }}>
            <p style={{ fontWeight: 700, marginBottom: "12px", fontSize: "0.9rem" }}>主要税制優遇措置</p>
            <ul style={{ paddingLeft: "18px", margin: 0 }}>
              {MY_BUSINESS_ENV.taxIncentives.map((inc, i) => (
                <li key={i} style={{ fontSize: "0.82rem", color: "#444", marginBottom: "8px", lineHeight: 1.55 }}>
                  {inc}
                </li>
              ))}
            </ul>
            <p style={{ ...SOURCE_NOTE, marginTop: "16px" }}>出典: {MY_BUSINESS_ENV.source}</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S2: Competitive Intelligence                                      */
/* ------------------------------------------------------------------ */

function S2CompetitiveIntelligence(): React.JSX.Element {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedComp = MY_COMPETITORS_INTEL.find((c) => c.name === selected) ?? null;

  const shareData = MY_COMPETITORS_INTEL.map((c) => ({
    name: c.name,
    value: c.estimatedSharePct,
  }));
  const SHARE_COLORS = ["#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c", "#e74c3c", "#f39c12", "#95a5a6"];

  const radarAxes = ["price", "brand", "tech", "service", "delivery"];
  const radarLabels: Record<string, string> = {
    price: "価格競争力",
    brand: "ブランド",
    tech: "技術スペック",
    service: "サービス",
    delivery: "納期",
  };

  // Build radar data for top 5 competitors
  const TOP5 = MY_COMPETITORS_INTEL.slice(0, 5);
  const radarData = radarAxes.map((axis) => {
    const row: Record<string, string | number> = { subject: radarLabels[axis] };
    TOP5.forEach((c) => {
      row[c.name] = c.radarScores[axis as keyof typeof c.radarScores];
    });
    return row;
  });

  const RADAR_COLORS = ["#3498db", "#2ecc71", "#e67e22", "#9b59b6", "#1abc9c"];

  const priceColor = (p: "Premium" | "Standard" | "Economy") => {
    if (p === "Premium") return { bg: "#e3f2fd", fg: "#1565c0" };
    if (p === "Standard") return { bg: "#e8f5e9", fg: "#2e7d32" };
    return { bg: "#fff3e0", fg: "#e65100" };
  };

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>COMPETITIVE INTELLIGENCE</p>
        <h2 style={SECTION_H2}>競合詳細分析</h2>
        <p style={SECTION_SUB}>主要競合8社の内部推定レンジ・強弱・多軸評価。行をクリックすると詳細が表示されます。</p>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "24px" }}>
          {/* Pie Chart */}
          <div style={{ flex: "0 0 320px" }}>
            <p style={{ fontWeight: 700, marginBottom: "8px", fontSize: "0.88rem" }}>推定市場シェア（概算）</p>
            <ResponsiveContainer width={320} height={280} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <PieChart>
                <Pie
                  data={shareData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }: { name?: string; value?: number }) => name ? `${name.split(" ")[0]} ${value ?? 0}%` : ""}
                  labelLine={false}
                >
                  {shareData.map((_, i) => (
                    <Cell key={i} fill={SHARE_COLORS[i % SHARE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number | undefined) => [`${v ?? 0}%`, "推定シェア"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div style={{ flex: "1 1 320px" }}>
            <p style={{ fontWeight: 700, marginBottom: "8px", fontSize: "0.88rem" }}>多軸評価（上位5社）</p>
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "8px" }}>
              価格競争力は「安いほど高スコア」。各軸10点満点（推定）。
            </p>
            <ResponsiveContainer width="100%" height={280} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#555" }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 9, fill: "#aaa" }} tickCount={3} />
                {TOP5.map((c, i) => (
                  <Radar
                    key={c.name}
                    name={c.name}
                    dataKey={c.name}
                    stroke={RADAR_COLORS[i]}
                    fill={RADAR_COLORS[i]}
                    fillOpacity={0.1}
                  />
                ))}
                <Legend iconSize={10} wrapperStyle={{ fontSize: "0.75rem" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Table */}
        <div className="table-wrap">
          <table className="definition-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "170px" }}>メーカー</th>
                <th style={{ width: "80px", textAlign: "center" }}>国</th>
                <th style={{ width: "90px", textAlign: "center" }}>推定シェア</th>
                <th style={{ width: "100px", textAlign: "center" }}>価格帯</th>
                <th style={{ width: "100px", textAlign: "center" }}>現地拠点</th>
                <th>主要製品</th>
                <th style={{ width: "100px", textAlign: "center" }}>詳細</th>
              </tr>
            </thead>
            <tbody>
              {MY_COMPETITORS_INTEL.map((c) => {
                const pc = priceColor(c.pricePositioning);
                return (
                  <tr key={c.name} style={{ cursor: "pointer", background: selected === c.name ? "#f0f7ff" : undefined }}>
                    <td>
                      <strong>{c.flag} {c.name}</strong>
                    </td>
                    <td style={{ textAlign: "center", fontSize: "0.82rem" }}>{c.country}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontWeight: 700, color: ACCENT }}>{formatRange(c.estimatedShareRangePct)}%</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={badge(pc.bg, pc.fg)}>{c.pricePositioning}</span>
                    </td>
                    <td style={{ textAlign: "center", fontSize: "0.82rem" }}>
                      {c.hasLocalOffice ? `✅ ${c.officeCities[0]}等` : "❌ 代理店経由"}
                    </td>
                    <td style={{ fontSize: "0.78rem", color: "#555" }}>{c.products.join(" / ")}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => setSelected(selected === c.name ? null : c.name)}
                        style={{
                          fontSize: "0.75rem",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          border: `1px solid ${ACCENT}`,
                          background: selected === c.name ? ACCENT : "#fff",
                          color: selected === c.name ? "#fff" : ACCENT,
                          cursor: "pointer",
                        }}
                      >
                        {selected === c.name ? "閉じる" : "詳細"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selectedComp && (
          <div
            style={{
              marginTop: "16px",
              background: "#f9f9fb",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "1rem" }}>
              {selectedComp.flag} {selectedComp.name} — 詳細分析
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#27ae60", marginBottom: "6px" }}>強み</p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {selectedComp.strength.map((s, i) => (
                    <li key={i} style={{ fontSize: "0.8rem", color: "#444", marginBottom: "4px" }}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#e74c3c", marginBottom: "6px" }}>弱み・課題</p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {selectedComp.weakness.map((w, i) => (
                    <li key={i} style={{ fontSize: "0.8rem", color: "#444", marginBottom: "4px" }}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", color: "#666" }}>拠点: {selectedComp.officeCities.join(" / ")}</span>
              <span style={{ fontSize: "0.78rem", color: "#666" }}>|</span>
              <span style={{ fontSize: "0.78rem", color: "#666" }}>
                推定売上レンジ: USD {formatRange(selectedComp.annualRevenueRangeUsdM)}M
              </span>
            </div>
          </div>
        )}

        <p style={SOURCE_NOTE}>{COMPETITOR_NOTE}</p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S3: Customer Segments                                             */
/* ------------------------------------------------------------------ */

function S3CustomerSegments(): React.JSX.Element {
  const [activeSegId, setActiveSegId] = useState<string>("panel-builder");
  const activeSeg = MY_CUSTOMER_SEGMENTS.find((s) => s.id === activeSegId) ?? MY_CUSTOMER_SEGMENTS[0];

  const pieData = MY_CUSTOMER_SEGMENTS.map((s) => ({
    name: s.nameJa,
    value: s.marketSizeUsdM,
    color: s.color,
  }));

  const severityColor = (s: "High" | "Medium" | "Low") => {
    if (s === "High") return { bg: "#fce4ec", fg: "#c62828" };
    if (s === "Medium") return { bg: "#fff8e1", fg: "#f57f17" };
    return { bg: "#e8f5e9", fg: "#2e7d32" };
  };

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>CUSTOMER SEGMENTS</p>
        <h2 style={SECTION_H2}>顧客セグメント分析</h2>
        <p style={SECTION_SUB}>セグメント別の市場規模・購買行動・参入障壁の内部シミュレーション。タブを切り替えて詳細を確認。</p>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Pie Chart */}
          <div style={{ flex: "0 0 300px" }}>
            <p style={{ fontWeight: 700, marginBottom: "8px", fontSize: "0.88rem" }}>セグメント別市場規模（推定 USD M）</p>
            <ResponsiveContainer width={300} height={280} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value}M`}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number | undefined) => [`$${v ?? 0}M`, "市場規模"]} />
              </PieChart>
            </ResponsiveContainer>
            <p style={SOURCE_NOTE}>※ 2025年推定値。出典: 6Wresearch + 業界推定</p>
          </div>

          {/* Segment selector */}
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {MY_CUSTOMER_SEGMENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSegId(s.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: `2px solid ${s.color}`,
                    background: activeSegId === s.id ? s.color : "#fff",
                    color: activeSegId === s.id ? "#fff" : s.color,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {s.nameJa}
                </button>
              ))}
            </div>

            {activeSeg && (
              <div
                style={{
                  background: "#fff",
                  border: `2px solid ${activeSeg.color}`,
                  borderRadius: "8px",
                  padding: "16px 20px",
                }}
              >
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "1rem", color: activeSeg.color }}>
                  {activeSeg.nameJa}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    marginBottom: "12px",
                    fontSize: "0.82rem",
                  }}
                >
                  <div>市場規模: <strong>${activeSeg.marketSizeUsdM}M</strong></div>
                  <div>成長率: <strong style={{ color: "#27ae60" }}>+{activeSeg.growthRatePct}%</strong></div>
                  <div>平均受注: <strong>${activeSeg.avgOrderUsd.toLocaleString()}</strong></div>
                  <div>決定期間: <strong>{activeSeg.decisionCycleMonths}ヶ月</strong></div>
                  <div style={{ gridColumn: "span 2" }}>決定権者: <strong>{activeSeg.decisionMaker}</strong></div>
                </div>

                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>購買決定基準（優先順位）</p>
                {activeSeg.purchaseCriteria.map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.75rem", minWidth: "120px", color: "#555" }}>{c.label}</span>
                    <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "4px", height: "8px" }}>
                      <div
                        style={{
                          width: `${c.weight}%`,
                          background: activeSeg.color,
                          height: "8px",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#888", minWidth: "32px" }}>{c.weight}%</span>
                  </div>
                ))}

                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginTop: "12px", marginBottom: "6px" }}>参入障壁</p>
                {activeSeg.entryBarriers.map((b, i) => {
                  const sc = severityColor(b.severity);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={badge(sc.bg, sc.fg)}>{b.severity}</span>
                      <span style={{ fontSize: "0.78rem", color: "#555" }}>{b.barrier}</span>
                    </div>
                  );
                })}

                <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "10px" }}>
                  主要企業: {activeSeg.keyCompanies.join(" / ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S4: Product Market Size                                           */
/* ------------------------------------------------------------------ */

function S4ProductMarket(): React.JSX.Element {
  const barData = MY_PRODUCT_MARKET.map((p) => ({
    name: p.product,
    "2025": p.marketSizeUsdM2025,
    "2031": p.marketSizeUsdM2031,
    cagr: p.cagr,
  }));

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>PRODUCT MARKET SIZE</p>
        <h2 style={SECTION_H2}>製品別市場規模</h2>
        <p style={SECTION_SUB}>LV遮断器5製品の2025年・2031年市場規模・成長率・価格レンジ（要追加調査の内部シミュレーション）</p>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 400px" }}>
            <ResponsiveContainer width="100%" height={280} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "USD M", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip formatter={(v: number | undefined) => [`$${v ?? 0}M`, ""]} />
                <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
                <Bar dataKey="2025" name="2025年" fill="#2980b9" />
                <Bar dataKey="2031" name="2031年（予測）" fill={ACCENT} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "0 0 300px" }}>
            <div className="table-wrap">
              <table className="definition-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>製品</th>
                    <th style={{ textAlign: "center" }}>CAGR</th>
                    <th>価格帯</th>
                  </tr>
                </thead>
                <tbody>
                  {MY_PRODUCT_MARKET.map((p) => (
                    <tr key={p.product}>
                      <td><strong>{p.product}</strong></td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={badge(
                            p.cagr >= 9 ? "#e8f5e9" : p.cagr >= 7 ? "#fff8e1" : "#f5f5f5",
                            p.cagr >= 9 ? "#2e7d32" : p.cagr >= 7 ? "#f57f17" : "#666"
                          )}
                        >
                          {p.cagr.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "#555" }}>{p.priceRangeUsd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "16px" }}>
              {MY_PRODUCT_MARKET.map((p) => (
                <div key={p.product} style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, margin: "0 0 3px" }}>{p.product}: 需要ドライバー</p>
                  <p style={{ fontSize: "0.75rem", color: "#666", margin: 0 }}>{p.demandDrivers.join("・")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={SOURCE_NOTE}>出典: 6Wresearch Malaysia Circuit Breaker Market 2025–2031 / 業界推定</p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S5: Distribution Channels                                         */
/* ------------------------------------------------------------------ */

function S5DistributionChannels(): React.JSX.Element {
  const [selectedCh, setSelectedCh] = useState<string>("exclusive-agent");
  const activeCh = MY_DISTRIBUTION_CH.find((c) => c.id === selectedCh) ?? MY_DISTRIBUTION_CH[0];

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>DISTRIBUTION CHANNELS</p>
        <h2 style={SECTION_H2}>流通チャネル詳細分析</h2>
        <p style={SECTION_SUB}>4つの主要流通チャネルの特性比較。参入段階に応じたチャネル選択のガイダンス。</p>

        {/* Channel cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {MY_DISTRIBUTION_CH.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setSelectedCh(ch.id)}
              style={{
                background: selectedCh === ch.id ? "#fff4e6" : "#f9f9fb",
                border: `2px solid ${selectedCh === ch.id ? ACCENT : "#e0e0e0"}`,
                borderRadius: "8px",
                padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.88rem", color: selectedCh === ch.id ? ACCENT : "#333" }}>
                {ch.nameJa}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: "0.72rem", color: "#888" }}>{ch.nameEn}</p>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>
                <div>最低投資: <strong>${ch.minInvestmentUsd.toLocaleString()}</strong></div>
                <div>立上げ: <strong>{ch.setupMonths}ヶ月</strong></div>
              </div>
            </div>
          ))}
        </div>

        {activeCh && (
          <div
            style={{
              background: "#fff",
              border: `2px solid ${ACCENT}`,
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "1rem", color: ACCENT }}>
              {activeCh.nameJa} — 詳細
            </p>
            <p style={{ fontSize: "0.83rem", color: "#555", margin: "0 0 16px" }}>{activeCh.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#27ae60", marginBottom: "6px" }}>メリット</p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {activeCh.pros.map((p, i) => (
                    <li key={i} style={{ fontSize: "0.78rem", color: "#444", marginBottom: "4px" }}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e74c3c", marginBottom: "6px" }}>デメリット・リスク</p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {activeCh.cons.map((c, i) => (
                    <li key={i} style={{ fontSize: "0.78rem", color: "#444", marginBottom: "4px" }}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>マージン構造</p>
              {activeCh.marginStructure.map((m, i) => (
                <p key={i} style={{ fontSize: "0.78rem", color: "#666", margin: "0 0 2px" }}>{m}</p>
              ))}
            </div>

            <div style={{ marginTop: "14px" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>主要プレイヤー例</p>
              <p style={{ fontSize: "0.78rem", color: "#666" }}>{activeCh.keyPlayers.join(" / ")}</p>
            </div>

            <div
              style={{
                marginTop: "14px",
                background: "#fff4e6",
                borderLeft: `3px solid ${ACCENT}`,
                borderRadius: "4px",
                padding: "8px 12px",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#7a4a00" }}>
                <strong>推奨タイミング:</strong> {activeCh.recommendedFor}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S6: Certification Process                                         */
/* ------------------------------------------------------------------ */

function S6CertificationProcess(): React.JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<string>(MY_CERT_PATHS[0].product);
  const activePath = MY_CERT_PATHS.find((p) => p.product === selectedProduct) ?? MY_CERT_PATHS[0];

  const costCompareData = MY_CERT_PATHS.map((p) => ({
    product: p.product.split("（")[0],
    "CB Schemeあり（週・レンジ中点）": rangeMidpoint(p.totalWeeksWithCBRange),
    "CB Schemeなし（週・レンジ中点）": rangeMidpoint(p.totalWeeksWithoutCBRange),
  }));

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>CERTIFICATION PROCESS</p>
        <h2 style={SECTION_H2}>認証取得プロセス詳細</h2>
        <p style={SECTION_SUB}>ST CoA、SIRIM製品認証、IECEE CB Schemeを区別した計画用整理。期間・費用は正式見積ではなく内部レンジ。</p>

        {/* Cost comparison bar chart */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>製品別 認証期間比較（CB Schemeあり vs なし）</p>
          <ResponsiveContainer width="100%" height={220} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
            <BarChart data={costCompareData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="product" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: "週", angle: -90, position: "insideLeft", fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
              <Bar dataKey="CB Schemeあり（週・レンジ中点）" fill="#27ae60" />
              <Bar dataKey="CB Schemeなし（週・レンジ中点）" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary table */}
        <div className="table-wrap" style={{ marginBottom: "20px" }}>
          <table className="definition-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>製品</th>
                <th style={{ textAlign: "center" }}>CB Scheme</th>
                <th style={{ textAlign: "center" }}>期間（あり）</th>
                <th style={{ textAlign: "center" }}>期間（なし）</th>
                <th style={{ textAlign: "center" }}>費用（あり）</th>
                <th style={{ textAlign: "center" }}>費用（なし）</th>
              </tr>
            </thead>
            <tbody>
              {MY_CERT_PATHS.map((p) => (
                <tr
                  key={p.product}
                  style={{ cursor: "pointer", background: selectedProduct === p.product ? "#fff4e6" : undefined }}
                  onClick={() => setSelectedProduct(p.product)}
                >
                  <td><strong>{p.product.split("（")[0]}</strong></td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={badge(
                        p.cbScheme === "Full" ? "#e8f5e9" : p.cbScheme === "Partial" ? "#fff8e1" : "#f5f5f5",
                        p.cbScheme === "Full" ? "#2e7d32" : p.cbScheme === "Partial" ? "#f57f17" : "#888"
                      )}
                    >
                      CB {p.cbScheme}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", color: "#27ae60", fontWeight: 700 }}>{formatRange(p.totalWeeksWithCBRange)}週</td>
                  <td style={{ textAlign: "center", color: "#e74c3c", fontWeight: 700 }}>{formatRange(p.totalWeeksWithoutCBRange)}週</td>
                  <td style={{ textAlign: "center" }}>MYR {formatRange(p.totalCostMyrWithCBRange)}</td>
                  <td style={{ textAlign: "center" }}>MYR {formatRange(p.totalCostMyrWithoutCBRange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Step-by-step process */}
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "12px" }}>
          {activePath.product} — ステップ別詳細（行をクリックして製品を切替）
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {activePath.steps.map((step) => (
            <div
              key={step.step}
              style={{
                display: "flex",
                gap: "12px",
                background: "#f9f9fb",
                borderRadius: "8px",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: ACCENT,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem" }}>{step.phase}</p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {step.durationWeeks > 0 && (
                      <span style={badge("#e3f2fd", "#1565c0")}>計画値 {step.durationWeeks}週</span>
                    )}
                    {step.costMyr > 0 && (
                      <span style={badge("#fff8e1", "#f57f17")}>仮定 MYR {step.costMyr.toLocaleString()}</span>
                    )}
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>{step.body}</span>
                  </div>
                </div>
                {step.documents.length > 0 && (
                  <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#777" }}>
                    必要書類: {step.documents.join("・")}
                  </p>
                )}
                {step.notes && (
                  <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#999", fontStyle: "italic" }}>
                    💡 {step.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p style={SOURCE_NOTE}>{CERT_NOTE}</p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S7: Investment Analysis                                           */
/* ------------------------------------------------------------------ */

function S7InvestmentAnalysis(): React.JSX.Element {
  const baseScenario = MY_INVESTMENT.scenarios.find((scenario) => scenario.name === "Base Case")
    ?? MY_INVESTMENT.scenarios[0];
  const cfData = MY_INVESTMENT.cashFlow.map((y) => ({
    year: y.year.replace("（初期投資）", "").replace("（基準シナリオ）", ""),
    revenue: y.revenue / 1000,
    cogs: y.cogs / 1000,
    fixedCost: y.fixedCost / 1000,
    operatingProfit: y.operatingProfit / 1000,
    cumulativeCF: y.cumulativeCF / 1000,
  }));

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>INVESTMENT ANALYSIS</p>
        <h2 style={SECTION_H2}>投資収支分析（5年間）</h2>
        <p style={SECTION_SUB}>共通前提と計算関数から導出する、税引前・借入前の比較用シミュレーション</p>

        {/* KPI summary row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "初期投資（合計）", value: `$${(MY_INVESTMENT.initialInvestmentUsd / 1000).toFixed(0)}K`, color: "#e74c3c" },
            { label: "年間固定費", value: `$${(MY_INVESTMENT.annualFixedCostUsd / 1000).toFixed(0)}K/年`, color: "#e67e22" },
            { label: "損益分岐（基準）", value: baseScenario.breakEvenMonth === null ? "5年内未回収" : `約${baseScenario.breakEvenMonth}ヶ月`, color: "#f39c12" },
            { label: "5年累積CF（基準）", value: `$${(MY_INVESTMENT.cashFlow[MY_INVESTMENT.cashFlow.length - 1].cumulativeCF / 1000).toFixed(0)}K`, color: "#27ae60" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderLeft: `4px solid ${kpi.color}`,
                borderRadius: "8px",
                padding: "14px 16px",
              }}
            >
              <p style={{ margin: "0 0 4px", fontSize: "0.72rem", color: "#888" }}>{kpi.label}</p>
              <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Cash flow chart */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>5年間 売上・累積CF推移（USD千）</p>
          <ResponsiveContainer width="100%" height={300} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
            <LineChart data={cfData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: "USD千", angle: -90, position: "insideLeft", fontSize: 11 }} />
              <Tooltip formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(0)}K`, ""]} />
              <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
              <ReferenceLine y={0} stroke="#e74c3c" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="revenue" stroke="#2980b9" strokeWidth={2} name="売上高" dot={false} />
              <Line type="monotone" dataKey="cumulativeCF" stroke={ACCENT} strokeWidth={2.5} name="累積CF" dot={false} />
              <Line type="monotone" dataKey="operatingProfit" stroke="#27ae60" strokeWidth={1.5} name="営業利益" strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scenarios */}
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "12px" }}>シナリオ別 財務指標</p>
        <div className="table-wrap" style={{ marginBottom: "20px" }}>
          <table className="definition-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>シナリオ</th>
                <th style={{ textAlign: "center" }}>売上倍率</th>
                <th style={{ textAlign: "center" }}>損益分岐</th>
                <th style={{ textAlign: "center" }}>3年ROI</th>
                <th style={{ textAlign: "center" }}>5年NPV</th>
                <th style={{ textAlign: "center" }}>IRR</th>
              </tr>
            </thead>
            <tbody>
              {MY_INVESTMENT.scenarios.map((s) => (
                <tr key={s.name}>
                  <td>
                    <span style={badge(s.color + "22", s.color)}>{s.nameJa}</span>
                  </td>
                  <td style={{ textAlign: "center", fontSize: "0.85rem" }}>×{s.revenueMultiplier.toFixed(1)}</td>
                  <td style={{ textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: s.color }}>
                    {s.breakEvenMonth === null ? "5年内未回収" : `${s.breakEvenMonth}ヶ月`}
                  </td>
                  <td style={{ textAlign: "center", fontSize: "0.85rem" }}>
                    <span style={{ color: s.roi3YearPct >= 0 ? "#27ae60" : "#e74c3c" }}>
                      {s.roi3YearPct >= 0 ? "+" : ""}{s.roi3YearPct}%
                    </span>
                  </td>
                  <td style={{ textAlign: "center", fontSize: "0.85rem" }}>
                    ${(s.npv5YearUsd / 1000).toFixed(0)}K
                  </td>
                  <td style={{ textAlign: "center", fontSize: "0.85rem" }}>{s.irrPct === null ? "算定不能" : `${s.irrPct}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sensitivity */}
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "8px" }}>感度分析</p>
        <div className="table-wrap" style={{ marginBottom: "16px" }}>
          <table className="definition-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>変動パラメータ</th>
                <th style={{ textAlign: "center" }}>基準ケース</th>
                <th style={{ textAlign: "center" }}>楽観</th>
                <th style={{ textAlign: "center" }}>悲観</th>
                <th style={{ textAlign: "center" }}>ROIへの影響</th>
              </tr>
            </thead>
            <tbody>
              {MY_INVESTMENT.sensitivityAnalysis.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{s.parameter}</td>
                  <td style={{ textAlign: "center", fontSize: "0.82rem" }}>{s.baseCase}</td>
                  <td style={{ textAlign: "center", fontSize: "0.82rem", color: "#27ae60" }}>{s.optimistic}</td>
                  <td style={{ textAlign: "center", fontSize: "0.82rem", color: "#e74c3c" }}>{s.pessimistic}</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={badge("#fff8e1", "#f57f17")}>±{s.roiImpactPct}pp</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assumptions */}
        <div
          style={{
            background: "#f9f9fb",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "12px 16px",
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: "0.78rem", fontWeight: 700, color: "#555" }}>試算前提条件</p>
          <ul style={{ paddingLeft: "16px", margin: 0 }}>
            {INVESTMENT_ASSUMPTIONS.map((a, i) => (
              <li key={i} style={{ fontSize: "0.75rem", color: "#777", marginBottom: "3px" }}>{a}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S8: Scenario Analysis                                             */
/* ------------------------------------------------------------------ */

function S8ScenarioAnalysis(): React.JSX.Element {
  const [activeScenario, setActiveScenario] = useState<string>("Base Case");
  const activeSc = MY_SCENARIOS.find((s) => s.name === activeScenario) ?? MY_SCENARIOS[1];

  const marketData = MY_SCENARIOS.map((s) => ({
    name: s.nameJa,
    "市場規模 2031（USD M）": s.marketSize2031UsdM,
    color: s.color,
  }));

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>SCENARIO ANALYSIS</p>
        <h2 style={SECTION_H2}>シナリオ分析</h2>
        <p style={SECTION_SUB}>市場環境の変化に応じた3つの内部シミュレーション。確率・市場規模・CAGRは要追加調査。</p>

        {/* Bar chart */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 320px" }}>
            <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>2031年市場規模 シナリオ比較</p>
            <ResponsiveContainer width={320} height={220} minWidth={0} initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}>
              <BarChart data={marketData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "USD M", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip formatter={(v: number | undefined) => [`$${v ?? 0}M`, "市場規模"]} />
                <Bar dataKey="市場規模 2031（USD M）" radius={[4, 4, 0, 0]}>
                  {marketData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario selector + detail */}
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {MY_SCENARIOS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setActiveScenario(s.name)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: `2px solid ${s.color}`,
                    background: activeScenario === s.name ? s.color : "#fff",
                    color: activeScenario === s.name ? "#fff" : s.color,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {s.nameJa}
                  <br />
                  <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>({s.probability}%)</span>
                </button>
              ))}
            </div>

            {activeSc && (
              <div
                style={{
                  background: "#fff",
                  border: `2px solid ${activeSc.color}`,
                  borderRadius: "8px",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: activeSc.color }}>{activeSc.nameJa}</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#888" }}>CAGR: {activeSc.cagr}% / 2031年: ${activeSc.marketSize2031UsdM}M</p>
                  </div>
                  <span style={badge(activeSc.color + "22", activeSc.color)}>発生確率 {activeSc.probability}%</span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "5px" }}>主要前提条件</p>
                  <ul style={{ paddingLeft: "16px", margin: 0 }}>
                    {activeSc.keyAssumptions.map((a, i) => (
                      <li key={i} style={{ fontSize: "0.78rem", color: "#555", marginBottom: "3px" }}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: activeSc.color + "15",
                    borderLeft: `3px solid ${activeSc.color}`,
                    borderRadius: "4px",
                    padding: "10px 14px",
                    marginBottom: "8px",
                  }}
                >
                  <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700, color: activeSc.color }}>推奨戦略</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#444" }}>{activeSc.recommendedStrategy}</p>
                </div>

                <div
                  style={{
                    background: "#f9f9fb",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>
                    <strong>投資スタンス: </strong>{activeSc.investmentStance}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S9: KPI Dashboard                                                 */
/* ------------------------------------------------------------------ */

function S9KPIDashboard(): React.JSX.Element {
  const categories = Array.from(new Set(MY_KPIS.map((k) => k.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const filteredKPIs = MY_KPIS.filter((k) => k.category === activeCategory);

  const priorityColor = (p: "High" | "Medium" | "Low") => {
    if (p === "High") return { bg: "#fce4ec", fg: "#c62828" };
    if (p === "Medium") return { bg: "#fff8e1", fg: "#f57f17" };
    return { bg: "#e8f5e9", fg: "#2e7d32" };
  };

  return (
    <>
      <section className="content-block content-block--major fade-in">
        <p style={SECTION_KICKER}>KPI DASHBOARD</p>
        <h2 style={SECTION_H2}>KPI・モニタリング指標</h2>
        <p style={SECTION_SUB}>市場参入後の進捗管理に使用するKPI一覧。Y1〜Y3の数値目標と測定頻度。</p>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: `2px solid ${ACCENT}`,
                background: activeCategory === cat ? ACCENT : "#fff",
                color: activeCategory === cat ? "#fff" : ACCENT,
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table className="definition-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "180px" }}>KPI指標</th>
                <th style={{ width: "60px", textAlign: "center" }}>単位</th>
                <th style={{ width: "100px", textAlign: "center" }}>Y1目標</th>
                <th style={{ width: "100px", textAlign: "center" }}>Y2目標</th>
                <th style={{ width: "100px", textAlign: "center" }}>Y3目標</th>
                <th style={{ width: "80px", textAlign: "center" }}>測定頻度</th>
                <th style={{ width: "70px", textAlign: "center" }}>優先度</th>
              </tr>
            </thead>
            <tbody>
              {filteredKPIs.map((kpi, i) => {
                const pc = priorityColor(kpi.priority);
                return (
                  <tr key={i}>
                    <td><strong>{kpi.metric}</strong></td>
                    <td style={{ textAlign: "center", fontSize: "0.78rem", color: "#888" }}>{kpi.unit}</td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#2980b9" }}>
                      {typeof kpi.targetY1 === "number" ? kpi.targetY1.toLocaleString() : kpi.targetY1}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#27ae60" }}>
                      {typeof kpi.targetY2 === "number" ? kpi.targetY2.toLocaleString() : kpi.targetY2}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: ACCENT }}>
                      {typeof kpi.targetY3 === "number" ? kpi.targetY3.toLocaleString() : kpi.targetY3}
                    </td>
                    <td style={{ textAlign: "center", fontSize: "0.75rem", color: "#666" }}>{kpi.frequency}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={badge(pc.bg, pc.fg)}>{kpi.priority}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  S10: Data Sources                                                 */
/* ------------------------------------------------------------------ */

function S10DataSources(): React.JSX.Element {
  return (
    <section className="content-block fade-in">
      <p style={SECTION_KICKER}>DATA SOURCES</p>
      <h2 style={SECTION_H2}>データソース・免責事項</h2>
        <p style={SECTION_SUB}>T6に掲載するデータの出典、参照年、検証状態の一覧</p>

      <div
        style={{
          background: "#f9f9fb",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px 24px",
        }}
      >
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {T6_DATA_SOURCES.map((source) => (
            <li key={source.id} style={{ fontSize: "0.8rem", color: "#555", marginBottom: "12px", lineHeight: 1.5 }}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#1565c0", fontWeight: 700 }}>
                {source.sourceName}: {source.title}
              </a>
              <br />
              <span>{source.publishedOrReferenceYear} / 参照日 {source.accessedOn}</span>
              <br />
              <span>裏付け対象: {source.supports}</span>{" "}
              <span style={badge(source.status === "一次情報で確認" ? "#e8f5e9" : "#fff8e1", source.status === "一次情報で確認" ? "#2e7d32" : "#8a5a00")}>
                {source.status}
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "20px",
            background: "#fff8e1",
            borderLeft: "3px solid #f39c12",
            borderRadius: "4px",
            padding: "10px 14px",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#7a4a00", lineHeight: 1.6 }}>
            <strong>免責事項:</strong>{" "}
            市場規模・製品別市場規模・競合シェア・推定売上・価格・認証費用と期間・シナリオ確率・投資試算は、明記した内部仮定またはシミュレーション値です。
            実際の投資判断に際しては、現地パートナー・専門機関による独立したデューデリジェンスを推奨します。
            有料調査レポートの公開要約だけで具体値を確認できない項目は、ファクトチェック済みとして扱っていません。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main T6 Export                                                    */
/* ------------------------------------------------------------------ */

export default function T6MarketIntelligence(): React.JSX.Element {
  return (
    <>
      <S1BusinessEnvironment />
      <S2CompetitiveIntelligence />
      <S3CustomerSegments />
      <S4ProductMarket />
      <S5DistributionChannels />
      <S6CertificationProcess />
      <S7InvestmentAnalysis />
      <S8ScenarioAnalysis />
      <S9KPIDashboard />
      <S10DataSources />
    </>
  );
}
