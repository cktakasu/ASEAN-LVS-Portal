import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calculateMaxY, generateYTicks, generateChartData } from "./utils";

/* ------------------------------------------------------------------ */
/*  Type Imports                                                       */
/* ------------------------------------------------------------------ */

import type {
  TooltipPayloadItem,
  TooltipProps,
  TabDef,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Hook Imports                                                       */
/* ------------------------------------------------------------------ */

import { useChartTransition } from "./hooks";
import { ForecastBadge, ForecastReferenceArea } from "./components/charts";
import { DonutLabelWithLeaderLine, cbRelevanceColor } from "./components/DonutLabelWithLeaderLine";

/* ------------------------------------------------------------------ */
/*  Legend Component                                                   */
/* ------------------------------------------------------------------ */

interface LegendItemProps {
  color: string;
  label: string;
  isSolid: boolean;
}

const LegendItem: React.FC<LegendItemProps> = React.memo(({ color, label, isSolid }) => {
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

/* ------------------------------------------------------------------ */
/*  Chart Components                                                   */
/* ------------------------------------------------------------------ */

interface GDPChartTooltipProps {
  usdJpy: number;
}

const GDPChartTooltip: React.FC<GDPChartTooltipProps> = React.memo(({ usdJpy }) => {
  const renderTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div style={{ ...TOOLTIP_STYLE, minWidth: "150px" }}>
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

import {
  ECONOMY_KPI_2025,
  GDP_HISTORY,
  INDUSTRY_GDP_2025,
  DATA_SOURCES,
} from "./data/malaysiaEconomyData";
import { ASEAN_GDP_COMPARISON } from "./data/aseanGdpData";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import {
  CB_MARKET_CHART_DATA,
  CB_SECTOR_FOCUS,
  CB_REGIONAL_PROFILE,
} from "./data/malaysiaMarketData";
import {
  MY_POWER_SPECS,
  MY_CB_SCHEME,
  MY_ASEAN_EE_MRA,
  MY_CERT_BODIES,
  REGULATORY_DATA_SOURCES,
  MY_PRODUCT_CERT_REQUIREMENTS,
  MY_CERT_TIMELINE_COMPARISON,
} from "./data/malaysiaRegulatoryData";
import {
  MY_TARIFF_DATA,
  MY_IMPORT_STEPS,
  MY_IMPORT_COSTS,
  MY_DISTRIBUTION_CHANNELS,
  MY_MARKET_PLAYERS,
  MY_PROCUREMENT_STAGES,
  MY_PROCUREMENT_COMPARISON,
  MY_AVL_INFO,
  MY_MARKET_BARRIERS,
  MY_MARKET_FACILITATORS,
  MARKET_ACCESS_DATA_SOURCES,
} from "./data/malaysiaMarketAccessData";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Style Constants                                                   */
/* ------------------------------------------------------------------ */

// Font sizes
const FONT_SIZE = {
  small: "0.78rem",
  medium: "0.85rem",
  large: "0.9rem",
  xlarge: "0.95rem",
  xxlarge: "1rem",
  xxxlarge: "1.1rem",
  header: "1.2rem",
};

// Colors
const COLOR = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  secondary: "#666",
  secondaryLight: "#888",
  tertiary: "#999",
  error: "#dc3545",
  success: "#28a745",
  warning: "#fd7e14",
  info: "#17a2b8",
  text: "#333",
  textLight: "#666",
  disabled: "#999",
  white: "#fff",
  gray: "#e0e0e0",
  lightGray: "#f5f5f5",
};

// Spacing
const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "24px",
  xxxl: "32px",
};

// Common styles (純粋な定数オブジェクト)
const STYLES = {
  flex: {
    center: { display: "flex", justifyContent: "center", alignItems: "center" } as const,
    centerColumn: { display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" as const },
    between: { display: "flex", justifyContent: "space-between", alignItems: "center" } as const,
    wrap: { display: "flex", flexWrap: "wrap" } as const,
  },
  margin: {
    lg: { marginTop: SPACING.lg, marginBottom: SPACING.lg } as const,
  },
  fontSize: {
    small: { fontSize: FONT_SIZE.small } as const,
    medium: { fontSize: FONT_SIZE.medium } as const,
    large: { fontSize: FONT_SIZE.large } as const,
  },
  color: {
    primary: { color: COLOR.primary } as const,
    secondary: { color: COLOR.secondary } as const,
    tertiary: { color: COLOR.tertiary } as const,
    text: { color: COLOR.text } as const,
  },
};

// Tooltip base style (shared across chart tooltips)
const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.97)",
  border: "1px solid #ccc",
  padding: "10px 14px",
  borderRadius: "4px",
  lineHeight: "1.7",
};

// Badge/pill helper
type BadgeVariant = "success" | "warning" | "danger" | "neutral";
const badgeStyle = (variant: BadgeVariant): React.CSSProperties => {
  const map: Record<BadgeVariant, { bg: string; fg: string }> = {
    success: { bg: "#d4edda", fg: "#155724" },
    warning: { bg: "#fff3cd", fg: "#856404" },
    danger:  { bg: "#f8d7da", fg: "#721c24" },
    neutral: { bg: "#f8f9fa", fg: "#6c757d" },
  };
  const { bg, fg } = map[variant];
  return {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: FONT_SIZE.medium,
    fontWeight: 600,
    backgroundColor: bg,
    color: fg,
  };
};

// Info box helper (left-border accent boxes)
const infoBoxStyle = (accentColor: string, bgColor: string): React.CSSProperties => ({
  padding: "12px 16px",
  backgroundColor: bgColor,
  borderLeft: `4px solid ${accentColor}`,
  borderRadius: "4px",
  fontSize: FONT_SIZE.medium,
});

// Source citation style
const SOURCE_STYLE: React.CSSProperties = { fontSize: FONT_SIZE.small, color: COLOR.tertiary, marginTop: "12px" };
const DISCLAIMER_STYLE: React.CSSProperties = { fontSize: "0.75rem", color: "#bbb", marginTop: "4px" };

// チャート設定定数
const CHART_CONFIG = {
  height: 530,
  margin: { top: 10, right: 30, left: 20, bottom: 30 },
  legend: {
    bottom: 80,
    right: 60,
  },
  yAxisStep: 20,
  transitionDuration: 400,
  lineStrokeWidth: 2.5,
  dashArray: "6 4",
} as const;


/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS: TabDef[] = [
  { id: "t1", label: "Country Profile", sublabel: "Is this country worth targeting?" },
  { id: "t2", label: "Market & Demand", sublabel: "Where is the demand?" },
  { id: "t3", label: "Regulatory Gateway", sublabel: "What is required to sell here?" },
  { id: "t4", label: "Market Access", sublabel: "How do we enter this market?" },
  { id: "t5", label: "Competitive Landscape", sublabel: "Who are we competing against?" },
  { id: "t6", label: "Strategy", sublabel: "What should we do?" },
];

/* ------------------------------------------------------------------ */
/*  Tab content components                                             */
/* ------------------------------------------------------------------ */

function T1CountryProfile(): React.JSX.Element {
  // 他国比較用state
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);

  // チャートトランジション用カスタムフック
  const [isYAxisTransitioning, chartTransitionClass, triggerTransition] = useChartTransition(400);

  return (
    <>
      {/* 経済 KPI セクション */}
      <section className="content-block content-block--major">
        <p className="section-kicker">ECONOMIC KEY PERFORMANCE INDICATORS</p>
        <p className="section-subline" style={{ fontSize: "28px", color: "inherit", fontWeight: 600, marginBottom: "8px" }}>主要マクロ経済指標 — Malaysia</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table" style={{ minWidth: "700px", tableLayout: "fixed", width: "100%" }}>
              <colgroup>
                <col style={{ width: "14%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>指標</th>
                  <th>2024年</th>
                  <th>2030年</th>
                  <th>出典</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const gdp2024 = GDP_HISTORY.find(d => d.year === 2024);
                  const gdp2030 = GDP_HISTORY.find(d => d.year === 2030);
                  if (!gdp2024 || !gdp2030) return null;
                  return (
                    <>
                      <tr>
                        <td><strong>GDP（名目）</strong></td>
                        <td>
                          約{(gdp2024.gdp_usd_billion * 140 / 1000).toFixed(1)}兆円 / (USD ${gdp2024.gdp_usd_billion.toFixed(1)}B)
                        </td>
                        <td style={{ color: "#444" }}>
                          約{(gdp2030.gdp_usd_billion * 140 / 1000).toFixed(1)}兆円 / (USD ${gdp2030.gdp_usd_billion.toFixed(1)}B)
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>IMF WEO CR 2025/057</td>
                      </tr>
                      <tr>
                        <td><strong>GDP成長率</strong></td>
                        <td>{ECONOMY_KPI_2025.gdp_growth_pct.toFixed(1)}%</td>
                        <td style={{ color: "#444" }}>
                          4.3%（中期）
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>IMF WEO CR 2025/057</td>
                      </tr>
                      <tr>
                        <td><strong>人口</strong></td>
                        <td>{(ECONOMY_KPI_2025.population_million * 100).toFixed(0).replace(".0", "")}万人</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>Department of Statistics Malaysia</td>
                      </tr>
                      <tr>
                        <td><strong>1人当たりGDP</strong></td>
                        <td>約{Math.round(ECONOMY_KPI_2025.gdp_per_capita_usd * 140 / 10000).toLocaleString()}万円</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>World Bank</td>
                      </tr>
                      <tr>
                        <td><strong>FDI流入額</strong></td>
                        <td>約{Math.round(ECONOMY_KPI_2025.fdi_inflow_usd_billion * 140).toLocaleString()}億円</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>Department of Statistics Malaysia</td>
                      </tr>
                      <tr>
                        <td><strong>主要貿易相手国</strong></td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.82rem" }}>
                            <span>輸出先: 1.シンガポール 2.米国 3.中国</span>
                            <span>輸入元: 1.中国 2.シンガポール 3.米国</span>
                          </div>
                        </td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>MATRADE 2024</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "12px", lineHeight: "1.6" }}>
            ※ {DATA_SOURCES.kpi_note}
          </p>
        </article>
      </section>

      {/* GDP推移グラフ（他国比較機能付き） */}
      {(() => {
        const USD_JPY = 140;

        // チャートデータをキャッシュ化
        const chartData = useMemo(
          () => generateChartData(GDP_HISTORY, ASEAN_GDP_COMPARISON, comparisonCountries, USD_JPY),
          [comparisonCountries]  // comparisonCountriesが変更された時のみ再計算
        );

        // Y軸の最大値を計算
        const maxY = useMemo(
          () => calculateMaxY(chartData, comparisonCountries),
          [chartData, comparisonCountries]
        );

        // Y軸のticksを生成
        const yTicks = useMemo(
          () => generateYTicks(maxY),
          [maxY]
        );

        // Y軸トランジションを考慮した国切替関数
        const toggleCountry = useCallback((iso3: string) => {
          // 常にトランジション発火（滑らかな切り替えのため）
          triggerTransition();

          setComparisonCountries(prev =>
            prev.includes(iso3)
              ? prev.filter(c => c !== iso3)
              : [...prev, iso3]
          );
        }, [triggerTransition]);

        return (
          <section className="content-block">
            <p className="section-kicker">GDP TREND</p>
            <h2 style={{ fontSize: "28px" }}>GDP 推移（実績 + 予測）</h2>
            <p className="section-subline">2015-2030年度 / 単位：兆円（名目GDP・140円/USD）</p>

            <article
              className={`reference-block chart-transition-container ${chartTransitionClass}`}
              style={{ '--chart-transition-duration': `${CHART_CONFIG.transitionDuration}ms` } as React.CSSProperties}
            >
              <div style={{ height: `${CHART_CONFIG.height}px`, position: "relative", outline: "none", userSelect: "none", WebkitUserSelect: "none" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin} style={{ outline: "none", userSelect: "none", WebkitUserSelect: "none" }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" stroke="#666" tick={{ dy: 12 }} />
                    <YAxis
                      stroke="#666"
                      domain={[0, maxY]}
                      ticks={yTicks}
                      tickFormatter={(v) => `${v}`}
                      label={{ value: "GDP（兆円）", angle: -90, position: "insideLeft" }}
                    />
                    {/* 予測期間の背景色（2025-2030） */}
                    <ForecastReferenceArea boundaryYear={2025} forecastEndYear={2030} />
                    <GDPChartTooltip usdJpy={USD_JPY} />
                    {/* マレーシア: 統合ライン（実績+予測）2015-2030 */}
                    <Line
                      type="monotone"
                      dataKey="malaysia"
                      name="マレーシア"
                      stroke="#2563eb"
                      strokeWidth={CHART_CONFIG.lineStrokeWidth}
                      dot={false}
                      activeDot={{ r: 6 }}
                      animationBegin={isYAxisTransitioning ? 500 : 0}
                      animationDuration={900}
                      animationEasing="ease-out"
                    />
                    {/* 比較国のライン */}
                    {comparisonCountries.map((iso3) => {
                      const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === iso3);
                      if (!country) return null;
                      return (
                        <Line
                          key={iso3}
                          type="monotone"
                          dataKey={iso3}
                          name={country.nameJa}
                          stroke={country.color}
                          strokeWidth={1.5}
                          dot={false}
                          activeDot={{ r: 5 }}
                          animationBegin={isYAxisTransitioning ? 500 : 0}
                          animationDuration={900}
                          animationEasing="ease-out"
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
                {/* Actual / Forecast バッジ */}
                <ForecastBadge type="actual" leftPosition="36.5%" />
                <ForecastBadge type="forecast" leftPosition="82%" />
              </div>
              {/* マレーシア注釈 - チェックボックスの上 */}
              <p style={{ ...STYLES.fontSize.medium, ...STYLES.color.secondary, marginTop: "16px", marginBottom: "8px", lineHeight: "1.7", paddingLeft: "80px" }}>
                <span style={{ color: COLOR.primary, fontWeight: 600 }}>●</span> マレーシア: 2015–2024年（実績値）、2025–2030年（IMF WEO予測値）
              </p>
              {/* 比較国選択チェックボックス */}
              <div style={{ ...STYLES.margin.lg, paddingLeft: "80px" }}>
                <div style={{ ...STYLES.flex.wrap, gap: "16px" }}>
                  {ASEAN_GDP_COMPARISON.map((country) => (
                    <label
                      key={country.iso3}
                      style={{
                        ...STYLES.flex.center,
                        gap: "6px",
                        fontSize: FONT_SIZE.large,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={comparisonCountries.includes(country.iso3)}
                        onChange={() => toggleCountry(country.iso3)}
                        style={{ cursor: "pointer" }}
                      />
                      <span
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: country.color,
                        }}
                      />
                      {country.nameJa}
                    </label>
                  ))}
                </div>
              </div>
              {/* 凡例 - グラフ外に配置 */}
              <div style={{
                ...STYLES.flex.center,
                gap: "16px",
                flexWrap: "wrap",
                padding: "10px 14px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "6px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                border: `1px solid ${COLOR.gray}`,
                marginBottom: "16px",
              }}>
                {/* マレーシア */}
                <LegendItem color={COLOR.primary} label="マレーシア" isSolid={true} />
                {/* 比較国 */}
                {comparisonCountries.map(iso3 => {
                  const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === iso3);
                  if (!country) return null;
                  return <LegendItem key={iso3} color={country.color} label={country.nameJa} isSolid={true} />;
                })}
              </div>
              <p style={{ ...STYLES.fontSize.small, ...STYLES.color.tertiary, marginTop: "4px", lineHeight: "1.6" }}>
                ※ 円換算レート：1 USD＝140円（固定）。為替変動により実際の円換算額は異なります。
              </p>
              <p style={{ ...STYLES.fontSize.small, ...STYLES.color.tertiary, marginTop: "2px", lineHeight: "1.6" }}>
                出典：{DATA_SOURCES.gdp}
              </p>
            </article>

          </section>
        );
      })()}

      {/* 産業別GDP構成比 */}
      <section className="content-block">
        <p className="section-kicker">INDUSTRY COMPOSITION</p>
        <h2 style={{ fontSize: "28px" }}>産業別 GDP 構成比（2025年度）</h2>
        <p className="section-subline">セクター別のシェアと成長率</p>
        <article className="reference-block">
          <div className="industry-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
            {/* テーブル */}
            <div style={{ minWidth: 0 }}>
              <div className="table-wrap">
                <table className="definition-table" style={{ width: "100%", minWidth: "unset", tableLayout: "fixed", fontSize: "0.88rem" }}>
                  <colgroup>
                    <col style={{ width: "48%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "32%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>産業セクター</th>
                      <th>GDP比率</th>
                      <th>遮断器需要連動</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDUSTRY_GDP_2025.map((item) => (
                      <tr key={item.sector}>
                        <td><strong>{item.sector}</strong></td>
                        <td>{item.gdp_share_pct.toFixed(1)}%</td>
                        <td>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              backgroundColor: cbRelevanceColor(item.cb_relevance),
                              color: "#fff",
                            }}
                          >
                            {item.cb_relevance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "12px" }}>
                ※ 遮断器需要連動：低圧遮断器市場との関連性を示します。
              </p>
              <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                出典: {DATA_SOURCES.industry}
              </p>
            </div>
            {/* ドーナツチャート */}
            <div style={{ height: "360px" }} className="chart-transition-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 50, bottom: 20, left: 50 }}>
                  <Pie
                    data={INDUSTRY_GDP_2025}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="gdp_share_pct"
                    label={<DonutLabelWithLeaderLine />}
                    labelLine={false}
                    isAnimationActive={false}
                    style={{ cursor: "default", pointerEvents: "none" }}
                  >
                    {INDUSTRY_GDP_2025.map((entry) => (
                      <Cell
                        key={entry.sector}
                        fill={cbRelevanceColor(entry.cb_relevance)}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      </section>

      <T1PowerSpecs />
    </>
  );
}


/* ------------------------------------------------------------------ */
/*  T1: Power Specifications (moved from T3)                           */
/* ------------------------------------------------------------------ */

function T1PowerSpecs(): React.JSX.Element {
  return (
    <section className="content-block fade-in">
      <p className="section-kicker">POWER SPECIFICATIONS</p>
      <h2 style={{ fontSize: "28px" }}>電力仕様・配電システム</h2>
      <p className="section-subline">Voltage, Frequency, Distribution System — Malaysia</p>

      <article className="reference-block">
        <h3>低圧電力仕様</h3>
        <div className="legend-inline">
          <div className="legend-inline-item">
            <strong>単相:</strong>
            <span>{MY_POWER_SPECS.voltage_lv.single_phase}</span>
          </div>
          <div className="legend-inline-item">
            <strong>三相:</strong>
            <span>{MY_POWER_SPECS.voltage_lv.three_phase}</span>
          </div>
          <div className="legend-inline-item">
            <strong>周波数:</strong>
            <span>{MY_POWER_SPECS.frequency}</span>
          </div>
          <div className="legend-inline-item">
            <strong>プラグ:</strong>
            <span>{MY_POWER_SPECS.plug_type}</span>
          </div>
          <div className="legend-inline-item">
            <strong>配電方式:</strong>
            <span>{MY_POWER_SPECS.distribution_system}</span>
          </div>
        </div>
      </article>

      <article className="reference-block">
        <h3>電力会社</h3>
        <div className="table-wrap">
          <table className="definition-table">
            <thead>
              <tr>
                <th>地域</th>
                <th>電力会社</th>
                <th>略称</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {MY_POWER_SPECS.utility_companies.map((utility) => (
                <tr key={utility.abbreviation}>
                  <td>{utility.region}</td>
                  <td>
                    <strong>{utility.name}</strong>
                  </td>
                  <td>{utility.abbreviation}</td>
                  <td style={{ fontSize: "0.85rem" }}>{utility.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={SOURCE_STYLE}>
          出典: {REGULATORY_DATA_SOURCES.power_specs}
        </p>
      </article>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  T3: Regulatory Gateway — Section Components                        */
/* ------------------------------------------------------------------ */

// 3-1 Product Certification Requirements
function T3ProductCertRequirements(): React.JSX.Element {
  return (
    <section className="content-block content-block--major fade-in">
      <p className="section-kicker">PRODUCT CERTIFICATION REQUIREMENTS</p>
      <h2 style={{ fontSize: "28px" }}>製品別認証要件</h2>
      <p className="section-subline">Do I need certification? — Product × Requirement Matrix</p>

      <article className="reference-block">
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>製品</th>
                <th>適用規格</th>
                <th>法的義務</th>
                <th>認証マーク</th>
                <th>実務上の必要性</th>
                <th>要点</th>
              </tr>
            </thead>
            <tbody>
              {MY_PRODUCT_CERT_REQUIREMENTS.map((req) => (
                <tr key={req.product_type}>
                  <td><strong>{req.product_type}</strong></td>
                  <td>{req.applicable_standard}</td>
                  <td style={{
                    fontWeight: 600,
                    color: req.requirement_level === "Mandatory" ? "#c00" : "#885500",
                  }}>
                    {req.requirement_level === "Mandatory" ? "必須" : "任意"}
                  </td>
                  <td>{req.certification_mark}</td>
                  <td>
                    <span style={badgeStyle(
                      req.practical_necessity === "Required" ? "success"
                      : req.practical_necessity === "Recommended" ? "warning"
                      : "neutral"
                    )}>
                      {req.practical_necessity === "Required" ? "必須"
                        : req.practical_necessity === "Recommended" ? "推奨"
                        : "任意"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem" }}>{req.key_notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...infoBoxStyle("#fd7e14", "#fff8e1"), marginTop: "16px" }}>
          <strong>要約:</strong> MCB・RCCB・RCBOは
          <span style={{ color: "#c00", fontWeight: 600 }}> ST-SIRIM CoA必須</span>（住宅用途）。
          ACB・MCCBは法的義務なしだが、
          <span style={{ color: "#885500", fontWeight: 600 }}> プロジェクト入札にはCoA事実上必要</span>。
        </div>

        <p style={SOURCE_STYLE}>
          出典: {REGULATORY_DATA_SOURCES.standards}
        </p>
        <p style={DISCLAIMER_STYLE}>
          ※ 本データは参考値です。最新情報はSIRIM QAS / Suruhanjaya Tenagaの公式情報をご確認ください。
        </p>
      </article>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  T3: Regulatory Gateway (Main)                                      */
/* ------------------------------------------------------------------ */

function T3RegulatoryGateway(): React.JSX.Element {
  return (
    <>
      <T3ProductCertRequirements />
    </>
  );
}


/* ------------------------------------------------------------------ */
/*  T2: 市場規模チャート用ツールチップ                                */
/* ------------------------------------------------------------------ */

const MarketSizeTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const central = (payload.find(p => p.dataKey === "market_size_jpy")?.value as number | undefined);
  const low = (payload.find(p => p.dataKey === "market_size_low_jpy")?.value as number | undefined);
  const bandWidth = (payload.find(p => p.dataKey === "band_width_jpy")?.value as number | undefined);
  const high = low != null && bandWidth != null ? low + bandWidth : undefined;

  // 円 → 億円 変換
  const toOkuYen = (yen: number) => Math.round(yen / 100000000);

  return (
    <div style={{ ...TOOLTIP_STYLE, minWidth: "200px" }}>
      <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#333" }}>{label}年</p>
      {central != null && (
        <p style={{ margin: "0 0 2px", fontSize: "0.9rem" }}>
          <span style={{ color: "#FF6600", fontWeight: 600 }}>●</span>
          {" "}中央推定値: 約{toOkuYen(central).toLocaleString()}億円
        </p>
      )}
      {low != null && high != null && (
        <p style={{ margin: "0", fontSize: "0.82rem", color: "#888" }}>
          レンジ: {toOkuYen(low).toLocaleString()} 〜 {toOkuYen(high).toLocaleString()}億円
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  T2: Market & Demand                                                */
/* ------------------------------------------------------------------ */

function T2MarketAndDemand(): React.JSX.Element {
  // 円換算レート（1 USD = 140 JPY）
  const USD_JPY = 140;

  // USD Million → 億円
  const usdMillionToOkuYen = (usdMillion: number): number => {
    return Math.round(usdMillion * USD_JPY / 100);
  };

  // KPI 計算（2025→2031 のCAGR）
  const kpiBase = CB_MARKET_CHART_DATA.find(d => d.year === 2025) ?? CB_MARKET_CHART_DATA[0];
  const kpiLast = CB_MARKET_CHART_DATA.find(d => d.year === 2031) ?? CB_MARKET_CHART_DATA[CB_MARKET_CHART_DATA.length - 1];
  const nYears = kpiLast.year - kpiBase.year;
  const cagr = (Math.pow(kpiLast.market_size_usd_million / kpiBase.market_size_usd_million, 1 / nYears) - 1) * 100;

  // 成長見通しアイコン表示
  const growthOutlookIcon = (outlook: string) => {
    const icons = {
      very_high: { symbol: "◎", color: "#28a745", label: "Very High" },
      high: { symbol: "○", color: "#4A90D9", label: "High" },
      medium: { symbol: "○", color: "#d97706", label: "Medium" },
      low: { symbol: "△", color: "#dc3545", label: "Low" },
    };
    return icons[outlook as keyof typeof icons] || icons.medium;
  };

  // 星評価表示
  const starRating = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // 円換算済みの市場規模チャートデータ（1USD = 140JPY）
  const CB_MARKET_CHART_DATA_JPY = useMemo(() => {
    return CB_MARKET_CHART_DATA.map(d => ({
      ...d,
      market_size_jpy: d.market_size_usd_million * USD_JPY * 1000000, // 円
      market_size_low_jpy: d.market_size_low_usd_million != null ? d.market_size_low_usd_million * USD_JPY * 1000000 : undefined,
      market_size_high_jpy: d.market_size_high_usd_million != null ? d.market_size_high_usd_million * USD_JPY * 1000000 : undefined,
      band_width_jpy: d.band_width != null ? d.band_width * USD_JPY * 1000000 : undefined,
    }));
  }, [CB_MARKET_CHART_DATA]);

  return (
    <>
      {/* ============================================================ */}
      {/* Section 2-1: 市場概況                                         */}
      {/* ============================================================ */}
      <section className="content-block content-block--major">
        <p className="section-kicker">MARKET SIZE OVERVIEW</p>
        <h2 style={{ fontSize: "28px" }}>マレーシア低圧遮断器市場規模外観</h2>
        <p className="section-subline">Low Voltage Circuit Breaker Market — Malaysia（2020-2031）</p>

        {/* KPI カード */}
        <div style={{ width: "100%", maxWidth: "1024px", marginLeft: "auto", marginRight: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            {
              label: "ASEANランク",
              value: "#2",
              sub: "ASEAN低圧遮断器市場規模",
              color: "#4A90D9",
            },
            {
              label: "市場規模（2025）",
              value: `約${usdMillionToOkuYen(kpiBase.market_size_usd_million).toLocaleString()}億円`,
              sub: kpiBase.market_size_low_usd_million && kpiBase.market_size_high_usd_million
                ? `レンジ: ${usdMillionToOkuYen(kpiBase.market_size_low_usd_million).toLocaleString()} 〜 ${usdMillionToOkuYen(kpiBase.market_size_high_usd_million).toLocaleString()}億円`
                : `USD ${kpiBase.market_size_usd_million}M`,
              color: "#FF6600",
            },
            {
              label: "市場規模（2031）",
              value: `約${usdMillionToOkuYen(kpiLast.market_size_usd_million).toLocaleString()}億円`,
              sub: kpiLast.market_size_low_usd_million && kpiLast.market_size_high_usd_million
                ? `レンジ: ${usdMillionToOkuYen(kpiLast.market_size_low_usd_million).toLocaleString()} 〜 ${usdMillionToOkuYen(kpiLast.market_size_high_usd_million).toLocaleString()}億円`
                : `USD ${kpiLast.market_size_usd_million}M`,
              color: "#FF6600",
            },
            {
              label: "CAGR（2025-2031）",
              value: `${cagr.toFixed(1)}%`,
              sub: "複合年間成長率",
              color: "#FF8C00",
            },
          ].map(card => (
            <div key={card.label} style={{
              padding: "16px 20px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {card.label}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "1.5rem", fontWeight: 700, color: card.color }}>
                {card.value}
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* 市場定義スコープ */}
        <div style={{ marginBottom: "24px", padding: "12px 16px", backgroundColor: "#f8f9fa", borderRadius: "6px", border: "1px solid #e9ecef" }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#495057" }}>
            <strong>市場定義スコープ:</strong> LV CB only, excl. fuses / MV / HV
          </p>
        </div>

        {/* 市場規模折れ線グラフ（推移と不確実性レンジ） */}
        <article className="reference-block">
          <div style={{ position: "relative", height: "360px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CB_MARKET_CHART_DATA_JPY} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="year" stroke="#666" tick={{ dy: 12 }} />
                <YAxis
                  stroke="#666"
                  tickFormatter={(v) => `${Math.round(v / 100000000)}億円`}
                />
                {/* ツールチップ */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip content={<MarketSizeTooltip active={false} payload={[]} label="" /> as any} />
                {/* オレンジ帯: 不確実性レンジ */}
                <Area
                  dataKey="market_size_low_jpy"
                  stackId="band"
                  fill="transparent"
                  stroke="none"
                  isAnimationActive={false}
                />
                <Area
                  dataKey="band_width_jpy"
                  stackId="band"
                  fill="rgba(255,140,0,0.20)"
                  stroke="none"
                  isAnimationActive={false}
                />
                {/* 中央推定値ライン */}
                <Line
                  type="monotone"
                  dataKey="market_size_jpy"
                  stroke="#FF6600"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#FF6600" }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "24px", height: "3px", backgroundColor: "#FF6600" }} />
              <span style={{ fontSize: "0.82rem", color: "#666" }}>中央推定値</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "24px", height: "12px", backgroundColor: "rgba(255,140,0,0.20)", border: "1px solid rgba(255,140,0,0.4)" }} />
              <span style={{ fontSize: "0.82rem", color: "#666" }}>不確実性レンジ（Low〜High）</span>
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "10px", lineHeight: "1.6" }}>
            出典: 6Wresearch "Malaysia Circuit Breaker Market (2025-2031)"
          </p>
        </article>
      </section>

      {/* ============================================================ */}
      {/* Section 2-2: 地域概況                                         */}
      {/* ============================================================ */}
      <section className="content-block content-block--major">
        <p className="section-kicker">REGIONAL PROFILE</p>
        <h2 style={{ fontSize: "28px" }}>地域概況</h2>
        <p className="section-subline">州別のGDP・主要産業・成長産業</p>

        {/* 地域概況テーブル */}
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table" style={{ width: "100%", fontSize: "0.88rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>州</th>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "right", fontWeight: 600 }}>
                    GDP (兆円 / USD Bn)
                    <div style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--text-sub-dark)", marginTop: "2px", whiteSpace: "nowrap" }}>DOSM GDP by State 2024</div>
                  </th>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>全国比</th>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>成長率</th>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>主要産業</th>
                  <th style={{ padding: "12px 10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>成長産業</th>
                </tr>
              </thead>
              <tbody>
                {CB_REGIONAL_PROFILE.map((state) => (
                  <tr key={state.state_name}>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", fontWeight: 600 }}>{state.state_name_ja}</td>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right", whiteSpace: "nowrap" }}>
                      約{(state.gdp_usd_billion * USD_JPY / 1000).toFixed(1)}兆円 <span style={{ fontSize: "0.75rem", color: "#999" }}>(USD {state.gdp_usd_billion.toFixed(1)}B)</span>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>{state.gdp_national_share_pct.toFixed(1)}%</td>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right", color: state.gdp_growth_pct >= 5.1 ? "#28a745" : state.gdp_growth_pct >= 4 ? "#d97706" : "#dc3545", fontWeight: 600 }}>
                      {state.gdp_growth_pct.toFixed(1)}%
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", fontSize: "0.85rem" }}>{state.major_industries}</td>
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", fontSize: "0.85rem" }}>{state.growing_industries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={SOURCE_STYLE}>
            上位5州（Selangor、KL/Putrajaya、Johor、Sarawak、Penang）でマレーシアGDPの約68%を占め、LV遮断器の需要もこの5州に集中すると見られる。<br />
            ※ 全国平均成長率5.1%超の州を緑色で表示。出典: DOSM, GDP by State 2024（2025年7月1日発表）
          </p>
        </article>
      </section>

      {/* ============================================================ */}
      {/* Section 2-3: 注目市場                                         */}
      {/* ============================================================ */}
      <section className="content-block content-block--major">
        <p className="section-kicker">SECTOR FOCUS</p>
        <h2 style={{ fontSize: "28px" }}>注目市場</h2>
        <p className="section-subline">LV遮断器の販売先として注目すべきセクター</p>

        {/* セクター比較テーブル */}
        <article className="reference-block" style={{ marginTop: "24px" }}>
          <div className="table-wrap">
            <table className="definition-table" style={{ width: "100%", fontSize: "0.85rem", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "50%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, fontSize: "0.82rem" }}>セクター</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, fontSize: "0.82rem" }}>セクター概要</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "center", fontWeight: 600, fontSize: "0.82rem" }}>成長見通し</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "center", fontWeight: 600, fontSize: "0.82rem" }}>総合評価</th>
                </tr>
              </thead>
              <tbody>
                {CB_SECTOR_FOCUS.map((sector) => {
                  const growthIcon = growthOutlookIcon(sector.growth_outlook);

                  return (
                    <React.Fragment key={sector.sector_name}>
                      {/* メインテーブル行 */}
                      <tr>
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", fontWeight: 600 }}>
                          {sector.sector_name}
                        </td>
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", fontSize: "0.82rem", lineHeight: "1.6" }}>
                          {sector.sector_overview}
                          {sector.source && (
                            <div style={{ fontSize: "0.7rem", color: "#999", marginTop: "4px" }}>
                              出典: {sector.source}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "1rem",
                              color: growthIcon.color,
                              fontWeight: 600
                            }}
                            title={growthIcon.label}
                          >
                            {growthIcon.symbol}
                          </span>
                        </td>
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", textAlign: "center" }}>
                          <span style={{
                            fontSize: "0.85rem",
                            color: "#FF6600",
                            letterSpacing: "1px"
                          }}>
                            {starRating(sector.overall_rating)}
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* テーブル凡例 */}
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            fontSize: "0.82rem"
          }}>
            <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#495057" }}>
              成長見通し凡例:
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ color: "#28a745" }}><strong>◎</strong> Very High (成長率 8%+)</span>
              <span style={{ color: "#4A90D9" }}><strong>○</strong> High (成長率 5-8%)</span>
              <span style={{ color: "#d97706" }}><strong>○</strong> Medium (成長率 3-5%)</span>
              <span style={{ color: "#dc3545" }}><strong>△</strong> Low (成長率 3%未満)</span>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  T4: Market Access — Section Components                             */
/* ------------------------------------------------------------------ */

// 4-1 Trade & Tariff Regime
function T4TariffRegime(): React.JSX.Element {
  return (
    <section className="content-block content-block--major fade-in">
      <p className="section-kicker">TRADE &amp; TARIFF REGIME</p>
      <h2 style={{ fontSize: "28px" }}>貿易・関税制度</h2>
      <p className="section-subline">
        What does it cost to import LV switchgear into Malaysia?
      </p>

      {/* --- Tariff Table --- */}
      <article className="reference-block">
        <h3>HS Code別 関税率一覧</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>製品</th>
                <th>HSコード</th>
                <th>品目説明</th>
                <th>MFN税率</th>
                <th>ATIGA</th>
                <th>JMEPA</th>
                <th>RCEP</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {MY_TARIFF_DATA.map((row) => (
                <tr key={`${row.product_type}-${row.hs_code}`}>
                  <td><strong>{row.product_label ?? row.product_type}</strong></td>
                  <td style={{ fontFamily: "monospace" }}>{row.hs_code}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{row.hs_description}</td>
                  <td style={{ fontWeight: 600, color: row.mfn_rate_pct > 0 ? "#c00" : COLOR.success }}>
                    {row.mfn_rate_pct}%
                  </td>
                  <td>
                    <span style={badgeStyle(row.atiga_rate_pct === 0 ? "success" : "warning")}>
                      {row.atiga_rate_pct}%
                    </span>
                  </td>
                  <td>{row.jmepa_rate_pct != null ? `${row.jmepa_rate_pct}%` : "—"}</td>
                  <td>{row.rcep_rate_pct != null ? `${row.rcep_rate_pct}%` : "—"}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{row.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...infoBoxStyle("#28a745", "#f0fff4"), marginTop: "16px" }}>
          <strong>ポイント:</strong> ATIGA適用により
          <span style={{ color: COLOR.success, fontWeight: 600 }}> ASEAN域内製造品は関税0%</span>。
          日本（福山拠点）からの直接輸出はMFN 15%だが、
          <span style={{ color: "#004085", fontWeight: 600 }}> JMEPA原産地証明で実質0%</span>に軽減可能。
          <br />
          <strong>注意:</strong> 630A超MCCBはACBと同じ
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}> 8536.20.19</span> に分類。
          境界値製品は<span style={{ color: "#885500", fontWeight: 600 }}> JKDM Advance Ruling（事前教示）</span>の取得を推奨。
        </div>

        <p style={SOURCE_STYLE}>
          出典: {MARKET_ACCESS_DATA_SOURCES.tariff}
        </p>
        <p style={DISCLAIMER_STYLE}>
          ※ 関税率は暫定値です（2026年3月時点）。最新のHS分類・税率はJKDM公式ツール（https://ezhs.customs.gov.my/）でご確認ください。境界値製品はAdvance Rulingによる事前確定を推奨します。
        </p>
      </article>

      {/* --- Import Cost Breakdown --- */}
      <article className="reference-block">
        <h3>輸入コスト構成</h3>
        <div className="table-wrap">
          <table className="definition-table">
            <thead>
              <tr>
                <th>費目</th>
                <th>税率/金額</th>
                <th>課税ベース</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {MY_IMPORT_COSTS.map((cost) => (
                <tr key={cost.cost_item}>
                  <td><strong>{cost.cost_item}</strong></td>
                  <td style={{ fontWeight: 600 }}>{cost.rate_or_amount}</td>
                  <td>{cost.basis}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{cost.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* --- Import Process Flow --- */}
      <article className="reference-block">
        <h3>輸入手続きフロー</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
          {MY_IMPORT_STEPS.map((step, idx) => (
            <div key={step.step_number} style={{
              padding: "12px 16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              borderLeft: `4px solid ${idx === 0 ? COLOR.primary : "#999"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{
                  ...badgeStyle("neutral"),
                  minWidth: "32px",
                  textAlign: "center" as const,
                }}>
                  Step {step.step_number}
                </span>
                <strong style={{ fontSize: "1rem" }}>{step.step_title}</strong>
                <span style={{ fontSize: "0.8rem", color: "#888" }}>({step.step_title_en})</span>
              </div>
              <div style={{ fontSize: FONT_SIZE.medium, color: "#555", marginBottom: "4px" }}>
                <strong>担当:</strong> {step.responsible_party}
                {step.typical_duration && (
                  <span style={{ marginLeft: "16px" }}>
                    <strong>所要期間:</strong> {step.typical_duration}
                  </span>
                )}
              </div>
              <ul style={{ margin: "4px 0 0", paddingLeft: "20px", fontSize: FONT_SIZE.medium }}>
                {step.key_actions.map((action, i) => (
                  <li key={`step${step.step_number}-action${i}`}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={SOURCE_STYLE}>
          出典: {MARKET_ACCESS_DATA_SOURCES.import_process}
        </p>
        <p style={DISCLAIMER_STYLE}>
          ※ 手続きフローは概要です。製品カテゴリー・輸入量により手続きが異なる場合があります。
        </p>
      </article>
    </section>
  );
}

// 4-2 Distribution Structure
function T4DistributionStructure(): React.JSX.Element {
  return (
    <section className="content-block fade-in">
      <p className="section-kicker">DISTRIBUTION STRUCTURE</p>
      <h2 style={{ fontSize: "28px" }}>流通構造</h2>
      <p className="section-subline">
        How does LV switchgear reach the end user in Malaysia?
      </p>

      {/* --- Channel Comparison Table --- */}
      <article className="reference-block">
        <h3>チャネル別特性比較</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>チャネル</th>
                <th>概要</th>
                <th>主要顧客</th>
                <th>推定シェア</th>
                <th>マージン</th>
                <th>強み</th>
                <th>弱み</th>
              </tr>
            </thead>
            <tbody>
              {MY_DISTRIBUTION_CHANNELS.map((ch) => (
                <tr key={ch.channel_type}>
                  <td><strong>{ch.channel_name_ja}</strong></td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{ch.description}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{ch.target_customers}</td>
                  <td style={{ fontWeight: 600 }}>{ch.volume_share_pct || "—"}</td>
                  <td>{ch.typical_margin_pct || "—"}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{ch.strengths.join("、")}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{ch.weaknesses.join("、")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* --- Key Market Players --- */}
      <article className="reference-block">
        <h3>主要ディストリビューター / パネルビルダー</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {MY_MARKET_PLAYERS.map((player) => (
            <div key={player.company_name} style={{
              padding: "12px 16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              borderLeft: `4px solid ${player.company_type === "Distributor" ? "#FF6600" : COLOR.primary}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <strong style={{ fontSize: "1rem" }}>{player.company_name}</strong>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: player.company_type === "Distributor" ? "#fff3cd" : "#d4edda",
                  color: player.company_type === "Distributor" ? "#856404" : "#155724",
                }}>
                  {player.company_type}
                </span>
                <span style={badgeStyle(
                  player.estimated_scale === "Large" ? "success"
                  : player.estimated_scale === "Medium" ? "warning"
                  : "neutral"
                )}>
                  {player.estimated_scale}
                </span>
              </div>
              <div style={{ marginTop: "8px", fontSize: FONT_SIZE.medium, color: COLOR.secondary }}>
                <span>カバー地域: {player.coverage}</span>
                {player.specialization && <span> | 専門: {player.specialization}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...infoBoxStyle("#fd7e14", "#fff8e1"), marginTop: "16px" }}>
          <strong>注:</strong> 主要プレーヤーのリストは調査中です。
          実際の企業名・取引情報は業界ヒアリングに基づき更新予定。
        </div>
      </article>

      <p style={SOURCE_STYLE}>
        出典: {MARKET_ACCESS_DATA_SOURCES.distribution}
      </p>
      <p style={DISCLAIMER_STYLE}>
        ※ シェア・マージン数値は業界推定であり、公式統計ではありません。
      </p>
    </section>
  );
}

// 4-3 Project Procurement Ecosystem
function T4ProjectProcurementEcosystem(): React.JSX.Element {
  return (
    <section className="content-block fade-in">
      <p className="section-kicker">PROJECT PROCUREMENT ECOSYSTEM</p>
      <h2 style={{ fontSize: "28px" }}>プロジェクト調達エコシステム</h2>
      <p className="section-subline">
        How are LV switchgear specified and procured in Malaysian projects?
      </p>

      {/* --- Procurement Stage Flow --- */}
      <article className="reference-block">
        <h3>案件の仕様決定 → 発注プロセス</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "14px" }}>
          {MY_PROCUREMENT_STAGES.map((stage, idx) => (
            <div key={stage.stage_number}>
              <div style={{
                padding: "16px",
                backgroundColor: stage.decision_influence === "High" ? "#f0f7ff" : "#f8f9fa",
                borderRadius: idx === 0 ? "8px 8px 0 0" : idx === MY_PROCUREMENT_STAGES.length - 1 ? "0 0 8px 8px" : "0",
                borderLeft: `4px solid ${stage.decision_influence === "High" ? COLOR.primary : stage.decision_influence === "Medium" ? "#fd7e14" : "#999"}`,
                borderBottom: idx < MY_PROCUREMENT_STAGES.length - 1 ? "1px dashed #ddd" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: COLOR.primary,
                    color: "#fff",
                    fontSize: FONT_SIZE.medium,
                    fontWeight: 700,
                  }}>
                    {stage.stage_number}
                  </span>
                  <strong style={{ fontSize: "1rem" }}>{stage.stage_name}</strong>
                  <span style={{ fontSize: "0.8rem", color: "#888" }}>({stage.stage_name_en})</span>
                  <span style={badgeStyle(
                    stage.decision_influence === "High" ? "danger"
                    : stage.decision_influence === "Medium" ? "warning"
                    : "neutral"
                  )}>
                    影響度: {stage.decision_influence}
                  </span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: FONT_SIZE.medium, color: "#555" }}>
                  <strong>キーアクター:</strong> {stage.key_actors.join("、")}
                </p>
                <p style={{ margin: "0 0 4px", fontSize: FONT_SIZE.medium }}>{stage.description}</p>
                <div style={{ ...infoBoxStyle("#17a2b8", "#f0f9ff"), marginTop: "8px", padding: "8px 12px" }}>
                  <strong>LVタッチポイント:</strong> {stage.lv_touchpoint}
                </div>
              </div>
              {idx < MY_PROCUREMENT_STAGES.length - 1 && (
                <div style={{ textAlign: "center" as const, color: "#999", fontSize: "1.2rem", lineHeight: "1" }}>
                  ▼
                </div>
              )}
            </div>
          ))}
        </div>
      </article>

      {/* --- Government vs Private Comparison --- */}
      <article className="reference-block">
        <h3>政府調達 vs 民間調達の比較</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>比較軸</th>
                <th>政府調達</th>
                <th>民間調達</th>
              </tr>
            </thead>
            <tbody>
              {MY_PROCUREMENT_COMPARISON.map((row) => (
                <tr key={row.dimension}>
                  <td><strong>{row.dimension}</strong></td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{row.government}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{row.private_sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* --- AVL Structure --- */}
      <article className="reference-block">
        <h3>AVL（Approved Vendor List）の仕組み</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>AVLオーナー</th>
                <th>代表例</th>
                <th>登録要件</th>
                <th>登録ブランド数</th>
                <th>影響度</th>
              </tr>
            </thead>
            <tbody>
              {MY_AVL_INFO.map((avl) => (
                <tr key={avl.avl_owner_type}>
                  <td><strong>{avl.avl_owner_type}</strong></td>
                  <td>{avl.avl_owner_example}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>
                    <ul style={{ margin: 0, paddingLeft: "16px" }}>
                      {avl.entry_requirements.map((req, i) => (
                        <li key={`avl-${avl.avl_owner_type}-req${i}`}>{req}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{avl.typical_brands_count || "—"}</td>
                  <td>
                    <span style={badgeStyle(
                      avl.influence_level === "High" ? "danger"
                      : avl.influence_level === "Medium" ? "warning"
                      : "neutral"
                    )}>
                      {avl.influence_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <p style={SOURCE_STYLE}>
        出典: {MARKET_ACCESS_DATA_SOURCES.procurement}
      </p>
      <p style={DISCLAIMER_STYLE}>
        ※ 調達プロセスは案件規模・セクターにより大きく異なります。本情報は一般的な構造を示すものです。
      </p>
    </section>
  );
}

// 4-4 Barriers & Facilitators
function T4BarriersAndFacilitators(): React.JSX.Element {
  return (
    <section className="content-block fade-in">
      <p className="section-kicker">BARRIERS &amp; FACILITATORS</p>
      <h2 style={{ fontSize: "28px" }}>市場アクセス障壁と促進要因</h2>
      <p className="section-subline">
        What makes market entry harder — and what makes it easier?
      </p>

      {/* --- Barriers Table --- */}
      <article className="reference-block">
        <h3>市場アクセス障壁</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>カテゴリー</th>
                <th>障壁</th>
                <th>深刻度</th>
                <th>説明</th>
                <th>対象製品</th>
              </tr>
            </thead>
            <tbody>
              {MY_MARKET_BARRIERS.map((b) => (
                <tr key={b.barrier_id}>
                  <td style={{ fontFamily: "monospace", fontSize: FONT_SIZE.medium }}>{b.barrier_id}</td>
                  <td>
                    <span style={badgeStyle("neutral")}>{b.category}</span>
                  </td>
                  <td><strong>{b.barrier_name}</strong></td>
                  <td>
                    <span style={badgeStyle(
                      b.severity === "High" ? "danger"
                      : b.severity === "Medium" ? "warning"
                      : "neutral"
                    )}>
                      {b.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{b.description}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>
                    {Array.isArray(b.affected_products) ? b.affected_products.join(", ") : b.affected_products}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* --- Facilitators Table --- */}
      <article className="reference-block">
        <h3>市場アクセス促進要因</h3>
        <div className="table-wrap">
          <table className="requirements-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>カテゴリー</th>
                <th>促進要因</th>
                <th>インパクト</th>
                <th>説明</th>
                <th>対象製品</th>
              </tr>
            </thead>
            <tbody>
              {MY_MARKET_FACILITATORS.map((f) => (
                <tr key={f.facilitator_id}>
                  <td style={{ fontFamily: "monospace", fontSize: FONT_SIZE.medium }}>{f.facilitator_id}</td>
                  <td>
                    <span style={badgeStyle("neutral")}>{f.category}</span>
                  </td>
                  <td><strong>{f.facilitator_name}</strong></td>
                  <td>
                    <span style={badgeStyle(
                      f.impact === "High" ? "success"
                      : f.impact === "Medium" ? "warning"
                      : "neutral"
                    )}>
                      {f.impact}
                    </span>
                  </td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>{f.description}</td>
                  <td style={{ fontSize: FONT_SIZE.medium }}>
                    {Array.isArray(f.relevant_products) ? f.relevant_products.join(", ") : f.relevant_products}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* --- Barrier × Facilitator Summary --- */}
      <article className="reference-block">
        <h3>障壁 × 促進要因の対比サマリー</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "14px" }}>
          <div style={infoBoxStyle("#dc3545", "#fdf2f2")}>
            <strong style={{ color: "#721c24" }}>主要障壁</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: "16px", fontSize: FONT_SIZE.medium }}>
              {MY_MARKET_BARRIERS.filter(b => b.severity === "High").map(b => (
                <li key={b.barrier_id}>{b.barrier_name}</li>
              ))}
            </ul>
          </div>
          <div style={infoBoxStyle("#28a745", "#f0fff4")}>
            <strong style={{ color: "#155724" }}>主要促進要因</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: "16px", fontSize: FONT_SIZE.medium }}>
              {MY_MARKET_FACILITATORS.filter(f => f.impact === "High").map(f => (
                <li key={f.facilitator_id}>{f.facilitator_name}</li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <p style={SOURCE_STYLE}>
        出典: {MARKET_ACCESS_DATA_SOURCES.barriers}
      </p>
      <p style={DISCLAIMER_STYLE}>
        ※ 障壁・促進要因の評価は定性的なものであり、市場環境の変化により変動します。
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  T4: Market Access (Main)                                           */
/* ------------------------------------------------------------------ */

function T4MarketAccess(): React.JSX.Element {
  return (
    <>
      <T4TariffRegime />
      <T4DistributionStructure />
      <T4ProjectProcurementEcosystem />
      <T4BarriersAndFacilitators />
    </>
  );
}

function TabPlaceholder({ tab }: { tab: TabDef }): React.JSX.Element {
  return (
    <section className="content-block content-block--major fade-in" style={{ textAlign: "center" }}>
      <p className="section-kicker">{tab.label.toUpperCase()}</p>
      <h2 style={{ fontSize: "28px" }}>{tab.sublabel}</h2>
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

  // タブ切替時に .fade-in 要素の IntersectionObserver を再起動する。
  // App.tsx の Observer は [pathname] 依存のため、同一 pathname 内でのタブ切替では
  // 再マウントされた .fade-in 要素が監視されず opacity:0 のままになる問題を解決。
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    // React の再レンダリング完了を待ってから DOM を走査する
    const timer = window.setTimeout(() => {
      const targets = document.querySelectorAll<HTMLElement>(".fade-in");
      if (targets.length === 0) return;

      // reduced-motion / IntersectionObserver 非対応環境は即表示
      if (
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
      ) {
        targets.forEach((el) => el.classList.add("visible"));
        return;
      }

      // 既存の visible クラスをリセットして再アニメーション
      targets.forEach((el) => el.classList.remove("visible"));

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      targets.forEach((el) => observer!.observe(el));
    }, 60);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [activeTab]);

  const renderTab = () => {
    if (activeTab === "t1") return <T1CountryProfile />;
    if (activeTab === "t2") return <T2MarketAndDemand />;
    if (activeTab === "t3") return <T3RegulatoryGateway />;
    if (activeTab === "t4") return <T4MarketAccess />;
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return null;
    return <TabPlaceholder tab={tab} />;
  };

  return (
    <main>
      <header className="my-page-header">
        <div className="my-page-header-top">
          <button
            className="my-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to ASEAN overview"
          >
            ← Back to ASEAN overview
          </button>
          <p className="hero-kicker" style={{ margin: 0 }}>COUNTRY PROFILE — MALAYSIA</p>
        </div>
        <div className="my-page-header-body">
          <h1 style={{ margin: 0 }}>Malaysia</h1>
          <p className="hero-sub" style={{ margin: 0 }}>Malaysia Low Voltage Switchgear Market Intelligence</p>
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
    </main>
  );
}
