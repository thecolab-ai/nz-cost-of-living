# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

> **This is a template.** It seeds every **thecolab.ai Impact for Good** build. Treat the sections below as a starting point — as the project takes shape, **keep this file updated to reflect the actual direction, stack, and conventions of the build**. A stale CLAUDE.md is worse than none; revise it whenever architecture, goals, or workflows change.

## What is this?

A **thecolab.ai Impact for Good** build — a project from TheColab's community programme that uses AI and software to create positive social, environmental, or community impact in Aotearoa New Zealand.

Each build lives in its own dated folder (e.g. `impact-2026-06-05/`). Fill in the specifics below as the project's purpose, audience, and success criteria become clear.

- **Project name:** Indexation Impact Simulator (NZ child-poverty policy demo)
- **Impact goal:** Make NZ's highest-leverage anti-poverty lever — benefit income adequacy and indexation drift — legible to non-economists. Pick a household archetype, drag policy levers (restore wage-indexation, extend the in-work tax credit to beneficiary children, lift toward the WEAG benchmark), and watch weekly income move toward or across the CPAG basic-needs "income floor".
- **Primary users:** Policy analysts, advocates and case workers (Treasury / MSD / DPMC Child Poverty Unit framing); a fast, transparent Budget-option sense-check.
- **Success looks like:** An honest, on-brand interactive that recomputes disposable income deterministically from real published figures and clearly shows which households clear the floor under which settings.
- **Grounded in:** thecolab.ai's "The Baseline We Built" poverty report (repo: `github.com/thecolab-ai/nz-poverty-report`; figures from Stats NZ CPRA measures, MSD benefit rates April 2026, WEAG 2019, CPAG "Below the Income Floor" 2025). Experimental proof-of-concept — not advice.

### Key files

**Income side — `/simulator`** (Indexation Impact Simulator)
- `src/app/simulator/page.tsx` — the interactive page (client component).
- `src/lib/indexation-data.ts` — typed archetype/lever data + shared constants (`IWTC_PER_CHILD_WEEKLY=50`, WEAG steps, disclaimer/source copy). Single source of truth for numbers.
- `src/lib/indexation-calc.ts` — pure, deterministic `calcImpact(archetype, settings)`; no React/DOM, fully unit-testable.
- `src/app/simulator/__tests__/indexation-calc.test.ts` — Vitest coverage of the calc (worked-dollar assertions, cross-floor case, clamping).

Levers are modelled as **additive** percentage uplifts on each archetype's `currentNetWeekly` (not compounded) for legibility; the IWTC toggle adds `$50/child` only to benefit-dependent households (`hasWorkingParent === false`). Dollar anchors for couple archetypes are estimates and base rates exclude WfF/Accommodation Supplement — disclosed in the footer.

**Spend side — `/grocery`** (Grocery category inflation tracker, companion to the simulator)
- `src/app/grocery/page.tsx` — dashboard: rebased multi-line chart (toggleable categories), annual-change-by-category bar chart, cumulative-since-2022 framing, cross-link to `/simulator`.
- `src/lib/food-price-data.ts` — **real Stats NZ Food Price Index** monthly series (Jan 2022 → Apr 2026, base June 2017 = 1000), parsed directly from the official `selected-price-indexes-april-2026.csv` (series CPIM.SE901 + subgroup SE9011–SE9015). Plus pure helpers (`rebaseToStart`, `cumulativeChangePct`, `annualChangePct`, `subgroupsBySqueeze`).
- `src/app/grocery/__tests__/food-price.test.ts` — Vitest: series/date alignment (52 pts), helper correctness, and a guard asserting each subgroup's published `annualPct` matches the series.

Data integrity note: the FPI series is genuine published Stats NZ data (verified: `total@2017-06 = 1000.0`; every subgroup's annual change reconciles with Stats NZ commentary). If refreshing to a newer SPI release, re-download the CSV and regenerate `SERIES` in `food-price-data.ts` — don't hand-edit values.

**Drift-over-time — part of `/simulator`** (income vs the rising floor)
- `src/lib/floor-projection.ts` — pure `projectGap(archetype, settings, opts)` → yearly points (year, income, floor, gap, crossed). Year-0 income = `calcImpact().newWeekly`, floor = `incomeFloorWeekly`. Income compounds at `incomeGrowthRate(settings)` (interpolated CPI 3.1% → wage 4.8% as the wage-indexation lever rises); floor compounds at `COST_GROWTH` 6.2%. The floor always outgrows income, so the lever changes the *slope*, not the direction.
- `src/app/simulator/__tests__/floor-projection.test.ts` — Vitest (year-0 anchoring, widening gap, lever slows drift, clamping).
- The simulator page renders a "drift over time" ComposedChart below the snapshot, driven by the same archetype + settings state.

**Overview — `/` (home)**
- `src/app/page.tsx` — front door: "the squeeze from both ends" thesis, real-figure stat cards, entry cards to all three tools. Server component, no chart deps; stats inlined.

**Housing side — `/housing`** (rent vs the Accommodation Supplement)
- `src/lib/housing-data.ts` — typed data: 15 main centres with **real** median weekly rent vs max Accommodation Supplement (by AS area), residual gap, AS-as-%-of-rent; plus AS rate table, area labels, context facts, sources.
- `src/app/housing/page.tsx` — ranked rent-vs-AS stacked bars (AS portion vs residual gap in orange), headline stats, methodology footer.
- `src/app/housing/__tests__/housing.test.ts` — Vitest (data integrity, helper correctness, ranking).

Housing data provenance — **all real**: **AS max rates** (Work & Income, 1 April 2026) and **AS area assignments** are official; **rents are the real MBIE median weekly rent of new tenancies, March 2026** (national median $595, matching the report's ~$595–620). National median + AS covers ~48% of Auckland rent; largest residual gap is Queenstown-Lakes (~$445/wk).

How the rent data was fetched (the live MBIE feed blocks plain `curl`/WebFetch with a JS/WAF gate; the data.govt.nz CSV URLs are stale 404s): a **Puppeteer** script (`/tmp/pup/`) drives headless Chrome, visits the tenancy.govt.nz rental-bond-data page to clear the gate, scrapes the *current* download links, then fetches `detailed-monthly-tla-tenancy.csv` / `detailed-monthly-region-tenancy.csv` (real columns incl. `Median Rent`) in-page. To refresh: re-run that scrape, re-parse the latest `Time Frame` per centre, and regenerate `HOUSING_CENTRES` + `HOUSING_META` (don't hand-edit values).

**Energy side — `/energy`** (electricity & gas inflation)
- `src/lib/energy-data.ts` — real Stats NZ Selected Price Indexes: Electricity `CPIM.SE904501` (+13.1%/yr) & Gas `CPIM.SE904502`, monthly 2019→Apr 2026, base June 2017 = 1000. Pulled from the same SPI CSV as the FPI. Plus context (the 11–17% prepay "poverty premium").
- `src/app/energy/page.tsx` (rebased electricity-vs-gas line chart) + test.

**Live Basket — `/basket`** (what a weekly shop actually costs)
- `src/lib/basket-data.ts` — 3 prebuilt baskets (bare-staples $38.79, nutritious-family $109.69, pantry $47.13) priced **live via the colab `woolworths-nz` skill** (`/Users/adam/TheColabAI/.skills/skills/woolworths-nz/scripts/cli.py search … --json`), each with a per-item breakdown and a `costHistory` reconstructed by re-pricing today's basket through the Stats NZ FPI sub-indices (latest point = live total). `% of a single Jobseeker benefit` on each.
- `src/app/basket/page.tsx` (selectable baskets + cost-history area chart + item table) + test. To refresh: re-run `/tmp/price_baskets.py` then `/tmp` history build, regenerate `basket-data.ts`.

**Budget Builder hub — `/budget`** (the connective centre)
- `src/lib/budget-calc.ts` — pure `buildBudget({archetypeId, centreName, basketKey, powerWeekly, otherWeekly, wageIndexPct})` that **composes the other modules**: income (indexation `calcImpact`) − rent (`HOUSING_CENTRES`) − food (`BASKETS`) − power/other (estimates: `DEFAULT_POWER_WEEKLY=50` MBIE-cited, `DEFAULT_OTHER_WEEKLY=60`) → residual. No duplicated numbers.
- `src/app/budget/page.tsx` (income-vs-outgoings diverging bar + residual headline, cross-links to all tools) + test.

**Deprivation / postcode penalty — `/map`**
- `src/lib/deprivation-data.ts` — **real NZDep2023** (Otago HIRP, 2023 Census) aggregated by me to 67 TAs + 16 regions: share of population in deciles 9–10 (Kawerau 78%…) + mean decile. Fetched via Puppeteer (the Otago page is Cloudflare-gated). Honest framing: it's a **graded ranked heat view, not a polygon choropleth** — links out to the official EHINZ web map.
- `src/app/map/page.tsx` (TA⇄Region heat-ranked bars, national-20% baseline line) + test.

**Export — `/brief` + `/about`**
- `src/lib/brief-data.ts` — **connective source of truth**: `KEY_FINDINGS` + `SUITE_SOURCES` re-derived from every module's exports (so headline figures never drift). Also the canonical home for the two figures that lacked an export: `CHILD_MATERIAL_HARDSHIP`, `AHC_CHILD_POVERTY`.
- `src/app/brief/page.tsx` — print-optimised one-page "State of Play" brief (Save-as-PDF via `window.print()`, print CSS in `globals.css` hides the sidebar). `src/app/about/page.tsx` — methodology, every source + date, confidence/limitations. Both + a test.

**Reasoning pages** (content, server components — no data deps)
- `src/app/why/page.tsx` (`/why`) — the "for good" thesis: NZ poverty data is too diverse/fragmented for one person to hold, but AI can fetch, reconcile and connect it into one actionable picture.
- `src/app/how-its-built/page.tsx` (`/how-its-built`) — the build methodology: one AI workflow per feature (Design→Build→Verify), real data fetched honestly (Stats NZ CSVs, Puppeteer for bot-gated MBIE/Otago, the `woolworths-nz` skill), pure tested calc modules, on-brand. Pulls `SUITE_SOURCES` from `brief-data`.

Suite status: 8 tool routes + home + brief/about + why/how-its-built; **122 Vitest tests**; `pnpm build` clean (**15 static routes**).

**Sidebar** (`src/app/registry-sidebar.tsx`) is driven by a `NAV_GROUPS` array, categorised: **Income & budget** (budget, simulator) · **Cost of living** (grocery, basket, energy, housing) · **Where it lands** (deprivation map) · **About & methodology** (brief, why, how-its-built, about). Add a route = one entry in the relevant group.

**Methodology on every statistic** — two shared components in `src/components/`:
- `method-info.tsx` → `<MethodInfo label calculation source />` — an inline ⓘ popover (print-hidden) next to every stat and chart title; `MethodEntry` is the shared `{label, calculation, source}` type.
- `methodology-panel.tsx` → `<MethodologyPanel entries={METHODS} />` — a per-page "Methodology & sources" accordion, rendered before each page's footer.
Each page defines a `METHODS: MethodEntry[]` whose `source` reuses the page's data-lib `*_SOURCE_LINE` and whose `calculation` is authored from the actual formula. **Gotcha:** `MethodInfo` renders a `<button>`, so don't nest it inside another interactive element — where a whole card was a button/link (basket, brief), use the **stretched-link/overlay pattern** (card content + ⓘ at `relative z-10`, with the selector `<button>`/`<Link>` as an `absolute inset-0` overlay sibling).

**Dev-server gotcha:** after editing `src/styles/globals.css` (e.g. the print block), Tailwind v4's dev HMR can get into a state where utility classes stop applying (symptom: the sidebar logo balloons to full-screen, charts don't size). It's not a code bug — `pnpm build` stays clean. Fix: **restart the dev server** (`preview_stop` + `preview_start`).

## Skills — use the shared library first

Before building, reach for TheColab's shared skills library:

**https://github.com/thecolab-ai/.skills**

It contains reusable, vetted skills for common Impact for Good build tasks. Check there for an existing skill that fits before writing something from scratch, and prefer those patterns so builds stay consistent across the programme. If you create something broadly useful during this build, consider contributing it back.

## Stack

_Update this section to match what the build actually uses._

The starter in `impact-2026-06-05/` is a Next.js app (TypeScript, Tailwind, Biome, Vitest, pnpm). Common commands:

```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # production build
pnpm lint         # Biome
pnpm test         # Vitest
```

## Conventions

- Use British/NZ English in content and user-facing copy (organisation, colours), American English in code.
- Follow thecolab.ai branding — invoke the `thecolab-branding` skill for exact colours, typography, voice, and component patterns.
- Keep commits focused; lint and test before pushing.

## Keeping this file current

This CLAUDE.md should evolve with the build. **Whenever the project's direction, architecture, stack, or workflow changes, update this file to match.** Capture decisions, gotchas, and conventions here so the next session (human or Claude) starts with accurate context.
