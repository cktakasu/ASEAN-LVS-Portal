import type { DemandDriverRow } from "../data/aseanMatrixData";
import { DEMAND_SECTORS } from "../data/aseanMatrixData";

const SCORE_COLORS: Record<number, string> = {
  1: "#FFECCC",
  2: "#FFD699",
  3: "#FFB84D",
  4: "#FF8C00",
  5: "#FF6600",
};

interface Props {
  data: DemandDriverRow[];
}

export function ASEANDemandMatrix({ data }: Props) {
  return (
    <div className="matrix-wrapper">
      <div className="matrix-scroll">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-th matrix-th--country">国</th>
              {DEMAND_SECTORS.map(sector => (
                <th key={sector} className="matrix-th">{sector}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.iso3}>
                <td className="matrix-td matrix-td--country">{row.nameJa}</td>
                {row.scores.map((score, i) => (
                  <td
                    key={i}
                    className="matrix-td matrix-td--score"
                    style={{ background: SCORE_COLORS[score] ?? "#fff" }}
                  >
                    {score}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="matrix-note">強度: 5=主要需要 / 1=軽微。各社・各プロジェクトにより異なる場合があります。</p>
    </div>
  );
}
