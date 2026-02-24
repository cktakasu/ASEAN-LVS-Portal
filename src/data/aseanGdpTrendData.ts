/**
 * ASEAN主要6カ国 GDP推移データ（USD 10億）
 * 実績: 2015–2023（IMF WEO 2024）
 * 予測: 2024–2030（IMF WEO 2024 ベース）
 */

export interface GdpDataPoint {
  year: number;
  isForecast: boolean;
  IDN: number; // インドネシア
  MYS: number; // マレーシア
  THA: number; // タイ
  VNM: number; // ベトナム
  PHL: number; // フィリピン
  SGP: number; // シンガポール
}

export const GDP_TREND_DATA: GdpDataPoint[] = [
  { year: 2015, isForecast: false, IDN:  861, MYS: 296, THA: 401, VNM: 193, PHL: 309, SGP: 296 },
  { year: 2016, isForecast: false, IDN:  932, MYS: 296, THA: 413, VNM: 205, PHL: 304, SGP: 296 },
  { year: 2017, isForecast: false, IDN: 1015, MYS: 314, THA: 455, VNM: 224, PHL: 328, SGP: 323 },
  { year: 2018, isForecast: false, IDN: 1042, MYS: 358, THA: 505, VNM: 245, PHL: 347, SGP: 364 },
  { year: 2019, isForecast: false, IDN: 1119, MYS: 364, THA: 543, VNM: 262, PHL: 376, SGP: 372 },
  { year: 2020, isForecast: false, IDN: 1058, MYS: 336, THA: 500, VNM: 271, PHL: 361, SGP: 344 },
  { year: 2021, isForecast: false, IDN: 1186, MYS: 373, THA: 506, VNM: 366, PHL: 394, SGP: 397 },
  { year: 2022, isForecast: false, IDN: 1319, MYS: 407, THA: 496, VNM: 409, PHL: 404, SGP: 466 },
  { year: 2023, isForecast: false, IDN: 1371, MYS: 399, THA: 512, VNM: 430, PHL: 437, SGP: 497 },
  { year: 2024, isForecast: true,  IDN: 1434, MYS: 430, THA: 514, VNM: 429, PHL: 437, SGP: 501 },
  { year: 2025, isForecast: true,  IDN: 1508, MYS: 449, THA: 525, VNM: 457, PHL: 462, SGP: 516 },
  { year: 2026, isForecast: true,  IDN: 1584, MYS: 469, THA: 536, VNM: 487, PHL: 489, SGP: 531 },
  { year: 2027, isForecast: true,  IDN: 1664, MYS: 490, THA: 547, VNM: 519, PHL: 518, SGP: 547 },
  { year: 2028, isForecast: true,  IDN: 1748, MYS: 511, THA: 558, VNM: 553, PHL: 548, SGP: 563 },
  { year: 2029, isForecast: true,  IDN: 1836, MYS: 534, THA: 570, VNM: 589, PHL: 580, SGP: 580 },
  { year: 2030, isForecast: true,  IDN: 1929, MYS: 557, THA: 582, VNM: 628, PHL: 614, SGP: 597 },
];

export interface GdpCountryMeta {
  key: keyof Omit<GdpDataPoint, "year" | "isForecast">;
  nameJa: string;
  color: string;
}

export const GDP_COUNTRY_META: GdpCountryMeta[] = [
  { key: "IDN", nameJa: "インドネシア", color: "#FF6600" },
  { key: "MYS", nameJa: "マレーシア",   color: "#FF8C00" },
  { key: "THA", nameJa: "タイ",         color: "#FFB84D" },
  { key: "VNM", nameJa: "ベトナム",     color: "#4CAF50" },
  { key: "PHL", nameJa: "フィリピン",   color: "#2196F3" },
  { key: "SGP", nameJa: "シンガポール", color: "#9C27B0" },
];
