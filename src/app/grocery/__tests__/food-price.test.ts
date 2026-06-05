import { describe, expect, it } from "vitest";

import {
  FOOD_SUBGROUPS,
  FPI_DATES,
  annualChangePct,
  cumulativeChangePct,
  getSubgroup,
  pctChange,
  rebaseToStart,
  round1,
  subgroupsBySqueeze,
} from "@/lib/food-price-data";

describe("food-price data integrity", () => {
  it("every subgroup series is aligned to the dates array (52 monthly points)", () => {
    expect(FPI_DATES.length).toBe(52);
    expect(FPI_DATES[0]).toBe("2022-01");
    expect(FPI_DATES.at(-1)).toBe("2026-04");
    for (const g of FOOD_SUBGROUPS) {
      expect(g.values.length, `${g.key} length`).toBe(FPI_DATES.length);
      expect(g.values.every((v) => Number.isFinite(v) && v > 0)).toBe(true);
    }
  });

  it("published latest annual change matches the index series (Apr 2026 vs Apr 2025)", () => {
    // Both numbers come from Stats NZ; this guards the series against drift.
    for (const g of FOOD_SUBGROUPS) {
      const fromSeries = annualChangePct(g.values);
      expect(fromSeries, `${g.key} annual`).not.toBeNull();
      expect(
        Math.abs((fromSeries as number) - g.annualPct),
      ).toBeLessThanOrEqual(0.15);
    }
  });
});

describe("helpers", () => {
  it("pctChange computes simple percentage change", () => {
    expect(pctChange(100, 110)).toBeCloseTo(10);
    expect(pctChange(200, 150)).toBeCloseTo(-25);
    expect(pctChange(0, 50)).toBe(0); // guard against divide-by-zero
  });

  it("round1 rounds to one decimal (epsilon-safe)", () => {
    expect(round1(2.65)).toBe(2.7);
    expect(round1(7.84)).toBe(7.8);
  });

  it("rebaseToStart makes the first point 100 and scales the rest", () => {
    expect(rebaseToStart([200, 300, 100])).toEqual([100, 150, 50]);
    const total = rebaseToStart(getSubgroup("total").values);
    expect(total[0]).toBe(100);
    expect(total.at(-1)).toBeGreaterThan(100); // food is up since Jan 2022
  });

  it("cumulativeChangePct reflects first->last move", () => {
    expect(cumulativeChangePct([100, 150])).toBe(50);
    const meat = cumulativeChangePct(getSubgroup("meat_poultry_fish").values);
    expect(meat).toBeGreaterThan(20); // meat ~+23% over the window
  });

  it("annualChangePct is null without 13 monthly points", () => {
    expect(annualChangePct([1, 2, 3])).toBeNull();
  });
});

describe("subgroupsBySqueeze", () => {
  it("ranks meat, poultry & fish as the sharpest current squeeze", () => {
    const ranked = subgroupsBySqueeze({ groceryOnly: true });
    expect(ranked[0].key).toBe("meat_poultry_fish");
    expect(ranked.some((g) => g.key === "total")).toBe(false); // total excluded
    expect(ranked.some((g) => g.key === "restaurant")).toBe(false); // grocery only
  });

  it("includes restaurant when not grocery-only", () => {
    const all = subgroupsBySqueeze();
    expect(all.some((g) => g.key === "restaurant")).toBe(true);
  });
});
