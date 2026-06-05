// Indexation Impact Simulator — pure, deterministic, side-effect-free calc module.
// No React, no DOM, no recharts. Fully unit-testable.
// All numbers come from indexation-data.ts — no magic numbers here.

import {
  type Archetype,
  IWTC_PER_CHILD_WEEKLY,
  type LeverSettings,
  WAGE_INDEX_MAX_PCT,
  WEAG_STEPS,
} from "./indexation-data";

export const DEFAULT_SETTINGS: LeverSettings = {
  wageIndexPct: 0,
  iwtcExtended: false,
  weagLiftPct: 0,
};

/** Round to 2 decimal places, epsilon-safe so e.g. 1.005 rounds to 1.01. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Bound/normalise raw lever settings into the supported ranges. */
export function clampSettings(settings: LeverSettings): LeverSettings {
  const wageIndexPct = clamp(
    Number.isFinite(settings.wageIndexPct) ? settings.wageIndexPct : 0,
    0,
    WAGE_INDEX_MAX_PCT,
  );

  // Snap WEAG lift to the nearest allowed step [0, 12, 25, 47].
  const raw = Number.isFinite(settings.weagLiftPct) ? settings.weagLiftPct : 0;
  const weagLiftPct = WEAG_STEPS.reduce((nearest, step) =>
    Math.abs(step - raw) < Math.abs(nearest - raw) ? step : nearest,
  );

  return {
    wageIndexPct,
    iwtcExtended: Boolean(settings.iwtcExtended),
    weagLiftPct,
  };
}

export interface ImpactComponents {
  base: number;
  wageIndexAdd: number;
  weagAdd: number;
  iwtcAdd: number;
}

export interface ImpactResult {
  baseWeekly: number;
  newWeekly: number;
  /** floor - base. Positive = short of the floor. */
  baseGap: number;
  /** floor - newWeekly. Can go negative once above the floor. */
  newGap: number;
  /** newWeekly - base. */
  delta: number;
  crossedFloor: boolean;
  components: ImpactComponents;
}

/**
 * Deterministic, pure impact calculation.
 *
 * The wage-index and WEAG levers are both modelled as percentage uplifts on the
 * SAME base (archetype.currentNetWeekly), applied ADDITIVELY — not compounded —
 * so each slider's dollar effect is independent and legible. This is the
 * transparent, defensible choice for a policy demo, not a Treasury microsimulation.
 *
 * ACCURACY-CRITICAL: the wage-index and WEAG levers are BENEFIT-policy levers.
 * They apply ONLY when archetype.isBeneficiary === true. For non-beneficiary
 * (wage/salary) archetypes they contribute $0 — a wage earner's income does not
 * change because benefit-uprating policy changes, and modelling otherwise would
 * be a false output. So for every employed archetype (including the working
 * minimum-wage couple) all three benefit levers are no-ops and newWeekly stays
 * at currentNetWeekly.
 *
 * The IWTC toggle only adds income for benefit-dependent households
 * (hasWorkingParent === false): the report's $50/wk in-work tax credit already
 * reaches working families and excludes beneficiary children, so this lever
 * closes that gap. Working households and childless households get $0 from it.
 */
export function calcImpact(
  archetype: Archetype,
  settings: LeverSettings,
): ImpactResult {
  const s = clampSettings(settings);

  const base = archetype.currentNetWeekly;
  const floor = archetype.incomeFloorWeekly;

  // Benefit-policy levers (wage-index, WEAG) only move a beneficiary household's
  // income. For wage/salary earners they are no-ops (see header note).
  const isBeneficiary = archetype.isBeneficiary === true;

  // Lever 1 — restore wage-indexation (percentage uplift on base).
  const wageIndexAdd = isBeneficiary
    ? round2(base * (s.wageIndexPct / 100))
    : 0;

  // Lever 3 — lift toward WEAG benchmark (stepped percentage uplift on base).
  const weagAdd = isBeneficiary ? round2(base * (s.weagLiftPct / 100)) : 0;

  // Lever 2 — extend IWTC/WfF to beneficiary children (per-child flat credit).
  const isBeneficiaryHousehold = archetype.hasWorkingParent === false;
  const iwtcAdd =
    s.iwtcExtended && isBeneficiaryHousehold
      ? round2(IWTC_PER_CHILD_WEEKLY * archetype.children)
      : 0;

  const newWeekly = round2(base + wageIndexAdd + weagAdd + iwtcAdd);
  const baseGap = round2(floor - base);
  const newGap = round2(floor - newWeekly);
  const delta = round2(newWeekly - base);
  const crossedFloor = newWeekly >= floor;

  return {
    baseWeekly: round2(base),
    newWeekly,
    baseGap,
    newGap,
    delta,
    crossedFloor,
    components: {
      base: round2(base),
      wageIndexAdd,
      weagAdd,
      iwtcAdd,
    },
  };
}
