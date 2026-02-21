import type { ChartDataItem } from "../types/chart";
import type { GDPDataPoint } from "../types/economy";
import type { CountryGDP } from "../types/chart";

/**
 * Y軸の最大値を計算（比較国を選択した場合に自動拡張）
 */
export const calculateMaxY = (data: ChartDataItem[], comparisonCountries: string[]): number => {
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

/**
 * Y軸のticksを生成
 */
export const generateYTicks = (maxY: number): number[] => {
  const ticks: number[] = [];
  for (let t = 0; t <= maxY; t += 20) {
    ticks.push(t);
  }
  return ticks;
};

/**
 * チャートデータを生成（型安全・最適化版）
 */
export const generateChartData = (
  gdpHistory: GDPDataPoint[],
  aseanGdpComparison: CountryGDP[],
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
