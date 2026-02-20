import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Type Imports                                                       */
/* ------------------------------------------------------------------ */

import type {
  ChartDataItem,
  CountryGDP,
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

          if (displayName === "actual") {
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

  return <Tooltip content={renderTooltip} />;
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

// 価値が定義されているかチェック
const isDefined = (value: number | undefined): value is number => {
  return value !== undefined && value !== null && !isNaN(value);
};

// チャートデータを生成（型安全・最適化版）
const generateChartData = (
  gdpHistory: typeof GDP_HISTORY,
  aseanGdpComparison: typeof ASEAN_GDP_COMPARISON,
  comparisonCountries: string[],
  usdJpy: number
): ChartDataItem[] => {
  const toJPY = (b: number) => b * usdJpy / 1000;

  // マレーシアのデータ（実績と予測を分離）
  const malaysiaData = gdpHistory.map(d => ({
    year: d.year,
    actual: !d.is_forecast ? toJPY(d.gdp_usd_billion) : null,  // 実績のみ（2015-2024）
    forecast: d.is_forecast || d.year === 2024 ? toJPY(d.gdp_usd_billion) : null,  // 予測（2024-2030、2024年は実績値で繋ぐ）
  }));

  // 比較国のデータを動的に追加
  return malaysiaData.map((malaysiaItem) => {
    const item: Record<string, number | null> = {
      year: malaysiaItem.year,
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
  ECONOMIC_NEWS_2025,
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
} from "recharts";

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
  // 経済ニュースフィルター用state
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("all");
  const [newsImpactFilter, setNewsImpactFilter] = useState<string>("all");

  // 他国比較用state
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);

  // チャートトランジション用カスタムフック
  const [isYAxisTransitioning, chartTransitionClass, triggerTransition] = useChartTransition(400);

  // カテゴリ・影響度フィルター用オプション
  const newsCategories = ["all", "Policy", "Investment", "Trade", "Infrastructure", "Other"];
  const impactLevels = ["all", "High", "Medium", "Low", "None"];

  // フィルター適用済みニュース
  const filteredNews = ECONOMIC_NEWS_2025.filter((news) => {
    if (newsCategoryFilter !== "all" && news.category !== newsCategoryFilter) return false;
    if (newsImpactFilter !== "all" && news.cb_impact !== newsImpactFilter) return false;
    return true;
  });

  return (
    <>
      {/* 経済 KPI セクション */}
      <section className="content-block" style={{ marginTop: "24px" }}>
        <p className="section-kicker">ECONOMIC KEY PERFORMANCE INDICATORS</p>
        <p className="section-subline" style={{ fontSize: "28px", color: "inherit", fontWeight: 600, marginBottom: "8px" }}>主要マクロ経済指標 — Malaysia</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table" style={{ minWidth: "700px", tableLayout: "fixed", width: "100%" }}>
              <colgroup>
                <col style={{ width: "18%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "34%" }} />
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
                  const gdp2024 = GDP_HISTORY.find(d => d.year === 2024)!;
                  return (
                    <>
                      <tr>
                        <td><strong>GDP（名目）</strong></td>
                        <td>
                          US${gdp2024.gdp_usd_billion.toFixed(1)}B / 約{(gdp2024.gdp_usd_billion * 140 / 1000).toFixed(1)}兆円
                        </td>
                        <td style={{ color: "#444" }}>
                          US${GDP_HISTORY.find(d => d.year === 2030)!.gdp_usd_billion.toFixed(1)}B / 約{(GDP_HISTORY.find(d => d.year === 2030)!.gdp_usd_billion * 140 / 1000).toFixed(1)}兆円
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>IMF WEO CR 2025/057</td>
                      </tr>
                      <tr>
                        <td><strong>GDP成長率</strong></td>
                        <td>{ECONOMY_KPI_2025.gdp_growth_pct.toFixed(1)}%</td>
                        <td style={{ color: "#444" }}>
                          4.0%（中期）<span style={{ fontSize: "0.75rem", color: "#999", marginLeft: "8px" }}>※Oct 2025 WEOでは4.3%</span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>IMF WEO CR 2025/057</td>
                      </tr>
                      <tr>
                        <td><strong>人口</strong></td>
                        <td>{(ECONOMY_KPI_2025.population_million * 100).toFixed(0).replace(".0", "")}万人</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>DOSM</td>
                      </tr>
                      <tr>
                        <td><strong>1人当たりGDP</strong></td>
                        <td>約{Math.round(ECONOMY_KPI_2025.gdp_per_capita_usd * 140 / 10000).toLocaleString()}万円</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>WB / DOSM</td>
                      </tr>
                      <tr>
                        <td><strong>FDI流入額</strong></td>
                        <td>約{Math.round(ECONOMY_KPI_2025.fdi_inflow_usd_billion * 140).toLocaleString()}億円</td>
                        <td style={{ color: "#999" }}>—</td>
                        <td style={{ fontSize: "0.8rem", color: "#666" }}>BNM</td>
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
        const toggleCountry = (iso3: string) => {
          const currentHasCountries = comparisonCountries.length > 0;
          const willHaveCountries = comparisonCountries.includes(iso3)
            ? comparisonCountries.length > 1  // 除去後も残るか
            : true;                           // 追加後は必ずある
          const willChangeYAxis = currentHasCountries !== willHaveCountries;

          // Y軸が変化する場合のみトランジション発火
          if (willChangeYAxis) {
            triggerTransition();
          }

          setComparisonCountries(prev =>
            prev.includes(iso3)
              ? prev.filter(c => c !== iso3)
              : [...prev, iso3]
          );
        };

        return (
          <section className="content-block">
            <p className="section-kicker">GDP TREND</p>
            <h2 style={{ fontSize: "28px" }}>GDP 推移（実績 + 予測）</h2>
            <p className="section-subline">2015–2030年度 — 兆円（名目、現在価格、1 USD＝140円換算）</p>

            <article
              className={`reference-block chart-transition-container ${chartTransitionClass}`}
              style={{ '--chart-transition-duration': `${CHART_CONFIG.transitionDuration}ms` } as React.CSSProperties}
            >
              <div style={{ height: `${CHART_CONFIG.height}px`, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" stroke="#666" tick={{ dy: 12 }} />
                    <YAxis
                      stroke="#666"
                      domain={[0, maxY]}
                      ticks={yTicks}
                      tickFormatter={(v) => `${v}`}
                      label={{ value: "GDP（兆円）", angle: -90, position: "insideLeft" }}
                    />
                    <GDPChartTooltip usdJpy={USD_JPY} />
                    {/* マレーシア: 実績（実線）2015-2024 */}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="マレーシア（実績）"
                      stroke="#2563eb"
                      strokeWidth={CHART_CONFIG.lineStrokeWidth}
                      dot={false}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                      animationBegin={0}
                      animationDuration={1667}
                      animationEasing="linear"
                    />
                    {/* マレーシア: 予測（点線）2025-2030（実績完了後に開始） */}
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="マレーシア（予測）"
                      stroke="#2563eb"
                      strokeWidth={CHART_CONFIG.lineStrokeWidth}
                      strokeDasharray={CHART_CONFIG.dashArray}
                      dot={false}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                      animationBegin={1667}
                      animationDuration={833}
                      animationEasing="linear"
                    />
                    {/* 比較国のライン */}
                    {comparisonCountries.map((iso3, index) => {
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
                          connectNulls={false}
                          animationBegin={500 + (index * 200)}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
                {/* カスタム凡例 - グラフ内右下に絶対配置 */}
                <div style={{
                  position: "absolute",
                  bottom: `${CHART_CONFIG.legend.bottom}px`,
                  right: `${CHART_CONFIG.legend.right}px`,
                  ...STYLES.flex.centerColumn,
                  gap: SPACING.sm,
                  padding: `${SPACING.sm} ${SPACING.md}`,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "6px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  border: `1px solid ${COLOR.gray}`,
                  pointerEvents: "none"
                }}>
                  {/* マレーシア（実績） */}
                  <LegendItem color={COLOR.primary} label="マレーシア（実績）" isSolid={true} />
                  {/* マレーシア（予測） */}
                  <LegendItem color={COLOR.primary} label="マレーシア（予測）" isSolid={false} />
                  {/* 比較国 */}
                  {comparisonCountries.map(iso3 => {
                    const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === iso3);
                    if (!country) return null;
                    return <LegendItem key={iso3} color={country.color} label={country.nameJa} isSolid={true} />;
                  })}
                </div>
              </div>
              {/* グラフ注釈 */}
              <p style={{ ...STYLES.fontSize.medium, ...STYLES.color.secondary, marginTop: "16px", lineHeight: "1.7" }}>
                <span style={{ color: COLOR.primary, fontWeight: 600 }}>●</span> マレーシア: 実線（2015–2024年 実績値）／点線（2025–2030年 IMF WEO予測値）
              </p>
              {comparisonCountries.length > 0 && (
                <p style={{ ...STYLES.fontSize.medium, ...STYLES.color.secondary, marginTop: "8px", lineHeight: "1.7" }}>
                  {comparisonCountries.map(iso3 => {
                    const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === iso3);
                    return country ? (
                      <span key={iso3}>
                        <span style={{ color: country.color, fontWeight: 600 }}>●</span> {country.nameJa}
                        {iso3 !== comparisonCountries[comparisonCountries.length - 1] && " / "}
                      </span>
                    ) : null;
                  })}: IMF WEOデータ
                </p>
              )}
              <p style={{ ...STYLES.fontSize.small, ...STYLES.color.tertiary, marginTop: "4px", lineHeight: "1.6" }}>
                ※ 円換算レート：1 USD＝140円（固定）。為替変動により実際の円換算額は異なります。
              </p>
              <p style={{ ...STYLES.fontSize.small, ...STYLES.color.tertiary, marginTop: "2px", lineHeight: "1.6" }}>
                出典：{DATA_SOURCES.gdp}
              </p>
            </article>

            {/* 比較国選択チェックボックス */}
            <div style={{ ...STYLES.margin.lg }}>
              <p style={{ ...STYLES.fontSize.medium, ...STYLES.color.secondary, marginBottom: "8px" }}>
                他国と比較（チェックで表示）:
              </p>
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
          </section>
        );
      })()}

      {/* 産業別GDP構成比 */}
      <section className="content-block">
        <p className="section-kicker">INDUSTRY COMPOSITION</p>
        <h2 style={{ fontSize: "28px" }}>産業別 GDP 構成比（2025年度）</h2>
        <p className="section-subline">セクター別のシェアと成長率</p>
        <article className="reference-block">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* ドーナツチャート */}
            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INDUSTRY_GDP_2025}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="gdp_share_pct"
                    label={(entry: any) => `${entry.sector}: ${entry.gdp_share_pct}%`}
                    labelLine={false}
                  >
                    {INDUSTRY_GDP_2025.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.cb_relevance === "High" ? "#dc3545" :
                        entry.cb_relevance === "Medium" ? "#ffc107" :
                        "#6c757d"
                      } />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number | undefined) => value !== undefined ? `${value}%` : ""} contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #ccc" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* テーブル */}
            <div>
              <div className="table-wrap">
                <table className="definition-table">
                  <thead>
                    <tr>
                      <th>産業セクター</th>
                      <th>GDP比率</th>
                      <th>成長率</th>
                      <th>CB関連度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDUSTRY_GDP_2025.map((item) => (
                      <tr key={item.sector}>
                        <td><strong>{item.sector}</strong></td>
                        <td>{item.gdp_share_pct.toFixed(1)}%</td>
                        <td>{item.growth_rate_pct.toFixed(1)}%</td>
                        <td>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              backgroundColor:
                                item.cb_relevance === "High" ? "#dc3545" :
                                item.cb_relevance === "Medium" ? "#ffc107" :
                                "#6c757d",
                              color: item.cb_relevance === "Medium" ? "#333" : "#fff",
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
                ※ CB関連度：低圧遮断器市場との関連性を示します。
              </p>
              <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                出典: {DATA_SOURCES.industry}
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* 主要経済ニュース */}
      <section className="content-block">
        <p className="section-kicker">ECONOMIC NEWS & POLICY TRENDS</p>
        <h2 style={{ fontSize: "28px" }}>主要経済ニュース・政策動向</h2>
        <p className="section-subline">CB市場への影響度分類付き — 2025年</p>
        <article className="reference-block">
          {/* フィルター */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#666", marginRight: "8px" }}>カテゴリ:</label>
              <select
                value={newsCategoryFilter}
                onChange={(e) => setNewsCategoryFilter(e.target.value)}
                style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "0.9rem" }}
              >
                <option value="all">すべて</option>
                {newsCategories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#666", marginRight: "8px" }}>CB影響度:</label>
              <select
                value={newsImpactFilter}
                onChange={(e) => setNewsImpactFilter(e.target.value)}
                style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "0.9rem" }}
              >
                <option value="all">すべて</option>
                {impactLevels.slice(1).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ニュースリスト */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <div
                  key={`${news.date}-${news.headline}`}
                  style={{
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    borderLeft: `4px solid ${
                      news.cb_impact === "High" ? "#dc3545" :
                      news.cb_impact === "Medium" ? "#ffc107" :
                      news.cb_impact === "Low" ? "#28a745" :
                      "#6c757d"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "#333" }}>{news.headline}</h4>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor:
                          news.cb_impact === "High" ? "#dc3545" :
                          news.cb_impact === "Medium" ? "#ffc107" :
                          news.cb_impact === "Low" ? "#28a745" :
                          "#6c757d",
                        color: news.cb_impact === "Medium" ? "#333" : "#fff",
                        whiteSpace: "nowrap",
                        marginLeft: "12px",
                      }}
                    >
                      {news.cb_impact}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "8px" }}>
                    <span style={{ marginRight: "16px" }}>📅 {news.date}</span>
                    <span style={{ marginRight: "16px" }}>🏷️ {news.category}</span>
                    {news.source && <span>📰 {news.source}</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.5", color: "#444" }}>{news.summary}</p>
                  {news.url && (
                    <div style={{ marginTop: "8px" }}>
                      <a href={news.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "#2563eb" }}>
                        🔗 記事リンク
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>該当するニュースはありません。</p>
            )}
          </div>
        </article>
      </section>

      {/* 既存：電力インフラ基本情報 */}
      <section className="content-block" style={{ marginTop: "24px" }}>
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
        <p className="section-kicker">PRODUCT-CATEGORY CERTIFICATION REQUIREMENTS</p>
        <h2 style={{ fontSize: "28px" }}>製品別 認証要件</h2>
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
            {MARKET_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </article>
      </section>
    </>
  );
}

function TabPlaceholder({ tab }: { tab: TabDef }): React.JSX.Element {
  return (
    <section className="content-block fade-in" style={{ marginTop: "24px", textAlign: "center" }}>
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

  const renderTab = () => {
    if (activeTab === "t1") return <T1CountryProfile />;
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
    </main>
  );
}
