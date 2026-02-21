import React, { useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { ASEAN_GDP_COMPARISON } from "../../data/aseanGdpData";
import { GDP_HISTORY } from "../../data/malaysiaEconomyData";
import { GDPChartTooltip } from "./GDPChartTooltip";
import { LegendItem } from "../LegendItem";
import { calculateMaxY, generateYTicks, generateChartData } from "../../utils/chartUtils";
import { CHART_CONFIG, STYLES, COLOR, FONT_SIZE } from "../../constants";
import { useChartTransition } from "../../hooks";

interface GDPChartSectionProps {
  comparisonCountries: string[];
  setComparisonCountries: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GDPChartSection: React.FC<GDPChartSectionProps> = React.memo(({
  comparisonCountries,
  setComparisonCountries
}) => {
  const USD_JPY = 140;
  const [isYAxisTransitioning, chartTransitionClass, triggerTransition] = useChartTransition(400);

  // チャートデータをキャッシュ化
  const chartData = useMemo(
    () => generateChartData(
      GDP_HISTORY,
      ASEAN_GDP_COMPARISON,
      comparisonCountries,
      USD_JPY
    ),
    [comparisonCountries]
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
    triggerTransition();
    setComparisonCountries(prev =>
      prev.includes(iso3)
        ? prev.filter(c => c !== iso3)
        : [...prev, iso3]
    );
  }, [triggerTransition, setComparisonCountries]);

  return (
    <section className="content-block content-block--wide">
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
              <ReferenceArea
                x1={2025}
                x2={2030}
                fill="rgba(200, 200, 200, 0.6)"
                stroke="none"
              />
              {/* Result / Forecast の境界線（2025年） */}
              <ReferenceLine
                x={2025}
                stroke="#999"
                strokeDasharray="3 8"
                strokeWidth={1.5}
              />
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
          {/* Result / Forecast バッジ */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "36.5%",
            transform: "translateX(-50%)",
            padding: "4px 14px",
            backgroundColor: "rgba(37, 99, 235, 0.8)",
            borderRadius: "999px",
            fontFamily: "'Roboto Condensed', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#fff",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000, 1px 0 0 #000",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Result
          </div>
          <div style={{
            position: "absolute",
            top: "20px",
            left: "82%",
            transform: "translateX(-50%)",
            padding: "4px 14px",
            backgroundColor: "rgba(100, 116, 139, 0.8)",
            borderRadius: "999px",
            fontFamily: "'Roboto Condensed', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#fff",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000, 1px 0 0 #000",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Forecast
          </div>
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
          <LegendItem color={COLOR.primary} label="マレーシア" isSolid={true} />
          {comparisonCountries.map(iso3 => {
            const country = ASEAN_GDP_COMPARISON.find(c => c.iso3 === iso3);
            if (!country) return null;
            return <LegendItem key={iso3} color={country.color} label={country.nameJa} isSolid={true} />;
          })}
        </div>
        <p style={{ ...STYLES.fontSize.small, ...STYLES.color.tertiary, marginTop: "4px", lineHeight: "1.6" }}>
          ※ 円換算レート：1 USD＝140円（固定）。為替変動により実際の円換算額は異なります。
        </p>
      </article>
    </section>
  );
});

GDPChartSection.displayName = "GDPChartSection";
