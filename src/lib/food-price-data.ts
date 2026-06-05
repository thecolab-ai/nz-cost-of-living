/**
 * Stats NZ Food Price Index (FPI) — real published monthly index levels.
 *
 * Source: Stats NZ "Selected price indexes — April 2026" CSV
 *   https://www.stats.govt.nz/information-releases/selected-price-indexes-april-2026/
 *   (series CPIM.SE901 + subgroup series CPIM.SE9011–SE9015)
 * Base/reference: June 2017 quarter = 1000 (the total index equals exactly 1000.0 at 2017-06).
 * Granularity: monthly, 2022-01 → 2026-04 (52 points). Values are genuine published
 * index levels (not reconstructed), as published by Stats NZ.
 *
 * Note: as of late 2024 the FPI is published within the monthly "Selected price
 * indexes" release rather than as a standalone FPI release.
 *
 * This is an experimental proof-of-concept for thecolab.ai "Impact for Good".
 * Always check figures against the original Stats NZ source before relying on them.
 */

export const FPI_BASE = "Index, June 2017 quarter = 1000";
export const FPI_LATEST_LABEL = "April 2026";
export const FPI_GRANULARITY = "monthly" as const;
export const FPI_SOURCE_URL =
  "https://www.stats.govt.nz/information-releases/selected-price-indexes-april-2026/";

export type FoodSubgroupKey =
  | "total"
  | "fruit_veg"
  | "meat_poultry_fish"
  | "grocery_food"
  | "beverages"
  | "restaurant";

export interface FoodSubgroup {
  key: FoodSubgroupKey;
  label: string;
  /** Short label for chips / compact UI. */
  shortLabel: string;
  /** Brand-aligned line/bar colour. */
  color: string;
  /** Latest annual % change (to April 2026), as published by Stats NZ. */
  annualPct: number;
  /** Latest month-on-month % change (Apr 2026 vs Mar 2026). */
  monthlyPct: number | null;
  /** Whether this subgroup is "grocery spend" (shown by default vs restaurant). */
  groceryRelevant: boolean;
  /** Monthly index levels, aligned to FPI_DATES. */
  values: number[];
}

/** YYYY-MM, aligned to every subgroup's `values` array. */
export const FPI_DATES: string[] = [
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

// Brand palette (matches src/app/simulator/page.tsx COLORS).
const C = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  teal: "#0F766E",
  stone: "#A8A29E",
} as const;

// Genuine published monthly index levels, aligned to FPI_DATES (52 points each).
const SERIES: Record<FoodSubgroupKey, number[]> = {
  total: [
    1118.0, 1117.0, 1125.0, 1126.0, 1134.0, 1148.0, 1172.0, 1185.0, 1190.0,
    1199.0, 1199.0, 1212.0, 1233.0, 1251.0, 1261.0, 1267.0, 1271.0, 1291.0,
    1284.0, 1290.0, 1285.0, 1274.0, 1271.0, 1270.0, 1285.0, 1277.0, 1270.0,
    1277.0, 1274.0, 1287.0, 1292.0, 1295.0, 1301.0, 1289.0, 1288.0, 1289.0,
    1314.0, 1308.0, 1314.0, 1324.0, 1330.0, 1346.0, 1356.0, 1360.0, 1354.0,
    1350.0, 1345.0, 1341.0, 1369.0, 1367.0, 1359.0, 1359.0,
  ],
  fruit_veg: [
    1079.0, 1071.0, 1084.0, 1050.0, 1055.0, 1107.0, 1218.0, 1268.0, 1267.0,
    1201.0, 1144.0, 1211.0, 1248.0, 1318.0, 1325.0, 1286.0, 1249.0, 1350.0,
    1294.0, 1337.0, 1285.0, 1241.0, 1199.0, 1229.0, 1253.0, 1195.0, 1149.0,
    1119.0, 1107.0, 1133.0, 1184.0, 1174.0, 1178.0, 1130.0, 1097.0, 1131.0,
    1163.0, 1121.0, 1118.0, 1121.0, 1161.0, 1219.0, 1271.0, 1278.0, 1246.0,
    1191.0, 1138.0, 1158.0, 1236.0, 1226.0, 1190.0, 1163.0,
  ],
  meat_poultry_fish: [
    1129.0, 1130.0, 1140.0, 1135.0, 1129.0, 1139.0, 1153.0, 1167.0, 1179.0,
    1211.0, 1225.0, 1210.0, 1233.0, 1241.0, 1229.0, 1243.0, 1261.0, 1264.0,
    1260.0, 1260.0, 1260.0, 1251.0, 1250.0, 1238.0, 1250.0, 1244.0, 1231.0,
    1246.0, 1246.0, 1246.0, 1246.0, 1262.0, 1277.0, 1274.0, 1272.0, 1264.0,
    1287.0, 1295.0, 1296.0, 1291.0, 1313.0, 1326.0, 1345.0, 1364.0, 1359.0,
    1371.0, 1370.0, 1357.0, 1394.0, 1392.0, 1391.0, 1392.0,
  ],
  grocery_food: [
    1103.0, 1101.0, 1111.0, 1118.0, 1130.0, 1133.0, 1144.0, 1156.0, 1155.0,
    1176.0, 1189.0, 1203.0, 1225.0, 1235.0, 1263.0, 1275.0, 1274.0, 1278.0,
    1280.0, 1279.0, 1279.0, 1269.0, 1272.0, 1268.0, 1289.0, 1283.0, 1284.0,
    1298.0, 1290.0, 1307.0, 1302.0, 1310.0, 1313.0, 1301.0, 1304.0, 1302.0,
    1341.0, 1338.0, 1350.0, 1366.0, 1357.0, 1368.0, 1369.0, 1372.0, 1364.0,
    1365.0, 1364.0, 1362.0, 1383.0, 1377.0, 1366.0, 1375.0,
  ],
  beverages: [
    1063.0, 1060.0, 1070.0, 1061.0, 1073.0, 1088.0, 1093.0, 1083.0, 1103.0,
    1125.0, 1134.0, 1115.0, 1138.0, 1156.0, 1158.0, 1146.0, 1197.0, 1194.0,
    1193.0, 1182.0, 1194.0, 1189.0, 1200.0, 1176.0, 1188.0, 1206.0, 1208.0,
    1212.0, 1229.0, 1245.0, 1239.0, 1230.0, 1246.0, 1228.0, 1253.0, 1236.0,
    1264.0, 1255.0, 1269.0, 1294.0, 1292.0, 1301.0, 1293.0, 1278.0, 1287.0,
    1292.0, 1308.0, 1280.0, 1310.0, 1316.0, 1314.0, 1310.0,
  ],
  restaurant: [
    1179.0, 1183.0, 1186.0, 1203.0, 1215.0, 1223.0, 1230.0, 1234.0, 1241.0,
    1254.0, 1260.0, 1268.0, 1277.0, 1282.0, 1289.0, 1311.0, 1321.0, 1335.0,
    1340.0, 1344.0, 1348.0, 1351.0, 1354.0, 1358.0, 1362.0, 1368.0, 1372.0,
    1384.0, 1385.0, 1389.0, 1390.0, 1393.0, 1395.0, 1397.0, 1399.0, 1400.0,
    1400.0, 1402.0, 1404.0, 1411.0, 1413.0, 1419.0, 1421.0, 1426.0, 1430.0,
    1430.0, 1433.0, 1433.0, 1436.0, 1440.0, 1444.0, 1449.0,
  ],
};

const META: Record<FoodSubgroupKey, Omit<FoodSubgroup, "values">> = {
  total: {
    key: "total",
    label: "Food (all groups)",
    shortLabel: "All food",
    color: C.navy,
    annualPct: 2.6,
    monthlyPct: 0.0,
    groceryRelevant: true,
  },
  meat_poultry_fish: {
    key: "meat_poultry_fish",
    label: "Meat, poultry & fish",
    shortLabel: "Meat & fish",
    color: C.orange,
    annualPct: 7.8,
    monthlyPct: 0.07,
    groceryRelevant: true,
  },
  fruit_veg: {
    key: "fruit_veg",
    label: "Fruit & vegetables",
    shortLabel: "Fruit & veg",
    color: C.cyan,
    annualPct: 3.7,
    monthlyPct: -2.27,
    groceryRelevant: true,
  },
  grocery_food: {
    key: "grocery_food",
    label: "Grocery food",
    shortLabel: "Grocery",
    color: C.indigo,
    annualPct: 0.7,
    monthlyPct: 0.66,
    groceryRelevant: true,
  },
  beverages: {
    key: "beverages",
    label: "Non-alcoholic beverages",
    shortLabel: "Beverages",
    color: C.teal,
    annualPct: 1.2,
    monthlyPct: -0.3,
    groceryRelevant: true,
  },
  restaurant: {
    key: "restaurant",
    label: "Restaurant meals & ready-to-eat",
    shortLabel: "Eating out",
    color: C.stone,
    annualPct: 2.7,
    monthlyPct: 0.35,
    groceryRelevant: false,
  },
};

// Display order: total first, then grocery groups by latest annual change, eating-out last.
const SUBGROUP_ORDER: FoodSubgroupKey[] = [
  "total",
  "meat_poultry_fish",
  "fruit_veg",
  "grocery_food",
  "beverages",
  "restaurant",
];

/** Exported, dates-aligned subgroups (single source of truth). */
export const FOOD_SUBGROUPS: FoodSubgroup[] = SUBGROUP_ORDER.map((key) => ({
  ...META[key],
  values: SERIES[key],
}));

export function getSubgroup(key: FoodSubgroupKey): FoodSubgroup {
  const s = FOOD_SUBGROUPS.find((g) => g.key === key);
  if (!s) throw new Error(`Unknown food subgroup: ${key}`);
  return s;
}

/** Sourced contextual facts for a low-income framing. */
export const FOOD_CONTEXT_FACTS: { fact: string; sourceUrl: string }[] = [
  {
    fact: "Meat, poultry & fish is the fastest-inflating food group — up 7.8% in the year to April 2026 and the single largest contributor to annual food inflation. The cheapest dignified source of protein is rising fastest, so it is the first thing low-income households cut.",
    sourceUrl: FPI_SOURCE_URL,
  },
  {
    fact: "Overall food inflation (2.6%/yr) now sits below headline CPI (3.1% to March 2026), but that masks the squeeze on the basics: protein and fresh produce — the core of a healthy diet — keep climbing while 'grocery food' (0.7%) cools.",
    sourceUrl:
      "https://www.stats.govt.nz/news/annual-inflation-at-3-1-percent-in-march-2026/",
  },
  {
    fact: "Beneficiary households are indexed to general CPI, which lags the steeper inflation of the food categories they rely on — so 'maintained' support quietly loses real purchasing power on food each year.",
    sourceUrl:
      "https://www.stats.govt.nz/information-releases/consumers-price-index-march-2026-quarter/",
  },
];

export const FOOD_SOURCE_LINE =
  "Source: Stats NZ Selected Price Indexes (Food Price Index), April 2026 — series CPIM.SE901. Index base: June 2017 quarter = 1000.";

export const FOOD_DISCLAIMER =
  "Experimental and indicative only — not financial, legal or policy advice. Built for thecolab.ai 'Impact for Good'. Figures are genuine published Stats NZ Food Price Index levels (April 2026 release); always verify against the original Stats NZ source before relying on them.";

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

/** Subgroups sorted by latest annual % change, descending (sharpest squeeze first). */
export function subgroupsBySqueeze(
  opts: { groceryOnly?: boolean } = {},
): FoodSubgroup[] {
  return FOOD_SUBGROUPS.filter((g) =>
    opts.groceryOnly ? g.groceryRelevant : true,
  )
    .filter((g) => g.key !== "total")
    .slice()
    .sort((a, b) => b.annualPct - a.annualPct);
}
