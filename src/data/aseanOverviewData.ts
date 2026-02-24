export interface ASEANAggregateKPI {
  total_gdp_usd_trillion: number;
  total_population_million: number;
  weighted_avg_growth_pct: number;
  country_count: number;
}

export interface ASEANCountryCard {
  iso3: string;
  nameJa: string;
  nameEn: string;
  gdp_usd_billion_2024: number;
  population_million: number;
  gdp_growth_pct: number;
  voltage: string;
  descriptionJa: string;
  hasDetailPage: boolean;
  detailRoute?: string;
}

export const ASEAN_KPI: ASEANAggregateKPI = {
  total_gdp_usd_trillion: 3.82,
  total_population_million: 683,
  weighted_avg_growth_pct: 5.1,
  country_count: 10,
};

export const ASEAN_COUNTRY_CARDS: ASEANCountryCard[] = [
  {
    iso3: "IDN",
    nameJa: "インドネシア",
    nameEn: "Indonesia",
    gdp_usd_billion_2024: 1371,
    population_million: 278,
    gdp_growth_pct: 5.0,
    voltage: "220V / 50Hz",
    descriptionJa:
      "ASEAN最大の人口大国。旺盛な製造業・インフラ投資を背景にLV機器需要が拡大中。SNI認証（BSN）が販売の前提となる。",
    hasDetailPage: false,
  },
  {
    iso3: "MYS",
    nameJa: "マレーシア",
    nameEn: "Malaysia",
    gdp_usd_billion_2024: 430,
    population_million: 34,
    gdp_growth_pct: 4.4,
    voltage: "240V / 50Hz",
    descriptionJa:
      "高所得国への移行期にあり、データセンターや半導体産業の急成長が電力需要を牽引。MS IEC規格とSIRIM認証が中心。",
    hasDetailPage: true,
    detailRoute: "/malaysia",
  },
  {
    iso3: "THA",
    nameJa: "タイ",
    nameEn: "Thailand",
    gdp_usd_billion_2024: 514,
    population_million: 72,
    gdp_growth_pct: 2.7,
    voltage: "220V / 50Hz",
    descriptionJa:
      "製造業・自動車産業の一大拠点。日系企業のプレゼンスが最も高く、TISI認証制度が整備されている。",
    hasDetailPage: false,
  },
  {
    iso3: "VNM",
    nameJa: "ベトナム",
    nameEn: "Vietnam",
    gdp_usd_billion_2024: 429,
    population_million: 98,
    gdp_growth_pct: 6.4,
    voltage: "220V / 50Hz",
    descriptionJa:
      "外資製造業の集積が続く高成長市場。2025年よりQCVN 25認証制度が強化され、対応が急務。",
    hasDetailPage: false,
  },
  {
    iso3: "PHL",
    nameJa: "フィリピン",
    nameEn: "Philippines",
    gdp_usd_billion_2024: 437,
    population_million: 115,
    gdp_growth_pct: 5.7,
    voltage: "220V / 60Hz",
    descriptionJa:
      "ASEAN唯一の60Hz電源国。人口増加に伴う住宅・商業開発需要が旺盛で、PEC認証が必要。",
    hasDetailPage: false,
  },
  {
    iso3: "SGP",
    nameJa: "シンガポール",
    nameEn: "Singapore",
    gdp_usd_billion_2024: 501,
    population_million: 6,
    gdp_growth_pct: 2.7,
    voltage: "230V / 50Hz",
    descriptionJa:
      "市場規模は小さいが、高い品質・安全規制が先行事例を作る重要市場。BS/IEC準拠が基本。",
    hasDetailPage: false,
  },
  {
    iso3: "KHM",
    nameJa: "カンボジア",
    nameEn: "Cambodia",
    gdp_usd_billion_2024: 31,
    population_million: 17,
    gdp_growth_pct: 5.8,
    voltage: "230V / 50Hz",
    descriptionJa:
      "縫製・軽工業輸出国として急成長。認証制度が整備途上で参入障壁は比較的低い。",
    hasDetailPage: false,
  },
  {
    iso3: "MMR",
    nameJa: "ミャンマー",
    nameEn: "Myanmar",
    gdp_usd_billion_2024: 65,
    population_million: 55,
    gdp_growth_pct: 1.0,
    voltage: "230V / 50Hz",
    descriptionJa:
      "政治情勢の影響下にあるが、豊富な天然資源と安価な労働力が潜在的魅力。EID登録制を採用。",
    hasDetailPage: false,
  },
  {
    iso3: "LAO",
    nameJa: "ラオス",
    nameEn: "Laos",
    gdp_usd_billion_2024: 14,
    population_million: 8,
    gdp_growth_pct: 4.0,
    voltage: "230V / 50Hz",
    descriptionJa:
      "メコン流域の水力発電開発と隣国向け電力輸出が成長を牽引。内陸国のため物流コストに注意。",
    hasDetailPage: false,
  },
  {
    iso3: "BRN",
    nameJa: "ブルネイ",
    nameEn: "Brunei",
    gdp_usd_billion_2024: 15,
    population_million: 0.5,
    gdp_growth_pct: 2.5,
    voltage: "240V / 50Hz",
    descriptionJa:
      "石油・天然ガス依存の小規模高所得国。BS 5839ベースの英国系規格を採用。",
    hasDetailPage: false,
  },
];
