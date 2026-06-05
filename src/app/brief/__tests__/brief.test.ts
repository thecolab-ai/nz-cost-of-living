import { describe, expect, it } from "vitest";

import { BASKETS, getBasket } from "@/lib/basket-data";
import {
  AHC_CHILD_POVERTY,
  CHILD_MATERIAL_HARDSHIP,
  KEY_FINDINGS,
  SUITE_SOURCES,
} from "@/lib/brief-data";
import { buildBudget } from "@/lib/budget-calc";
import { topByDeprivation } from "@/lib/deprivation-data";
import { getSeries } from "@/lib/energy-data";
import { getSubgroup } from "@/lib/food-price-data";
import { HOUSING_CENTRES } from "@/lib/housing-data";

const TOOL_ROUTES = [
  "/budget",
  "/simulator",
  "/grocery",
  "/basket",
  "/energy",
  "/housing",
  "/map",
];

/** Parse the first numeric token out of a "$38.79/wk" / "+7.8%/yr" string. */
const num = (value: string): number => Number(value.replace(/[^0-9.]/g, ""));

describe("State of Play brief data", () => {
  it("has at least eight findings", () => {
    expect(Array.isArray(KEY_FINDINGS)).toBe(true);
    expect(KEY_FINDINGS.length).toBeGreaterThanOrEqual(8);
  });

  it("every finding is fully and validly shaped", () => {
    for (const f of KEY_FINDINGS) {
      expect(typeof f.label).toBe("string");
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.value.length).toBeGreaterThan(0);
      expect(f.detail.length).toBeGreaterThan(0);
      expect(f.source.length).toBeGreaterThan(0);
      expect(f.href.startsWith("/")).toBe(true);
      expect(TOOL_ROUTES).toContain(f.href);
    }
  });

  it("reconciles the basket figure with basket-data", () => {
    const f = KEY_FINDINGS.find((x) => x.href === "/basket");
    expect(f).toBeDefined();
    const bare = getBasket("bare-staples");
    const fromBaskets = BASKETS.find((b) => b.key === "bare-staples");
    expect(fromBaskets?.totalWeekly).toBeCloseTo(bare.totalWeekly, 2);
    expect(num(f?.value ?? "")).toBeCloseTo(bare.totalWeekly, 2);
  });

  it("reconciles the energy figure with energy-data", () => {
    const f = KEY_FINDINGS.find((x) => x.href === "/energy");
    expect(num(f?.value ?? "")).toBeCloseTo(
      getSeries("electricity").annualPct,
      2,
    );
  });

  it("reconciles the housing coverage figure with housing-data", () => {
    const f = KEY_FINDINGS.find(
      (x) => x.href === "/housing" && x.value.includes("%"),
    );
    const akl = HOUSING_CENTRES.find((c) => c.name === "Auckland");
    expect(num(f?.value ?? "")).toBeCloseTo(akl?.asCoversFamilyPct ?? 0, 2);
  });

  it("reconciles the meat figure with food-price-data", () => {
    const f = KEY_FINDINGS.find((x) => x.href === "/grocery");
    expect(num(f?.value ?? "")).toBeCloseTo(
      getSubgroup("meat_poultry_fish").annualPct,
      2,
    );
  });

  it("reconciles the deprivation figure with deprivation-data", () => {
    const f = KEY_FINDINGS.find((x) => x.href === "/map");
    const worst = topByDeprivation("ta", 1)[0];
    expect(num(f?.value ?? "")).toBeCloseTo(worst.pct910, 2);
    expect(f?.label.includes("Kawerau") || f?.label.includes(worst.name)).toBe(
      true,
    );
  });

  it("reconciles the budget deficit by recomposing the suite", () => {
    const f = KEY_FINDINGS.find((x) => x.href === "/budget");
    const rep = buildBudget({
      archetypeId: "sole-parent-3kids",
      centreName: "Auckland",
      basketKey: "nutritious-family",
    });
    expect(rep.residualIsDeficit).toBe(true);
    expect(num(f?.value ?? "")).toBeCloseTo(Math.abs(rep.residual), 2);
  });

  it("reconciles the hardship and AHC findings with their named constants", () => {
    const hardship = KEY_FINDINGS.find((x) => x.href === "/simulator");
    const ahc = KEY_FINDINGS.find(
      (x) => x.href === "/housing" && x.label.includes("after housing"),
    );
    expect(num(hardship?.value ?? "")).toBe(CHILD_MATERIAL_HARDSHIP.count);
    expect(num(ahc?.value ?? "")).toBe(AHC_CHILD_POVERTY.count);
  });
});

describe("Suite sources", () => {
  it("covers every tool route", () => {
    const hrefs = new Set(SUITE_SOURCES.map((s) => s.href));
    for (const route of TOOL_ROUTES) {
      expect(hrefs.has(route)).toBe(true);
    }
  });

  it("every source has a non-empty sourceLine and date", () => {
    for (const s of SUITE_SOURCES) {
      expect(s.sourceLine.length).toBeGreaterThan(0);
      expect(s.date.length).toBeGreaterThan(0);
      expect(s.title.length).toBeGreaterThan(0);
    }
  });
});
