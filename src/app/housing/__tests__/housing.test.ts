import { describe, expect, it } from "vitest";

import {
  AS_MAX_BY_AREA,
  HOUSING_CENTRES,
  HOUSING_CONTEXT,
  HOUSING_DISCLAIMER,
  HOUSING_META,
  HOUSING_SOURCES,
  asCoversPct,
  asMaxFor,
  residualGap,
  round1,
  sortByCoverage,
  sortByResidual,
} from "@/lib/housing-data";

describe("housing data integrity", () => {
  it("has 15 centres with unique names", () => {
    expect(HOUSING_CENTRES.length).toBe(15);
    const names = HOUSING_CENTRES.map((c) => c.name);
    expect(new Set(names).size).toBe(15);
  });

  it("every numeric field is finite and > 0", () => {
    for (const c of HOUSING_CENTRES) {
      for (const v of [
        c.asArea,
        c.rentWeekly,
        c.asMaxFamily,
        c.asMaxSingle,
        c.asCoversFamilyPct,
        c.residualFamily,
      ]) {
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThan(0);
      }
    }
  });

  it("rent = AS max + residual per centre (stacked bar identity)", () => {
    for (const c of HOUSING_CENTRES) {
      expect(c.asMaxFamily + c.residualFamily).toBe(c.rentWeekly);
    }
  });

  it("rent always exceeds the family AS max", () => {
    for (const c of HOUSING_CENTRES) {
      expect(c.rentWeekly).toBeGreaterThan(c.asMaxFamily);
    }
  });

  it("area caps wired correctly for family and single", () => {
    for (const c of HOUSING_CENTRES) {
      expect(c.asMaxFamily).toBe(
        AS_MAX_BY_AREA.family_2plus_children[c.asArea],
      );
      expect(c.asMaxSingle).toBe(AS_MAX_BY_AREA.single_no_children[c.asArea]);
    }
  });

  it("published coverage % matches recomputed (drift guard)", () => {
    for (const c of HOUSING_CENTRES) {
      expect(
        Math.abs(
          asCoversPct(c.asMaxFamily, c.rentWeekly) - c.asCoversFamilyPct,
        ),
      ).toBeLessThanOrEqual(0.15);
    }
  });

  it("rents are whole-dollar published medians", () => {
    for (const c of HOUSING_CENTRES) {
      expect(Number.isInteger(c.rentWeekly)).toBe(true);
    }
  });
});

describe("housing helpers", () => {
  it("sortByResidual ranks worst gap first, smallest last", () => {
    const ranked = sortByResidual();
    expect(ranked[0].name).toBe("Queenstown-Lakes");
    expect(ranked[0].residualFamily).toBe(445);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].residualFamily).toBeLessThanOrEqual(
        ranked[i - 1].residualFamily,
      );
    }
  });

  it("sortByCoverage ranks worst coverage first, ascending", () => {
    const ranked = sortByCoverage();
    expect(ranked[0].name).toBe("Invercargill");
    expect(ranked[0].asCoversFamilyPct).toBe(24.7);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].asCoversFamilyPct).toBeGreaterThanOrEqual(
        ranked[i - 1].asCoversFamilyPct,
      );
    }
  });

  it("does not mutate the source array", () => {
    const before = HOUSING_CENTRES.map((c) => c.name);
    sortByResidual();
    sortByCoverage();
    expect(HOUSING_CENTRES.map((c) => c.name)).toEqual(before);
  });

  it("asCoversPct computes and is divide-by-zero safe", () => {
    expect(asCoversPct(305, 770)).toBe(39.6);
    expect(asCoversPct(10, 0)).toBe(0);
  });

  it("residualGap subtracts and clamps at zero", () => {
    expect(residualGap(770, 305)).toBe(465);
    expect(residualGap(100, 300)).toBe(0);
  });

  it("round1 rounds to one decimal place", () => {
    expect(round1(27.45)).toBe(27.5);
    expect(round1(39.64)).toBe(39.6);
  });

  it("asMaxFor looks up the right cap", () => {
    expect(asMaxFor("family_2plus_children", 1)).toBe(305);
    expect(asMaxFor("single_no_children", 3)).toBe(80);
  });
});

describe("housing meta & strings", () => {
  it("rentMethod states the rents are real published medians", () => {
    expect(HOUSING_META.rentMethod).toContain("REAL");
    expect(HOUSING_META.rentMethod).toContain("median");
    expect(HOUSING_META.rentPeriod).toBe("2026-03-01");
  });

  it("disclaimer embeds the rentMethod text", () => {
    expect(HOUSING_DISCLAIMER).toContain(HOUSING_META.rentMethod);
  });

  it("every source is an http(s) url", () => {
    for (const s of HOUSING_SOURCES) {
      expect(s.startsWith("http")).toBe(true);
    }
  });

  it("has four context facts", () => {
    expect(HOUSING_CONTEXT.length).toBe(4);
  });
});
