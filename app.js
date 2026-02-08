const filterSelect = document.getElementById("country-filter");
const keywordInput = document.getElementById("keyword");
const tableBody = document.getElementById("table-body");
const mapSvg = document.getElementById("asean-map-svg");

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_WIDTH = 960;
const MAP_HEIGHT = 620;
const MAP_PADDING = 24;
const COUNTRY_PADDING_FACTOR = 1.05;
const MIN_COUNTRY_SCALE = 2.0;
const MAX_COUNTRY_SCALE = 10;

let countries = [];
const countryShapes = new Map();
const countryBounds = new Map();
let mapGroup = null;
let currentViewBox = { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };
let viewBoxAnimationFrame = null;

const ISO3_TO_JA = new Map([
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

function rowTemplate(item) {
  return `
    <tr>
      <td>${item.country}</td>
      <td>${item.standards}</td>
      <td>${item.lowVoltageScope}</td>
      <td>${item.grid}</td>
      <td>${item.certification}</td>
      <td>${item.memo}</td>
      <td>${item.updatedAt}</td>
    </tr>
  `;
}

function render() {
  const selected = filterSelect.value;
  const keyword = keywordInput.value.trim().toLowerCase();

  const filtered = countries.filter((item) => {
    const matchCountry = selected === "all" || item.country === selected;
    const text = Object.values(item).join(" ").toLowerCase();
    const matchKeyword = !keyword || text.includes(keyword);
    return matchCountry && matchKeyword;
  });

  tableBody.innerHTML = filtered.map(rowTemplate).join("");
  updateMapActiveState(selected);
  updateMapZoom(selected);
}

function initCountryFilter(data) {
  const options = data
    .map((item) => item.country)
    .sort((a, b) => a.localeCompare(b, "ja"));

  for (const name of options) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    filterSelect.appendChild(opt);
  }
}

function clampLat(latDeg) {
  return Math.max(-85, Math.min(85, latDeg));
}

function mercatorProject(coord) {
  const lonRad = (coord[0] * Math.PI) / 180;
  const latRad = (clampLat(coord[1]) * Math.PI) / 180;
  return [lonRad, Math.log(Math.tan(Math.PI / 4 + latRad / 2))];
}

function geometryToPolygons(geometry) {
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return [];
  }
  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates;
  }
  return [];
}

function collectProjectedBounds(features) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const feature of features) {
    const polygons = geometryToPolygons(feature.geometry);
    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const coord of ring) {
          const [x, y] = mercatorProject(coord);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

function createProjector(features) {
  const bounds = collectProjectedBounds(features);
  const dx = bounds.maxX - bounds.minX || 1;
  const dy = bounds.maxY - bounds.minY || 1;
  const innerWidth = MAP_WIDTH - MAP_PADDING * 2;
  const innerHeight = MAP_HEIGHT - MAP_PADDING * 2;
  const scale = Math.min(
    innerWidth / dx,
    innerHeight / dy
  );
  const usedWidth = dx * scale;
  const usedHeight = dy * scale;
  const offsetX = (MAP_WIDTH - usedWidth) / 2;
  const offsetY = (MAP_HEIGHT - usedHeight) / 2;

  return (coord) => {
    const [x, y] = mercatorProject(coord);
    const sx = (x - bounds.minX) * scale + offsetX;
    const sy = (bounds.maxY - y) * scale + offsetY;
    return [sx, sy];
  };
}

function fmt(num) {
  return Number(num.toFixed(2));
}

function polygonToPathD(polygon, project) {
  let d = "";
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const ring of polygon) {
    if (!Array.isArray(ring) || ring.length < 2) {
      continue;
    }
    for (let i = 0; i < ring.length; i += 1) {
      const [x, y] = project(ring[i]);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      d += `${i === 0 ? "M" : "L"}${fmt(x)} ${fmt(y)} `;
    }
    d += "Z ";
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }
  return {
    d: d.trim(),
    bounds: { minX, minY, maxX, maxY },
  };
}

function bringCountryToFront(countryName) {
  const shapes = countryShapes.get(countryName) || [];
  for (const shape of shapes) {
    shape.parentNode.appendChild(shape);
  }
}

function applyViewBox(box) {
  currentViewBox = { ...box };
  mapSvg.setAttribute(
    "viewBox",
    `${fmt(box.x)} ${fmt(box.y)} ${fmt(box.width)} ${fmt(box.height)}`
  );
}

function stopViewBoxAnimation() {
  if (viewBoxAnimationFrame !== null) {
    cancelAnimationFrame(viewBoxAnimationFrame);
    viewBoxAnimationFrame = null;
  }
}

function animateViewBox(targetBox, durationMs = 240) {
  stopViewBoxAnimation();

  const startBox = { ...currentViewBox };
  const startedAt = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - startedAt;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = easeOutCubic(progress);
    const next = {
      x: startBox.x + (targetBox.x - startBox.x) * eased,
      y: startBox.y + (targetBox.y - startBox.y) * eased,
      width: startBox.width + (targetBox.width - startBox.width) * eased,
      height: startBox.height + (targetBox.height - startBox.height) * eased,
    };
    applyViewBox(next);
    if (progress < 1) {
      viewBoxAnimationFrame = requestAnimationFrame(tick);
    } else {
      viewBoxAnimationFrame = null;
    }
  }

  if (typeof requestAnimationFrame !== "function") {
    applyViewBox(targetBox);
    return;
  }
  viewBoxAnimationFrame = requestAnimationFrame(tick);
}

function resetMapZoom(animated = true) {
  const full = { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };
  if (animated) {
    animateViewBox(full);
  } else {
    applyViewBox(full);
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateMapZoom(selectedCountry) {
  if (selectedCountry === "all" || !countryBounds.has(selectedCountry)) {
    resetMapZoom();
    return;
  }

  const bounds = countryBounds.get(selectedCountry);
  if (
    !bounds ||
    !Number.isFinite(bounds.minX) ||
    !Number.isFinite(bounds.minY) ||
    !Number.isFinite(bounds.maxX) ||
    !Number.isFinite(bounds.maxY)
  ) {
    resetMapZoom();
    return;
  }
  const width = Math.max(bounds.maxX - bounds.minX, MAP_WIDTH * 0.08);
  const height = Math.max(bounds.maxY - bounds.minY, MAP_HEIGHT * 0.08);
  const fitScale = Math.min(
    MAP_WIDTH / (width * COUNTRY_PADDING_FACTOR),
    MAP_HEIGHT / (height * COUNTRY_PADDING_FACTOR)
  );
  const scale = clamp(Math.max(MIN_COUNTRY_SCALE, fitScale), 1, MAX_COUNTRY_SCALE);

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const zoomWidth = MAP_WIDTH / scale;
  const zoomHeight = MAP_HEIGHT / scale;
  const x = clamp(centerX - zoomWidth / 2, 0, MAP_WIDTH - zoomWidth);
  const y = clamp(centerY - zoomHeight / 2, 0, MAP_HEIGHT - zoomHeight);

  animateViewBox({ x, y, width: zoomWidth, height: zoomHeight });
}

function clearAllHoverStates() {
  for (const shapes of countryShapes.values()) {
    for (const shape of shapes) {
      shape.classList.remove("hover");
    }
  }
}

function setCountryHoverState(countryName, hovering) {
  const shapes = countryShapes.get(countryName) || [];
  const active = filterSelect.value === countryName;
  if (active) {
    return;
  }
  for (const shape of shapes) {
    shape.classList.toggle("hover", hovering);
  }
}

function updateMapActiveState(selectedCountry) {
  clearAllHoverStates();
  for (const [countryName, shapes] of countryShapes.entries()) {
    const active = selectedCountry !== "all" && countryName === selectedCountry;
    for (const shape of shapes) {
      shape.classList.toggle("active", active);
    }
    if (active) {
      bringCountryToFront(countryName);
    }
  }
}

function attachShapeEvents(shape, countryName) {
  shape.addEventListener("mouseenter", () => {
    clearAllHoverStates();
    setCountryHoverState(countryName, true);
    bringCountryToFront(countryName);
  });

  shape.addEventListener("mouseleave", (event) => {
    const next = event.relatedTarget;
    if (
      next &&
      next.nodeType === 1 &&
      next.getAttribute &&
      next.getAttribute("data-country") === countryName
    ) {
      return;
    }
    setCountryHoverState(countryName, false);
  });

  shape.addEventListener("click", () => {
    selectCountry(countryName);
  });

  shape.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCountry(countryName);
    }
  });

  shape.addEventListener("focus", () => {
    setCountryHoverState(countryName, true);
    bringCountryToFront(countryName);
  });

  shape.addEventListener("blur", () => {
    setCountryHoverState(countryName, false);
  });
}

function selectCountry(countryName) {
  filterSelect.value = countryName;
  render();
  updateMapZoom(countryName);
}

function renderMap(features) {
  mapSvg.innerHTML = "";
  countryShapes.clear();
  countryBounds.clear();
  resetMapZoom(false);

  const project = createProjector(features);
  mapGroup = document.createElementNS(SVG_NS, "g");
  mapGroup.setAttribute("class", "map-group");
  mapSvg.appendChild(mapGroup);

  for (const feature of features) {
    const iso3 = feature.properties?.iso3;
    const countryName = ISO3_TO_JA.get(iso3);
    if (!countryName) {
      continue;
    }

    const polygons = geometryToPolygons(feature.geometry);
    for (const polygon of polygons) {
      const pathInfo = polygonToPathD(polygon, project);
      if (!pathInfo) {
        continue;
      }

      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", pathInfo.d);
      path.setAttribute("class", "country-shape");
      path.setAttribute("data-country", countryName);
      path.setAttribute("tabindex", "0");
      path.setAttribute("aria-label", countryName);

      attachShapeEvents(path, countryName);
      mapGroup.appendChild(path);

      if (!countryShapes.has(countryName)) {
        countryShapes.set(countryName, []);
      }
      countryShapes.get(countryName).push(path);

      if (!countryBounds.has(countryName)) {
        countryBounds.set(countryName, { ...pathInfo.bounds });
      } else {
        const b = countryBounds.get(countryName);
        b.minX = Math.min(b.minX, pathInfo.bounds.minX);
        b.minY = Math.min(b.minY, pathInfo.bounds.minY);
        b.maxX = Math.max(b.maxX, pathInfo.bounds.maxX);
        b.maxY = Math.max(b.maxY, pathInfo.bounds.maxY);
      }
    }
  }

  mapSvg.addEventListener("mouseleave", () => {
    clearAllHoverStates();
  });

  mapSvg.addEventListener("click", (event) => {
    if (event.target === mapSvg) {
      filterSelect.value = "all";
      render();
    }
  });

  resetMapZoom(false);
}

function showMapError(message) {
  mapSvg.innerHTML = "";
  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("class", "map-error-text");
  text.textContent = message;
  mapSvg.appendChild(text);
}

async function initMap() {
  let geo = window.__ASEAN_MAP_DATA;
  if (!geo) {
    const res = await fetch("data/asean_10m.geojson");
    if (!res.ok) {
      throw new Error(`map data load failed (${res.status})`);
    }
    geo = await res.json();
  }
  const features = Array.isArray(geo.features) ? geo.features : [];
  if (!features.length) {
    throw new Error("map data is empty");
  }
  renderMap(features);
}

async function init() {
  countries = window.__COUNTRIES_DATA || [];
  if (!countries.length) {
    const countryRes = await fetch("data/countries.json");
    countries = await countryRes.json();
  }

  initCountryFilter(countries);

  try {
    await initMap();
  } catch (err) {
    showMapError(`地図を読み込めませんでした: ${err.message || "unknown error"}`);
  }

  render();
}

filterSelect.addEventListener("change", render);
keywordInput.addEventListener("input", render);

init().catch((err) => {
  tableBody.innerHTML = `<tr><td colspan="7">データ読み込みに失敗しました: ${err}</td></tr>`;
});
