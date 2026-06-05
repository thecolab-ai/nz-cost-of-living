import { describe, expect, it } from "vitest";

import {
  COST_GROWTH,
  CPI_GROWTH,
  FIRST_YEAR,
  HORIZON_YEARS,
  WAGE_GROWTH,
  incomeGrowthRate,
  incomeGrowthRateFor,
  projectGap,
} from "@/lib/floor-projection";
import { calcImpact, round2 } from "@/lib/indexation-calc";
import {
  ARCHETYPES,
  type LeverSettings,
  WAGE_INDEX_MAX_PCT,
} from "@/lib/indexation-data";

function archetype(id: string) {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype ${id}`);
  return a;
}

const single = archetype("single-jobseeker");
const soleParent = archetype("sole-parent-3kids");
const minwageCouple = archetype("minwage-couple-2kids");
const single100k = archetype("single-100k");
const singleMinwage = archetype("single-minwage");

const zero: LeverSettings = {
  wageIndexPct: 0,
  iwtcExtended: false,
  weagLiftPct: 0,
};

describe("projectGap — year-0 anchoring", () => {
  it("year 0 equals calcImpact.newWeekly and archetype floor", () => {
    const p = projectGap(single, zero);
    const impact = calcImpact(single, zero);
    expect(p[0].year).toBe(FIRST_YEAR);
    expect(p[0].income).toBe(impact.newWeekly);
    expect(p[0].floor).toBe(single.incomeFloorWeekly);
    expect(p[0].gap).toBe(round2(p[0].floor - p[0].income));
    expect(p[0].crossed).toBe(false);
  });

  it("year-0 income tracks the levers (IWTC shifts the anchor)", () => {
    const settings: LeverSettings = { ...zero, iwtcExtended: true };
    const p = projectGap(soleParent, settings);
    expect(p[0].income).toBe(calcImpact(soleParent, settings).newWeekly);
  });
});

describe("projectGap — horizon", () => {
  it("defaults to HORIZON_YEARS spanning FIRST_YEAR..FIRST_YEAR+N-1", () => {
    const p = projectGap(single, zero);
    expect(p).toHaveLength(HORIZON_YEARS);
    expect(p[0].year).toBe(FIRST_YEAR);
    expect(p[p.length - 1].year).toBe(FIRST_YEAR + HORIZON_YEARS - 1);
  });

  it("respects opts.years", () => {
    expect(projectGap(single, zero, { years: 3 })).toHaveLength(3);
  });

  it("respects opts.firstYear", () => {
    const p = projectGap(single, zero, { firstYear: 2030, years: 2 });
    expect(p.map((x) => x.year)).toEqual([2030, 2031]);
  });

  it("coerces years < 1 to 1 and floors floats", () => {
    expect(projectGap(single, zero, { years: 0 })).toHaveLength(1);
    expect(projectGap(single, zero, { years: -5 })).toHaveLength(1);
    expect(projectGap(single, zero, { years: 3.9 })).toHaveLength(3);
  });
});

describe("incomeGrowthRate", () => {
  it("is CPI_GROWTH at 0% indexation", () => {
    expect(incomeGrowthRate(zero)).toBe(CPI_GROWTH);
  });

  it("is WAGE_GROWTH at the +15% max", () => {
    expect(
      incomeGrowthRate({ ...zero, wageIndexPct: WAGE_INDEX_MAX_PCT }),
    ).toBeCloseTo(WAGE_GROWTH, 10);
  });

  it("interpolates strictly between CPI and wage at the midpoint", () => {
    const mid = incomeGrowthRate({ ...zero, wageIndexPct: 7.5 });
    expect(mid).toBeGreaterThan(CPI_GROWTH);
    expect(mid).toBeLessThan(WAGE_GROWTH);
  });

  it("clamps out-of-range / NaN wageIndexPct", () => {
    expect(incomeGrowthRate({ ...zero, wageIndexPct: 99 })).toBeCloseTo(
      WAGE_GROWTH,
      10,
    );
    expect(incomeGrowthRate({ ...zero, wageIndexPct: -5 })).toBe(CPI_GROWTH);
    expect(incomeGrowthRate({ ...zero, wageIndexPct: Number.NaN })).toBe(
      CPI_GROWTH,
    );
  });
});

describe("incomeGrowthRateFor — employed vs beneficiary", () => {
  it("beneficiary tracks the lever-driven CPI→wage interpolation", () => {
    expect(incomeGrowthRateFor(single, zero)).toBe(incomeGrowthRate(zero));
    expect(
      incomeGrowthRateFor(single, { ...zero, wageIndexPct: WAGE_INDEX_MAX_PCT }),
    ).toBeCloseTo(WAGE_GROWTH, 10);
  });

  it("employed always tracks WAGE_GROWTH, regardless of the wage-index lever", () => {
    expect(incomeGrowthRateFor(single100k, zero)).toBe(WAGE_GROWTH);
    expect(
      incomeGrowthRateFor(single100k, {
        ...zero,
        wageIndexPct: WAGE_INDEX_MAX_PCT,
      }),
    ).toBe(WAGE_GROWTH);
    expect(incomeGrowthRateFor(singleMinwage, { ...zero, wageIndexPct: 7 })).toBe(
      WAGE_GROWTH,
    );
  });
});

describe("projectGap — employed archetypes", () => {
  it("single-100k starts above the floor and the wage-index lever does not change its income path", () => {
    const a = projectGap(single100k, zero);
    const b = projectGap(single100k, {
      ...zero,
      wageIndexPct: WAGE_INDEX_MAX_PCT,
    });
    expect(a[0].crossed).toBe(true);
    expect(a[0].gap).toBeLessThan(0); // above the floor
    // benefit lever is a no-op for a wage earner -> identical income series
    expect(a.map((p) => p.income)).toEqual(b.map((p) => p.income));
    // income grows at WAGE_GROWTH from the unchanged year-0 anchor
    expect(a[1].income).toBe(
      round2(single100k.currentNetWeekly * (1 + WAGE_GROWTH)),
    );
    // huge surplus: stays above the floor across the whole horizon
    expect(a[a.length - 1].crossed).toBe(true);
  });

  it("single full-time minimum wage starts above the floor", () => {
    const p = projectGap(singleMinwage, zero);
    expect(p[0].crossed).toBe(true);
    expect(p[0].income).toBe(singleMinwage.currentNetWeekly);
  });
});

describe("projectGap — drift thesis", () => {
  it("floor outpaces income so the gap widens every year at zero settings", () => {
    const p = projectGap(single, zero);
    for (let i = 0; i + 1 < p.length; i++) {
      expect(p[i + 1].gap).toBeGreaterThan(p[i].gap);
    }
  });

  it("even at max indexation the final-year gap exceeds year-0, but is smaller than at zero indexation", () => {
    const atZero = projectGap(single, zero);
    const atMax = projectGap(single, {
      ...zero,
      wageIndexPct: WAGE_INDEX_MAX_PCT,
    });
    const lastZero = atZero[atZero.length - 1];
    const lastMax = atMax[atMax.length - 1];
    // floor (6.2%) still beats wage (4.8%) -> still widening vs year 0
    expect(lastMax.gap).toBeGreaterThan(atMax[0].gap);
    // but the lever slows the drift
    expect(lastMax.gap).toBeLessThan(lastZero.gap);
  });

  it("the floor grows at COST_GROWTH regardless of settings", () => {
    const a = projectGap(single, zero);
    const b = projectGap(single, { ...zero, wageIndexPct: WAGE_INDEX_MAX_PCT });
    expect(a.map((p) => p.floor)).toEqual(b.map((p) => p.floor));
    expect(a[1].floor).toBe(
      round2(single.incomeFloorWeekly * (1 + COST_GROWTH)),
    );
  });
});

describe("projectGap — crossed flag", () => {
  it("minimum-wage couple starts short -> crossed false at year 0", () => {
    const p = projectGap(minwageCouple, zero);
    expect(p[0].crossed).toBe(false);
  });

  it("a household above the floor at year 0 drifts back below it later", () => {
    // single + WEAG +47% + IWTC is moot (no kids), so use a big wage lift case
    const settings: LeverSettings = {
      wageIndexPct: 0,
      iwtcExtended: false,
      weagLiftPct: 47,
    };
    const p = projectGap(single, settings);
    // year-0 income clears the floor with WEAG +47%
    expect(p[0].crossed).toBe(true);
    // crossed flag matches the income>=floor invariant every row
    for (const row of p) {
      expect(row.crossed).toBe(row.income >= row.floor);
    }
    // cost growth (6.2%) eventually overtakes income -> dips below by the horizon end
    expect(p[p.length - 1].crossed).toBe(false);
  });
});

describe("projectGap — precision, purity, invariants", () => {
  it("every income/floor/gap is round2-clean", () => {
    const p = projectGap(soleParent, { ...zero, weagLiftPct: 25 });
    for (const row of p) {
      expect(row.income).toBe(round2(row.income));
      expect(row.floor).toBe(round2(row.floor));
      expect(row.gap).toBe(round2(row.gap));
      expect(row.gap).toBe(round2(row.floor - row.income));
    }
  });

  it("is deterministic across calls with the same args", () => {
    expect(projectGap(single, zero)).toEqual(projectGap(single, zero));
  });

  it("does not mutate the input settings", () => {
    const settings: LeverSettings = { ...zero, wageIndexPct: 10 };
    const snapshot = { ...settings };
    projectGap(single, settings);
    expect(settings).toEqual(snapshot);
  });
});
