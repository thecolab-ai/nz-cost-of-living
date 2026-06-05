import { describe, expect, it } from "vitest";

import {
  REPORT_GENERATED,
  REPORT_SECTIONS,
  REPORT_TITLE,
} from "@/lib/report-content";

const EXPECTED_IDS = [
  "exec",
  "baseline",
  "income",
  "food",
  "housing",
  "energy",
  "deprivation",
  "compounding",
  "whatworks",
  "recommendations",
  "confidence",
];

describe("report-content", () => {
  it("exposes a title and generated date", () => {
    expect(REPORT_TITLE.length).toBeGreaterThan(0);
    expect(REPORT_GENERATED).toBe("5 June 2026");
  });

  it("has all 11 section ids in the expected order", () => {
    expect(REPORT_SECTIONS.map((s) => s.id)).toEqual(EXPECTED_IDS);
  });

  it("gives every section a title, subhead and non-empty paragraphs", () => {
    for (const section of REPORT_SECTIONS) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.subhead.length).toBeGreaterThan(0);
      expect(section.paragraphs.length).toBeGreaterThan(0);
      for (const para of section.paragraphs) {
        expect(para.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("gives every stat a value, label and source", () => {
    for (const section of REPORT_SECTIONS) {
      for (const stat of section.stats) {
        expect(stat.value.trim().length).toBeGreaterThan(0);
        expect(stat.label.trim().length).toBeGreaterThan(0);
        expect(stat.source.trim().length).toBeGreaterThan(0);
        expect(stat.calculation.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("gives every section at least one source", () => {
    for (const section of REPORT_SECTIONS) {
      expect(section.sources.length).toBeGreaterThan(0);
    }
  });

  it("has a recommendations section with at least 5 recommendations", () => {
    const recs = REPORT_SECTIONS.find((s) => s.id === "recommendations");
    expect(recs).toBeDefined();
    expect(recs?.recommendations?.length ?? 0).toBeGreaterThanOrEqual(5);
    for (const rec of recs?.recommendations ?? []) {
      expect(rec.action.trim().length).toBeGreaterThan(0);
      expect(rec.rationale.trim().length).toBeGreaterThan(0);
      expect(rec.leverage.trim().length).toBeGreaterThan(0);
    }
  });
});
