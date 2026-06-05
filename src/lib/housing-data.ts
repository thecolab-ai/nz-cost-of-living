/**
 * Rent vs the Accommodation Supplement — real Work and Income NZ (WINZ) maximum
 * Accommodation Supplement (AS) rates effective 1 April 2026, set against the
 * REAL median weekly rent for new tenancies from MBIE Tenancy Services rental
 * bond data (2026-03-01, detailed monthly by territorial authority).
 *
 * Every figure is real and sourced: AS maxima are the genuine published
 * 1 April 2026 rates; rents are the published MBIE median weekly rent (no
 * estimation). See HOUSING_META for sources.
 *
 * This is an experimental proof-of-concept for thecolab.ai "Impact for Good".
 * Always check figures against the original WINZ / MBIE sources before relying
 * on them.
 */

export type AsAreaId = 1 | 2 | 3 | 4;

export type AsHouseholdKey =
  | "single_no_children"
  | "couple_or_soleparent_1"
  | "family_2plus_children";

export interface HousingCentre {
  name: string;
  asArea: AsAreaId;
  /** Real MBIE median weekly rent of new tenancies (2026-03-01). */
  rentWeekly: number;
  asMaxFamily: number;
  asMaxSingle: number;
  asCoversFamilyPct: number;
  residualFamily: number;
}

export interface HousingMeta {
  asRatesEffective: string;
  asRatesSource: string;
  rentSource: string;
  rentMethod: string;
  asAreaSource: string;
  rentPeriod: string;
  nationalRentWeekly: number;
  nationalRentPeriod: string;
}

export interface HousingContextFact {
  fact: string;
  source: string;
}

export const HOUSING_META: HousingMeta = {
  asRatesEffective: "1 April 2026",
  asRatesSource:
    "Work and Income NZ \u2014 Accommodation Supplement maximum weekly payments (1 April 2026)",
  rentSource:
    "MBIE Tenancy Services rental bond data \u2014 median weekly rent of new tenancies, 2026-03-01 (detailed monthly by territorial authority)",
  rentMethod:
    "Rents are the REAL published MBIE median weekly rent for new bonds (2026-03-01); Accommodation Supplement maxima are the real 1 April 2026 rates. No estimation.",
  asAreaSource:
    "Work and Income NZ \u2014 Accommodation Supplement area definitions (Statistical Area Units 2017)",
  rentPeriod: "2026-03-01",
  nationalRentWeekly: 595,
  nationalRentPeriod: "2026-03-01",
};

export const AS_MAX_BY_AREA: Record<
  AsHouseholdKey,
  Record<AsAreaId, number>
> = {
  single_no_children: { 1: 165, 2: 105, 3: 80, 4: 70 },
  couple_or_soleparent_1: { 1: 235, 2: 155, 3: 105, 4: 80 },
  family_2plus_children: { 1: 305, 2: 220, 3: 160, 4: 120 },
};

export const AS_AREA_LABELS: Record<AsAreaId, string> = {
  1: "Area 1 \u2014 Auckland, Tauranga, Queenstown-Lakes (highest-cost)",
  2: "Area 2 \u2014 Wellington, Hamilton, Christchurch & most main centres",
  3: "Area 3 \u2014 Dunedin & similar",
  4: "Area 4 \u2014 rest of New Zealand (lowest cap)",
};

export const HOUSING_CENTRES: HousingCentre[] = [
  {
    name: "Auckland",
    asArea: 1,
    rentWeekly: 640,
    asMaxFamily: 305,
    asMaxSingle: 165,
    asCoversFamilyPct: 47.7,
    residualFamily: 335,
  },
  {
    name: "Tauranga",
    asArea: 1,
    rentWeekly: 720,
    asMaxFamily: 305,
    asMaxSingle: 165,
    asCoversFamilyPct: 42.4,
    residualFamily: 415,
  },
  {
    name: "Queenstown-Lakes",
    asArea: 1,
    rentWeekly: 750,
    asMaxFamily: 305,
    asMaxSingle: 165,
    asCoversFamilyPct: 40.7,
    residualFamily: 445,
  },
  {
    name: "Wellington City",
    asArea: 2,
    rentWeekly: 585,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 37.6,
    residualFamily: 365,
  },
  {
    name: "Lower Hutt",
    asArea: 2,
    rentWeekly: 595,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 37.0,
    residualFamily: 375,
  },
  {
    name: "Hamilton",
    asArea: 2,
    rentWeekly: 560,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 39.3,
    residualFamily: 340,
  },
  {
    name: "Christchurch",
    asArea: 2,
    rentWeekly: 550,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 40.0,
    residualFamily: 330,
  },
  {
    name: "Napier",
    asArea: 2,
    rentWeekly: 643,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 34.2,
    residualFamily: 423,
  },
  {
    name: "Nelson",
    asArea: 2,
    rentWeekly: 550,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 40.0,
    residualFamily: 330,
  },
  {
    name: "Palmerston North",
    asArea: 2,
    rentWeekly: 550,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 40.0,
    residualFamily: 330,
  },
  {
    name: "Whang\u0101rei",
    asArea: 2,
    rentWeekly: 593,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 37.1,
    residualFamily: 373,
  },
  {
    name: "Rotorua",
    asArea: 2,
    rentWeekly: 555,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 39.6,
    residualFamily: 335,
  },
  {
    name: "New Plymouth",
    asArea: 2,
    rentWeekly: 590,
    asMaxFamily: 220,
    asMaxSingle: 105,
    asCoversFamilyPct: 37.3,
    residualFamily: 370,
  },
  {
    name: "Dunedin",
    asArea: 3,
    rentWeekly: 500,
    asMaxFamily: 160,
    asMaxSingle: 80,
    asCoversFamilyPct: 32.0,
    residualFamily: 340,
  },
  {
    name: "Invercargill",
    asArea: 4,
    rentWeekly: 485,
    asMaxFamily: 120,
    asMaxSingle: 70,
    asCoversFamilyPct: 24.7,
    residualFamily: 365,
  },
];

export const HOUSING_CONTEXT: HousingContextFact[] = [
  {
    fact: "385,025 households receive the Accommodation Supplement, costing about $42.5m every week (\u2248$2.2b a year) \u2014 a structural subsidy that exists because market rents far outrun low incomes.",
    source:
      "public-housing-nz skill \u2014 HUD Accommodation Supplement recipients & weekly spend (data.govt.nz), as at 1 Dec 2024",
  },
  {
    fact: "After-housing-costs child poverty (210,600) runs far above the before-housing-costs measure (148,700): roughly 62,000 children are poor purely because of housing costs.",
    source: "Stats NZ YE June 2025 (MEASA/MEASB)",
  },
  {
    fact: "112,496 people were severely housing-deprived (homeless) at the 2023 Census, up from 99,462 in 2018.",
    source: "Stats NZ, 2023 Census",
  },
  {
    fact: "The Accommodation Supplement is capped well below actual rent and most recipients receive less than the maximum, so the real shortfall is typically larger than shown.",
    source: "Work and Income NZ",
  },
];

export const HOUSING_SOURCES: string[] = [
  "https://www.workandincome.govt.nz/products/benefit-rates/benefit-rates-april-2026.html",
  "https://www.workandincome.govt.nz/map/deskfile/extra-help-information/accommodation-supplement-tables/definitions-of-areas.html",
  "https://www.tenancy.govt.nz/about-tenancy-services/data-and-statistics/rental-bond-data/",
];

export const HOUSING_SOURCE_LINE =
  "Accommodation Supplement maxima: Work and Income NZ (rates effective 1 April 2026). Rents: MBIE Tenancy Services rental bond data — median weekly rent of new tenancies (2026-03-01).";

export const HOUSING_DISCLAIMER = `Experimental proof-of-concept for thecolab.ai Impact for Good — not financial, housing or policy advice. ${HOUSING_META.rentMethod} ${HOUSING_CONTEXT[3].fact}`;

// ---------------------------------------------------------------------------
// Pure, testable helpers
// ---------------------------------------------------------------------------

/** epsilon-safe 1dp rounding (identical contract to food-price-data.round1). */
export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/** Ranks centres by residual family gap, largest first (the lead chart order). */
export function sortByResidual(
  centres: HousingCentre[] = HOUSING_CENTRES,
): HousingCentre[] {
  return [...centres].sort((a, b) => b.residualFamily - a.residualFamily);
}

/** Ranks by AS-as-%-of-rent ascending (worst coverage first). */
export function sortByCoverage(
  centres: HousingCentre[] = HOUSING_CENTRES,
): HousingCentre[] {
  return [...centres].sort((a, b) => a.asCoversFamilyPct - b.asCoversFamilyPct);
}

/** AS as a % of weekly rent, rounded to 1dp, divide-by-zero safe. */
export function asCoversPct(asMax: number, rentWeekly: number): number {
  return rentWeekly <= 0 ? 0 : round1((asMax / rentWeekly) * 100);
}

/** Residual = rent minus the AS max (cash the household must find), clamped >=0. */
export function residualGap(rentWeekly: number, asMax: number): number {
  return Math.max(0, rentWeekly - asMax);
}

/** Look up the max AS for a household type in a given area. */
export function asMaxFor(household: AsHouseholdKey, area: AsAreaId): number {
  return AS_MAX_BY_AREA[household][area];
}
