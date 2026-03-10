import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { GdpDataPoint, GdpCountryMeta } from "../data/aseanGdpTrendData";

interface Props {
  data: GdpDataPoint[];
  meta: GdpCountryMeta[];
}

function formatGdp(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}兆`;
  return `$${value}B`;
}

export function ASEANGdpChart({ data, meta }: Props) {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#6e6e73" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}兆` : `${v}B`}
            tick={{ fontSize: 11, fill: "#6e6e73" }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => {
              const label = meta.find(m => m.key === String(name))?.nameJa ?? String(name);
              return [`${formatGdp(Number(value))}`, label];
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => `${label}年`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e0e0e0" }}
          />
          {/* 実績/予測境界線 */}
          <ReferenceLine
            x={2024}
            stroke="#aaa"
            strokeDasharray="4 4"
            label={{ value: "予測→", position: "insideTopRight", fontSize: 11, fill: "#aaa" }}
          />
          {meta.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* 凡例 */}
      <div className="chart-legend">
        {meta.map(({ key, nameJa, color }) => (
          <span key={key} className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: color }} />
            {nameJa}
          </span>
        ))}
      </div>
      <p className="chart-note">出典: IMF World Economic Outlook 2024。2024年以降は予測値。単位: USD 10億（B）</p>
    </div>
  );
}
