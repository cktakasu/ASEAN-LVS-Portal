import React from "react";
import type { EntryPriorityRow } from "../data/aseanMatrixData";
import { ENTRY_PRIORITY_AXES } from "../data/aseanMatrixData";

// スコア1-5に対応するヒートマップカラー
const SCORE_COLORS: Record<number, string> = {
  1: "#FFECCC",
  2: "#FFD699",
  3: "#FFB84D",
  4: "#FF8C00",
  5: "#FF6600",
};

interface Props {
  data: EntryPriorityRow[];
}

export const ASEANEntryMatrix = React.memo(function ASEANEntryMatrix({ data }: Props) {
  return (
    <div className="matrix-wrapper">
      <div className="matrix-scroll">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-th matrix-th--country">国</th>
              {ENTRY_PRIORITY_AXES.map(axis => (
                <th key={axis} className="matrix-th">{axis}</th>
              ))}
              <th className="matrix-th matrix-th--total">合計</th>
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
                <td className="matrix-td matrix-td--total">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="matrix-note">スコア: 5=最優先 / 1=最低優先。合計点の降順で表示。</p>
    </div>
  );
});
