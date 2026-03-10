import React from "react";
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

export const ASEANDemandMatrix = React.memo(function ASEANDemandMatrix({ data }: Props) {
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
      <div className="matrix-scoring-criteria">
        <p className="matrix-scoring-title">スコアリング基準・出典</p>
        <dl className="matrix-scoring-dl">
          <dt>住宅建設</dt>
          <dd>人口増加率・都市化率に基づく。IDN/PHLは人口大国かつ都市化が急速（5）。MYS/THA/VNMは中〜高水準（3–4）。<cite>UN DESA World Urbanization Prospects 2024</cite></dd>
          <dt>データセンター</dt>
          <dd>DC施設数（SG: 99施設、IDN: 84施設、MYS: 62施設、THA: 42施設、VNM: 33施設）および新規投資動向。SG（地域ハブ）・MYS（Johor投資ブーム、新規投資流入首位）＝5、IDN（Jakarta集積・インフラ制約あり）・VNM＝4。<cite>Arizton Southeast Asia Data Center Market Report 2024–2030</cite></dd>
          <dt>製造業</dt>
          <dd>製造業GDP比率・外資製造FDI流入額。THA（自動車産業集積）・VNM（電子製造・中国+1）＝5、IDN・MYS・KHM＝4。<cite>UNCTAD World Investment Report 2024</cite></dd>
          <dt>インフラ整備</dt>
          <dd>インフラ投資額対GDP比・国家計画の規模。IDN（新首都Nusantara・国家インフラ計画）・VNM・LAO（メコン回廊）が高水準。<cite>ADB Infrastructure Report 2024</cite></dd>
          <dt>商業施設</dt>
          <dd>小売売上高成長率・都市化率。IDN/MYS/THA/PHLは中〜高水準（3–4）、SGは既存商業集積地として成熟（4）。<cite>Euromonitor International 2024</cite></dd>
        </dl>
      </div>
    </div>
  );
});
