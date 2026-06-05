import { describe, expect, it } from "vitest";

import {
  DEPRIVATION_CONTEXT,
  DEPRIVATION_DISCLAIMER,
  DEPRIVATION_META,
  DEPRIVATION_SOURCE_LINE,
  NATIONAL_BASELINE_PCT,
  REGIONS,
  TERRITORIAL_AUTHORITIES,
  areasFor,
  depBand,
  depColor,
  overIndex,
  round1,
  topByDeprivation,
} from "@/lib/deprivation-data";

describe("deprivation data integrity", () => {
  it("has 67 territorial authorities with unique names", () => {
    expect(TERRITORIAL_AUTHORITIES.length).toBe(67);
    const names = TERRITORIAL_AUTHORITIES.map((a) => a.name);
    expect(new Set(names).size).toBe(67);
  });

  it("has 16 regions with unique names", () => {
    expect(REGIONS.length).toBe(16);
    const names = REGIONS.map((a) => a.name);
    expect(new Set(names).size).toBe(16);
  });

  it("every row is finite with valid ranges (zeros allowed)", () => {
    for (const a of [...TERRITORIAL_AUTHORITIES, ...REGIONS]) {
      expect(Number.isFinite(a.pct910)).toBe(true);
      expect(Number.isFinite(a.meanDecile)).toBe(true);
      expect(Number.isFinite(a.pop)).toBe(true);
      expect(a.pct910).toBeGreaterThanOrEqual(0);
      expect(a.pct910).toBeLessThanOrEqual(100);
      expect(a.pop).toBeGreaterThan(0);
      expect(a.meanDecile).toBeGreaterThanOrEqual(1);
      expect(a.meanDecile).toBeLessThanOrEqual(10);
    }
  });

  it("territorial authorities are pre-sorted desc by pct910", () => {
    for (let i = 1; i < TERRITORIAL_AUTHORITIES.length; i++) {
      expect(TERRITORIAL_AUTHORITIES[i].pct910).toBeLessThanOrEqual(
        TERRITORIAL_AUTHORITIES[i - 1].pct910,
      );
    }
  });

  it("regions are pre-sorted desc by pct910", () => {
    for (let i = 1; i < REGIONS.length; i++) {
      expect(REGIONS[i].pct910).toBeLessThanOrEqual(REGIONS[i - 1].pct910);
    }
  });

  it("Kawerau District is the worst TA at 78.0", () => {
    expect(TERRITORIAL_AUTHORITIES[0].name).toBe("Kawerau District");
    expect(TERRITORIAL_AUTHORITIES[0].pct910).toBe(78.0);
  });

  it("Ōpōtiki is present with macron at 69.3", () => {
    const opotiki = TERRITORIAL_AUTHORITIES.find((a) =>
      a.name.startsWith("Ōpōtiki"),
    );
    expect(opotiki).toBeDefined();
    expect(opotiki?.pct910).toBe(69.3);
  });

  it("Gisborne Region leads the regions at 47.8", () => {
    expect(REGIONS[0].name).toBe("Gisborne Region");
    expect(REGIONS[0].pct910).toBe(47.8);
  });
});

describe("deprivation helpers", () => {
  it("topByDeprivation('ta', 15) returns the 15 highest, non-increasing", () => {
    const top = topByDeprivation("ta", 15);
    expect(top.length).toBe(15);
    expect(top[0].name).toContain("Kawerau");
    for (let i = 1; i < top.length; i++) {
      expect(top[i].pct910).toBeLessThanOrEqual(top[i - 1].pct910);
    }
  });

  it("topByDeprivation does NOT mutate the source array", () => {
    const before = TERRITORIAL_AUTHORITIES.map((a) => a.name);
    topByDeprivation("ta", 15);
    topByDeprivation("region");
    expect(TERRITORIAL_AUTHORITIES.map((a) => a.name)).toEqual(before);
  });

  it("areasFor returns the right geography", () => {
    expect(areasFor("region")).toBe(REGIONS);
    expect(areasFor("ta")).toBe(TERRITORIAL_AUTHORITIES);
  });

  it("depColor grades on the heat ramp anchored at 20%", () => {
    expect(depColor(5)).toBe("#0EA5E9"); // cyan, below baseline
    expect(depColor(20)).toBe("#78716C"); // muted, at baseline
    expect(depColor(35)).toBe("#E08A4A"); // warm
    expect(depColor(45)).toBe("#C2410C"); // orange
    expect(depColor(78)).toBe("#7A1F08"); // dark, concentrated
  });

  it("depColor returns a hex string", () => {
    expect(depColor(50)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("depBand returns expected labels", () => {
    expect(depBand(5)).toBe("well below 20% baseline");
    expect(depBand(20)).toBe("near national 20% baseline");
    expect(depBand(45)).toBe("2–3× national share");
    expect(depBand(78)).toBe("concentrated deprivation");
  });

  it("overIndex expresses share over the national baseline", () => {
    expect(overIndex(78, 20)).toBe(3.9);
    expect(overIndex(78)).toBe(3.9);
  });

  it("round1 rounds to one decimal place", () => {
    expect(round1(27.45)).toBe(27.5);
    expect(round1(39.64)).toBe(39.6);
  });

  it("national baseline is 20", () => {
    expect(NATIONAL_BASELINE_PCT).toBe(20);
  });
});

describe("deprivation meta & strings", () => {
  it("officialMapUrl is an http(s) EHINZ url", () => {
    expect(DEPRIVATION_META.officialMapUrl.startsWith("http")).toBe(true);
    expect(DEPRIVATION_META.officialMapUrl).toContain("ehinz");
  });

  it("national population matches the 2023 Census figure", () => {
    expect(DEPRIVATION_META.nationalPop).toBe(4992801);
  });

  it("disclaimer is honest about the heat-view framing", () => {
    expect(DEPRIVATION_DISCLAIMER).toContain(
      "not a literal polygon choropleth",
    );
    expect(DEPRIVATION_DISCLAIMER).toContain("EHINZ");
    expect(DEPRIVATION_DISCLAIMER).toContain("20%");
  });

  it("has four context facts", () => {
    expect(DEPRIVATION_CONTEXT.length).toBe(4);
  });

  it("source line names the Otago NZDep2023 source", () => {
    expect(DEPRIVATION_SOURCE_LINE).toContain("Otago");
    expect(DEPRIVATION_SOURCE_LINE).toContain("NZDep2023");
  });
});
