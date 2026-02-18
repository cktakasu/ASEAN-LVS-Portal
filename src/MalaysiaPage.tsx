import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  { product: "ACB",  requirement: "Conditional", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "Often required in project specifications" },
  { product: "MCCB", requirement: "Conditional", standard: "MS IEC 60947-2", authority: "SIRIM QAS", note: "SIRIM CoA commonly required in project specs" },
  { product: "MCB",  requirement: "Mandatory",   standard: "MS IEC 60898",   authority: "SIRIM QAS", note: "ST-SIRIM CoA mandatory" },
  { product: "RCCB", requirement: "Mandatory",   standard: "MS IEC 61008",   authority: "SIRIM QAS", note: "ST-SIRIM CoA mandatory" },
  { product: "RCBO", requirement: "Mandatory",   standard: "MS IEC 61009",   authority: "SIRIM QAS", note: "ST-SIRIM CoA mandatory" },
];

const POWER_INFO: InfoItem[] = [
  { label: "System Voltage (LV)",  value: "240 V (single-phase) / 415 V (three-phase)" },
  { label: "Frequency",            value: "50 Hz" },
  { label: "Main Utility",         value: "Tenaga Nasional Berhad (TNB) — Peninsular Malaysia" },
  { label: "Sabah & Sarawak",      value: "Sabah Electricity Sdn Bhd (SESB) / Sarawak Energy Berhad (SEB)" },
  { label: "Plug Type",            value: "Type G (British standard BS 1363)" },
  { label: "Distribution System",  value: "TN-S / TN-C-S (Peninsular); TT in some areas" },
];

const SIRIM_PROCESS: string[] = [
  "Submit application, product specifications, and test report (from accredited lab) to SIRIM QAS International",
  "Product evaluation against applicable MS standards (MS IEC 60898 / 61008 / 61009, etc.)",
  "Issuance of Certificate of Approval (CoA)",
  "Registration and notification to ST (Suruhanjaya Tenaga / Energy Commission)",
  "Product may be shipped bearing the ST-SIRIM CoA mark",
];

const REGIONAL_DIFF: InfoItem[] = [
  { label: "Peninsular Malaysia", value: "TNB grid. The MS standards and SIRIM CoA framework is most developed here; ST registration is effectively mandatory." },
  { label: "Sabah (North Borneo)", value: "Under SESB. Grid capacity is smaller than Peninsular. Project specs typically require IEC or BS compliance." },
  { label: "Sarawak (Northwest Borneo)", value: "SEB operates independently. Certification requirements must be confirmed separately against SEB specifications." },
];

const MARKET_NOTES: string[] = [
  "ST-SIRIM CoA is a mandatory requirement for residential MCB, RCCB, and RCBO. Certificates from bodies other than SIRIM QAS are not accepted.",
  "Industrial ACB and MCCB are not subject to mandatory certification, but TNB and PLC tender specifications frequently require submission of a SIRIM CoA or IEC CB Scheme certificate.",
  "Holding an IECEE CB certificate may allow partial waiver of SIRIM testing. Confirm with SIRIM QAS on a case-by-case basis before application.",
  "HS codes: 8536.20 (MCB), 8536.10 (RCCB/RCBO and other circuit breakers). It is standard practice to declare the certification number on customs documents at import.",
  "For MCCB compliant with IEC 60947-2, some projects — particularly those led by UK-based engineering firms — may additionally require test reports equivalent to BS EN 60947-2.",
];

/* ------------------------------------------------------------------ */
/*  Tab content components                                             */
/* ------------------------------------------------------------------ */

function T1CountryProfile(): React.JSX.Element {
  return (
    <>
      <section className="content-block fade-in" style={{ marginTop: "24px" }}>
        <p className="section-kicker">POWER INFRASTRUCTURE</p>
        <h2>Power Infrastructure</h2>
        <p className="section-subline">System voltage, frequency, plug type, and main utility companies</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Details</th>
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
        <h2>Certification Requirements by Product</h2>
        <p className="section-subline">Low-Voltage Circuit Breakers — Malaysia</p>
        <article className="reference-block">
          <h3>Certification Requirements</h3>
          <div className="table-wrap">
            <table className="requirements-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Requirement</th>
                  <th>Standard</th>
                  <th>Authority</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {CERT_ROWS.map((row) => (
                  <tr key={row.product}>
                    <td><strong>{row.product}</strong></td>
                    <td
                      style={{
                        color: row.requirement === "Mandatory" ? "#c00" : row.requirement === "Conditional" ? "#885500" : "inherit",
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
            <strong>Required Procedure: </strong>
            SIRIM product certification → ST (Energy Commission) label → CoA issuance
          </p>
        </article>
        <article className="reference-block">
          <h3>SIRIM Certification Process</h3>
          <ol className="notes-list">
            {SIRIM_PROCESS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="content-block fade-in">
        <p className="section-kicker">REGIONAL DIFFERENCES</p>
        <h2>Regional Notes</h2>
        <p className="section-subline">Key differences between Peninsular Malaysia, Sabah, and Sarawak</p>
        <article className="reference-block">
          <div className="table-wrap">
            <table className="definition-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Key Points</th>
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
        <h2>Market &amp; Practical Notes</h2>
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
        This section is under construction.
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
      <header className="hero hero--light" style={{ paddingTop: "32px", paddingBottom: "16px" }}>
        <button
          className="my-back-btn"
          onClick={() => navigate("/")}
          aria-label="Back to top page"
        >
          ← Back to ASEAN Overview
        </button>
        <p className="hero-kicker">COUNTRY PROFILE — MALAYSIA</p>
        <h1 style={{ marginTop: "8px" }}>Malaysia</h1>
        <p className="hero-sub">LV Circuit Breaker Market Intelligence</p>
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
