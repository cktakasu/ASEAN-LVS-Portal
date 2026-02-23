# CLAUDE.md — ASEAN LVS Business Portal

This file provides AI assistants with a complete reference for the ASEAN Low-Voltage Switchgear (LVS) Business Portal codebase. Read this before making any changes.

---

## Project Overview

**ASEAN LVS Portal** is an internal business intelligence dashboard for analyzing the ASEAN low-voltage circuit breaker market. It is a **fully client-side, static React + TypeScript application** — there is no backend, no database, and no external API calls at runtime.

- **Primary language**: Japanese (all UI labels, documentation, and data)
- **Target users**: Internal sales/strategy teams
- **Scope**: ASEAN countries (MY, TH, VN, ID, PH, SG), with Malaysia as the primary detailed country view
- **Product categories tracked**: ACB, MCCB, ELCB, MCB, RCBO, RCCB

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.3.1 |
| Language | TypeScript | 5.7.3 (strict) |
| Routing | React Router DOM | 7.13.0 |
| Charting | Recharts | 3.7.0 |
| Build Tool | Vite | 6.0.11 |
| Test Runner | Vitest | 3.2.4 |
| Test Utilities | @testing-library/react | 16.3.0 |
| DOM Environment | jsdom | 27.0.0 |

No CSS-in-JS library, no state management library (no Redux/Zustand), no backend framework.

---

## Commands

```bash
# Start development server (port 8080)
npm run dev

# Type-check and build for production
npm run build

# Run tests (Vitest, one-time)
npm run test

# Preview the production build locally
npm run preview
```

**Important**: `npm run build` runs `tsc --noEmit` first, so the build will fail on any TypeScript error. Always ensure types are clean before committing.

---

## Repository Structure

```
ASEAN-LVS-Portal/
├── .github/workflows/deploy.yml   # GitHub Actions: build + deploy to GitHub Pages
├── public/
│   ├── data/
│   │   ├── asean_10m.geojson           # ASEAN-only map (1 MB)
│   │   ├── asean_context_10m.geojson   # Full context map (4.7 MB)
│   │   └── countries.json              # Country regulatory specs
│   └── fonts/                          # Locally hosted font files
├── src/
│   ├── components/                # Reusable React components
│   │   ├── charts/                # Chart sub-components
│   │   ├── DonutLabelWithLeaderLine.tsx
│   │   ├── LegendItem.tsx
│   │   └── index.ts               # Barrel export
│   ├── constants/
│   │   ├── malaysia.ts            # All visual constants (colors, spacing, chart config)
│   │   └── index.ts
│   ├── data/                      # Static datasets as TypeScript modules
│   │   ├── aseanGdpData.ts        # ASEAN GDP 2015–2030 (actual + forecast)
│   │   ├── malaysiaEconomyData.ts # Malaysia KPIs, industry breakdown, news
│   │   └── malaysiaMarketData.ts  # Market size, sector data, regional profiles
│   ├── hooks/
│   │   ├── useChartTransition.ts  # Y-axis fade animation hook
│   │   └── index.ts
│   ├── types/                     # Shared TypeScript interfaces
│   │   ├── chart.ts               # ChartDataItem, CountryGDP, TooltipProps
│   │   ├── economy.ts             # EconomyKPI, GDPDataPoint, IndustryGDP, EconomicNews
│   │   ├── market.ts              # Market data types
│   │   ├── certification.ts       # Certification matrix types
│   │   └── index.ts               # Barrel export (re-exports all)
│   ├── utils/
│   │   ├── chartUtils.ts          # calculateMaxY, generateYTicks, generateChartData
│   │   └── index.ts
│   ├── test/
│   │   └── setup.ts               # Vitest setup (imports @testing-library/jest-dom)
│   ├── App.tsx                    # Root component: SVG map, routing, country selection
│   ├── App.test.tsx               # Primary test file (~3600 lines)
│   ├── MalaysiaPage.tsx           # Malaysia dashboard: 6-tab layout (~1480 lines)
│   ├── main.tsx                   # React entry point
│   └── styles.css                 # Global CSS (~522 lines)
├── data/                          # Legacy/reference data files (JS module format)
├── app.js                         # Legacy standalone map visualization
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite + Vitest configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

---

## Architecture

### Routing

React Router v7 is used for client-side routing. `App.tsx` handles the root route (`/`) with the interactive ASEAN map. Country-specific pages (e.g., Malaysia) are separate route components.

### Map Rendering

The ASEAN map is rendered as **SVG** from GeoJSON data. Key details:
- Mercator projection computed client-side
- GeoJSON source: `public/data/asean_10m.geojson`
- Interactivity: click to zoom, hover states
- The larger `asean_context_10m.geojson` (4.7 MB) is used when surrounding context is needed

### Data Architecture

All data is **static and embedded** — no runtime API calls:

| File | Contents |
|------|----------|
| `src/data/aseanGdpData.ts` | GDP 2015–2030 for MY, TH, VN, ID, PH, SG. Each point has `is_forecast: boolean`. |
| `src/data/malaysiaEconomyData.ts` | Malaysia 2025 KPIs (`EconomyKPI`), industry breakdown, economic news items, data source citations |
| `src/data/malaysiaMarketData.ts` | Circuit breaker market size (USD millions), sector demand heatmap, regional project profiles |
| `public/data/countries.json` | Regulatory specs: standards, grid voltage, certification requirements per country |

**Currency handling**: All monetary data is stored in USD. The UI converts to JPY using an exchange rate constant (`usdJpy`) defined in `malaysiaEconomyData.ts`. The `generateChartData` utility applies this conversion.

### MalaysiaPage Dashboard Tabs

`MalaysiaPage.tsx` renders a 6-tab dashboard (referenced as T1–T6 in design docs):
- **T1**: Economic overview (KPIs, GDP chart, industry breakdown)
- **T2**: Market & demand (market size, product type heatmap, project pipeline)
- **T3**: Certification & regulatory compliance matrix
- **T4**: Competitive landscape
- **T5**: Strategy / go-to-market insights
- **T6**: Data sources and update log

---

## TypeScript Conventions

TypeScript strict mode is **fully enabled**. The following compiler options are active:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Rules to follow**:
- Never use `any`. Use precise types or generics.
- All exported data must have explicit type annotations.
- Shared interfaces live in `src/types/`. Import from the barrel (`src/types/index.ts`).
- Use `as const` for all constant objects and arrays to get literal types.
- Optional chart fields use `number | null | undefined` (see `ChartDataItem`).

---

## Constants and Styling

All visual configuration is centralized in `src/constants/malaysia.ts`. Do not hardcode colors, font sizes, or spacing inline — use these exports:

| Constant | Purpose |
|----------|---------|
| `COLOR` | Semantic color palette (primary `#2563eb`, etc.) |
| `FONT_SIZE` | Relative font sizes (`small` → `xxxlarge`) |
| `SPACING` | Spacing scale (`xs` 4px → `xxxl` 32px) |
| `STYLES` | Pre-built flex/margin/font style objects |
| `CHART_CONFIG` | Chart height, margins, animation duration (400ms), stroke widths |
| `CHART_FORECAST_COLORS` | Colors for actual vs. forecast visual distinction |
| `CHART_REFERENCE_CONFIG` | Boundary line and forecast area styles |
| `CHART_BADGE_STYLE` | Badge overlay style for "ACTUAL"/"FORECAST" labels |
| `PRODUCT_TYPE_COLORS` | Orange-scale colors per product type (ACB → RCCB) |
| `HEATMAP_COLORS` | 6-level array indexed by score 0–5 |
| `PROJECT_STATUS_COLORS` | Colors for project pipeline status values |

**Section width**: All major content sections use `maxWidth: 1024px` for consistency.

---

## Custom Hooks

### `useChartTransition(transitionDuration?: number)`

Located at `src/hooks/useChartTransition.ts`. Manages a fade animation when switching chart data.

```typescript
const [isTransitioning, transitionClass, triggerTransition] = useChartTransition(400);
// transitionClass is "fading" during transition, "" otherwise
// call triggerTransition() before updating chart data
```

---

## Utility Functions

Located at `src/utils/chartUtils.ts`:

| Function | Description |
|----------|-------------|
| `calculateMaxY(data, comparisonCountries)` | Computes Y-axis max, rounded up to nearest 20 |
| `generateYTicks(maxY)` | Returns array of tick values in steps of 20 |
| `generateChartData(gdpHistory, aseanGdpComparison, comparisonCountries, usdJpy)` | Merges Malaysia + comparison country GDP data, applies USD→JPY conversion |

---

## Testing

**Framework**: Vitest 3.2.4 with jsdom

**Configuration** (`vite.config.ts`):
```typescript
test: {
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  exclude: ["**/._*"],
}
```

**Run tests**:
```bash
npm run test
```

The primary test file is `src/App.test.tsx`. Place new test files alongside the component or module they test, using the `.test.tsx` / `.test.ts` suffix.

There are no end-to-end tests (no Playwright or Cypress configured).

---

## Build and Deployment

**Build command**: `npm run build`
- Runs `tsc --noEmit` for type checking, then `vite build`
- Output directory: `dist/`
- Base path: `/Kaikiei-Group-Site-Codex/` (required for GitHub Pages)

**Deployment**: Automatic via GitHub Actions on every push to `main`.
- Workflow: `.github/workflows/deploy.yml`
- Target: GitHub Pages
- Node version: 20

**Do not change the `base` in `vite.config.ts`** without coordinating with the GitHub Pages repository settings.

---

## Key Files Reference

| File | Lines | Role |
|------|-------|------|
| `src/App.tsx` | ~1542 | Main application: SVG map, zoom, routing, country selection |
| `src/MalaysiaPage.tsx` | ~1479 | Malaysia 6-tab dashboard (T1–T6) |
| `src/constants/malaysia.ts` | ~180 | All visual constants — single source of truth |
| `src/data/aseanGdpData.ts` | — | GDP historical + forecast dataset |
| `src/data/malaysiaEconomyData.ts` | — | Malaysia KPIs and economic indicators |
| `src/data/malaysiaMarketData.ts` | — | Circuit breaker market data |
| `src/utils/chartUtils.ts` | ~75 | Chart data computation utilities |
| `vite.config.ts` | 14 | Vite + Vitest config, base path |
| `tsconfig.json` | — | Strict TypeScript config |

---

## Domain Glossary

| Term | Meaning |
|------|---------|
| LVS / LV遮断器 | Low-Voltage Switchgear / circuit breakers |
| ACB | Air Circuit Breaker (大型、幹線保護) |
| MCCB | Molded Case Circuit Breaker (分岐回路保護) |
| ELCB | Earth Leakage Circuit Breaker |
| MCB | Miniature Circuit Breaker |
| RCBO | Residual Current Breaker with Overcurrent |
| RCCB | Residual Current Circuit Breaker |
| CB relevance | Circuit breaker market relevance score for an industry sector |
| is_forecast | Boolean flag on data points — `true` means projected, `false` means actual |
| usdJpy | USD to JPY exchange rate constant used for all currency conversions |
| T1–T6 | Tab identifiers in the Malaysia dashboard (as used in design specification) |

---

## Conventions and Rules

1. **No new dependencies without discussion** — the dependency footprint is intentionally small.
2. **All UI text must be in Japanese** — do not add English-only UI strings.
3. **Static data only** — do not add runtime API calls or fetch calls. Data updates are handled by editing `src/data/*.ts` files directly.
4. **Use constants** — colors, sizes, and spacing must come from `src/constants/malaysia.ts`, not hardcoded inline.
5. **Type everything** — no implicit `any`, no type assertions without a comment explaining why.
6. **Section max-width is 1024px** — maintain this consistently across all dashboard sections.
7. **Chart animations use 400ms** — this matches `CHART_CONFIG.transitionDuration`; do not use different durations.
8. **Backup files** (`*.bak`) in `src/` should be cleaned up and not committed.
9. **The `data/` root directory** contains legacy JS-module versions of the GeoJSON data for standalone use (e.g., `app.js`). Prefer the GeoJSON files in `public/data/` for the React app.
10. **No ESLint or Prettier is configured** — follow the existing code style manually. The TypeScript compiler enforces correctness.

---

## Design Specification

The full requirements are documented in:
- `LV遮断器市場インテリジェンスダッシュボード — 設計仕様書.md` (comprehensive design spec, ~100 pages, Japanese)
- `ASEAN低圧遮断器市場_設計書.txt` (initial design document)

Consult these files when implementing new dashboard features or data structures to ensure alignment with the intended design.
