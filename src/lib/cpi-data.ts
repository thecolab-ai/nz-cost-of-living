/**
 * NZ headline CPI (all groups), for overlaying general inflation on the
 * index/cost charts. Source: Stats NZ Consumers Price Index, series CPIQ.SE9A
 * (March 2026 quarter release), retrieved via thecolab.ai stats-nz skill.
 *
 * CPI is published QUARTERLY; these are monthly values linearly interpolated
 * between quarter points (and held flat after the latest quarter) so a CPI line
 * can sit on the same monthly axis as the food / electricity indices. Index
 * base matches the CPI series (June 2006 quarter = 1000); only relative
 * movement matters once rebased. Latest: 2026 Q1 = 1339 (+3.1%/yr).
 */

export const CPI_SOURCE_LINE =
  "Headline CPI (all groups), Stats NZ Consumers Price Index series CPIQ.SE9A (March 2026 quarter) via the stats-nz skill; quarterly values interpolated to monthly for charting.";

export const CPI_DATES: string[] = [
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

/** Monthly CPI index aligned to CPI_DATES (2019-01 .. 2026-04). */
export const CPI_INDEX: number[] = [
  1025.3, 1025.7, 1026.0, 1028.0, 1030.0, 1032.0, 1034.3, 1036.7, 1039.0,
  1040.7, 1042.3, 1044.0, 1046.7, 1049.3, 1052.0, 1050.3, 1048.7, 1047.0,
  1049.3, 1051.7, 1054.0, 1055.7, 1057.3, 1059.0, 1062.0, 1065.0, 1068.0,
  1072.7, 1077.3, 1082.0, 1090.0, 1098.0, 1106.0, 1111.3, 1116.7, 1122.0,
  1128.7, 1135.3, 1142.0, 1148.3, 1154.7, 1161.0, 1169.3, 1177.7, 1186.0,
  1191.7, 1197.3, 1203.0, 1208.0, 1213.0, 1218.0, 1222.3, 1226.7, 1231.0,
  1238.3, 1245.7, 1253.0, 1255.0, 1257.0, 1259.0, 1261.7, 1264.3, 1267.0,
  1268.7, 1270.3, 1272.0, 1274.7, 1277.3, 1280.0, 1282.3, 1284.7, 1287.0,
  1291.0, 1295.0, 1299.0, 1301.3, 1303.7, 1306.0, 1310.3, 1314.7, 1319.0,
  1321.7, 1324.3, 1327.0, 1331.0, 1335.0, 1339.0, 1339.0,
];

const CPI_BY_DATE: Record<string, number> = Object.fromEntries(
  CPI_DATES.map((d, i) => [d, CPI_INDEX[i]]),
);

/**
 * Return a CPI line rebased to 100 at the first of `targetDates`, aligned to
 * those dates. Months outside the CPI range clamp to the nearest known value.
 * Use to overlay general inflation on a chart already rebased to its own start.
 */
export function cpiRebasedTo(targetDates: string[]): (number | null)[] {
  if (targetDates.length === 0) return [];
  const valueAt = (d: string): number => {
    if (CPI_BY_DATE[d] != null) return CPI_BY_DATE[d];
    if (d < CPI_DATES[0]) return CPI_INDEX[0];
    return CPI_INDEX[CPI_INDEX.length - 1];
  };
  const base = valueAt(targetDates[0]);
  return targetDates.map((d) => Math.round((valueAt(d) / base) * 1000) / 10);
}
