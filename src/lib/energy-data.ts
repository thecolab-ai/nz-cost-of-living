/**
 * Stats NZ power prices — real published monthly index levels for electricity
 * and reticulated (mains) gas.
 *
 * Source: Stats NZ "Selected price indexes — April 2026"
 *   https://www.stats.govt.nz/information-releases/selected-price-indexes-april-2026/
 *   (CPI Level 3 classes — Electricity CPIM.SE904501, Gas CPIM.SE904502)
 * Base/reference: June 2017 quarter = 1000.
 * Granularity: monthly, 2019-01 → 2026-04 (88 points). Values are genuine
 * published index levels (not reconstructed), as published by Stats NZ.
 *
 * This is an experimental proof-of-concept for thecolab.ai "Impact for Good".
 * Always check figures against the original Stats NZ source before relying on them.
 */

export const EPI_BASE = "Index, June 2017 quarter = 1000";
export const EPI_LATEST_LABEL = "April 2026";
export const EPI_GRANULARITY = "monthly" as const;
export const EPI_SOURCE_URL =
  "https://www.stats.govt.nz/information-releases/selected-price-indexes-april-2026/";

export type EnergySeriesKey = "electricity" | "gas";

export interface EnergySeries {
  key: EnergySeriesKey;
  label: string;
  /** Short label for chips / compact UI. */
  shortLabel: string;
  /** Brand-aligned line colour. */
  color: string;
  /** Latest annual % change (to April 2026), as published by Stats NZ. */
  annualPct: number;
  /** Cumulative % change since January 2019. */
  cumulativePct: number;
  /** Monthly index levels, aligned to EPI_DATES. */
  values: number[];
}

/** YYYY-MM, aligned to every series' `values` array (88 points). */
export const EPI_DATES: string[] = [
  "2019-01",
  "2019-02",
  "2019-03",
  "2019-04",
  "2019-05",
  "2019-06",
  "2019-07",
  "2019-08",
  "2019-09",
  "2019-10",
  "2019-11",
  "2019-12",
  "2020-01",
  "2020-02",
  "2020-03",
  "2020-04",
  "2020-05",
  "2020-06",
  "2020-07",
  "2020-08",
  "2020-09",
  "2020-10",
  "2020-11",
  "2020-12",
  "2021-01",
  "2021-02",
  "2021-03",
  "2021-04",
  "2021-05",
  "2021-06",
  "2021-07",
  "2021-08",
  "2021-09",
  "2021-10",
  "2021-11",
  "2021-12",
  "2022-01",
  "2022-02",
  "2022-03",
  "2022-04",
  "2022-05",
  "2022-06",
  "2022-07",
  "2022-08",
  "2022-09",
  "2022-10",
  "2022-11",
  "2022-12",
  "2023-01",
  "2023-02",
  "2023-03",
  "2023-04",
  "2023-05",
  "2023-06",
  "2023-07",
  "2023-08",
  "2023-09",
  "2023-10",
  "2023-11",
  "2023-12",
  "2024-01",
  "2024-02",
  "2024-03",
  "2024-04",
  "2024-05",
  "2024-06",
  "2024-07",
  "2024-08",
  "2024-09",
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
  "2025-06",
  "2025-07",
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
];

// Brand palette (matches src/lib/food-price-data.ts).
const C = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  teal: "#0F766E",
  stone: "#A8A29E",
} as const;

// Genuine published monthly index levels, aligned to EPI_DATES (88 points each).
const SERIES: Record<EnergySeriesKey, number[]> = {
  electricity: [
    1038.0, 1038.0, 1038.0, 1043.0, 1043.0, 1043.0, 1041.0, 1041.0, 1041.0,
    1039.0, 1039.0, 1039.0, 1052.0, 1052.0, 1052.0, 1053.0, 1059.0, 1059.0,
    1057.0, 1057.0, 1057.0, 1044.0, 1044.0, 1044.0, 1048.0, 1048.0, 1048.0,
    1051.0, 1051.0, 1051.0, 1049.0, 1049.0, 1049.0, 1037.0, 1037.0, 1037.0,
    1051.0, 1051.0, 1051.0, 1069.0, 1069.0, 1069.0, 1052.0, 1052.0, 1052.0,
    1062.0, 1062.0, 1062.0, 1085.0, 1085.0, 1085.0, 1114.0, 1114.0, 1114.0,
    1094.0, 1094.0, 1094.0, 1114.0, 1114.0, 1114.0, 1119.0, 1119.0, 1119.0,
    1153.0, 1153.0, 1153.0, 1159.0, 1159.0, 1159.0, 1162.0, 1158.0, 1176.0,
    1187.0, 1188.0, 1197.0, 1225.0, 1253.0, 1273.0, 1286.0, 1291.0, 1293.0,
    1299.0, 1300.0, 1320.0, 1324.0, 1345.0, 1354.0, 1386.0,
  ],
  gas: [
    1035.0, 1035.0, 1036.0, 1035.0, 1035.0, 1035.0, 1036.0, 1038.0, 1041.0,
    1059.0, 1059.0, 1059.0, 1058.0, 1058.0, 1060.0, 1055.0, 1052.0, 1052.0,
    1051.0, 1051.0, 1051.0, 1053.0, 1053.0, 1053.0, 1054.0, 1054.0, 1054.0,
    1058.0, 1055.0, 1058.0, 1050.0, 1056.0, 1059.0, 1060.0, 1060.0, 1058.0,
    1068.0, 1069.0, 1072.0, 1091.0, 1103.0, 1093.0, 1113.0, 1115.0, 1101.0,
    1141.0, 1129.0, 1142.0, 1189.0, 1162.0, 1197.0, 1201.0, 1214.0, 1204.0,
    1237.0, 1253.0, 1242.0, 1291.0, 1277.0, 1291.0, 1303.0, 1276.0, 1303.0,
    1303.0, 1317.0, 1308.0, 1339.0, 1340.0, 1329.0, 1385.0, 1381.0, 1404.0,
    1445.0, 1461.0, 1493.0, 1509.0, 1520.0, 1522.0, 1528.0, 1534.0, 1555.0,
    1585.0, 1620.0, 1650.0, 1649.0, 1653.0, 1667.0, 1672.0,
  ],
};

const META: Record<EnergySeriesKey, Omit<EnergySeries, "values">> = {
  electricity: {
    key: "electricity",
    label: "Electricity",
    shortLabel: "Electricity",
    color: C.orange, // emphasised
    annualPct: 13.1,
    cumulativePct: 33.5,
  },
  gas: {
    key: "gas",
    label: "Reticulated/mains gas",
    shortLabel: "Gas",
    color: C.indigo,
    annualPct: 10.8,
    cumulativePct: 61.5,
  },
};

const SERIES_ORDER: EnergySeriesKey[] = ["electricity", "gas"];

/** Exported, dates-aligned series (single source of truth). */
export const ENERGY_SERIES: EnergySeries[] = SERIES_ORDER.map((key) => ({
  ...META[key],
  values: SERIES[key],
}));

export function getSeries(key: EnergySeriesKey): EnergySeries {
  const s = ENERGY_SERIES.find((g) => g.key === key);
  if (!s) throw new Error(`Unknown energy series: ${key}`);
  return s;
}

/** The "poverty premium" range on power, for display and tests. */
export const ENERGY_POVERTY_PREMIUM_PCT = "11–17%";
export const POVERTY_PREMIUM_LOW = 11;
export const POVERTY_PREMIUM_HIGH = 17;

/** Sourced contextual facts for a low-income framing. */
export const ENERGY_CONTEXT_FACTS: { fact: string; source: string }[] = [
  {
    fact: "Electricity was the single largest upward contributor to annual CPI inflation, up 12.5% in the March 2026 quarter — the steepest rise since 1989 — and accounted for more than a tenth of the 3.1% headline inflation.",
    source: "Stats NZ Consumers Price Index, March 2026 quarter",
  },
  {
    fact: "The poorest households pay a 'poverty premium' on power: prepay/credit meter tariffs run about 11–17% more per unit than the cheapest plans low-income families can't access.",
    source: "thecolab.ai poverty report (Driver 7: the poverty premium)",
  },
  {
    fact: "Electricity takes about 7.5%+ of the poorest households' income, versus under 1.5% for the richest — so the same price rise hits hardest where there is least slack.",
    source: "thecolab.ai poverty report",
  },
  {
    fact: "Around 1 in 3 households report some energy hardship (going without heating to save money); benefits are indexed to general CPI, which lags energy inflation.",
    source: "thecolab.ai poverty report (Driver 4: energy & fuel hardship)",
  },
];

export const ENERGY_SOURCE_LINE =
  "Source: Stats NZ Selected Price Indexes (CPI Level 3 classes), April 2026 — Electricity CPIM.SE904501, Gas CPIM.SE904502. Index base: June 2017 quarter = 1000.";

export const ENERGY_DISCLAIMER =
  "Experimental and indicative only — not financial, legal or policy advice. Built for thecolab.ai 'Impact for Good'. Figures are genuine published Stats NZ Selected Price Index levels (April 2026 release); always verify against the original Stats NZ source before relying on them.";

// ---------------------------------------------------------------------------
// Pure, testable helpers
// ---------------------------------------------------------------------------

export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/** Percentage change from `from` to `to`, e.g. pctChange(100, 110) === 10. */
export function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}

/**
 * Rebase a series so the value at `baseIndex` (default 0) becomes 100.
 * Makes divergence between categories legible from a common start.
 */
export function rebaseToStart(values: number[], baseIndex = 0): number[] {
  const base = values[baseIndex];
  if (!base) return values.map(() => 0);
  return values.map((v) => round1((v / base) * 100));
}

/** Total % change across the whole series (first → last). */
export function cumulativeChangePct(values: number[]): number {
  if (values.length < 2) return 0;
  return round1(pctChange(values[0], values[values.length - 1]));
}

/**
 * Annual % change at the latest point: last value vs the value 12 months prior.
 * Returns null if there are fewer than 13 monthly points.
 */
export function annualChangePct(values: number[]): number | null {
  if (values.length < 13) return null;
  const last = values[values.length - 1];
  const yearAgo = values[values.length - 13];
  return round1(pctChange(yearAgo, last));
}
