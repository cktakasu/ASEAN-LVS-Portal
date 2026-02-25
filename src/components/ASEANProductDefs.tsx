import React from "react";
import type { ProductDefRow } from "../data/aseanMatrixData";

interface Props {
  rows: ProductDefRow[];
}

export const ASEANProductDefs = React.memo(function ASEANProductDefs({ rows }: Props) {
  return (
    <div className="matrix-wrapper">
      <div className="matrix-scroll">
        <table className="matrix-table product-def-table">
          <thead>
            <tr>
              <th className="matrix-th">コード</th>
              <th className="matrix-th">製品名（日本語）</th>
              <th className="matrix-th product-def-en">製品名（英語）</th>
              <th className="matrix-th">主な用途</th>
              <th className="matrix-th">定格電流</th>
              <th className="matrix-th">参照規格</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.code}>
                <td className="matrix-td">
                  <span className="product-code-badge">{row.code}</span>
                </td>
                <td className="matrix-td">{row.nameJa}</td>
                <td className="matrix-td product-def-en" style={{ fontSize: "12px", color: "var(--text-sub)" }}>
                  {row.nameEn}
                </td>
                <td className="matrix-td">{row.usageJa}</td>
                <td className="matrix-td" style={{ whiteSpace: "nowrap" }}>{row.currentRange}</td>
                <td className="matrix-td" style={{ fontFamily: "monospace", fontSize: "12px" }}>{row.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
