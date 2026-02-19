import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ECONOMY_KPI_2025,
  ECONOMY_KPI_2024,
  GDP_HISTORY,
  INDUSTRY_GDP_2025,
  ECONOMIC_NEWS_2025,
  DATA_SOURCES,
} from "./data/malaysiaEconomyData";
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
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CertRow = {
  product: string;
  requirement: string;
  standard: string;
  authority: string;
  note: string;
};

type InfoItem = {
  label: string;
  value: string;
};

type TabDef = {
  id: string;
  label: string;
  sublabel: string;
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
  // 経済ニュースフィルター用state
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("all");
  const [newsImpactFilter, setNewsImpactFilter] = useState<string>("all");

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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {/* GDP */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>GDP（名目）</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>USD {ECONOMY_KPI_2025.gdp_usd_billion.toFixed(1)}B</div>
              <div style={{ fontSize: "0.8rem", color: ECONOMY_KPI_2025.gdp_usd_billion > ECONOMY_KPI_2024.gdp_usd_billion ? "#28a745" : "#dc3545" }}>
                {ECONOMY_KPI_2025.gdp_usd_billion > ECONOMY_KPI_2024.gdp_usd_billion ? "+" : ""}
                {(ECONOMY_KPI_2025.gdp_usd_billion - ECONOMY_KPI_2024.gdp_usd_billion).toFixed(1)}B vs 前年
              </div>
            </div>
            {/* GDP成長率 */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>GDP成長率</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>{ECONOMY_KPI_2025.gdp_growth_pct.toFixed(1)}%</div>
              <div style={{ fontSize: "0.8rem", color: ECONOMY_KPI_2025.gdp_growth_pct > ECONOMY_KPI_2024.gdp_growth_pct ? "#28a745" : "#dc3545" }}>
                {ECONOMY_KPI_2025.gdp_growth_pct > ECONOMY_KPI_2024.gdp_growth_pct ? "+" : ""}
                {(ECONOMY_KPI_2025.gdp_growth_pct - ECONOMY_KPI_2024.gdp_growth_pct).toFixed(1)}%pt vs 前年
              </div>
            </div>
            {/* 人口 */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>人口</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>{ECONOMY_KPI_2025.population_million.toFixed(1)}M人</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>—</div>
            </div>
            {/* 1人当たりGDP */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>1人当たりGDP</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>USD {ECONOMY_KPI_2025.gdp_per_capita_usd.toLocaleString()}</div>
              <div style={{ fontSize: "0.8rem", color: ECONOMY_KPI_2025.gdp_per_capita_usd > ECONOMY_KPI_2024.gdp_per_capita_usd ? "#28a745" : "#dc3545" }}>
                {ECONOMY_KPI_2025.gdp_per_capita_usd > ECONOMY_KPI_2024.gdp_per_capita_usd ? "+" : ""}
                {(ECONOMY_KPI_2025.gdp_per_capita_usd - ECONOMY_KPI_2024.gdp_per_capita_usd).toLocaleString()} USD vs 前年
              </div>
            </div>
            {/* FDI流入 */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>FDI流入額</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>USD {ECONOMY_KPI_2025.fdi_inflow_usd_billion.toFixed(1)}B</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>—</div>
            </div>
            {/* 為替レート */}
            <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>対USD為替レート</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 600, color: "#333" }}>1 USD = {ECONOMY_KPI_2025.exchange_rate_to_usd.toFixed(2)} MYR</div>
              <div style={{ fontSize: "0.8rem", color: ECONOMY_KPI_2025.exchange_rate_to_usd < ECONOMY_KPI_2024.exchange_rate_to_usd ? "#28a745" : "#dc3545" }}>
                {ECONOMY_KPI_2025.exchange_rate_to_usd < ECONOMY_KPI_2024.exchange_rate_to_usd ? "MYR高" : "MYR安"}
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "12px" }}>
            出典: {DATA_SOURCES.kpi}
          </p>
        </article>
      </section>

      {/* GDP推移グラフ */}
      {(() => {
        // 2列データ変換: actual / forecast を分離し、2024年を予測線の起点として共有
        const gdpChartData = GDP_HISTORY.map(d => ({
          year: d.year,
          actual:   !d.is_forecast ? d.gdp_usd_billion : null,
          forecast: d.is_forecast ? d.gdp_usd_billion
                    : (d.year === 2024 ? d.gdp_usd_billion : null), // 接続ポイント
        }));
        return (
          <section className="content-block">
            <p className="section-kicker">GDP TREND</p>
            <h2>GDP 推移（実績 + 予測）</h2>
            <p className="section-subline">2015-2030年度 — 十億USD</p>
            <article className="reference-block">
              <div style={{ height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gdpChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" label={{ value: "GDP（十億USD）", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: any) => {
                        if (value == null) return "";
                        return `USD ${(value as number).toFixed(1)}B`;
                      }}
                      contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #ccc" }}
                    />
                    <Legend />
                    {/* 実績ライン: 2010-2024 実線 */}
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="実績"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                    {/* 予測ライン: 2024-2030 破線（2024年を共有して実績と接続） */}
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="予測"
                      stroke="#2563eb"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#2563eb", r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "12px" }}>
                ※ 2024年まで実績、2025年以降は予測値です。破線は予測を示します。
              </p>
              <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                出典: {DATA_SOURCES.gdp}
              </p>
            </article>
          </section>
        );
      })()}

      {/* 産業別GDP構成比 */}
      <section className="content-block">
        <p className="section-kicker">INDUSTRY COMPOSITION</p>
        <h2>産業別 GDP 構成比（2025年度）</h2>
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
        <h2>主要経済ニュース・政策動向</h2>
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
        <h2>電力インフラ基本情報</h2>
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
        <h2>製品別 認証要件</h2>
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
        <h2>地域別 留意点</h2>
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
        <h2>市場・実務ノート</h2>
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
      <h2>{tab.sublabel}</h2>
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
    <main className="fade-in">
      <header className="my-page-header">
        <div className="my-page-header-top">
          <button
            className="my-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to top page"
          >
            Back to ASEAN Overview →
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
