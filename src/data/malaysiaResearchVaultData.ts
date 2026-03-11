/* ------------------------------------------------------------------ */
/*  T6 Research Vault — Malaysia Data                                 */
/* ------------------------------------------------------------------ */

import type {
  ResearchSection,
  ResearchSource,
} from "../types";

export const MALAYSIA_RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: "st_faq_eq",
    label: "ST FAQ: Electrical Equipment",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/eng/web/faqs/listing/35",
    checked_on: "2026-03-11",
  },
  {
    id: "st_coa_app",
    label: "ST Application Procedure for COA",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/eng/web/application/details/5/5",
    checked_on: "2026-03-11",
  },
  {
    id: "st_guideline_2024",
    label: "Guidelines for the Approval of Electrical Equipment (2024 Edition)",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/contents/files/download/158/Guidelines%20for%20the%20Approval%20of%20Electrical%20Equipment%20%282024%20Edition%29.pdf",
    checked_on: "2026-03-11",
  },
  {
    id: "st_new_coa_sla",
    label: "ST New COA SLA",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/web/general/details/115",
    checked_on: "2026-03-11",
  },
  {
    id: "st_renewal_coa_sla",
    label: "ST Renewal COA SLA",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/web/general/details/116",
    checked_on: "2026-03-11",
  },
  {
    id: "st_new_docs",
    label: "ST New COA Required Documents",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/web/general/details/113",
    checked_on: "2026-03-11",
  },
  {
    id: "st_renewal_docs",
    label: "ST Renewal COA Required Documents",
    publisher: "Suruhanjaya Tenaga (Energy Commission)",
    url: "https://www.st.gov.my/web/general/details/114",
    checked_on: "2026-03-11",
  },
  {
    id: "sirim_pc_faq",
    label: "SIRIM Product Certification FAQs",
    publisher: "SIRIM QAS International",
    url: "https://www.sirim-qas.com.my/faqs/product-certification/",
    checked_on: "2026-03-11",
  },
  {
    id: "sirim_pc_scheme",
    label: "SIRIM Product Certification Scheme",
    publisher: "SIRIM QAS International",
    url: "https://www.sirim-qas.com.my/service/product-certification-scheme/",
    checked_on: "2026-03-11",
  },
  {
    id: "sirim_cb",
    label: "SIRIM IECEE CB Scheme",
    publisher: "SIRIM QAS International",
    url: "https://www.sirim-qas.com.my/service/iecee-cb-scheme/",
    checked_on: "2026-03-11",
  },
  {
    id: "sirim_consignment",
    label: "SIRIM Consignment Batch for Imported E&E Products",
    publisher: "SIRIM QAS International",
    url: "https://www.sirim-qas.com.my/service/electrical-electronics/scope-of-testing/consignment-batch-for-imported-electrical-and-electronics-products/",
    checked_on: "2026-03-11",
  },
  {
    id: "miti_fta",
    label: "MITI FTA Portal",
    publisher: "Ministry of Investment, Trade and Industry",
    url: "https://fta.miti.gov.my/",
    checked_on: "2026-03-11",
  },
  {
    id: "mysst",
    label: "MySST Portal",
    publisher: "Royal Malaysian Customs Department",
    url: "https://mysst.customs.gov.my/",
    checked_on: "2026-03-11",
  },
  {
    id: "myprocurement",
    label: "MyProcurement Portal",
    publisher: "Government of Malaysia",
    url: "https://myprocurement.treasury.gov.my/",
    checked_on: "2026-03-11",
  },
  {
    id: "mida_ee",
    label: "MIDA Electrical & Electronics Industry",
    publisher: "MIDA",
    url: "https://www.mida.gov.my/industries/manufacturing/electrical-electronics/",
    checked_on: "2026-03-11",
  },
  {
    id: "mida_1h2024",
    label: "MIDA 1H2024 Approved Investments",
    publisher: "MIDA",
    url: "https://www.mida.gov.my/media-release/continued-investor-confidence-sees-approved-investments-up-18-to-rm160-billion-for-malaysia-generating-over-79000-new-jobs-for-1h-2024/",
    checked_on: "2026-03-11",
  },
  {
    id: "mida_johor_dc",
    label: "MIDA AirTrunk Johor Data Centre",
    publisher: "MIDA",
    url: "https://www.mida.gov.my/mida-news/airtrunk-to-build-second-data-centre-in-johor-combined-cost-of-two-facilities-at-rm9-7bil/",
    checked_on: "2026-03-11",
  },
  {
    id: "mida_penang_semi",
    label: "MIDA Penang Semiconductor Hub",
    publisher: "MIDA",
    url: "https://www.mida.gov.my/mida-news/penang-focusing-on-international-hub-for-electronics-and-semiconductors-says-kon-yeow/",
    checked_on: "2026-03-11",
  },
];

export const MALAYSIA_RESEARCH_SECTIONS: ResearchSection[] = [
  {
    id: "executive",
    kicker: "RESEARCH OPERATING MODEL",
    title: "T6の使い方",
    subtitle: "Confirmed facts first, inference second, unknowns left explicit.",
    description:
      "このタブは T3/T4 に再配分する前の一次情報集約庫です。Confirmed は公開一次情報で確認済み、Inference はその事実から導く営業示唆、Unverified は今回の公開一次情報だけでは断定できなかった項目です。",
    cards: [
      {
        title: "最速の参入形",
        value: "輸入者/現地代理人起点",
        detail: "COA は e-Permit で申請し、申請者または local agent が Dagang Net 登録を行う建付け。",
        status: "Confirmed",
        source_ids: ["st_coa_app"],
      },
      {
        title: "制度上の強いゲート",
        value: "CoR → CoA → ST-SIRIM label",
        detail: "CoA は CoR なしでは申請不可。Seller/advertiser 単独では CoA を新規取得できない。",
        status: "Confirmed",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
      {
        title: "高確度の需要ポケット",
        value: "E&E / 半導体 / データセンター",
        detail: "MIDA の産業・投資発表上で、E&E・Johor の DC・Penang の半導体が強く出ている。",
        status: "Confirmed",
        source_ids: ["mida_ee", "mida_1h2024", "mida_johor_dc", "mida_penang_semi"],
      },
      {
        title: "今回の最大注意点",
        value: "ACB/MCCB の公的スコープ確認",
        detail: "今回回収した公開一次情報では、MCB / ELCB-RCCB / RCBO の regulated scope は確認できた一方、ACB / MCCB の扱いは追加確認が必要。",
        status: "Unverified",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
    ],
  },
  {
    id: "cert-route",
    kicker: "CERTIFICATION ROUTE MAP",
    title: "製品別の制度上スコープ",
    subtitle: "What is clearly regulated, and what still needs official scope confirmation?",
    table: {
      columns: [
        { key: "product", label: "製品" },
        { key: "official_scope", label: "公開一次情報での扱い" },
        { key: "practical_read", label: "営業判断への読み替え" },
        { key: "notes", label: "注記" },
      ],
      rows: [
        {
          id: "mcb",
          status: "Confirmed",
          source_ids: ["st_faq_eq", "st_guideline_2024"],
          values: {
            product: "MCB",
            official_scope: "Single-phase 240V / Three-phase 415V、60A以下の miniature circuit breakers は regulated equipment として ST-SIRIM label 対象。",
            practical_read: "住宅・一般商業の量販を狙うなら、CoA と ST-SIRIM label は前提条件。",
            notes: "単相/三相の表記は FAQ 上 240/415V、供給公称値 FAQ は 230/400V。",
          },
        },
        {
          id: "rccb",
          status: "Confirmed",
          source_ids: ["st_faq_eq", "st_guideline_2024"],
          values: {
            product: "ELCB / RCCB",
            official_scope: "Single-phase 240V 63A以下、Three-phase 415V 100A以下が regulated equipment として明示。",
            practical_read: "低圧保護機器としての mass-market entry は regulated route を前提に設計すべき。",
            notes: "ST FAQ の regulated list に ELCB / RCCB が明記。",
          },
        },
        {
          id: "rcbo",
          status: "Confirmed",
          source_ids: ["st_faq_eq", "st_guideline_2024"],
          values: {
            product: "RCBO",
            official_scope: "Single-phase / Three-phase、63A以下の RCBO が regulated equipment として明示。",
            practical_read: "RCBO を前面に出す場合も、MCB/RCCB と同様に label-ready である必要が高い。",
            notes: "FAQ 上は RCBO も ST-SIRIM label 対象として読める。",
          },
        },
        {
          id: "acb_mccb",
          status: "Unverified",
          source_ids: ["st_faq_eq", "st_guideline_2024"],
          values: {
            product: "ACB / MCCB",
            official_scope: "今回回収した公開一次情報では regulated list 上の明示確認に至らず。",
            practical_read: "案件営業に進む前に、最新 guideline と ST への official clarification が必要。",
            notes: "未確認のまま mandatory / voluntary を断定しない。",
          },
        },
      ],
    },
    insights: [
      {
        title: "T3へ後で移すべき中心項目",
        body: "MCB / RCCB / RCBO は制度上の販売可否に直結するため、将来の T3 では最上段に置く価値が高い。",
        status: "Inference",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
    ],
  },
  {
    id: "workflow",
    kicker: "APPROVAL WORKFLOW",
    title: "Time-to-Revenueの制度面タイムライン",
    subtitle: "The official SLA is short only after the dossier is complete.",
    table: {
      columns: [
        { key: "step", label: "段階" },
        { key: "confirmed_fact", label: "確認済み事実" },
        { key: "time", label: "公表所要" },
        { key: "gtm_impact", label: "営業上の意味" },
      ],
      rows: [
        {
          id: "cor",
          status: "Confirmed",
          source_ids: ["st_faq_eq", "st_coa_app"],
          values: {
            step: "CoR / 申請主体整備",
            confirmed_fact: "CoA は CoR なしでは申請できず、申請者または local agent が Dagang Net 登録を行う。",
            time: "SLA未公表",
            gtm_impact: "最初のボトルネックは試験ではなく、誰が申請主体になるかの設計。",
          },
        },
        {
          id: "new-coa",
          status: "Confirmed",
          source_ids: ["st_coa_app", "st_new_coa_sla"],
          values: {
            step: "新規 CoA 申請",
            confirmed_fact: "test report・必要書類・手数料が揃えば ST が CoA を発行。Complete application の SLA は 5営業日。",
            time: "5営業日",
            gtm_impact: "SLA は短いが、前提資料不足だと lead time は一気に伸びる。",
          },
        },
        {
          id: "renewal",
          status: "Confirmed",
          source_ids: ["st_renewal_coa_sla", "st_faq_eq"],
          values: {
            step: "更新",
            confirmed_fact: "Renewal application は expiry の少なくとも 14日前に提出。Complete renewal の SLA は 1営業日。",
            time: "1営業日",
            gtm_impact: "維持運用は速いが、失効させると案件供給が止まりやすい。",
          },
        },
        {
          id: "consignment",
          status: "Confirmed",
          source_ids: ["sirim_consignment"],
          values: {
            step: "輸入ロット対応",
            confirmed_fact: "Consignment service は sample test と inspection に合格した batch のみに label を発行し、label は各 unit に貼付する。",
            time: "SIRIMの固定SLA未公表",
            gtm_impact: "pilot import は可能だが、ロット毎運用前提なので量販常態化には向きにくい。",
          },
        },
      ],
    },
    insights: [
      {
        title: "制度上の最短売上ルート",
        body: "既に CoR を持つ現地輸入者/代理人を起点に、対象モデルを絞って CoA を取る形がもっとも早い。",
        status: "Inference",
        source_ids: ["st_coa_app", "st_faq_eq"],
      },
      {
        title: "SKU 拡大型の弱点",
        body: "one CoA for one model のため、色違い・型番違いを多く持ち込む戦略は初期立ち上げで不利になりやすい。",
        status: "Inference",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
    ],
  },
  {
    id: "economics",
    kicker: "CERTIFICATION ECONOMICS",
    title: "認証コストと維持負担",
    subtitle: "Known official fees are small; the hidden cost is model proliferation and surveillance.",
    cards: [
      {
        title: "CoA有効期間",
        value: "12 months",
        detail: "Certificate of Approval は発行日から 12か月有効。",
        status: "Confirmed",
        source_ids: ["st_faq_eq"],
      },
      {
        title: "年額費用",
        value: "RM220 / RM330",
        detail: "公開 FAQ で、local importer or manufacturer は RM220、foreign importer or manufacturer は RM330 の annual fee が示されている。",
        status: "Confirmed",
        source_ids: ["st_faq_eq"],
      },
      {
        title: "モデル管理負担",
        value: "1 CoA = 1 model",
        detail: "1つの CoA を複数モデルに流用できないため、SKU が増えるほど制度コストが積み上がる。",
        status: "Confirmed",
        source_ids: ["st_faq_eq"],
      },
      {
        title: "SIRIM維持監査",
        value: "Twice a year",
        detail: "Product Certification Scheme では subsequent years に surveillance audit を年2回行うと FAQ で案内。",
        status: "Confirmed",
        source_ids: ["sirim_pc_faq", "sirim_pc_scheme"],
      },
    ],
    insights: [
      {
        title: "費用よりも運用が重い",
        body: "ST の公表 fee 自体は大きくない。一方で、SKU 数、工場監査、surveillance、batch labels の運用が実務負荷の本体になりやすい。",
        status: "Inference",
        source_ids: ["st_faq_eq", "sirim_pc_faq", "sirim_consignment"],
      },
    ],
  },
  {
    id: "standards",
    kicker: "STANDARD & DOCUMENT FIT",
    title: "電圧条件と必要書類",
    subtitle: "Grid reality, product scope, and dossier completeness are all gating items.",
    table: {
      columns: [
        { key: "topic", label: "観点" },
        { key: "fact", label: "確認済み事実" },
        { key: "risk", label: "実務リスク" },
        { key: "action", label: "T6での暫定アクション" },
      ],
      rows: [
        {
          id: "voltage",
          status: "Confirmed",
          source_ids: ["st_faq_eq"],
          values: {
            topic: "供給電圧",
            fact: "FAQ では single-phase 230V、three-phase 400V、許容偏差 +10% / -6%。",
            risk: "FAQ の regulated equipment list は 240/415V 表記で、catalogue 側の定格表現と照合が必要。",
            action: "製品データシートに 230/400V 系適合の表現整理欄を作る。",
          },
        },
        {
          id: "new-docs",
          status: "Confirmed",
          source_ids: ["st_new_docs"],
          values: {
            topic: "新規申請書類",
            fact: "公開 FAQ / guideline では type test report、SSM 文書、licence/tenancy、invoice・B/L 等が必要書類として案内される。",
            risk: "営業初期に test report と申請主体書類の収集が遅れると 5営業日 SLA の恩恵を受けられない。",
            action: "T6 では HQ 側書類と現地側書類を分けて管理する。",
          },
        },
        {
          id: "renewal-docs",
          status: "Confirmed",
          source_ids: ["st_renewal_docs"],
          values: {
            topic: "更新書類",
            fact: "renewal も最新資料の再提出が必要で、期限前提出ルールがある。",
            risk: "輸入者・代理店切替時に renewal 運用が途切れると案件継続性を損なう。",
            action: "T6 内で renewal owner を明示できるデータ項目を後続実装で追加する。",
          },
        },
        {
          id: "cb-docs",
          status: "Confirmed",
          source_ids: ["sirim_cb"],
          values: {
            topic: "CB活用",
            fact: "SIRIM は recognised NCB / CBTL として CB Test Reports と CB Test Certificates を発行できる。",
            risk: "CB は national approval を直接代替するわけではなく、国内制度への橋渡し手段として理解すべき。",
            action: "T6 では CB 有無を dossier completeness 項目として持たせる。",
          },
        },
      ],
    },
  },
  {
    id: "market-gates",
    kicker: "ACCESS GATEKEEPERS",
    title: "市場参入の実権者",
    subtitle: "The first gates are regulatory and procurement-system gates, not branding gates.",
    table: {
      columns: [
        { key: "gate", label: "ゲート" },
        { key: "fact", label: "確認済み事実" },
        { key: "implication", label: "営業示唆" },
      ],
      rows: [
        {
          id: "regulator",
          status: "Confirmed",
          source_ids: ["st_coa_app", "st_faq_eq"],
          values: {
            gate: "ST / CoA",
            fact: "regulated scope の electrical equipment は CoR と CoA、ST-SIRIM label で販売可否が決まる。",
            implication: "まず regulator pass を取らない限り、後段の販路開拓は効きにくい。",
          },
        },
        {
          id: "sirim",
          status: "Confirmed",
          source_ids: ["sirim_pc_faq", "sirim_consignment"],
          values: {
            gate: "SIRIM audit / labels",
            fact: "factory audit、sample testing、surveillance、consignment labels など運用ゲートが存在する。",
            implication: "現地販売の可否だけでなく、維持運用の耐久力が問われる。",
          },
        },
        {
          id: "gov-system",
          status: "Confirmed",
          source_ids: ["myprocurement"],
          values: {
            gate: "Government procurement systems",
            fact: "MyProcurement は tender、supplier、contract 情報の政府ポータルとして機能する。",
            implication: "公共案件は案件探索と入札実務のシステム適応が必要で、純粋な輸出営業だけでは弱い。",
          },
        },
        {
          id: "seller",
          status: "Confirmed",
          source_ids: ["st_faq_eq"],
          values: {
            gate: "Seller / advertiser",
            fact: "seller or advertiser は既に CoA を持ち ST-SIRIM label が付いた機器のみ販売・広告可能。CoA は原則 importer / manufacturer に発行。",
            implication: "EC 起点や販促先行だけの entry は制度的に弱い。先に importer/manufacturer 側の体制が要る。",
          },
        },
      ],
    },
  },
  {
    id: "import-trade",
    kicker: "IMPORT & TRADE CHECKPOINTS",
    title: "輸入・FTA・税務の確認ポイント",
    subtitle: "Use official portals, but do not freeze tariff assumptions without product-specific rulings.",
    cards: [
      {
        title: "申請チャネル",
        value: "e-Permit / Dagang Net",
        detail: "ST の COA 申請は e-Permit 経由で運用される。",
        status: "Confirmed",
        source_ids: ["st_coa_app"],
      },
      {
        title: "FTA確認窓口",
        value: "MITI FTA Portal",
        detail: "RCEP / AJCEP などの法文・運用入口は MITI FTA ポータルで追う。",
        status: "Confirmed",
        source_ids: ["miti_fta"],
      },
      {
        title: "税務確認窓口",
        value: "MySST",
        detail: "販売税の現行確認は Customs の MySST で行うのが安全。",
        status: "Confirmed",
        source_ids: ["mysst"],
      },
      {
        title: "ロット輸入の代替線",
        value: "SIRIM Consignment",
        detail: "imported E&E products 向けに consignment batch certification が用意されている。",
        status: "Confirmed",
        source_ids: ["sirim_consignment"],
      },
    ],
    insights: [
      {
        title: "T4へ移すべき論点",
        body: "HS、FTA、SST は製品型番と原産地で変わるため、将来の T4 では product-specific lookup と ruling 前提で扱うべき。現段階ではポータルと確認手順だけを固定するのが安全。",
        status: "Inference",
        source_ids: ["miti_fta", "mysst", "st_coa_app"],
      },
    ],
  },
  {
    id: "entry-modes",
    kicker: "ENTRY MODE DECISION MATRIX",
    title: "公式事実から見た参入方式の向き不向き",
    subtitle: "This section is intentionally labelled as inference.",
    table: {
      columns: [
        { key: "mode", label: "参入方式" },
        { key: "fit", label: "現時点の相性" },
        { key: "why", label: "根拠" },
        { key: "watchout", label: "注意点" },
      ],
      rows: [
        {
          id: "local-agent",
          status: "Inference",
          source_ids: ["st_coa_app", "st_faq_eq"],
          values: {
            mode: "現地輸入者 / 代理人起点",
            fit: "High",
            why: "申請主体または local agent が Dagang Net / CoR / CoA 体制を持てるため、制度との整合が良い。",
            watchout: "代理人変更時に renewal / model 管理が複雑化しやすい。",
          },
        },
        {
          id: "foreign-maker",
          status: "Inference",
          source_ids: ["st_faq_eq", "sirim_pc_faq"],
          values: {
            mode: "海外メーカー主導 + 現地補完",
            fit: "Medium",
            why: "foreign applicant ルートはあるが、CoR・現地提出書類・工場監査の整理が要る。",
            watchout: "no-local-ops のままでは seller / advertiser モデルに寄りすぎて制度で詰まりやすい。",
          },
        },
        {
          id: "consignment-pilot",
          status: "Inference",
          source_ids: ["sirim_consignment"],
          values: {
            mode: "Consignment で小口立上げ",
            fit: "Medium",
            why: "batch ごとに inspection/testing と label 発行で pilot import を作りやすい。",
            watchout: "量販常態化すると batch 運用負荷が高い。",
          },
        },
        {
          id: "pure-digital",
          status: "Inference",
          source_ids: ["st_faq_eq"],
          values: {
            mode: "EC / 広告先行の純デジタル参入",
            fit: "Low",
            why: "seller / advertiser は CoA を自分で取りにいく主体ではなく、既認証品しか扱えない。",
            watchout: "制度整備なしの lead generation は受注化に結びつきにくい。",
          },
        },
      ],
    },
  },
  {
    id: "buyer-journey",
    kicker: "BUYER JOURNEY & CHANNEL POWER",
    title: "案件化までの実務仮説",
    subtitle: "Officially anchored where possible; otherwise left as inference.",
    table: {
      columns: [
        { key: "actor", label: "プレイヤー" },
        { key: "official_anchor", label: "一次情報アンカー" },
        { key: "power_read", label: "意思決定力の読み" },
        { key: "status_note", label: "確度" },
      ],
      rows: [
        {
          id: "importer",
          status: "Inference",
          source_ids: ["st_coa_app", "st_faq_eq"],
          values: {
            actor: "Importer / Local Agent",
            official_anchor: "CoA 申請実務と required documents を握る主体。",
            power_read: "制度面では High。案件化の最初のハンドルを持つ。",
            status_note: "制度根拠は Confirmed、案件影響度は Inference。",
          },
        },
        {
          id: "government",
          status: "Inference",
          source_ids: ["myprocurement"],
          values: {
            actor: "Government procurer",
            official_anchor: "MyProcurement が tender / supplier / contract の窓口。",
            power_read: "公共案件では High。制度適合だけでなく調達手続き理解が必要。",
            status_note: "公開調達システムの存在は Confirmed、影響度は Inference。",
          },
        },
        {
          id: "sirim-st",
          status: "Inference",
          source_ids: ["sirim_pc_faq", "sirim_consignment", "st_faq_eq"],
          values: {
            actor: "ST / SIRIM",
            official_anchor: "approval、labels、audit、surveillance を通じて entry condition を規定。",
            power_read: "ブランド力より先に効く High gatekeeper。",
            status_note: "制度的影響はほぼ Confirmed。",
          },
        },
        {
          id: "pb_epc",
          status: "Unverified",
          source_ids: ["mida_ee"],
          values: {
            actor: "Panel builder / EPC / consultant",
            official_anchor: "今回の公開一次情報では個別プレイヤー構造を定量確認できず。",
            power_read: "案件影響は高い可能性が高いが、T6 では断定しない。",
            status_note: "後続で業界一次情報を追加予定。",
          },
        },
      ],
    },
  },
  {
    id: "public-utility",
    kicker: "TENDER / AVL PLAYABILITY",
    title: "公共・ユーティリティの入りやすさ",
    subtitle: "What is publicly evidenced, and what still needs direct authority confirmation?",
    table: {
      columns: [
        { key: "theme", label: "論点" },
        { key: "current_read", label: "現時点の読み" },
        { key: "why", label: "根拠" },
      ],
      rows: [
        {
          id: "gov-discovery",
          status: "Confirmed",
          source_ids: ["myprocurement"],
          values: {
            theme: "公共案件の探索性",
            current_read: "Medium to High",
            why: "案件・契約・supplier 情報の公的ポータルが存在し、案件探索はしやすい。",
          },
        },
        {
          id: "gov-execution",
          status: "Inference",
          source_ids: ["myprocurement", "st_faq_eq"],
          values: {
            theme: "公共案件の実行難度",
            current_read: "Medium",
            why: "ポータルはあるが、認証保有主体と入札主体の整合を取る必要があるため、単純輸出より重い。",
          },
        },
        {
          id: "utility-avl",
          status: "Unverified",
          source_ids: ["myprocurement"],
          values: {
            theme: "Utility AVL / vendor listing の難度",
            current_read: "Need direct confirmation",
            why: "今回の公開一次情報だけでは、TNB 個別の product/vendor listing 条件を十分に確定できていない。",
          },
        },
      ],
    },
  },
  {
    id: "priority",
    kicker: "WHITE SPACE & GEOGRAPHY",
    title: "狙うべき産業・地域",
    subtitle: "Demand pockets supported by official investment announcements.",
    table: {
      columns: [
        { key: "segment", label: "需要ポケット" },
        { key: "official_signal", label: "一次情報のシグナル" },
        { key: "geo", label: "地域示唆" },
        { key: "priority", label: "優先度" },
      ],
      rows: [
        {
          id: "ee",
          status: "Confirmed",
          source_ids: ["mida_ee", "mida_1h2024"],
          values: {
            segment: "Electrical & Electronics",
            official_signal: "MIDA は E&E を主要製造業として位置づけ、2024 年の approved investments でも最大セクターとして公表。",
            geo: "Penang / Kedah / Klang Valley を軸に見るのが自然。",
            priority: "High",
          },
        },
        {
          id: "dc",
          status: "Confirmed",
          source_ids: ["mida_johor_dc", "mida_1h2024"],
          values: {
            segment: "Data centre",
            official_signal: "Johor で AirTrunk の二つの施設合計 RM9.7bn 規模が公表。",
            geo: "Johor が最優先。",
            priority: "High",
          },
        },
        {
          id: "semi",
          status: "Confirmed",
          source_ids: ["mida_penang_semi", "mida_ee"],
          values: {
            segment: "Semiconductor",
            official_signal: "Penang を international hub for electronics and semiconductors として押し出している。",
            geo: "Penang / northern corridor。",
            priority: "High",
          },
        },
        {
          id: "state-rank",
          status: "Confirmed",
          source_ids: ["mida_1h2024"],
          values: {
            segment: "州優先順位の初期仮説",
            official_signal: "1H2024 の approved investments 上位は Kuala Lumpur, Selangor, Johor, Kedah, Penang。",
            geo: "Klang Valley と Johor / Penang を切り分けて追うべき。",
            priority: "High",
          },
        },
      ],
    },
    insights: [
      {
        title: "最初の geographic focus",
        body: "広く ASEAN 一国として追うより、Johor の DC、Penang / Kedah の E&E・半導体、Klang Valley の本社・案件ハブを分けて攻める方が再現性が高い。",
        status: "Inference",
        source_ids: ["mida_ee", "mida_1h2024", "mida_johor_dc", "mida_penang_semi"],
      },
    ],
  },
  {
    id: "partner-framework",
    kicker: "PARTNER EVALUATION FRAMEWORK",
    title: "現地パートナー選定の採点軸",
    subtitle: "The dimensions are grounded in official process requirements.",
    table: {
      columns: [
        { key: "criterion", label: "採点項目" },
        { key: "why", label: "なぜ必要か" },
        { key: "must_have", label: "最低条件" },
      ],
      rows: [
        {
          id: "cor-holder",
          status: "Inference",
          source_ids: ["st_faq_eq", "st_coa_app"],
          values: {
            criterion: "CoR / CoA 運用主体になれるか",
            why: "制度上の申請主体を持てない partner では販売化が進まない。",
            must_have: "Importer / local agent として必要書類を回せること。",
          },
        },
        {
          id: "dossier",
          status: "Inference",
          source_ids: ["st_new_docs", "st_renewal_docs"],
          values: {
            criterion: "Dossier 管理能力",
            why: "5営業日 SLA の前提は complete application。",
            must_have: "test report、会社書類、輸入書類、更新期限を管理できること。",
          },
        },
        {
          id: "audit",
          status: "Inference",
          source_ids: ["sirim_pc_faq", "sirim_pc_scheme"],
          values: {
            criterion: "SIRIM 監査対応力",
            why: "factory audit、surveillance、market sampling への反応速度が必要。",
            must_have: "工場・品質・市場対応の窓口を持つこと。",
          },
        },
        {
          id: "public-sector",
          status: "Inference",
          source_ids: ["myprocurement"],
          values: {
            criterion: "公共案件運用力",
            why: "公共案件は公的調達ポータルと調達実務を理解している partner が有利。",
            must_have: "government tender の案件探索・書類提出に慣れていること。",
          },
        },
      ],
    },
  },
  {
    id: "service-watch",
    kicker: "SERVICE EXPECTATIONS & WATCHLIST",
    title: "参入後に止まりやすい論点",
    subtitle: "What must be operated continuously, not just approved once.",
    table: {
      columns: [
        { key: "watch_item", label: "論点" },
        { key: "confirmed_fact", label: "確認済み事実" },
        { key: "impact", label: "影響" },
      ],
      rows: [
        {
          id: "renewal",
          status: "Confirmed",
          source_ids: ["st_faq_eq", "st_renewal_coa_sla"],
          values: {
            watch_item: "失効管理",
            confirmed_fact: "CoA は 12か月有効、renewal は expiry 14日前提出。",
            impact: "期限管理を誤ると販売継続性を損なう。",
          },
        },
        {
          id: "surveillance",
          status: "Confirmed",
          source_ids: ["sirim_pc_faq", "sirim_pc_scheme"],
          values: {
            watch_item: "SIRIM surveillance",
            confirmed_fact: "announced / unannounced surveillance、市場サンプリング、complaint triggered sampling がある。",
            impact: "認証取得後も品質・市場対応体制が必要。",
          },
        },
        {
          id: "batch",
          status: "Confirmed",
          source_ids: ["sirim_consignment"],
          values: {
            watch_item: "Consignment labels",
            confirmed_fact: "batch approval は consignment size 分の labels を発行し、各 unit へ貼付。",
            impact: "pilot import は柔軟だが、量販でのオペレーション負荷が高い。",
          },
        },
        {
          id: "scope-gap",
          status: "Unverified",
          source_ids: ["st_faq_eq", "st_guideline_2024"],
          values: {
            watch_item: "ACB / MCCB scope gap",
            confirmed_fact: "今回の回収ソースでは明示確認未了。",
            impact: "制度誤認のまま価格表や販促を作ると危険。",
          },
        },
      ],
    },
  },
  {
    id: "win-loss",
    kicker: "WIN / LOSS SUMMARY",
    title: "現時点のGo-to-Market結論",
    subtitle: "This summary is intentionally inference-led, but every point is tied back to confirmed facts.",
    cards: [
      {
        title: "勝ちやすい条件",
        value: "現地申請主体 + 絞ったSKU + 重点産業集中",
        detail: "制度面の速度は出るので、Johor DC と Penang / Kedah E&E に集中する戦い方が現実的。",
        status: "Inference",
        source_ids: ["st_coa_app", "mida_johor_dc", "mida_penang_semi", "mida_1h2024"],
      },
      {
        title: "負けやすい条件",
        value: "EC先行 / 多SKU先行 / scope未確認のまま拡販",
        detail: "seller / advertiser 制約、1 CoA = 1 model、ACB/MCCB の未確認論点がボトルネックになる。",
        status: "Inference",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
      {
        title: "まずT3へ戻すべきもの",
        value: "MCB・RCCB・RCBO の route map",
        detail: "販売可否に直結するため、最終的には T3 の中核へ戻すべき。",
        status: "Inference",
        source_ids: ["st_faq_eq", "st_guideline_2024"],
      },
      {
        title: "まずT4へ戻すべきもの",
        value: "Johor / Penang / Klang Valley の優先順位",
        detail: "需要ポケットと entry mode を結びつける中核情報。",
        status: "Inference",
        source_ids: ["mida_1h2024", "mida_johor_dc", "mida_penang_semi"],
      },
    ],
    note:
      "このまとめは営業示唆です。制度要件そのものではありません。制度断定は各 Confirmed row を参照してください。",
  },
];
