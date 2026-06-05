// State of Play brief — the CONNECTIVE source of truth.
//
// Pure data module (no React, no DOM). It imports the real exports from every
// data library and re-derives the headline numbers through each lib's own
// helpers, so the brief, the /about methodology page and the home CTA all stay
// in sync with the tools — nothing is duplicated or hand-typed.
//
// Experimental proof-of-concept for thecolab.ai "Impact for Good".

import { BASKETS, getBasket } from "./basket-data";
import { BASKET_PRICED_AT, BASKET_SOURCE_LINE } from "./basket-data";
import { BUDGET_SOURCE_LINE, buildBudget } from "./budget-calc";
import {
  DEPRIVATION_META,
  DEPRIVATION_SOURCE_LINE,
  NATIONAL_BASELINE_PCT,
  overIndex,
  topByDeprivation,
} from "./deprivation-data";
import {
  ENERGY_SOURCE_LINE,
  EPI_LATEST_LABEL,
  EPI_SOURCE_URL,
  getSeries,
} from "./energy-data";
import {
  FOOD_SOURCE_LINE,
  FPI_LATEST_LABEL,
  FPI_SOURCE_URL,
  getSubgroup,
} from "./food-price-data";
import {
  HOUSING_CENTRES,
  HOUSING_META,
  HOUSING_SOURCES,
  HOUSING_SOURCE_LINE,
  sortByCoverage,
} from "./housing-data";
import {
  ARCHETYPES,
  SOURCE_LINE as INDEXATION_SOURCE_LINE,
} from "./indexation-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KeyFinding {
  label: string;
  value: string;
  detail: string;
  source: string;
  /** Internal route to the tool this finding comes from. */
  href: string;
}

export interface SuiteSource {
  module: string;
  title: string;
  sourceLine: string;
  /** Reference date / period for the underlying data. */
  date: string;
  /** Internal route to the tool. */
  href: string;
  /** External official source URLs, if any. */
  urls?: string[];
}

// ---------------------------------------------------------------------------
// Numbers with NO existing export — defined ONCE here, with their source, so
// the home page and the brief can import them instead of scattering literals.
// ---------------------------------------------------------------------------

/** Children in material hardship — currently a literal on the home page. */
export const CHILD_MATERIAL_HARDSHIP = {
  count: 169300,
  pct: 14.3,
  source: "Stats NZ, year ended June 2025",
} as const;

/** After-housing-costs child poverty — currently only JSX text in /housing. */
export const AHC_CHILD_POVERTY = {
  count: 210600,
  bhc: 148700,
  housingOnly: 62000,
  source: "Stats NZ YE June 2025 (MEASA/MEASB)",
} as const;

// ---------------------------------------------------------------------------
// Derived headline values — every number comes from a lib helper, not a copy.
// ---------------------------------------------------------------------------

const meat = getSubgroup("meat_poultry_fish");
const bare = getBasket("bare-staples");
const auckland = HOUSING_CENTRES.find((c) => c.name === "Auckland");
const worstCoverage = sortByCoverage()[0];
const elec = getSeries("electricity");
const worstDep = topByDeprivation("ta", 1)[0];

// Representative household budget — the connective hub composition. Composed
// here (not hard-typed) so the test can prove the suite still reconciles.
const repBudget = buildBudget({
  archetypeId: "sole-parent-3kids",
  centreName: "Auckland",
  basketKey: "nutritious-family",
});
const repArchetype = ARCHETYPES.find((a) => a.id === "sole-parent-3kids");

// ---------------------------------------------------------------------------
// KEY_FINDINGS — eight headline figures, ordered for the one-page brief.
// ---------------------------------------------------------------------------

export const KEY_FINDINGS: KeyFinding[] = [
  {
    label: `children in material hardship — ${CHILD_MATERIAL_HARDSHIP.pct}% of all Kiwi kids`,
    value: CHILD_MATERIAL_HARDSHIP.count.toLocaleString("en-NZ"),
    detail:
      "Material hardship means going without basics most families take for granted — the human total the rest of this brief explains.",
    source: CHILD_MATERIAL_HARDSHIP.source,
    href: "/simulator",
  },
  {
    label: "children in poverty after housing costs",
    value: AHC_CHILD_POVERTY.count.toLocaleString("en-NZ"),
    detail: `Well above the before-housing-costs measure (${AHC_CHILD_POVERTY.bhc.toLocaleString(
      "en-NZ",
    )}): roughly ${AHC_CHILD_POVERTY.housingOnly.toLocaleString(
      "en-NZ",
    )} children are poor purely because of housing costs.`,
    source: AHC_CHILD_POVERTY.source,
    href: "/housing",
  },
  {
    label: "meat, poultry & fish — the basics climb fastest",
    value: `+${meat.annualPct}%/yr`,
    detail:
      "The cheapest dignified source of protein is the fastest-inflating food group, so it is the first thing low-income households cut.",
    source: FOOD_SOURCE_LINE,
    href: "/grocery",
  },
  {
    label: `the bare-staples survival shop — ${bare.pctOfJobseeker}% of a single Jobseeker benefit`,
    value: `$${bare.totalWeekly.toFixed(2)}/wk`,
    detail:
      "Carbs, dairy and eggs, almost no fresh protein or veg — priced from live Woolworths NZ prices. What a benefit actually stretches to.",
    source: BASKET_SOURCE_LINE,
    href: "/basket",
  },
  {
    label:
      "of an Auckland family's median rent the maximum Accommodation Supplement covers",
    value: `${(auckland?.asCoversFamilyPct ?? 47.7).toFixed(1)}%`,
    detail: `National median rent is $${HOUSING_META.nationalRentWeekly}/wk; the worst coverage is ${worstCoverage.name} at ${worstCoverage.asCoversFamilyPct.toFixed(
      1,
    )}% of rent.`,
    source: HOUSING_SOURCE_LINE,
    href: "/housing",
  },
  {
    label: "electricity — the steepest CPI rise since 1989",
    value: `+${elec.annualPct}%/yr`,
    detail:
      "Benefits are indexed to general CPI, which lags energy inflation, and the poorest pay a 'poverty premium' on power.",
    source: ENERGY_SOURCE_LINE,
    href: "/energy",
  },
  {
    label: `of ${worstDep.name} residents live in the most-deprived areas`,
    value: `${worstDep.pct910.toFixed(0)}%`,
    detail: `That is ${overIndex(worstDep.pct910)}× the national ${NATIONAL_BASELINE_PCT}% baseline — deprivation concentrates by postcode, it is not spread evenly.`,
    source: DEPRIVATION_SOURCE_LINE,
    href: "/map",
  },
  {
    label: `${repArchetype?.name ?? "a sole parent with 3 children"} (Auckland) — weekly shortfall`,
    value: `-$${Math.abs(repBudget.residual).toFixed(2)}/wk`,
    detail: `Outgoings of $${repBudget.totalOutgoings.toFixed(
      2,
    )} on base benefit income of $${repBudget.incomeBase.toFixed(
      2,
    )} (base rate only — excludes Working for Families and the Accommodation Supplement).`,
    source: BUDGET_SOURCE_LINE,
    href: "/budget",
  },
];

// ---------------------------------------------------------------------------
// SUITE_SOURCES — one entry per module, covering every tool route.
// ---------------------------------------------------------------------------

export const SUITE_SOURCES: SuiteSource[] = [
  {
    module: "indexation",
    title: "Indexation Simulator — the income side",
    sourceLine: INDEXATION_SOURCE_LINE,
    date: "MSD rates effective 1 April 2026",
    href: "/simulator",
  },
  {
    module: "food-price",
    title: "Grocery Tracker — the Food Price Index by category",
    sourceLine: FOOD_SOURCE_LINE,
    date: FPI_LATEST_LABEL,
    href: "/grocery",
    urls: [FPI_SOURCE_URL],
  },
  {
    module: "basket",
    title: "Live Basket — today's real Woolworths NZ shop",
    sourceLine: BASKET_SOURCE_LINE,
    date: BASKET_PRICED_AT,
    href: "/basket",
  },
  {
    module: "energy",
    title: "Power & Energy — electricity and gas price indexes",
    sourceLine: ENERGY_SOURCE_LINE,
    date: EPI_LATEST_LABEL,
    href: "/energy",
    urls: [EPI_SOURCE_URL],
  },
  {
    module: "housing",
    title: "Housing — rent vs the Accommodation Supplement",
    sourceLine: HOUSING_SOURCE_LINE,
    date: HOUSING_META.rentPeriod,
    href: "/housing",
    urls: HOUSING_SOURCES,
  },
  {
    module: "deprivation",
    title: "Deprivation Map — the postcode penalty",
    sourceLine: DEPRIVATION_SOURCE_LINE,
    date: "NZDep2023 (2023 Census)",
    href: "/map",
    urls: [DEPRIVATION_META.sourceUrl, DEPRIVATION_META.officialMapUrl],
  },
  {
    module: "budget",
    title: "Budget Builder — the whole squeeze, one week",
    sourceLine: BUDGET_SOURCE_LINE,
    date: "composed from the modules above",
    href: "/budget",
  },
];

// ---------------------------------------------------------------------------
// Disclaimer + a fixed (deterministic) generated-on string for print & tests.
// ---------------------------------------------------------------------------

export const BRIEF_GENERATED = "as at 5 June 2026";
export const SUITE_GENERATED_ON = "5 June 2026";

export const BRIEF_DISCLAIMER =
  "Experimental proof-of-concept built for thecolab.ai's Impact for Good programme. Figures are drawn from public Stats NZ, MSD, MBIE, WINZ, CPAG and University of Otago sources and simplified for illustration — they are indicative, not exact, and this is not financial, legal or policy advice. British/NZ spelling used throughout.";

export const SUITE_DISCLAIMER = BRIEF_DISCLAIMER;
