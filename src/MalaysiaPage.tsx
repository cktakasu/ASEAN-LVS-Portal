import React from "react";
import { useNavigate } from "react-router-dom";

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

const CERT_ROWS: CertRow[] = [
  {
    product: "ACB",
    requirement: "条件付き",
    standard: "MS IEC 60947-2",
    authority: "SIRIM QAS",
    note: "プロジェクト仕様で要求多し",
  },
  {
    product: "MCCB",
    requirement: "条件付き",
    standard: "MS IEC 60947-2",
    authority: "SIRIM QAS",
    note: "プロジェクト仕様でSIRIM CoA要求",
  },
  {
    product: "MCB",
    requirement: "必須",
    standard: "MS IEC 60898",
    authority: "SIRIM QAS",
    note: "ST-SIRIM CoA必須",
  },
  {
    product: "RCCB",
    requirement: "必須",
    standard: "MS IEC 61008",
    authority: "SIRIM QAS",
    note: "ST-SIRIM CoA必須",
  },
  {
    product: "RCBO",
    requirement: "必須",
    standard: "MS IEC 61009",
    authority: "SIRIM QAS",
    note: "ST-SIRIM CoA必須",
  },
];

const POWER_INFO: InfoItem[] = [
  { label: "系統電圧（低圧）", value: "240 V（単相）/ 415 V（三相）" },
  { label: "周波数", value: "50 Hz" },
  { label: "主要電力会社", value: "Tenaga Nasional Berhad（TNB）— 半島マレーシア" },
  { label: "サバ・サラワク", value: "Sabah Electricity（SESB）/ Sarawak Energy（SEB）" },
  { label: "プラグ形状", value: "Type G（英国型 BS 1363）" },
  { label: "配電方式", value: "TN-S / TN-C-S（半島）、地域によりTT" },
];

const SIRIM_PROCESS: string[] = [
  "SIRIM QAS International へ申請書・製品仕様書・試験報告書（認定ラボ発行）を提出",
  "MS規格（MS IEC 60898 / 61008 / 61009 等）に基づく製品評価",
  "CoA（Certificate of Approval）発行",
  "ST（Suruhanjaya Tenaga / Energy Commission）への届出・登録",
  "ST-SIRIM CoAマーク付き製品として出荷可能",
];

const REGIONAL_DIFF: InfoItem[] = [
  { label: "半島マレーシア", value: "TNB系統。MS規格・SIRIM CoA体制が最も整備されており、ST登録が実質必須。" },
  { label: "サバ（ボルネオ北部）", value: "SESBが管轄。系統容量は半島より小さく、プロジェクト仕様でIECまたはBS準拠を要求するケースが多い。" },
  { label: "サラワク（ボルネオ北西）", value: "SEBが独立運営。半島とは別制度。認証要件をSEB仕様で個別確認要。" },
];

const MARKET_NOTES: string[] = [
  "住宅向けMCB・RCCB・RCBOはST-SIRIM CoAが強制要件。SIRIM QAS以外の認証機関では取得不可。",
  "産業用ACB・MCCBは強制認証対象外だが、PLCやTNBの入札仕様で「SIRIM CoAまたはCBスキーム証明書提出」を要求するケースが多い。",
  "CBスキーム（IEC CB Scheme）証明書があれば、SIRIM試験の一部省略が可能な場合がある。事前にSIRIM QASに確認要。",
  "HS分類：8536.20（MCB）、8536.10（RCCB/RCBO含む遮断器類）。輸入時に認証番号を税関申告書に記載する実務が定着している。",
  "IEC 60947-2準拠のMCCBでもプロジェクトによってはBS EN 60947-2相当の試験報告書を追加要求されることがある（英国系エンジニアリング会社案件）。",
];

export default function MalaysiaPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <main className="fade-in">
      {/* ヒーローヘッダー */}
      <header className="hero hero--light" style={{ paddingTop: "32px", paddingBottom: "24px" }}>
        <button
          className="my-back-btn"
          onClick={() => navigate("/")}
          aria-label="トップページへ戻る"
        >
          ← ASEAN 一覧へ戻る
        </button>
        <p className="hero-kicker">COUNTRY PROFILE — MALAYSIA</p>
        <h1 style={{ marginTop: "8px" }}>マレーシア</h1>
        <p className="hero-sub">Malaysia — 認証・電力・市場情報</p>
      </header>

      {/* 電力インフラ基本情報 */}
      <section className="content-block fade-in" style={{ marginTop: "24px" }}>
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

      {/* 認証要件 */}
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

      {/* 地域差 */}
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

      {/* 市場・実務ノート */}
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
    </main>
  );
}
