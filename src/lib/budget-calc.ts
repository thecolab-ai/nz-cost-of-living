// Household Budget Builder — pure, deterministic, side-effect-free calc module.
// No React, no DOM, no recharts. Fully unit-testable.
//
// This is the connective HUB of the suite: it composes the income side
// (indexation), rent (housing) and food (basket) into one weekly budget,
// plus adjustable power and other-essentials estimates. Every leaf dollar is
// owned by its source library — budget-calc only sums and ratios, so totals
// reconcile across modules. No duplicated numbers.

import { type Basket, type BasketKey, getBasket } from "./basket-data";
import { HOUSING_CENTRES, type HousingCentre } from "./housing-data";
import { DEFAULT_SETTINGS, calcImpact } from "./indexation-calc";
import {
  ARCHETYPES,
  type Archetype,
  type BenefitArchetypeId,
  WAGE_INDEX_MAX_PCT,
} from "./indexation-data";

// energy-data holds only an INDEX, not a $ level, so we DO NOT pull a number
// from it; we define DEFAULT_POWER_WEEKLY here and cite MBIE in the source line.

// Brand colours for the breakdown lines (single source of truth for the chart).
const BREAKDOWN_COLORS = {
  rent: "#2E4057", // indigo
  food: "#C2410C", // orange
  power: "#0EA5E9", // cyan
  other: "#78716C", // muted
} as const;

// ---------------------------------------------------------------------------
// Constants — adjustable estimates (MBIE-cited), and slider bounds.
// ---------------------------------------------------------------------------

/** MBIE avg household electricity ≈ $2,400–2,600/yr ≈ ~$48–50/wk. */
export const DEFAULT_POWER_WEEKLY = 50;
/** Transport, phone, etc. — adjustable estimate. */
export const DEFAULT_OTHER_WEEKLY = 60;

export const POWER_MIN = 0;
export const POWER_MAX = 120;
export const POWER_STEP = 5;

export const OTHER_MIN = 0;
export const OTHER_MAX = 200;
export const OTHER_STEP = 5;

// ---------------------------------------------------------------------------
// Helpers — mirror the sibling idioms exactly.
// ---------------------------------------------------------------------------

/** Round to 2 decimal places, epsilon-safe (identical contract to indexation-calc.round2). */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Clamp into [min, max]; non-finite input falls back to min. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

/**
 * Sensible default food basket per household: singles / childless households
 * → the bare-staples survival shop; households with children → nutritious-family.
 */
export function defaultBasketFor(archetype: Archetype): BasketKey {
  return archetype.children > 0 ? "nutritious-family" : "bare-staples";
}

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export interface BudgetInput {
  archetypeId: BenefitArchetypeId;
  /** Matches HousingCentre.name. */
  centreName: string;
  basketKey: BasketKey;
  /** Defaults to DEFAULT_POWER_WEEKLY, clamped. */
  powerWeekly?: number;
  /** Defaults to DEFAULT_OTHER_WEEKLY, clamped. */
  otherWeekly?: number;
  /** 0..WAGE_INDEX_MAX_PCT optional income lever; default 0. */
  wageIndexPct?: number;
}

export interface BudgetBreakdownLine {
  key: "rent" | "food" | "power" | "other";
  label: string;
  value: number;
  color: string;
  pctOfIncome: number;
}

export interface BudgetResult {
  archetype: Archetype;
  centre: HousingCentre;
  basket: Basket;
  /** Base income, or lifted via the wage-index lever (consistent with the simulator). */
  incomeWeekly: number;
  /** archetype.currentNetWeekly (pre-lever). */
  incomeBase: number;
  /** incomeWeekly - incomeBase (round2). */
  incomeUplift: number;
  rent: number;
  food: number;
  power: number;
  other: number;
  totalOutgoings: number;
  /** incomeWeekly - totalOutgoings (negative = underwater). */
  residual: number;
  residualIsDeficit: boolean;
  pctOfIncomeOnRent: number;
  pctOfIncomeOnOutgoings: number;
  breakdown: BudgetBreakdownLine[];
}

// ---------------------------------------------------------------------------
// buildBudget — pure composition.
// ---------------------------------------------------------------------------

export function buildBudget(input: BudgetInput): BudgetResult {
  const archetype =
    ARCHETYPES.find((a) => a.id === input.archetypeId) ?? ARCHETYPES[0];
  const centre =
    HOUSING_CENTRES.find((c) => c.name === input.centreName) ??
    HOUSING_CENTRES[0];
  const basket = getBasket(input.basketKey);

  const wageIndexPct = clamp(input.wageIndexPct ?? 0, 0, WAGE_INDEX_MAX_PCT);

  const incomeBase = archetype.currentNetWeekly;
  // Reusing calcImpact keeps the income lift identical to the simulator;
  // iwtc/weag stay at DEFAULT_SETTINGS so this lever only restores wage-indexation.
  const incomeWeekly =
    wageIndexPct > 0
      ? calcImpact(archetype, { ...DEFAULT_SETTINGS, wageIndexPct }).newWeekly
      : round2(incomeBase);
  const incomeUplift = round2(incomeWeekly - incomeBase);

  const power = round2(
    clamp(input.powerWeekly ?? DEFAULT_POWER_WEEKLY, POWER_MIN, POWER_MAX),
  );
  const other = round2(
    clamp(input.otherWeekly ?? DEFAULT_OTHER_WEEKLY, OTHER_MIN, OTHER_MAX),
  );

  const rent = centre.rentWeekly;
  const food = basket.totalWeekly;

  const totalOutgoings = round2(rent + food + power + other);
  const residual = round2(incomeWeekly - totalOutgoings);
  const residualIsDeficit = residual < 0;

  const pctOfIncomeOnRent =
    incomeWeekly <= 0 ? 0 : round2((rent / incomeWeekly) * 100);
  const pctOfIncomeOnOutgoings =
    incomeWeekly <= 0 ? 0 : round2((totalOutgoings / incomeWeekly) * 100);

  const pctOf = (value: number) =>
    incomeWeekly <= 0 ? 0 : round2((value / incomeWeekly) * 100);

  const breakdown: BudgetBreakdownLine[] = [
    {
      key: "rent",
      label: "Rent",
      value: rent,
      color: BREAKDOWN_COLORS.rent,
      pctOfIncome: pctOf(rent),
    },
    {
      key: "food",
      label: "Food",
      value: food,
      color: BREAKDOWN_COLORS.food,
      pctOfIncome: pctOf(food),
    },
    {
      key: "power",
      label: "Power",
      value: power,
      color: BREAKDOWN_COLORS.power,
      pctOfIncome: pctOf(power),
    },
    {
      key: "other",
      label: "Other",
      value: other,
      color: BREAKDOWN_COLORS.other,
      pctOfIncome: pctOf(other),
    },
  ];

  return {
    archetype,
    centre,
    basket,
    incomeWeekly,
    incomeBase,
    incomeUplift,
    rent,
    food,
    power,
    other,
    totalOutgoings,
    residual,
    residualIsDeficit,
    pctOfIncomeOnRent,
    pctOfIncomeOnOutgoings,
    breakdown,
  };
}

// ---------------------------------------------------------------------------
// Exported copy — single source of truth for the page and tests.
// ---------------------------------------------------------------------------

export const BUDGET_SOURCE_LINE =
  "Income: MSD benefit base rates (1 April 2026) via the Indexation Simulator. Rent: MBIE Tenancy Services median weekly rent of new tenancies (2026-03-01). Food: live Woolworths NZ basket prices (2026-06-05). Power & other essentials are adjustable estimates (MBIE average household electricity ≈ $2,400–2,600/yr ≈ ~$48–50/wk).";

export const BUDGET_DISCLAIMER =
  "Experimental and indicative only — not financial, legal or policy advice. Built for thecolab.ai 'Impact for Good'. Income is the benefit BASE rate only (excludes Working for Families and the Accommodation Supplement, so it understates true disposable income); rent is the MEDIAN MARKET rent for a whole tenancy, larger than a single person's room or board; power and other essentials are adjustable estimates, not measured figures. This composes the suite's other modules to show one household's weekly squeeze — always verify against the underlying sources.";
