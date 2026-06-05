import { describe, expect, it } from "vitest";

import {
  BASKETS,
  BASKET_DATES,
  JOBSEEKER_SINGLE_WEEKLY,
  basketsByCost,
  cumulativeChangePct,
  getBasket,
  itemsTotal,
  pctOfJobseeker,
  round1,
  round2,
} from "@/lib/basket-data";

const INDIGO = "#2E4057";
const ORANGE = "#C2410C";
const CYAN = "#0EA5E9";

describe("basket data integrity", () => {
  it("has three baskets aligned to 52 monthly dates", () => {
    expect(BASKET_DATES.length).toBe(52);
    expect(BASKET_DATES[0]).toBe("2022-01");
    expect(BASKET_DATES.at(-1)).toBe("2026-04");
    expect(BASKETS.length).toBe(3);
    for (const b of BASKETS) {
      expect(b.costHistory.length, `${b.key} history length`).toBe(
        BASKET_DATES.length,
      );
      expect(
        b.costHistory.every((v) => Number.isFinite(v) && v > 0),
        `${b.key} finite positive`,
      ).toBe(true);
    }
  });

  it("history endpoint equals today's live total (the honesty contract)", () => {
    for (const b of BASKETS) {
      expect(b.costHistory.at(-1), `${b.key} endpoint`).toBeCloseTo(
        b.totalWeekly,
        2,
      );
    }
    expect(getBasket("bare-staples").costHistory.at(-1)).toBeCloseTo(38.79, 2);
    expect(getBasket("nutritious-family").costHistory.at(-1)).toBeCloseTo(
      109.69,
      2,
    );
    expect(getBasket("pantry-basics").costHistory.at(-1)).toBeCloseTo(47.13, 2);
  });

  it("item line costs sum to the weekly total within a cent", () => {
    for (const b of BASKETS) {
      expect(itemsTotal(b), `${b.key} items total`).toBeCloseTo(
        b.totalWeekly,
        2,
      );
      expect(b.items.length, `${b.key} item count`).toBe(b.itemCount);
    }
  });

  it("pctOfJobseeker matches embedded values and the benefit rate", () => {
    for (const b of BASKETS) {
      expect(pctOfJobseeker(b.totalWeekly), `${b.key} pct`).toBeCloseTo(
        b.pctOfJobseeker,
        1,
      );
    }
    expect(JOBSEEKER_SINGLE_WEEKLY).toBe(372.55);
    expect(pctOfJobseeker(372.55)).toBeCloseTo(100, 1);
  });

  it("assigns the agreed brand colours", () => {
    expect(getBasket("nutritious-family").color).toBe(INDIGO);
    expect(getBasket("bare-staples").color).toBe(ORANGE);
    expect(getBasket("pantry-basics").color).toBe(CYAN);
  });
});

describe("helpers", () => {
  it("round1 rounds to one decimal (epsilon-safe)", () => {
    expect(round1(33.45)).toBe(33.5);
    expect(round1(10.84)).toBe(10.8);
  });

  it("round2 rounds dollars to the cent (epsilon-safe)", () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(38.794)).toBe(38.79);
    expect(round2(7.77)).toBe(7.77);
  });

  it("cumulativeChangePct reflects first->last move", () => {
    expect(cumulativeChangePct([100, 150])).toBe(50);
    for (const b of BASKETS) {
      expect(
        cumulativeChangePct(b.costHistory),
        `${b.key} cumulative`,
      ).toBeGreaterThan(0);
    }
  });

  it("getBasket throws on an unknown key", () => {
    // @ts-expect-error testing the runtime guard with an invalid key
    expect(() => getBasket("nope")).toThrow();
  });

  it("basketsByCost ranks the dearest basket first, totals descending", () => {
    const ordered = basketsByCost();
    expect(ordered[0].key).toBe("nutritious-family");
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i - 1].totalWeekly).toBeGreaterThan(
        ordered[i].totalWeekly,
      );
    }
  });
});
