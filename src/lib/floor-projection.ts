// Indexation Impact Simulator — multi-year floor-vs-income drift projection.
// Pure, deterministic, side-effect-free. No React, no DOM, no recharts.
//
// Models the report's #1 driver made visible: household income is CPI-indexed
// (since the 2024 switch from wage-indexation) and grows slowly, while the
// basic-needs floor tracks a faster basket of beneficiary-household living costs.
// Even at maximum wage-indexation the floor still outpaces income — so the gap
// widens every year; the lever only changes the slope, not the direction.
//
// Sources: CPAG "Below the Income Floor" (2025), WEAG (2019), Stats NZ CPI /
// Household Living-Costs Price Indexes. Growth rates are stylised from the report.

import { calcImpact, round2 } from "@/lib/indexation-calc";
import type { Archetype, LeverSettings } from "@/lib/indexation-data";
import { WAGE_INDEX_MAX_PCT } from "@/lib/indexation-data";

// --- Documented growth-rate constants (no magic numbers in the page/chart) ---

// Main benefits are CPI-indexed since the 2024 switch away from wage-indexation.
export const CPI_GROWTH = 0.031; // 3.1%/yr — headline CPI / current indexation basis

// Wage growth — the pre-2024 indexation basis the 'restore wage-indexation' lever moves toward.
export const WAGE_GROWTH = 0.048; // 4.8%/yr

// Beneficiary-household living costs rose ~6.2% vs CPI ~4.7%; the basic-needs
// floor tracks this faster basket, so it climbs faster than income every year.
export const COST_GROWTH = 0.062; // 6.2%/yr — drives the floor upward faster than income

// Horizon defaults — inclusive year span, Year 0 plus projected years.
export const FIRST_YEAR = 2026;
export const HORIZON_YEARS = 7; // 2026..2032 (Year 0 + 6 projected years)
/** Default horizon length (years), inclusive of Year 0. */
export const DEFAULT_HORIZON = HORIZON_YEARS;

export interface ProjectGapOptions {
  /** First calendar year (Year 0 anchor). Defaults to FIRST_YEAR. */
  firstYear?: number;
  /** Inclusive number of years to project. Defaults to HORIZON_YEARS; coerced to >= 1. */
  years?: number;
}

export interface ProjectionPoint {
  /** Calendar year, e.g. 2026..2032. */
  year: number;
  /** Projected weekly income that year (round2). */
  income: number;
  /** Projected basic-needs floor that year (round2). */
  floor: number;
  /** round2(floor - income); positive = short of the floor. */
  gap: number;
  /** income >= floor that year. */
  crossed: boolean;
}

/** Clamp to [0, 1]; guards NaN / out-of-range input. */
function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * The income growth rate the household experiences, given the wage-indexation lever.
 *
 * At wageIndexPct = 0 income tracks CPI (3.1%); at the +15% max it tracks wage
 * growth (4.8%), interpolated linearly in between. The floor ALWAYS grows at
 * COST_GROWTH (6.2%), which exceeds even WAGE_GROWTH — so the gap still widens
 * every year even at max indexation, but more slowly.
 */
export function incomeGrowthRate(settings: LeverSettings): number {
  const frac = clamp01((settings.wageIndexPct ?? 0) / WAGE_INDEX_MAX_PCT); // 0 at 0%, 1 at 15%
  return CPI_GROWTH + frac * (WAGE_GROWTH - CPI_GROWTH); // 3.1% .. 4.8%
}

/**
 * Project the income-vs-floor gap year by year from explicit Year-0 anchors.
 *
 * Each series compounds independently from its OWN Year-0 anchor via Math.pow on
 * the year index (no accumulation drift between rows), then is round2'd. Year 0
 * (i = 0) returns income === calcImpact(...).newWeekly and floor ===
 * archetype.incomeFloorWeekly exactly, since pow(_, 0) === 1.
 *
 * Pure: no Date.now, no randomness, no mutation of inputs. Lever clamping is
 * delegated to calcImpact (clampSettings) for the Year-0 income anchor, so lever
 * bounds stay single-sourced.
 */
export function projectGap(
  archetype: Archetype,
  settings: LeverSettings,
  opts: ProjectGapOptions = {},
): ProjectionPoint[] {
  const firstYear = opts.firstYear ?? FIRST_YEAR;
  const years = Math.max(1, Math.floor(opts.years ?? HORIZON_YEARS));
  const incomeRate = incomeGrowthRate(settings);
  const income0 = calcImpact(archetype, settings).newWeekly; // Year-0 income (after settings)
  const floor0 = archetype.incomeFloorWeekly; // Year-0 floor (archetype anchor)

  const out: ProjectionPoint[] = [];
  for (let i = 0; i < years; i++) {
    const income = round2(income0 * (1 + incomeRate) ** i);
    const floor = round2(floor0 * (1 + COST_GROWTH) ** i);
    const gap = round2(floor - income);
    out.push({
      year: firstYear + i,
      income,
      floor,
      gap,
      crossed: income >= floor,
    });
  }
  return out;
}
