import { type CSSProperties, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

const MalaysiaPage = lazy(() => import("./MalaysiaPage"));
import { ASEANKPICards } from "./components/ASEANKPICards";
import { CountryNavCards } from "./components/CountryNavCards";
import { ASEANGdpChart } from "./components/ASEANGdpChart";
import { ASEANEntryMatrix } from "./components/ASEANEntryMatrix";
import { ASEANDemandMatrix } from "./components/ASEANDemandMatrix";
import { ASEANProductDefs } from "./components/ASEANProductDefs";
import { ASEAN_KPI, ASEAN_COUNTRY_CARDS } from "./data/aseanOverviewData";
import { GDP_TREND_DATA, GDP_COUNTRY_META } from "./data/aseanGdpTrendData";
import {
  ENTRY_PRIORITY_DATA,
  DEMAND_DRIVER_DATA,
  PRODUCT_DEF_ROWS,
} from "./data/aseanMatrixData";

type Coordinate = [number, number];
type Ring = Coordinate[];
type Polygon = Ring[];

type Geometry = {
  type: string;
  coordinates?: unknown;
};

type Feature = {
  properties?: {
    iso3?: string;
    name?: string;
  };
  geometry?: Geometry;
};

type FeatureCollection = {
  type?: string;
  features?: Feature[];
};

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MapPath = {
  key: string;
  d: string;
  iso3: string;
  countryName: string | null;
  isAsean: boolean;
  bounds: Bounds;
};

type LabelPhase = "entering" | "visible" | "exiting";

type ActiveLabel = {
  countryName: string;
  phase: LabelPhase;
};

type EditorialLabelSpec = {
  headline: string;
  official: string;
  tracking: string;
  ruleWidth: number;
  ruleOffset: number;
  nudgeX: number;
  nudgeY: number;
};


const MAP_WIDTH = 960;
const MAP_HEIGHT = 700;
const MAP_PADDING = 24;
const ASEAN_FOCUS_PADDING = 0.84;
const COUNTRY_PADDING_FACTOR = 1.22;
const INDONESIA_PADDING_FACTOR = 0.9;
const INDONESIA_MIN_SCALE = 1.58;
const MIN_COUNTRY_SCALE = 1.0;
const MAX_COUNTRY_SCALE = 10;
const ZOOM_ANIMATION_MS = 360;
const RESET_ANIMATION_MS = 500;
const LABEL_EXIT_TOTAL_MS = 860;
const FULL_VIEWBOX: ViewBox = { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };

const ISO3_TO_JA = new Map<string, string>([
  ["BRN", "ブルネイ"],
  ["MMR", "ミャンマー"],
  ["KHM", "カンボジア"],
  ["IDN", "インドネシア"],
  ["LAO", "ラオス"],
  ["MYS", "マレーシア"],
  ["PHL", "フィリピン"],
  ["SGP", "シンガポール"],
  ["THA", "タイ"],
  ["VNM", "ベトナム"],
]);



const EDITORIAL_LABELS = new Map<string, EditorialLabelSpec>([
  [
    "ブルネイ",
    {
      headline: "BRUNEI",
      official: "Brunei Darussalam",
      tracking: "0.42em",
      ruleWidth: 58,
      ruleOffset: -7,
      nudgeX: -0.012,
      nudgeY: -0.015,
    },
  ],
  [
    "ミャンマー",
    {
      headline: "MYANMAR",
      official: "Republic of the Union of Myanmar",
      tracking: "0.39em",
      ruleWidth: 63,
      ruleOffset: -9,
      nudgeX: -0.018,
      nudgeY: -0.01,
    },
  ],
  [
    "カンボジア",
    {
      headline: "CAMBODIA",
      official: "Kingdom of Cambodia",
      tracking: "0.41em",
      ruleWidth: 59,
      ruleOffset: -6,
      nudgeX: -0.006,
      nudgeY: -0.012,
    },
  ],
  [
    "インドネシア",
    {
      headline: "INDONESIA",
      official: "Republic of Indonesia",
      tracking: "0.36em",
      ruleWidth: 62,
      ruleOffset: -10,
      nudgeX: 0.013,
      nudgeY: -0.009,
    },
  ],
  [
    "ラオス",
    {
      headline: "LAOS",
      official: "Lao People's Democratic Republic",
      tracking: "0.45em",
      ruleWidth: 56,
      ruleOffset: -5,
      nudgeX: -0.015,
      nudgeY: -0.014,
    },
  ],
  [
    "マレーシア",
    {
      headline: "MALAYSIA",
      official: "Malaysia",
      tracking: "0.4em",
      ruleWidth: 60,
      ruleOffset: -8,
      nudgeX: -0.01,
      nudgeY: -0.008,
    },
  ],
  [
    "フィリピン",
    {
      headline: "PHILIPPINES",
      official: "Republic of the Philippines",
      tracking: "0.34em",
      ruleWidth: 64,
      ruleOffset: -11,
      nudgeX: 0.01,
      nudgeY: -0.016,
    },
  ],
  [
    "シンガポール",
    {
      headline: "SINGAPORE",
      official: "Republic of Singapore",
      tracking: "0.38em",
      ruleWidth: 57,
      ruleOffset: -7,
      nudgeX: -0.008,
      nudgeY: -0.004,
    },
  ],
  [
    "タイ",
    {
      headline: "THAILAND",
      official: "Kingdom of Thailand",
      tracking: "0.43em",
      ruleWidth: 61,
      ruleOffset: -9,
      nudgeX: -0.014,
      nudgeY: -0.012,
    },
  ],
  [
    "ベトナム",
    {
      headline: "VIET NAM",
      official: "Socialist Republic of Viet Nam",
      tracking: "0.44em",
      ruleWidth: 60,
      ruleOffset: -8,
      nudgeX: 0.012,
      nudgeY: -0.02,
    },
  ],
]);

function clampLat(latDeg: number): number {
  return Math.max(-85, Math.min(85, latDeg));
}

function mercatorProject(coord: Coordinate): Coordinate {
  const lonRad = (coord[0] * Math.PI) / 180;
  const latRad = (clampLat(coord[1]) * Math.PI) / 180;
  return [lonRad, Math.log(Math.tan(Math.PI / 4 + latRad / 2))];
}

function isCoordinate(value: unknown): value is Coordinate {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

function geometryToPolygons(geometry?: Geometry): Polygon[] {
  if (!geometry || !geometry.coordinates) {
    return [];
  }

  if (geometry.type === "Polygon") {
    const polygon = geometry.coordinates;
    if (!Array.isArray(polygon)) {
      return [];
    }
    return [polygon as Polygon];
  }

  if (geometry.type === "MultiPolygon") {
    const multiPolygon = geometry.coordinates;
    if (!Array.isArray(multiPolygon)) {
      return [];
    }
    return multiPolygon as Polygon[];
  }

  return [];
}

function collectProjectedBounds(features: Feature[]): Bounds {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const feature of features) {
    const polygons = geometryToPolygons(feature.geometry);
    for (const polygon of polygons) {
      for (const ring of polygon) {
        if (!Array.isArray(ring)) {
          continue;
        }
        for (const point of ring) {
          if (!isCoordinate(point)) {
            continue;
          }
          const [x, y] = mercatorProject(point);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    const [left, top] = mercatorProject([-180, 85]);
    const [right, bottom] = mercatorProject([180, -85]);
    return {
      minX: left,
      minY: bottom,
      maxX: right,
      maxY: top,
    };
  }

  return { minX, minY, maxX, maxY };
}

function expandBounds(bounds: Bounds, factor: number): Bounds {
  const dx = bounds.maxX - bounds.minX || 1;
  const dy = bounds.maxY - bounds.minY || 1;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const halfW = (dx * factor) / 2;
  const halfH = (dy * factor) / 2;

  return {
    minX: cx - halfW,
    minY: cy - halfH,
    maxX: cx + halfW,
    maxY: cy + halfH,
  };
}

function createProjector(features: Feature[], focusFeatures: Feature[], focusPadding = 1): (coord: Coordinate) => Coordinate {
  const baseBounds = collectProjectedBounds(focusFeatures);
  const bounds = focusPadding !== 1 ? expandBounds(baseBounds, focusPadding) : baseBounds;

  const dx = bounds.maxX - bounds.minX || 1;
  const dy = bounds.maxY - bounds.minY || 1;
  const innerWidth = MAP_WIDTH - MAP_PADDING * 2;
  const innerHeight = MAP_HEIGHT - MAP_PADDING * 2;
  const scale = Math.min(innerWidth / dx, innerHeight / dy);
  const usedWidth = dx * scale;
  const usedHeight = dy * scale;
  const offsetX = (MAP_WIDTH - usedWidth) / 2;
  const offsetY = (MAP_HEIGHT - usedHeight) / 2;

  if (!features.length) {
    return (coord: Coordinate) => coord;
  }

  return (coord: Coordinate) => {
    const [x, y] = mercatorProject(coord);
    const sx = (x - bounds.minX) * scale + offsetX;
    const sy = (bounds.maxY - y) * scale + offsetY;
    return [sx, sy];
  };
}

function fmt(num: number): number {
  return Number(num.toFixed(2));
}

function polygonToPathData(polygon: Polygon, project: (coord: Coordinate) => Coordinate): { d: string; bounds: Bounds } | null {
  let d = "";
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const ring of polygon) {
    if (!Array.isArray(ring) || ring.length < 2) {
      continue;
    }

    let hasPoint = false;
    for (let i = 0; i < ring.length; i += 1) {
      const point = ring[i];
      if (!isCoordinate(point)) {
        continue;
      }
      const [x, y] = project(point);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      d += `${i === 0 ? "M" : "L"}${fmt(x)} ${fmt(y)} `;
      hasPoint = true;
    }

    if (hasPoint) {
      d += "Z ";
    }
  }

  if (!d || !Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }

  return {
    d: d.trim(),
    bounds: { minX, minY, maxX, maxY },
  };
}

function mergeBounds(base: Bounds, next: Bounds): Bounds {
  return {
    minX: Math.min(base.minX, next.minX),
    minY: Math.min(base.minY, next.minY),
    maxX: Math.max(base.maxX, next.maxX),
    maxY: Math.max(base.maxY, next.maxY),
  };
}

function buildMapPaths(features: Feature[]): { paths: MapPath[]; countryBounds: Map<string, Bounds> } {
  // ASEAN周辺から大きく外れる国を除外
  const MAX_CONTEXT_LAT = 30;
  const MIN_CONTEXT_LON = 60;
  const MAX_CONTEXT_LON = 155;
  const filteredFeatures = features.filter((feature) => {
    const iso3 = feature.properties?.iso3;
    // ASEAN諸国は常に残す
    if (iso3 && ISO3_TO_JA.has(iso3)) return true;
    const polygons = geometryToPolygons(feature.geometry);
    let maxLat = -90;
    let minLon = 360;
    let maxLon = -360;
    for (const polygon of polygons) {
      for (const ring of polygon) {
        if (!Array.isArray(ring)) continue;
        for (const point of ring) {
          if (!isCoordinate(point)) continue;
          if (point[1] > maxLat) maxLat = point[1];
          if (point[0] < minLon) minLon = point[0];
          if (point[0] > maxLon) maxLon = point[0];
        }
      }
    }
    // 緯度フィルタ: 最北端が閾値を超える国は除外
    if (maxLat >= MAX_CONTEXT_LAT) return false;
    // 経度フィルタ: ASEAN周辺から大きく外れる国は除外
    if (minLon < MIN_CONTEXT_LON || maxLon > MAX_CONTEXT_LON) return false;
    return true;
  });

  const aseanFeatures = filteredFeatures.filter((feature) => {
    const iso3 = feature.properties?.iso3;
    return Boolean(iso3 && ISO3_TO_JA.has(iso3));
  });

  // フィルタ済みの国を表示（コンテキスト国も含める）
  const focusFeatures = aseanFeatures.length ? aseanFeatures : filteredFeatures;
  const project = createProjector(filteredFeatures, focusFeatures, ASEAN_FOCUS_PADDING);
  const paths: MapPath[] = [];
  const countryBounds = new Map<string, Bounds>();

  // フィルタ済みの国をパスに追加
  filteredFeatures.forEach((feature, featureIndex) => {
    const iso3 = feature.properties?.iso3 ?? `F-${featureIndex}`;
    const countryName = ISO3_TO_JA.get(iso3) ?? null;
    const isAsean = Boolean(countryName);
    const polygons = geometryToPolygons(feature.geometry);

    polygons.forEach((polygon, polygonIndex) => {
      const pathData = polygonToPathData(polygon, project);
      if (!pathData) {
        return;
      }

      const path: MapPath = {
        key: `${iso3}-${featureIndex}-${polygonIndex}`,
        d: pathData.d,
        iso3,
        countryName,
        isAsean,
        bounds: pathData.bounds,
      };

      paths.push(path);

      if (!countryName) {
        return;
      }

      const currentBounds = countryBounds.get(countryName);
      countryBounds.set(countryName, currentBounds ? mergeBounds(currentBounds, pathData.bounds) : pathData.bounds);
    });
  });

  return { paths, countryBounds };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function viewBoxForCountry(countryName: string, bounds: Bounds): ViewBox {
  const width = Math.max(bounds.maxX - bounds.minX, MAP_WIDTH * 0.05);
  const height = Math.max(bounds.maxY - bounds.minY, MAP_HEIGHT * 0.05);
  const paddingFactor = countryName === "インドネシア" ? INDONESIA_PADDING_FACTOR : COUNTRY_PADDING_FACTOR;
  const fitWidthRatio = countryName === "インドネシア" ? 1.0 : 0.9;
  const fitHeightRatio = countryName === "インドネシア" ? 0.92 : 0.9;

  const fitScale = Math.min(
    (MAP_WIDTH * fitWidthRatio) / (width * paddingFactor),
    (MAP_HEIGHT * fitHeightRatio) / (height * paddingFactor)
  );

  const minScale = countryName === "インドネシア" ? INDONESIA_MIN_SCALE : MIN_COUNTRY_SCALE;
  const scale = clamp(Math.max(minScale, fitScale), MIN_COUNTRY_SCALE, MAX_COUNTRY_SCALE);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const zoomWidth = MAP_WIDTH / scale;
  const zoomHeight = MAP_HEIGHT / scale;

  return {
    x: clamp(centerX - zoomWidth / 2, 0, MAP_WIDTH - zoomWidth),
    y: clamp(centerY - zoomHeight / 2, 0, MAP_HEIGHT - zoomHeight),
    width: zoomWidth,
    height: zoomHeight,
  };
}

function boxesAlmostEqual(a: ViewBox, b: ViewBox): boolean {
  const eps = 0.01;
  return (
    Math.abs(a.x - b.x) < eps &&
    Math.abs(a.y - b.y) < eps &&
    Math.abs(a.width - b.width) < eps &&
    Math.abs(a.height - b.height) < eps
  );
}

async function loadMapFeatures(): Promise<Feature[]> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const candidates = [`${base}/data/asean_context_10m.geojson`, `${base}/data/asean_10m.geojson`];

  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        continue;
      }
      const payload = (await res.json()) as FeatureCollection;
      if (Array.isArray(payload.features) && payload.features.length > 0) {
        return payload.features;
      }
    } catch {
      // Try next source.
    }
  }

  throw new Error("地図データを読み込めませんでした");
}

export default function App(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCountryPage = pathname !== "/";
  const [geoFeatures, setGeoFeatures] = useState<Feature[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<ActiveLabel | null>(null);
  const [mapError, setMapError] = useState<string>("");
  const [viewBox, setViewBox] = useState<ViewBox>(FULL_VIEWBOX);

  const viewBoxRef = useRef<ViewBox>(FULL_VIEWBOX);
  const viewBoxAnimationRef = useRef<number | null>(null);
  const viewBoxAnimationResolveRef = useRef<(() => void) | null>(null);
  const activeLabelRef = useRef<ActiveLabel | null>(null);
  const labelExitTimerRef = useRef<number | null>(null);
  const transitionRunRef = useRef<number>(0);

  useEffect(() => {
    viewBoxRef.current = viewBox;
  }, [viewBox]);

  useEffect(() => {
    activeLabelRef.current = activeLabel;
  }, [activeLabel]);

  // ポータルページ（/）に戻った時に地図の選択状態をリセットする
  useEffect(() => {
    if (pathname === "/") {
      setSelectedCountry("all");
      setHoveredCountry(null);
      setActiveLabel(null);
      setViewBox(FULL_VIEWBOX);
      viewBoxRef.current = FULL_VIEWBOX;
    }
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const loadedFeatures = await loadMapFeatures();
        if (active) {
          setGeoFeatures(loadedFeatures);
          setMapError("");
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "地図データの読み込みに失敗しました";
          setMapError(message);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (viewBoxAnimationRef.current !== null) {
        cancelAnimationFrame(viewBoxAnimationRef.current);
        viewBoxAnimationRef.current = null;
      }
      if (viewBoxAnimationResolveRef.current) {
        viewBoxAnimationResolveRef.current();
        viewBoxAnimationResolveRef.current = null;
      }
      if (labelExitTimerRef.current !== null) {
        window.clearTimeout(labelExitTimerRef.current);
        labelExitTimerRef.current = null;
      }
    };
  }, []);

  const { paths, countryBounds } = useMemo(() => buildMapPaths(geoFeatures), [geoFeatures]);

  useEffect(() => {
    if (selectedCountry !== "all" && !countryBounds.has(selectedCountry)) {
      setSelectedCountry("all");
    }
  }, [countryBounds, selectedCountry]);

  const animateViewBox = useCallback((target: ViewBox, durationMs = ZOOM_ANIMATION_MS): Promise<void> => {
    return new Promise((resolve) => {
      if (boxesAlmostEqual(viewBoxRef.current, target)) {
        viewBoxRef.current = target;
        setViewBox(target);
        resolve();
        return;
      }

      if (viewBoxAnimationRef.current !== null) {
        cancelAnimationFrame(viewBoxAnimationRef.current);
        viewBoxAnimationRef.current = null;
      }
      if (viewBoxAnimationResolveRef.current) {
        viewBoxAnimationResolveRef.current();
        viewBoxAnimationResolveRef.current = null;
      }

      viewBoxAnimationResolveRef.current = resolve;

      const startAt = performance.now();
      const from = { ...viewBoxRef.current };
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const t = Math.min(1, (now - startAt) / durationMs);
        const e = easeOutCubic(t);

        const next: ViewBox = {
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
          width: from.width + (target.width - from.width) * e,
          height: from.height + (target.height - from.height) * e,
        };

        viewBoxRef.current = next;
        setViewBox(next);

        if (t < 1) {
          viewBoxAnimationRef.current = requestAnimationFrame(step);
          return;
        }

        viewBoxRef.current = target;
        setViewBox(target);
        viewBoxAnimationRef.current = null;

        if (viewBoxAnimationResolveRef.current) {
          const done = viewBoxAnimationResolveRef.current;
          viewBoxAnimationResolveRef.current = null;
          done();
        } else {
          resolve();
        }
      };

      viewBoxAnimationRef.current = requestAnimationFrame(step);
    });
  }, []);

  const hideEditorialLabel = useCallback((runId: number): Promise<void> => {
    return new Promise((resolve) => {
      const currentLabel = activeLabelRef.current;
      if (!currentLabel) {
        resolve();
        return;
      }

      setActiveLabel({ countryName: currentLabel.countryName, phase: "exiting" });

      if (labelExitTimerRef.current !== null) {
        window.clearTimeout(labelExitTimerRef.current);
      }
      labelExitTimerRef.current = window.setTimeout(() => {
        if (runId !== transitionRunRef.current) {
          resolve();
          return;
        }
        setActiveLabel(null);
        labelExitTimerRef.current = null;
        resolve();
      }, LABEL_EXIT_TOTAL_MS);
    });
  }, []);

  const showEditorialLabel = useCallback((countryName: string, runId: number) => {
    setActiveLabel({ countryName, phase: "entering" });
    requestAnimationFrame(() => {
      if (runId !== transitionRunRef.current) {
        return;
      }
      setActiveLabel((prev) => (prev && prev.countryName === countryName ? { countryName, phase: "visible" } : prev));
    });
  }, []);

  useEffect(() => {
    const runId = transitionRunRef.current + 1;
    transitionRunRef.current = runId;

    const execute = async () => {
      if (labelExitTimerRef.current !== null) {
        window.clearTimeout(labelExitTimerRef.current);
        labelExitTimerRef.current = null;
      }

      if (selectedCountry === "all") {
        setActiveLabel(null);
        await animateViewBox(FULL_VIEWBOX, RESET_ANIMATION_MS);
        return;
      }

      await hideEditorialLabel(runId);
      if (runId !== transitionRunRef.current) {
        return;
      }

      const bounds = countryBounds.get(selectedCountry);
      if (!bounds) {
        await animateViewBox(FULL_VIEWBOX);
        return;
      }

      await animateViewBox(viewBoxForCountry(selectedCountry, bounds));
      if (runId !== transitionRunRef.current) {
        return;
      }

      showEditorialLabel(selectedCountry, runId);
    };

    void execute();
  }, [animateViewBox, countryBounds, hideEditorialLabel, selectedCountry, showEditorialLabel]);

  const { contextPaths, aseanPaths } = useMemo(() => {
    const context = paths.filter((path) => !path.isAsean);
    const asean = paths.filter((path) => path.isAsean);

    const rank = (path: MapPath): number => {
      if (path.countryName && selectedCountry !== "all" && path.countryName === selectedCountry) {
        return 2;
      }
      if (path.countryName && hoveredCountry === path.countryName) {
        return 1;
      }
      return 0;
    };

    asean.sort((a, b) => rank(a) - rank(b));

    return {
      contextPaths: context,
      aseanPaths: asean,
    };
  }, [hoveredCountry, paths, selectedCountry]);

  const onSelectCountry = useCallback((countryName: string) => {
    setHoveredCountry(null);
    setSelectedCountry((prev) => (prev === countryName ? "all" : countryName));
  }, []);

  const editorialLabel = useMemo(() => {
    if (!activeLabel) {
      return null;
    }

    const spec = EDITORIAL_LABELS.get(activeLabel.countryName);
    const bounds = countryBounds.get(activeLabel.countryName);
    if (!spec || !bounds) {
      return null;
    }

    const countryWidth = Math.max(1, bounds.maxX - bounds.minX);
    const countryHeight = Math.max(1, bounds.maxY - bounds.minY);
    const isTall = countryHeight > countryWidth * 1.12;
    const isWide = countryWidth > countryHeight * 1.15;

    let anchorX = (bounds.minX + bounds.maxX) / 2;
    let anchorY = (bounds.minY + bounds.maxY) / 2 - (isTall ? countryHeight * 0.2 : countryHeight * 0.16);

    if (isWide) {
      anchorX -= countryWidth * 0.03;
    }

    anchorX += viewBox.width * spec.nudgeX;
    anchorY += viewBox.height * spec.nudgeY;

    const left = clamp(((anchorX - viewBox.x) / viewBox.width) * 100, 14, 86);
    const top = clamp(((anchorY - viewBox.y) / viewBox.height) * 100, 10, 76);

    const style = {
      left: `${left}%`,
      top: `${top}%`,
      "--label-tracking": spec.tracking,
      "--rule-offset": `${spec.ruleOffset}px`,
    } as CSSProperties & Record<string, string>;

    return {
      ...spec,
      phase: activeLabel.phase,
      style,
    };
  }, [activeLabel, countryBounds, viewBox]);

  useEffect(() => {
    // ページ遷移後に一度レンダリングを待ってから監視を開始する
    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      const targets = document.querySelectorAll<HTMLElement>(".fade-in");
      if (targets.length === 0) {
        return;
      }

      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        targets.forEach((target) => target.classList.add("visible"));
        return;
      }

      if (!("IntersectionObserver" in window)) {
        targets.forEach((target) => target.classList.add("visible"));
        return;
      }

      // ページ遷移時に visible をリセットして再アニメーション
      targets.forEach((target) => target.classList.remove("visible"));

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      targets.forEach((target) => observer!.observe(target));
    }, 50);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  const renderMapBody = () => {
    if (mapError) {
      return (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="map-error-text">
          {mapError}
        </text>
      );
    }

    if (paths.length === 0) {
      return (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="map-error-text">
          地図を読み込み中...
        </text>
      );
    }

    return (
      <g className="map-group">
        <g className="context-layer">
          {contextPaths.map((path) => (
            <path key={path.key} d={path.d} className="context-shape" aria-hidden="true" />
          ))}
        </g>
        <g className="asean-layer">
          {aseanPaths.map((path) => {
            const countryName = path.countryName;
            if (!countryName) {
              return null;
            }

            const active = selectedCountry !== "all" && selectedCountry === countryName;
            const hover = !active && hoveredCountry === countryName;
            const className = `country-shape${hover ? " hover" : ""}${active ? " active" : ""}`;

            return (
              <path
                key={path.key}
                d={path.d}
                data-iso3={path.iso3}
                data-country={countryName}
                className={className}
                tabIndex={0}
                aria-label={countryName}
                onMouseEnter={() => setHoveredCountry(countryName)}
                onFocus={() => setHoveredCountry(countryName)}
                onBlur={() => setHoveredCountry((prev) => (prev === countryName ? null : prev))}
                onClick={(event) => {
                  event.preventDefault();
                  onSelectCountry(countryName);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") {
                    return;
                  }
                  event.preventDefault();
                  onSelectCountry(countryName);
                }}
              />
            );
          })}
        </g>
      </g>
    );
  };

  return (
    <>
      <nav className="global-nav" aria-label="Global navigation">
        <div className="nav-inner">
          <a className="nav-logo" href="#top" aria-label="Top">
            ASEAN
          </a>
          <div className="nav-links">
            <a href="#top">ホーム</a>
            <a href="#map-section">マップ</a>
          </div>
          <div className="nav-actions" aria-hidden="true">
            <span>EN</span>
          </div>
        </div>
      </nav>

      {!isCountryPage && (
        <header id="top" className="hero hero--light">
          <p className="hero-kicker">ASEAN LOW VOLTAGE BUSINESS PORTAL</p>
          <h1>ASEAN低圧配電事業ポータル</h1>
          <p className="hero-sub">ASEAN 10カ国の低圧遮断器市場 — マクロ経済から認証制度まで</p>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="map-section" className="hero hero--gray">
          <div className="map-stage" aria-label="ASEAN map navigation">
            <svg
              id="asean-map-svg"
              viewBox={`${fmt(viewBox.x)} ${fmt(viewBox.y)} ${fmt(viewBox.width)} ${fmt(viewBox.height)}`}
              role="img"
              aria-label="ASEAN countries map"
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {renderMapBody()}
            </svg>
            {editorialLabel ? (
              <div
                className={`editorial-label phase-${editorialLabel.phase}`}
                style={{
                  ...editorialLabel.style,
                  cursor: activeLabel?.countryName === "マレーシア" ? "pointer" : "default"
                }}
                aria-hidden="true"
                onClick={() => {
                  if (activeLabel?.countryName === "マレーシア") {
                    navigate("/malaysia");
                  }
                }}
              >
                <div className="label-title-wrap">
                  <p className="label-headline">{editorialLabel.headline}</p>
                  <span className="label-rule" />
                </div>
                <p className="label-official">{editorialLabel.official}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="content-block content-block--major">
          <p className="section-kicker">ASEAN OVERVIEW</p>
          <ASEANKPICards data={ASEAN_KPI} />
        </section>

        <hr className="section-divider" />

        {/* Section 4: GDP比較チャート */}
        <section className="content-block content-block--major">
          <p className="section-kicker">ASEAN GDP TRENDS</p>
          <h2>ASEAN主要6カ国 GDP推移（2015–2030）</h2>
          <p className="section-sub">実績（〜2023）＋ IMF WEO 予測（2024〜）</p>
          <ASEANGdpChart data={GDP_TREND_DATA} meta={GDP_COUNTRY_META} />
        </section>

        <hr className="section-divider" />

        {/* Section 5: 参入優先度マトリクス */}
        <section className="content-block content-block--major">
          <p className="section-kicker">MARKET ENTRY PRIORITY</p>
          <h2>参入優先度マトリクス</h2>
          <p className="section-sub">10カ国 × 5軸 スコアリング（各軸 1〜5点、合計点降順）</p>
          <ASEANEntryMatrix data={ENTRY_PRIORITY_DATA} />
        </section>

        <hr className="section-divider" />

        {/* Section 6: 需要ドライバー比較 */}
        <section className="content-block content-block--major">
          <p className="section-kicker">DEMAND DRIVERS</p>
          <h2>需要ドライバー比較</h2>
          <p className="section-sub">主要セクター別 国別需要強度（1=軽微 → 5=主要需要）</p>
          <ASEANDemandMatrix data={DEMAND_DRIVER_DATA} />
        </section>

        <hr className="section-divider" />

        {/* Section 7: 製品カテゴリ定義 */}
        <section className="content-block content-block--major">
          <p className="section-kicker">PRODUCT CATEGORIES</p>
          <h2>製品カテゴリ定義</h2>
          <ASEANProductDefs rows={PRODUCT_DEF_ROWS} />
        </section>

        <hr className="section-divider" />

        {/* Section 8: カントリーナビカード */}
        <section className="content-block content-block--major">
          <p className="section-kicker">ASEAN COUNTRIES</p>
          <h2>10カ国の市場概要</h2>
          <CountryNavCards countries={ASEAN_COUNTRY_CARDS} />
        </section>

        <section className="content-block">
          <p className="section-kicker">NOTES</p>
          <ul style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 1.7, paddingLeft: 20, margin: "12px 0 0" }}>
            <li>IECスキーム（CBスキーム証明書）は各国認証取得の際に有利に活用できます。</li>
            <li>フィリピンはASEAN唯一の60Hz電源国のため、他国（50Hz）と異なる製品仕様が必要です。</li>
            <li>各国の認証制度・規制は随時改定されます。最新情報は各国規制当局の公式情報をご確認ください。</li>
          </ul>
        </section>
            </>
          } />
          <Route path="/malaysia" element={<Suspense fallback={null}><MalaysiaPage /></Suspense>} />
        </Routes>
      </main>

      <footer className="footer fade-in">
        <div className="footer-inner">
          <p className="footer-note">注意: 法令・制度は更新されるため、最終判断前に必ず一次情報を確認してください。</p>
          <p className="footer-note">最終更新：2026年2月23日</p>
          <div className="footer-line" />
          <small>ASEAN Low Voltage Business Portal</small>
        </div>
      </footer>
    </>
  );
}
