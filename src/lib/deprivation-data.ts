/**
 * The "postcode penalty" — NZDep2023 socioeconomic deprivation by place.
 *
 * Source: University of Otago (HIRP) NZDep2023 Index of Socioeconomic
 * Deprivation, SA1 with higher geography (2023 Census), aggregated to
 * territorial authority and region by usually-resident population. The headline
 * metric is the share of people living in NZDep deciles 9–10 (the most-deprived
 * 20% of small areas nationally), plus a population-weighted mean decile.
 *
 * NZDep is RELATIVE: by construction about 20% of New Zealanders fall in
 * deciles 9–10, so a district far above 20% carries a disproportionate share of
 * deprivation. Every pct910 / meanDecile / pop figure below is taken verbatim
 * from the source aggregation (no recomputation or rounding). Display names are
 * normalised to te reo Māori with macrons (Ōpōtiki, Whangārei, Whakatāne,
 * Manawatū, Taupō, Ōtorohanga) even though the raw source uses ASCII.
 *
 * This is an experimental proof-of-concept for thecolab.ai "Impact for Good".
 * IMPORTANT: a reliable polygon boundary file was not available in this build,
 * so the page is a GRADED RANKED heat view of deprivation CONCENTRATION, not a
 * literal choropleth — for the true geographic map see the official EHINZ web
 * map (officialMapUrl). Always check figures against the original Otago/EHINZ
 * source before relying on them.
 */

export interface DepArea {
  name: string;
  pop: number;
  /** Share of usually-resident population in NZDep2023 deciles 9–10 (%). */
  pct910: number;
  /** Population-weighted mean NZDep2023 decile (1 = least, 10 = most deprived). */
  meanDecile: number;
}

export interface DepMeta {
  source: string;
  sourceUrl: string;
  officialMapUrl: string;
  metric: string;
  nationalPop: number;
  note: string;
}

export interface DepContextFact {
  fact: string;
  source: string;
}

export type Geography = "ta" | "region";

const COLORS = {
  navy: "#1C1917",
  cyan: "#0EA5E9",
  cyanMid: "#38BDF8",
  muted: "#78716C",
  warm: "#E08A4A",
  orange: "#C2410C",
  dark: "#7A1F08",
} as const;

/** The ~20%-by-design relativity anchor (NZDep deciles 9–10 nationally). */
export const NATIONAL_BASELINE_PCT = 20;

export const DEPRIVATION_META: DepMeta = {
  source:
    "University of Otago (HIRP) — NZDep2023 Index of Socioeconomic Deprivation, SA1 with higher geography (2023 Census). Aggregated to territorial authority and region by usually-resident population.",
  sourceUrl:
    "https://www.otago.ac.nz/wellington/research/groups/research-groups-in-the-department-of-public-health/hirp/socioeconomic-deprivation-indexes",
  officialMapUrl:
    "https://www.ehinz.ac.nz/indicators/population-vulnerability/socioeconomic-deprivation-profile/",
  metric:
    "Share of usually-resident population living in NZDep2023 deciles 9–10 (the most deprived 20% of small areas nationally), plus population-weighted mean decile.",
  nationalPop: 4992801,
  note: "NZDep is relative: by design ~20% of people nationally fall in deciles 9–10. A district far above 20% carries a disproportionate share of deprivation — the 'postcode penalty'.",
};

/** 67 territorial authorities, pre-sorted desc by pct910. Display names macronised. */
export const TERRITORIAL_AUTHORITIES: DepArea[] = [
  { name: "Kawerau District", pop: 7542, pct910: 78.0, meanDecile: 9.13 },
  { name: "Wairoa District", pop: 8811, pct910: 74.5, meanDecile: 9.14 },
  { name: "Ōpōtiki District", pop: 10098, pct910: 69.3, meanDecile: 8.75 },
  { name: "Far North District", pop: 71433, pct910: 56.6, meanDecile: 8.05 },
  { name: "Waitomo District", pop: 9579, pct910: 55.7, meanDecile: 8.12 },
  {
    name: "South Waikato District",
    pop: 25032,
    pct910: 54.1,
    meanDecile: 8.13,
  },
  { name: "Gisborne District", pop: 51129, pct910: 47.8, meanDecile: 7.41 },
  { name: "Ruapehu District", pop: 13089, pct910: 47.8, meanDecile: 8.09 },
  {
    name: "Chatham Islands Territory",
    pop: 612,
    pct910: 46.6,
    meanDecile: 7.93,
  },
  { name: "Horowhenua District", pop: 36705, pct910: 42.3, meanDecile: 7.36 },
  { name: "Whanganui District", pop: 47622, pct910: 42.2, meanDecile: 7.12 },
  { name: "Rotorua District", pop: 74073, pct910: 42.1, meanDecile: 7.06 },
  { name: "Buller District", pop: 10440, pct910: 41.4, meanDecile: 7.63 },
  { name: "Whakatāne District", pop: 37161, pct910: 40.8, meanDecile: 7.09 },
  {
    name: "South Taranaki District",
    pop: 29040,
    pct910: 36.0,
    meanDecile: 7.45,
  },
  { name: "Hauraki District", pop: 21306, pct910: 35.9, meanDecile: 7.66 },
  { name: "Porirua City", pop: 59415, pct910: 32.6, meanDecile: 5.34 },
  { name: "Tararua District", pop: 18660, pct910: 30.6, meanDecile: 7.15 },
  { name: "Hamilton City", pop: 174768, pct910: 30.5, meanDecile: 6.43 },
  { name: "Whangārei District", pop: 96651, pct910: 30.4, meanDecile: 6.43 },
  { name: "Kaipara District", pop: 25899, pct910: 28.7, meanDecile: 7.02 },
  { name: "Hastings District", pop: 85968, pct910: 26.4, meanDecile: 5.9 },
  { name: "Ōtorohanga District", pop: 10416, pct910: 24.5, meanDecile: 6.91 },
  { name: "Napier City", pop: 64668, pct910: 23.5, meanDecile: 5.83 },
  { name: "Auckland", pop: 1656021, pct910: 22.8, meanDecile: 5.61 },
  { name: "Rangitikei District", pop: 15660, pct910: 22.6, meanDecile: 6.79 },
  { name: "Masterton District", pop: 27669, pct910: 22.6, meanDecile: 6.04 },
  { name: "Waimate District", pop: 8106, pct910: 22.5, meanDecile: 6.5 },
  { name: "Grey District", pop: 14019, pct910: 22.4, meanDecile: 6.5 },
  { name: "Taupō District", pop: 39990, pct910: 22.0, meanDecile: 5.6 },
  { name: "Invercargill City", pop: 55596, pct910: 21.4, meanDecile: 5.96 },
  { name: "Lower Hutt City", pop: 107565, pct910: 21.2, meanDecile: 5.43 },
  { name: "Palmerston North City", pop: 87141, pct910: 20.9, meanDecile: 5.69 },
  {
    name: "Thames-Coromandel District",
    pop: 32001,
    pct910: 20.4,
    meanDecile: 6.2,
  },
  { name: "Dunedin City", pop: 128871, pct910: 19.7, meanDecile: 5.32 },
  { name: "Waikato District", pop: 85938, pct910: 19.5, meanDecile: 5.17 },
  { name: "Gore District", pop: 12708, pct910: 18.5, meanDecile: 5.69 },
  { name: "New Plymouth District", pop: 86958, pct910: 15.9, meanDecile: 5.41 },
  { name: "Christchurch City", pop: 391362, pct910: 15.6, meanDecile: 5.27 },
  {
    name: "Western Bay of Plenty District",
    pop: 56217,
    pct910: 15.1,
    meanDecile: 5.49,
  },
  {
    name: "Matamata-Piako District",
    pop: 37125,
    pct910: 14.4,
    meanDecile: 6.05,
  },
  { name: "Waitaki District", pop: 23457, pct910: 14.3, meanDecile: 6.05 },
  { name: "Stratford District", pop: 10140, pct910: 12.2, meanDecile: 6.35 },
  {
    name: "Central Hawke's Bay District",
    pop: 15489,
    pct910: 11.6,
    meanDecile: 5.61,
  },
  { name: "Westland District", pop: 8892, pct910: 11.2, meanDecile: 6.24 },
  { name: "Nelson City", pop: 52554, pct910: 11.0, meanDecile: 5.22 },
  { name: "Tauranga City", pop: 152820, pct910: 9.9, meanDecile: 5.03 },
  { name: "Upper Hutt City", pop: 45759, pct910: 9.7, meanDecile: 4.49 },
  { name: "Marlborough District", pop: 49389, pct910: 9.5, meanDecile: 4.99 },
  { name: "Timaru District", pop: 47556, pct910: 9.5, meanDecile: 5.33 },
  { name: "Clutha District", pop: 18321, pct910: 9.5, meanDecile: 5.67 },
  { name: "Ashburton District", pop: 34746, pct910: 8.8, meanDecile: 5.1 },
  { name: "Kaikoura District", pop: 4215, pct910: 7.4, meanDecile: 5.51 },
  { name: "Manawatū District", pop: 32430, pct910: 6.2, meanDecile: 4.98 },
  { name: "Southland District", pop: 31707, pct910: 5.6, meanDecile: 5.11 },
  { name: "Wellington City", pop: 202725, pct910: 5.5, meanDecile: 3.98 },
  { name: "Kapiti Coast District", pop: 55908, pct910: 5.3, meanDecile: 4.49 },
  { name: "Hurunui District", pop: 13584, pct910: 5.2, meanDecile: 4.83 },
  { name: "Waipa District", pop: 58686, pct910: 5.1, meanDecile: 4.3 },
  {
    name: "South Wairarapa District",
    pop: 11799,
    pct910: 4.7,
    meanDecile: 4.26,
  },
  { name: "Tasman District", pop: 57858, pct910: 4.7, meanDecile: 4.7 },
  { name: "Carterton District", pop: 10122, pct910: 3.9, meanDecile: 4.71 },
  { name: "Waimakariri District", pop: 66204, pct910: 3.4, meanDecile: 3.89 },
  { name: "Mackenzie District", pop: 5121, pct910: 2.9, meanDecile: 4.45 },
  { name: "Central Otago District", pop: 24315, pct910: 0.6, meanDecile: 3.78 },
  { name: "Selwyn District", pop: 78123, pct910: 0.4, meanDecile: 2.54 },
  {
    name: "Queenstown-Lakes District",
    pop: 47817,
    pct910: 0.0,
    meanDecile: 2.63,
  },
];

/** 16 regions, pre-sorted desc by pct910. */
export const REGIONS: DepArea[] = [
  { name: "Gisborne Region", pop: 51129, pct910: 47.8, meanDecile: 7.41 },
  { name: "Northland Region", pop: 193983, pct910: 39.8, meanDecile: 7.1 },
  {
    name: "Manawatū-Whanganui Region",
    pop: 251511,
    pct910: 28.5,
    meanDecile: 6.42,
  },
  { name: "Hawke's Bay Region", pop: 175020, pct910: 26.4, meanDecile: 6.01 },
  { name: "West Coast Region", pop: 33351, pct910: 25.4, meanDecile: 6.78 },
  { name: "Waikato Region", pop: 498477, pct910: 24.7, meanDecile: 6.03 },
  { name: "Bay of Plenty Region", pop: 334146, pct910: 24.7, meanDecile: 5.98 },
  { name: "Auckland Region", pop: 1656021, pct910: 22.8, meanDecile: 5.61 },
  { name: "Taranaki Region", pop: 125979, pct910: 20.1, meanDecile: 5.95 },
  { name: "Southland Region", pop: 100011, pct910: 16.0, meanDecile: 5.65 },
  { name: "Wellington Region", pop: 520962, pct910: 13.1, meanDecile: 4.66 },
  { name: "Otago Region", pop: 240885, pct910: 12.7, meanDecile: 4.73 },
  { name: "Canterbury Region", pop: 650913, pct910: 11.4, meanDecile: 4.8 },
  { name: "Nelson Region", pop: 52554, pct910: 11.0, meanDecile: 5.22 },
  { name: "Marlborough Region", pop: 49389, pct910: 9.5, meanDecile: 4.99 },
  { name: "Tasman Region", pop: 57858, pct910: 4.7, meanDecile: 4.7 },
];

export const DEPRIVATION_CONTEXT: DepContextFact[] = [
  {
    fact: "NZDep is relative — about 20% of New Zealanders live in the most-deprived deciles 9–10 by construction. Districts well above that line carry far more than their share.",
    source: "Otago HIRP, NZDep2023 User's Manual",
  },
  {
    fact: "In Kawerau (78%), Wairoa (74.5%) and Ōpōtiki (69.3%) districts, more than two-thirds of residents live in the most-deprived deciles — deprivation is concentrated, not spread evenly.",
    source: "NZDep2023, aggregated by TA",
  },
  {
    fact: "Deprivation co-locates with cold/damp homes, thin transport, closed GP books and council-thinned free services — a child's address, not the national average, largely decides outcomes.",
    source: "thecolab.ai poverty report (Driver 5: spatial pooling)",
  },
  {
    fact: "Identifiable suburbs in South Auckland, Porirua, Christchurch, Hastings and Whanganui cluster in deciles 9–10 even within wealthier regions.",
    source: "thecolab.ai poverty report",
  },
];

export const DEPRIVATION_SOURCE_LINE =
  "Source: University of Otago (HIRP) NZDep2023 Index of Socioeconomic Deprivation (2023 Census), aggregated to territorial authority and region by usually-resident population. Metric: share of people living in NZDep deciles 9–10 (most-deprived 20% of small areas), plus population-weighted mean decile.";

export const DEPRIVATION_DISCLAIMER =
  "Experimental proof-of-concept for thecolab.ai Impact for Good — not policy advice. NZDep is RELATIVE: by construction about 20% of New Zealanders fall in deciles 9–10, so a district far above 20% carries a disproportionate share of deprivation (the 'postcode penalty'). IMPORTANT: a reliable polygon boundary file was not available in this build, so this is a GRADED RANKED heat view of deprivation CONCENTRATION, not a literal polygon choropleth — for the true geographic map see the official EHINZ web map (DEPRIVATION_META.officialMapUrl). Always verify figures against the original Otago/EHINZ source.";

// ---------------------------------------------------------------------------
// Pure, testable helpers
// ---------------------------------------------------------------------------

/** epsilon-safe 1dp rounding (identical contract to the sibling data modules). */
export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/** Returns the row set for a geography (TA districts or regions). */
export function areasFor(geo: Geography): DepArea[] {
  return geo === "region" ? REGIONS : TERRITORIAL_AUTHORITIES;
}

/**
 * Copies and ranks a geography's areas desc by pct910, sliced to n (default
 * all). MUST NOT mutate the source array.
 */
export function topByDeprivation(geo: Geography, n?: number): DepArea[] {
  const sorted = [...areasFor(geo)].sort((a, b) => b.pct910 - a.pct910);
  return typeof n === "number" ? sorted.slice(0, n) : sorted;
}

/**
 * Diverging heat ramp anchored at the ~20% national baseline: below the line
 * reads cyan, the ~20% band reads neutral (muted), and over-representation
 * warms through orange to a dark concentrated-deprivation red.
 */
export function depColor(pct910: number): string {
  if (pct910 < 10) return COLORS.cyan;
  if (pct910 < 18) return COLORS.cyanMid;
  if (pct910 < 25) return COLORS.muted;
  if (pct910 < 40) return COLORS.warm;
  if (pct910 < 60) return COLORS.orange;
  return COLORS.dark;
}

/** Companion ramp on the 1–10 mean-decile scale (same heat logic). */
export function depColorByDecile(meanDecile: number): string {
  if (meanDecile <= 4) return COLORS.cyan;
  if (meanDecile < 5) return COLORS.cyanMid;
  if (meanDecile < 6.5) return COLORS.muted;
  if (meanDecile < 8) return COLORS.warm;
  if (meanDecile < 9) return COLORS.orange;
  return COLORS.dark;
}

/** Human-readable band label for legend + tooltip copy. */
export function depBand(pct910: number): string {
  if (pct910 < 18) return "well below 20% baseline";
  if (pct910 < 25) return "near national 20% baseline";
  if (pct910 < 60) return "2–3× national share";
  return "concentrated deprivation";
}

/** How many times the national baseline a district's share is (e.g. 78/20 = 3.9). */
export function overIndex(
  pct910: number,
  baseline: number = NATIONAL_BASELINE_PCT,
): number {
  return baseline <= 0 ? 0 : round1(pct910 / baseline);
}
