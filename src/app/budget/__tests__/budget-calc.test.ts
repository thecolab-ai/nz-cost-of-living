import { describe, expect, it } from "vitest";

import { getBasket } from "@/lib/basket-data";
import {
  DEFAULT_OTHER_WEEKLY,
  DEFAULT_POWER_WEEKLY,
  buildBudget,
  clamp,
  defaultBasketFor,
  round2,
} from "@/lib/budget-calc";
import { HOUSING_CENTRES } from "@/lib/housing-data";
import { ARCHETYPES } from "@/lib/indexation-data";

const archetype = (id: string) => {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype: ${id}`);
  return a;
};
const centre = (name: string) => {
  const c = HOUSING_CENTRES.find((x) => x.name === name);
  if (!c) throw new Error(`Unknown centre: ${name}`);
  return c;
};

describe("round2", () => {
  it("is epsilon-safe", () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(2.345)).toBe(2.35);
  });
});

describe("clamp", () => {
  it("bounds and handles NaN", () => {
    expect(clamp(-5, 0, 120)).toBe(0);
    expect(clamp(999, 0, 120)).toBe(120);
    expect(clamp(Number.NaN, 0, 120)).toBe(0);
    expect(clamp(50, 0, 120)).toBe(50);
  });
});

describe("defaultBasketFor", () => {
  it("seeds bare-staples for childless and nutritious-family for children", () => {
    expect(defaultBasketFor(archetype("single-jobseeker"))).toBe(
      "bare-staples",
    );
    expect(defaultBasketFor(archetype("sole-parent-3kids"))).toBe(
      "nutritious-family",
    );
  });
});

describe("buildBudget defaults", () => {
  it("applies DEFAULT power/other when omitted", () => {
    const b = buildBudget({
      archetypeId: "single-jobseeker",
      centreName: "Auckland",
      basketKey: "bare-staples",
    });
    expect(b.power).toBe(DEFAULT_POWER_WEEKLY);
    expect(b.other).toBe(DEFAULT_OTHER_WEEKLY);
  });
});

describe("buildBudget composition (deficit path)", () => {
  const b = buildBudget({
    archetypeId: "single-jobseeker",
    centreName: "Auckland",
    basketKey: "bare-staples",
    powerWeekly: 50,
    otherWeekly: 60,
  });

  it("sums outgoings from the source libraries", () => {
    const expected = round2(
      centre("Auckland").rentWeekly +
        getBasket("bare-staples").totalWeekly +
        50 +
        60,
    );
    expect(b.totalOutgoings).toBe(expected);
  });

  it("uses the base income with no lever", () => {
    expect(b.incomeWeekly).toBe(
      round2(archetype("single-jobseeker").currentNetWeekly),
    );
    expect(b.incomeUplift).toBe(0);
  });

  it("residual = income - outgoings and is a deficit", () => {
    expect(b.residual).toBe(round2(b.incomeWeekly - b.totalOutgoings));
    expect(b.residualIsDeficit).toBe(true);
  });

  it("rent share exceeds 100% (rent alone outruns income)", () => {
    expect(b.pctOfIncomeOnRent).toBe(
      round2((centre("Auckland").rentWeekly / b.incomeWeekly) * 100),
    );
    expect(b.pctOfIncomeOnRent).toBeGreaterThan(100);
    expect(Number.isFinite(b.pctOfIncomeOnRent)).toBe(true);
  });
});

describe("buildBudget surplus path", () => {
  it("goes positive for a working couple in a low-rent centre", () => {
    const b = buildBudget({
      archetypeId: "minwage-couple-2kids",
      centreName: "Invercargill",
      basketKey: "bare-staples",
      powerWeekly: 0,
      otherWeekly: 0,
    });
    const expectedOutgoings = round2(
      centre("Invercargill").rentWeekly + getBasket("bare-staples").totalWeekly,
    );
    expect(b.totalOutgoings).toBe(expectedOutgoings);
    expect(b.residual).toBe(
      round2(
        archetype("minwage-couple-2kids").currentNetWeekly - expectedOutgoings,
      ),
    );
    expect(b.residual).toBeGreaterThanOrEqual(0);
    expect(b.residualIsDeficit).toBe(false);
  });
});

describe("buildBudget wage-index lever", () => {
  it("lifts income additively, matching calcImpact", () => {
    const a = archetype("single-jobseeker");
    const b = buildBudget({
      archetypeId: "single-jobseeker",
      centreName: "Auckland",
      basketKey: "bare-staples",
      wageIndexPct: 15,
    });
    expect(b.incomeWeekly).toBeGreaterThan(b.incomeBase);
    expect(b.incomeUplift).toBe(round2(b.incomeWeekly - b.incomeBase));
    expect(b.incomeUplift).toBe(round2(a.currentNetWeekly * 0.15));
  });
});

describe("buildBudget defensive fallbacks", () => {
  it("falls back to the first centre for an unknown name", () => {
    const b = buildBudget({
      archetypeId: "single-jobseeker",
      centreName: "Nowhere",
      basketKey: "bare-staples",
    });
    expect(b.centre).toBe(HOUSING_CENTRES[0]);
  });

  it("falls back to the first archetype for an unknown id", () => {
    const b = buildBudget({
      // deliberately invalid id to exercise the fallback
      archetypeId: "ghost" as never,
      centreName: "Auckland",
      basketKey: "bare-staples",
    });
    expect(b.archetype).toBe(ARCHETYPES[0]);
  });
});

describe("buildBudget breakdown integrity", () => {
  it("has 4 lines summing to total outgoings, with consistent pctOfIncome", () => {
    const b = buildBudget({
      archetypeId: "sole-parent-3kids",
      centreName: "Wellington City",
      basketKey: "nutritious-family",
    });
    expect(b.breakdown).toHaveLength(4);
    const sum = round2(b.breakdown.reduce((acc, line) => acc + line.value, 0));
    expect(sum).toBe(b.totalOutgoings);
    for (const line of b.breakdown) {
      expect(line.pctOfIncome).toBe(
        round2((line.value / b.incomeWeekly) * 100),
      );
      expect(Number.isFinite(line.pctOfIncome)).toBe(true);
    }
  });
});
