import { describe, expect, it } from "vitest";

import {
  ENERGY_SERIES,
  EPI_DATES,
  annualChangePct,
  cumulativeChangePct,
  getSeries,
  pctChange,
  rebaseToStart,
  round1,
} from "@/lib/energy-data";

const ORANGE = "#C2410C";

describe("energy data integrity", () => {
  it("every series is aligned to the dates array (88 monthly points)", () => {
    expect(EPI_DATES.length).toBe(88);
    expect(EPI_DATES[0]).toBe("2019-01");
    expect(EPI_DATES.at(-1)).toBe("2026-04");
    for (const s of ENERGY_SERIES) {
      expect(s.values.length, `${s.key} length`).toBe(EPI_DATES.length);
      expect(s.values.every((v) => Number.isFinite(v) && v > 0)).toBe(true);
    }
  });

  it("published latest annual change matches the index series (Apr 2026 vs Apr 2025)", () => {
    // Both numbers come from Stats NZ; this guards the series against drift.
    for (const s of ENERGY_SERIES) {
      const fromSeries = annualChangePct(s.values);
      expect(fromSeries, `${s.key} annual`).not.toBeNull();
      expect(
        Math.abs((fromSeries as number) - s.annualPct),
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
    expect(round1(33.45)).toBe(33.5);
    expect(round1(10.84)).toBe(10.8);
  });

  it("rebaseToStart makes the first point 100 and scales the rest", () => {
    expect(rebaseToStart([200, 300, 100])).toEqual([100, 150, 50]);
    const elec = rebaseToStart(getSeries("electricity").values);
    expect(elec[0]).toBe(100);
    expect(elec.at(-1)).toBeGreaterThan(100); // power is up since Jan 2019 (~133.5)
  });

  it("cumulativeChangePct reflects first->last move", () => {
    expect(cumulativeChangePct([100, 150])).toBe(50);
    const elec = cumulativeChangePct(getSeries("electricity").values);
    expect(elec).toBeGreaterThan(30); // electricity ~+33.5%
    const gas = cumulativeChangePct(getSeries("gas").values);
    expect(gas).toBeGreaterThan(50); // gas ~+61.5%
  });

  it("annualChangePct is null without 13 monthly points", () => {
    expect(annualChangePct([1, 2, 3])).toBeNull();
  });
});

describe("series ordering", () => {
  it("ranks electricity first (emphasised), gas second", () => {
    expect(ENERGY_SERIES[0].key).toBe("electricity");
    expect(ENERGY_SERIES[1].key).toBe("gas");
    expect(ENERGY_SERIES[0].color).toBe(ORANGE);
  });
});
