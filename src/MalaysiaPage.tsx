import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Type Imports                                                       */
/* ------------------------------------------------------------------ */

import type {
  ChartDataItem,
  TooltipPayloadItem,
  TooltipProps,
  CertRow,
  InfoItem,
  TabDef,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Hook Imports                                                       */
/* ------------------------------------------------------------------ */

import { useChartTransition } from "./hooks";
import { ForecastBadge, ForecastReferenceArea } from "./components/charts";

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

/* ------------------------------------------------------------------ */
/*  Utility Functions                                                   */
/* ------------------------------------------------------------------ */

// Y軸の最大値を計算（比較国を選択した場合に自動拡張）
const calculateMaxY = (data: ChartDataItem[], comparisonCountries: string[]): number => {
  if (comparisonCountries.length === 0) return 100;

  const allValues = data.flatMap(d =>
    Object.entries(d)
      .filter(([k]) => k !== "year")
      .map(([, v]) => v ?? 0)
  );

  const maxVal = Math.max(...allValues);
  // 20単位で切り上げ
  return Math.ceil((maxVal + 10) / 20) * 20;
};

// Y軸のticksを生成
const generateYTicks = (maxY: number): number[] => {
  const ticks: number[] = [];
  for (let t = 0; t <= maxY; t += 20) {
    ticks.push(t);
  }
  return ticks;
};

// チャートデータを生成（型安全・最適化版）
const generateChartData = (
  gdpHistory: typeof GDP_HISTORY,
  aseanGdpComparison: typeof ASEAN_GDP_COMPARISON,
  comparisonCountries: string[],
  usdJpy: number
): ChartDataItem[] => {
  const toJPY = (b: number) => b * usdJpy / 1000;

  // マレーシアのデータ（統合：実績と予測を1つの系列に）
  const malaysiaData = gdpHistory.map(d => ({
    year: d.year,
    malaysia: toJPY(d.gdp_usd_billion),  // マレーシア統合データ（実績+予測）
    actual: !d.is_forecast ? toJPY(d.gdp_usd_billion) : null,  // 実績のみ（ツールチップ用）
    forecast: d.is_forecast || d.year === 2024 ? toJPY(d.gdp_usd_billion) : null,  // 予測（ツールチップ用）
  }));

  // 比較国のデータを動的に追加
  return malaysiaData.map((malaysiaItem) => {
    const item: ChartDataItem = {
      year: malaysiaItem.year,
      malaysia: malaysiaItem.malaysia,
      actual: malaysiaItem.actual,
      forecast: malaysiaItem.forecast,
    };

    // 選択された各国のデータを追加
    comparisonCountries.forEach((iso3) => {
      const country = aseanGdpComparison.find(c => c.iso3 === iso3);
      if (country) {
        const yearData = country.data.find(d => d.year === malaysiaItem.year);
        if (yearData) {
          item[iso3] = toJPY(yearData.gdp_usd_billion);
        }
      }
    });

    return item;
  });
};
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
/*  CB Relevance Color                                                 */
/* ------------------------------------------------------------------ */

const cbRelevanceColor = (relevance: string): string =>
  relevance === "High" ? "#dc3545" :
  relevance === "Medium" ? "#d97706" :
  "#6c757d";

/* ------------------------------------------------------------------ */
/*  ドーナツチャート用カスタムラベル（リード線付き）                  */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DonutLabelWithLeaderLine: React.FC<any> = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  payload,
}) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined ||
    !payload?.sector ||
    payload.gdp_share_pct === undefined ||
    !payload.cb_relevance
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const leaderLineLength = 20;
  const horizontalLineLength = 25;
  const labelOffset = 6;

  const angleRad = -midAngle * RADIAN;
  const isRight = Math.cos(angleRad) >= 0;

  const lineStartX = cx + outerRadius * Math.cos(angleRad);
  const lineStartY = cy + outerRadius * Math.sin(angleRad);
  const elbowX = cx + (outerRadius + leaderLineLength) * Math.cos(angleRad);
  const elbowY = cy + (outerRadius + leaderLineLength) * Math.sin(angleRad);
  const lineEndX = isRight ? elbowX + horizontalLineLength : elbowX - horizontalLineLength;
  const lineEndY = elbowY;

  const textAnchor = isRight ? "start" : "end";
  const textX = isRight ? lineEndX + labelOffset : lineEndX - labelOffset;
  const textY = elbowY;
  const color = cbRelevanceColor(payload.cb_relevance);

  return (
    <g>
      <line x1={lineStartX} y1={lineStartY} x2={elbowX} y2={elbowY} stroke={color} strokeWidth={1.5} opacity={0.8} />
      <line x1={elbowX} y1={elbowY} x2={lineEndX} y2={lineEndY} stroke={color} strokeWidth={1.5} opacity={0.8} />
      <circle cx={lineEndX} cy={lineEndY} r={3} fill={color} />
      <text x={textX} y={textY - 9} textAnchor={textAnchor} dominantBaseline="middle" fontSize="14px" fill={color} fontWeight={600}>
        {payload.sector}
      </text>
      <text x={textX} y={textY + 10} textAnchor={textAnchor} dominantBaseline="middle" fontSize="13px" fill={color} opacity={0.85} fontWeight={500}>
        {payload.gdp_share_pct.toFixed(1)}%
      </text>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS: TabDef[] = [
  { id: "t1", label: "Country Profile",       sublabel: "Is this country worth targeting?" },
  { id: "t2", label: "Market & Demand",        sublabel: "Where is the demand?" },
  { id: "t3", label: "Regulatory Gateway",     sublabel: "What is required to sell here?" },
  { id: "t4", label: "Competitive Landscape",  sublabel: "Who are we competing against?" },
  { id: "t5", label: "Our Position",           sublabel: "Where do we stand?" },
  { id: "t6", label: "Strategic Assessment",   sublabel: "What should we do?" },
];

/* ------------------------------------------------------------------ */
/*  T1 data                                                            */
/* ------------------------------------------------------------------ */

const CERT_ROWS: CertRow[] = [
  { product: "ACB",  requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様で要求多し" },
  { product: "MCCB", requirement: "条件付き", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "プロジェクト仕様でSIRIM CoA要求" },
  { product: "MCB",  requirement: "必須",     standard: "MS IEC 60898",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCCB", requirement: "必須",     standard: "MS IEC 61008",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
  { product: "RCBO", requirement: "必須",     standard: "MS IEC 61009",   authority: "SIRIM QAS", note: "ST-SIRIM CoA必須" },
];

const POWER_INFO: InfoItem[] = [
  { label: "系統電圧（低圧）", value: "240 V（単相）/ 415 V（三相）" },
  { label: "周波数",           value: "50 Hz" },
  { label: "主要電力会社",     value: "Tenaga Nasional Berhad（TNB）— 半島マレーシア" },
  { label: "サバ・サラワク",   value: "Sabah Electricity（SESB）/ Sarawak Energy（SEB）" },
  { label: "プラグ形状",       value: "Type G（英国型 BS 1363）" },
  { label: "配電方式",         value: "TN-S / TN-C-S（半島）、地域によりTT" },
];

const SIRIM_PROCESS: string[] = [
  "SIRIM QAS International へ申請書・製品仕様書・試験報告書（認定ラボ発行）を提出",
  "MS規格（MS IEC 60898 / 61008 / 61009 等）に基づく製品評価",
  "CoA（Certificate of Approval）発行",
  "ST（Suruhanjaya Tenaga / Energy Commission）への届出・登録",
  "ST-SIRIM CoAマーク付き製品として出荷可能",
];

const REGIONAL_DIFF: InfoItem[] = [
  { label: "半島マレーシア",         value: "TNB系統。MS規格・SIRIM CoA体制が最も整備されており、ST登録が実質必須。" },
  { label: "サバ（ボルネオ北部）",   value: "SESBが管轄。系統容量は半島より小さく、プロジェクト仕様でIECまたはBS準拠を要求するケースが多い。" },
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
                    {INDUSTRY_GDP_2025.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
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

      {/* 既存：電力インフラ基本情報 */}
      <section className="content-block content-block--major">
        <p className="section-kicker">POWER INFRASTRUCTURE</p>
        <h2 style={{ fontSize: "28px" }}>電力インフラ基本情報</h2>
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

      <section className="content-block fade-in">
        <p className="section-kicker">REGIONAL DIFFERENCES</p>
        <h2 style={{ fontSize: "28px" }}>地域別 留意点</h2>
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
        <h2 style={{ fontSize: "28px" }}>市場・実務ノート</h2>
        <article className="reference-block">
          <ol className="notes-list">
            {MARKET_NOTES.map((note, index) => (
              <li key={`market-note-${index}`}>{note}</li>
            ))}
          </ol>
        </article>
      </section>
    </>
  );
}


/* ------------------------------------------------------------------ */
/*  T3: Regulatory Gateway                                             */
/* ------------------------------------------------------------------ */

function T3RegulatoryGateway(): React.JSX.Element {
  return (
    <>
      <section className="content-block fade-in">
        <p className="section-kicker">PRODUCT-CATEGORY CERTIFICATION REQUIREMENTS</p>
        <h2 style={{ fontSize: "28px" }}>機種別規格認証</h2>
        <p className="section-subline">Low-Voltage Circuit Breakers — Malaysia</p>
        <article className="reference-block">
          <h3>認証要件一覧</h3>
          <div className="table-wrap">
            <table className="requirements-table" style={{ maxWidth: "1004px", margin: "0 auto" }}>
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
            {SIRIM_PROCESS.map((step, index) => (
              <li key={`sirim-${index}`}>{step}</li>
            ))}
          </ol>
        </article>
      </section>
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
    <div style={{ backgroundColor: "rgba(255,255,255,0.97)", border: "1px solid #ccc", padding: "10px 14px", borderRadius: "4px", lineHeight: "1.7", minWidth: "200px" }}>
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

  // USD Billion → 兆円
  const usdBillionToTrillionYen = (usdBillion: number): string => {
    const yenValue = usdBillion * USD_JPY / 1000;
    return yenValue >= 1
      ? `${(Math.round(yenValue * 10) / 10).toFixed(1)}兆円`
      : `${Math.round(yenValue * 1000).toLocaleString()}億円`;
  };

  // セクター市場規模文字列を解析して円換算
  const parseAndConvertSectorMarketSize = (marketSizeStr: string): string => {
    const usdMatch = marketSizeStr.match(/USD\s+([\d.]+)([BM])/i);
    if (!usdMatch) return marketSizeStr; // USD値がない場合は元の文字列を返す

    const value = parseFloat(usdMatch[1]);
    const unit = usdMatch[2].toUpperCase();

    let jpyStr: string;
    if (unit === 'B') {
      jpyStr = usdBillionToTrillionYen(value);
    } else {
      jpyStr = `${usdMillionToOkuYen(value).toLocaleString()}億円`;
    }

    // USD部分を円換算値に置換し、元のUSD値を括弧で保持
    return marketSizeStr.replace(
      /USD\s+[\d.]+[BM]\s*/i,
      `約${jpyStr} (USD ${value}${unit}, `
    );
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

  // 展開行管理用State
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

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
              sub: "ASEAN低圧遮断器市場規模（6ヵ国中）",
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
                  label={{ value: "億円", angle: -90, position: "insideLeft", offset: 10 }}
                />
                {/* ツールチップ */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip content={<MarketSizeTooltip active={false} payload={[]} label="" />  as any} />
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
      {/* Section 2-2: 注目市場                                         */}
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
                <col style={{ width: "18%" }} />
                <col style={{ width: "34%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, fontSize: "0.82rem" }}>セクター</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, fontSize: "0.82rem" }}>市場規模</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "center", fontWeight: 600, fontSize: "0.82rem" }}>成長見通し</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "left", fontWeight: 600, fontSize: "0.82rem" }}>案件あたり需要</th>
                  <th style={{ padding: "10px 8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", textAlign: "center", fontWeight: 600, fontSize: "0.82rem" }}>総合評価</th>
                </tr>
              </thead>
              <tbody>
                {CB_SECTOR_FOCUS.map((sector) => {
                  const growthIcon = growthOutlookIcon(sector.growth_outlook);
                  const isExpanded = expandedSector === sector.sector_name;

                  return (
                    <React.Fragment key={sector.sector_name}>
                      {/* メインテーブル行 */}
                      <tr
                        style={{
                          cursor: "pointer",
                          backgroundColor: isExpanded ? "#f8f9fa" : "transparent"
                        }}
                        onClick={() => setExpandedSector(isExpanded ? null : sector.sector_name)}
                      >
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", fontWeight: 600 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {sector.sector_name}
                            <span style={{
                              fontSize: "0.65rem",
                              color: isExpanded ? "#FF6600" : "#999",
                              transition: "transform 0.2s"
                            }}>
                              {isExpanded ? "▼" : "▶"}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", fontSize: "0.82rem" }}>
                          {parseAndConvertSectorMarketSize(sector.sector_market_size)}
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
                        <td style={{ padding: "10px 8px", border: "1px solid #dee2e6", fontSize: "0.82rem" }}>
                          {sector.cb_demand_per_project}
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

                      {/* 展開詳細行 */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              padding: "12px 16px",
                              border: "1px solid #dee2e6",
                              backgroundColor: "#fafbfc",
                              borderBottom: "2px solid #dee2e6",
                              whiteSpace: "normal",
                              wordBreak: "normal",
                            }}
                          >
                            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                              {/* 左: 概要テキスト（幅を制限して読みやすく） */}
                              <div style={{ flex: "0 0 62%" }}>
                                <h4 style={{
                                  margin: "0 0 6px",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  color: "#495057",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px"
                                }}>
                                  セクター概要
                                </h4>
                                <p style={{
                                  margin: 0,
                                  fontSize: "0.85rem",
                                  lineHeight: "1.75",
                                  color: "#6c757d"
                                }}>
                                  {sector.sector_overview}
                                </p>
                              </div>
                              {/* 右: 出典・補足 */}
                              <div style={{ flex: 1, borderLeft: "1px solid #e9ecef", paddingLeft: "20px" }}>
                                <h4 style={{
                                  margin: "0 0 6px",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  color: "#495057",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.4px"
                                }}>
                                  出典
                                </h4>
                                <p style={{
                                  margin: 0,
                                  fontSize: "0.82rem",
                                  color: "#6c757d",
                                  lineHeight: "1.6"
                                }}>
                                  {sector.source}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
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
            <p style={{ margin: "8px 0 0 0", fontSize: "0.78rem", color: "#6c757d" }}>
              ※ 各行をクリックすると詳細情報が表示されます
            </p>
          </div>
        </article>
      </section>

      {/* ============================================================ */}
      {/* Section 2-3: 地域概況                                         */}
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
                    <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
                      約{(state.gdp_usd_billion * USD_JPY / 1000).toFixed(1)}兆円
                      <span style={{ fontSize: "0.75rem", color: "#999" }}> (USD {state.gdp_usd_billion.toFixed(1)}B)</span>
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
          <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "12px" }}>
            上位5州（Selangor、KL/Putrajaya、Johor、Sarawak、Penang）でマレーシアGDPの約68%を占め、LV遮断器の需要もこの5州に集中すると見られる。<br />
            ※ 全国平均成長率5.1%超の州を緑色で表示。出典: DOSM, GDP by State 2024（2025年7月1日発表）
          </p>
        </article>
      </section>
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
