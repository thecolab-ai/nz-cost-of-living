import { describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  calcImpact,
  clampSettings,
  round2,
} from "@/lib/indexation-calc";
import { ARCHETYPES, type LeverSettings } from "@/lib/indexation-data";

function archetype(id: string) {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype ${id}`);
  return a;
}

const single = archetype("single-jobseeker");
const soleParent = archetype("sole-parent-3kids");
const coupleJobseeker = archetype("couple-jobseeker-2kids");
const minwageCouple = archetype("minwage-couple-2kids");

const zero: LeverSettings = {
  wageIndexPct: 0,
  iwtcExtended: false,
  weagLiftPct: 0,
};

describe("round2", () => {
  it("rounds to 2dp epsilon-safe", () => {
    expect(round2(372.555)).toBe(372.56);
    expect(round2(55.8825)).toBe(55.88);
    expect(round2(100)).toBe(100);
  });
});

describe("clampSettings", () => {
  it("bounds wageIndexPct to 0..15", () => {
    expect(clampSettings({ ...zero, wageIndexPct: -5 }).wageIndexPct).toBe(0);
    expect(clampSettings({ ...zero, wageIndexPct: 99 }).wageIndexPct).toBe(15);
    expect(clampSettings({ ...zero, wageIndexPct: 7 }).wageIndexPct).toBe(7);
  });

  it("snaps weagLiftPct to nearest of [0,12,25,47]", () => {
    expect(clampSettings({ ...zero, weagLiftPct: 5 }).weagLiftPct).toBe(0);
    expect(clampSettings({ ...zero, weagLiftPct: 10 }).weagLiftPct).toBe(12);
    expect(clampSettings({ ...zero, weagLiftPct: 20 }).weagLiftPct).toBe(25);
    expect(clampSettings({ ...zero, weagLiftPct: 40 }).weagLiftPct).toBe(47);
    expect(clampSettings({ ...zero, weagLiftPct: 99 }).weagLiftPct).toBe(47);
  });

  it("coerces iwtcExtended to boolean", () => {
    expect(clampSettings({ ...zero, iwtcExtended: true }).iwtcExtended).toBe(
      true,
    );
  });
});

describe("calcImpact — zero levers leave everything unchanged", () => {
  it("single jobseeker, all zero", () => {
    const r = calcImpact(single, zero);
    expect(r.baseWeekly).toBe(372.55);
    expect(r.newWeekly).toBe(372.55);
    expect(r.delta).toBe(0);
    expect(r.baseGap).toBe(100);
    expect(r.newGap).toBe(100);
    expect(r.crossedFloor).toBe(false);
  });

  it("DEFAULT_SETTINGS equals the zero case", () => {
    const r = calcImpact(single, DEFAULT_SETTINGS);
    expect(r.newWeekly).toBe(r.baseWeekly);
    expect(r.delta).toBe(0);
  });
});

describe("calcImpact — wage indexation raises income", () => {
  it("single jobseeker, +15% wage index", () => {
    const r = calcImpact(single, { ...zero, wageIndexPct: 15 });
    expect(r.components.wageIndexAdd).toBe(55.88);
    expect(r.newWeekly).toBe(428.43);
    expect(r.newGap).toBe(44.12);
    expect(r.crossedFloor).toBe(false);
    expect(r.newWeekly).toBeGreaterThan(r.baseWeekly);
  });
});

describe("calcImpact — IWTC toggle adds per-child credit only for beneficiary households", () => {
  it("sole parent (3 kids, beneficiary): +$150", () => {
    const r = calcImpact(soleParent, { ...zero, iwtcExtended: true });
    expect(r.components.iwtcAdd).toBe(150);
    expect(r.newWeekly).toBe(671.52);
    expect(r.newGap).toBe(50);
    expect(r.crossedFloor).toBe(false);
  });

  it("couple jobseeker (2 kids, beneficiary): +$100", () => {
    const r = calcImpact(coupleJobseeker, { ...zero, iwtcExtended: true });
    expect(r.components.iwtcAdd).toBe(100);
    expect(r.newWeekly).toBe(720);
    expect(r.newGap).toBe(220);
  });

  it("minimum-wage couple (working parent): $0 from the toggle", () => {
    const r = calcImpact(minwageCouple, { ...zero, iwtcExtended: true });
    expect(r.components.iwtcAdd).toBe(0);
    expect(r.newWeekly).toBe(880);
    expect(r.newGap).toBe(50);
  });

  it("childless single jobseeker: $0 from the toggle (no children)", () => {
    const r = calcImpact(single, { ...zero, iwtcExtended: true });
    expect(r.components.iwtcAdd).toBe(0);
    expect(r.newWeekly).toBe(372.55);
  });
});

describe("calcImpact — a large lever crosses the floor", () => {
  it("sole parent: IWTC + WEAG +47% clears the floor", () => {
    const r = calcImpact(soleParent, {
      wageIndexPct: 0,
      iwtcExtended: true,
      weagLiftPct: 47,
    });
    expect(r.components.weagAdd).toBe(245.11);
    expect(r.components.iwtcAdd).toBe(150);
    expect(r.newWeekly).toBe(916.63);
    expect(r.newGap).toBe(-195.11);
    expect(r.crossedFloor).toBe(true);
  });
});

describe("calcImpact — levers combine additively", () => {
  it("single jobseeker: wage index + WEAG add independently", () => {
    const r = calcImpact(single, {
      wageIndexPct: 15,
      iwtcExtended: false,
      weagLiftPct: 12,
    });
    expect(r.components.wageIndexAdd).toBe(55.88);
    expect(r.components.weagAdd).toBe(44.71);
    // 372.55 + 55.88 + 44.71 = 473.14
    expect(r.newWeekly).toBe(473.14);
    expect(r.crossedFloor).toBe(true);
  });
});
