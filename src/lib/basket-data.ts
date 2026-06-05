/**
 * Live Woolworths NZ basket prices, priced 2026-06-05 via the thecolab.ai
 * woolworths-nz skill (live Woolworths NZ product search).
 *
 * History is NOT a set of historical receipts: each basket's cost over time is
 * reconstructed by re-pricing today's live basket through Stats NZ Food Price
 * Index sub-group movements (fruit & veg, meat/poultry/fish, grocery food,
 * beverages). The latest point equals the live basket total; earlier points
 * scale each component by its real FPI sub-index. Indicative of how this
 * basket's cost has moved, not a historical receipt.
 *
 * Experimental proof-of-concept for thecolab.ai "Impact for Good" — always
 * verify figures against the live store and Stats NZ source before relying on them.
 */

export const BASKET_STORE = "Woolworths NZ — live online prices";
export const BASKET_PRICED_AT = "2026-06-05";
export const BASKET_PRICE_SOURCE =
  "thecolab.ai woolworths-nz skill (live Woolworths NZ product search)";
export const BASKET_HISTORY_METHOD =
  "Each basket's cost over time is reconstructed by re-pricing today's live basket through Stats NZ Food Price Index sub-group movements (fruit & veg, meat/poultry/fish, grocery food, beverages). The latest point equals the live basket total; earlier points scale each component by its real FPI sub-index. Indicative of how this basket's cost has moved, not a historical receipt.";
export const BASKET_FPI_SOURCE =
  "Stats NZ Food Price Index (CPIM.SE901*), base June 2017 = 1000";
export const JOBSEEKER_SINGLE_WEEKLY = 372.55;

/** YYYY-MM, aligned to every basket's `costHistory` array (52 points). */
export const BASKET_DATES: string[] = [
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

export type BasketKey = "bare-staples" | "nutritious-family" | "pantry-basics";
export type FpiSubgroup =
  | "fruit_veg"
  | "meat_poultry_fish"
  | "grocery_food"
  | "beverages";

export interface BasketItem {
  label: string;
  qty: number;
  unitPrice: number;
  lineCost: number;
  matched: string;
  size: string;
  subgroup: FpiSubgroup;
}

export interface Basket {
  key: BasketKey;
  title: string;
  blurb: string;
  totalWeekly: number;
  itemCount: number;
  pctOfJobseeker: number;
  /** Brand-aligned chart/dot colour (added in TS, not in source JSON). */
  color: string;
  items: BasketItem[];
  /** 52 points aligned to BASKET_DATES, in NZ dollars. */
  costHistory: number[];
}

// Brand colours shared by chart, cards and tooltip (single source of truth).
const BASKET_COLOR: Record<BasketKey, string> = {
  "bare-staples": "#C2410C", // orange — the survival shop, emphasised
  "nutritious-family": "#2E4057", // indigo
  "pantry-basics": "#0EA5E9", // cyan
};

const BARE_STAPLES: Basket = {
  key: "bare-staples",
  title: "Bare staples (1 adult, 1 week)",
  blurb:
    "The cheapest survival shop — carbs, dairy and eggs, almost no fresh protein, fruit or veg. What a benefit actually stretches to.",
  totalWeekly: 38.79,
  itemCount: 11,
  pctOfJobseeker: 10.4,
  color: BASKET_COLOR["bare-staples"],
  items: [
    {
      label: "Standard milk 2L",
      qty: 1,
      unitPrice: 3.16,
      lineCost: 3.16,
      matched: "woolworths milk standard",
      size: "1L",
      subgroup: "grocery_food",
    },
    {
      label: "White bread loaf",
      qty: 1,
      unitPrice: 2.15,
      lineCost: 2.15,
      matched: "essentials sliced bread white",
      size: "600g",
      subgroup: "grocery_food",
    },
    {
      label: "Eggs size 7 dozen",
      qty: 1,
      unitPrice: 9.4,
      lineCost: 9.4,
      matched: "woolworths eggs barn size 7",
      size: "12pack",
      subgroup: "grocery_food",
    },
    {
      label: "Weet-Bix 1.2kg",
      qty: 1,
      unitPrice: 8.96,
      lineCost: 8.96,
      matched: "sanitarium weet-bix cereal ",
      size: "1.2kg",
      subgroup: "grocery_food",
    },
    {
      label: "White rice 1kg",
      qty: 1,
      unitPrice: 2.49,
      lineCost: 2.49,
      matched: "essentials long grain rice ",
      size: "1kg",
      subgroup: "grocery_food",
    },
    {
      label: "Spaghetti 500g",
      qty: 1,
      unitPrice: 1.65,
      lineCost: 1.65,
      matched: "essentials pasta spaghetti",
      size: "500g",
      subgroup: "grocery_food",
    },
    {
      label: "Baked beans 420g",
      qty: 1,
      unitPrice: 1.1,
      lineCost: 1.1,
      matched: "woolworths essentials baked beans ",
      size: "420g",
      subgroup: "grocery_food",
    },
    {
      label: "Margarine spread 500g",
      qty: 1,
      unitPrice: 2.19,
      lineCost: 2.19,
      matched: "essentials table spread margarine",
      size: "500g",
      subgroup: "grocery_food",
    },
    {
      label: "Potatoes 2.5kg",
      qty: 1,
      unitPrice: 3.45,
      lineCost: 3.45,
      matched: "fresh vegetable potatoes white washed",
      size: "per kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Onions 1.5kg",
      qty: 1,
      unitPrice: 1.99,
      lineCost: 1.99,
      matched: "fresh vegetable onions brown",
      size: "per kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Carrots 1kg",
      qty: 1,
      unitPrice: 2.25,
      lineCost: 2.25,
      matched: "fresh vegetable carrots ",
      size: "per kg",
      subgroup: "fruit_veg",
    },
  ],
  costHistory: [
    32.08, 31.98, 32.3, 32.23, 32.53, 32.95, 33.93, 34.53, 34.5, 34.54, 34.46,
    35.22, 35.96, 36.65, 37.33, 37.34, 37.07, 37.83, 37.51, 37.77, 37.43, 36.91,
    36.7, 36.81, 37.44, 36.92, 36.64, 36.76, 36.5, 37.05, 37.28, 37.39, 37.49,
    36.9, 36.75, 36.93, 38.02, 37.68, 37.93, 38.31, 38.37, 39.0, 39.37, 39.48,
    39.09, 38.75, 38.38, 38.46, 39.45, 39.25, 38.76, 38.79,
  ],
};

const NUTRITIOUS_FAMILY: Basket = {
  key: "nutritious-family",
  title: "Nutritious week (family of 4)",
  blurb:
    "A healthier shop with protein, dairy and 5+ a day for two adults and two children — the diet DEP-17 says counts, and what hardship strips out first.",
  totalWeekly: 109.69,
  itemCount: 18,
  pctOfJobseeker: 29.4,
  color: BASKET_COLOR["nutritious-family"],
  items: [
    {
      label: "Milk 2L x2",
      qty: 2,
      unitPrice: 3.16,
      lineCost: 6.32,
      matched: "woolworths milk standard",
      size: "1L",
      subgroup: "grocery_food",
    },
    {
      label: "Wholemeal bread x2",
      qty: 2,
      unitPrice: 2.15,
      lineCost: 4.3,
      matched: "essentials sliced bread wheatmeal",
      size: "600g",
      subgroup: "grocery_food",
    },
    {
      label: "Eggs dozen",
      qty: 1,
      unitPrice: 9.4,
      lineCost: 9.4,
      matched: "woolworths eggs barn size 7",
      size: "12pack",
      subgroup: "grocery_food",
    },
    {
      label: "Chicken drumsticks 1kg",
      qty: 1,
      unitPrice: 8.3,
      lineCost: 8.3,
      matched: "woolworths nz chicken drumsticks ",
      size: "min order 1.36kg",
      subgroup: "meat_poultry_fish",
    },
    {
      label: "Beef mince 1kg",
      qty: 1,
      unitPrice: 12.99,
      lineCost: 12.99,
      matched: "woolworths nz beef mince grass fed 18% fat",
      size: "500g",
      subgroup: "meat_poultry_fish",
    },
    {
      label: "Canned tuna 185g x3",
      qty: 3,
      unitPrice: 2.59,
      lineCost: 7.77,
      matched: "essentials tuna chunks in oil",
      size: "185g",
      subgroup: "meat_poultry_fish",
    },
    {
      label: "Tasty cheese 500g",
      qty: 1,
      unitPrice: 10.29,
      lineCost: 10.29,
      matched: "woolworths cheese tasty",
      size: "500g",
      subgroup: "grocery_food",
    },
    {
      label: "Yoghurt 1kg",
      qty: 1,
      unitPrice: 6.89,
      lineCost: 6.89,
      matched: "de winkel natural yoghurt carton plain unsweetened",
      size: "1kg",
      subgroup: "grocery_food",
    },
    {
      label: "Weet-Bix 1.2kg",
      qty: 1,
      unitPrice: 8.96,
      lineCost: 8.96,
      matched: "sanitarium weet-bix cereal ",
      size: "1.2kg",
      subgroup: "grocery_food",
    },
    {
      label: "Rolled oats 1kg",
      qty: 1,
      unitPrice: 2.49,
      lineCost: 2.49,
      matched: "woolworths oats rolled",
      size: "750g",
      subgroup: "grocery_food",
    },
    {
      label: "Bananas 1kg",
      qty: 1,
      unitPrice: 3.49,
      lineCost: 3.49,
      matched: "fresh fruit bananas green cooking",
      size: "per kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Apples 1.5kg",
      qty: 1,
      unitPrice: 4.45,
      lineCost: 4.45,
      matched: "fresh fruit apples royal gala",
      size: "",
      subgroup: "fruit_veg",
    },
    {
      label: "Potatoes 2.5kg",
      qty: 1,
      unitPrice: 3.45,
      lineCost: 3.45,
      matched: "fresh vegetable potatoes white washed",
      size: "per kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Carrots 1kg",
      qty: 1,
      unitPrice: 2.25,
      lineCost: 2.25,
      matched: "fresh vegetable carrots ",
      size: "per kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Broccoli",
      qty: 2,
      unitPrice: 2.69,
      lineCost: 5.38,
      matched: "fresh vegetable broccoli head",
      size: "",
      subgroup: "fruit_veg",
    },
    {
      label: "Frozen mixed veg 1kg",
      qty: 1,
      unitPrice: 3.69,
      lineCost: 3.69,
      matched: "woolworths frozen mixed vegetables ",
      size: "1kg",
      subgroup: "fruit_veg",
    },
    {
      label: "Pasta 500g x2",
      qty: 2,
      unitPrice: 1.65,
      lineCost: 3.3,
      matched: "essentials pasta spaghetti",
      size: "500g",
      subgroup: "grocery_food",
    },
    {
      label: "Canned tomatoes 400g x3",
      qty: 3,
      unitPrice: 1.99,
      lineCost: 5.97,
      matched: "watties chopped tomatoes in purée",
      size: "400g",
      subgroup: "grocery_food",
    },
  ],
  costHistory: [
    91.1, 90.88, 91.77, 91.29, 91.77, 93.12, 96.04, 97.82, 98.01, 98.27, 98.0,
    99.58, 101.71, 103.67, 104.73, 104.77, 104.38, 106.58, 105.49, 106.29,
    105.27, 103.8, 103.09, 103.26, 104.86, 103.35, 102.22, 102.54, 101.97,
    103.19, 103.98, 104.45, 104.97, 103.47, 102.91, 103.32, 106.07, 105.29,
    105.75, 106.38, 107.24, 109.11, 110.56, 111.22, 110.16, 109.38, 108.28,
    108.31, 111.49, 111.0, 109.82, 109.69,
  ],
};

const PANTRY_BASICS: Basket = {
  key: "pantry-basics",
  title: "Pantry re-stock",
  blurb:
    "The occasional bulk shop — flour, oil, sugar, tea and tinned basics that keep a kitchen running between weekly shops.",
  totalWeekly: 47.13,
  itemCount: 10,
  pctOfJobseeker: 12.7,
  color: BASKET_COLOR["pantry-basics"],
  items: [
    {
      label: "Flour 1.5kg",
      qty: 1,
      unitPrice: 2.0,
      lineCost: 2.0,
      matched: "woolworths plain flour ",
      size: "1.5kg",
      subgroup: "grocery_food",
    },
    {
      label: "White sugar 1.5kg",
      qty: 1,
      unitPrice: 3.44,
      lineCost: 3.44,
      matched: "woolworths white sugar ",
      size: "1.5kg",
      subgroup: "grocery_food",
    },
    {
      label: "Cooking oil 750ml",
      qty: 1,
      unitPrice: 3.1,
      lineCost: 3.1,
      matched: "woolworths canola oil ",
      size: "750mL",
      subgroup: "grocery_food",
    },
    {
      label: "Tea bags 100",
      qty: 1,
      unitPrice: 3.19,
      lineCost: 3.19,
      matched: "woolworths tea black",
      size: "100pack",
      subgroup: "beverages",
    },
    {
      label: "Instant coffee 100g",
      qty: 1,
      unitPrice: 10.29,
      lineCost: 10.29,
      matched: "nescafé classic instant coffee ",
      size: "100g",
      subgroup: "beverages",
    },
    {
      label: "Peanut butter 500g",
      qty: 1,
      unitPrice: 5.19,
      lineCost: 5.19,
      matched: "bega peanut butter smooth",
      size: "375g",
      subgroup: "grocery_food",
    },
    {
      label: "Canned tomatoes 400g x4",
      qty: 4,
      unitPrice: 1.99,
      lineCost: 7.96,
      matched: "watties chopped tomatoes in purée",
      size: "400g",
      subgroup: "grocery_food",
    },
    {
      label: "Baked beans 420g x3",
      qty: 3,
      unitPrice: 1.1,
      lineCost: 3.3,
      matched: "woolworths essentials baked beans ",
      size: "420g",
      subgroup: "grocery_food",
    },
    {
      label: "Salt 500g",
      qty: 1,
      unitPrice: 1.79,
      lineCost: 1.79,
      matched: "woolworths salt table",
      size: "1kg",
      subgroup: "grocery_food",
    },
    {
      label: "Long-life milk 1L x3",
      qty: 3,
      unitPrice: 2.29,
      lineCost: 6.87,
      matched: "woolworths milk standard uht",
      size: "1L",
      subgroup: "grocery_food",
    },
  ],
  costHistory: [
    37.93, 37.85, 38.2, 38.28, 38.7, 38.92, 39.24, 39.43, 39.62, 40.36, 40.77,
    40.91, 41.69, 42.12, 42.82, 43.0, 43.5, 43.56, 43.6, 43.46, 43.59, 43.29,
    43.48, 43.13, 43.77, 43.81, 43.85, 44.24, 44.22, 44.8, 44.61, 44.72, 44.95,
    44.48, 44.81, 44.58, 45.82, 45.66, 46.1, 46.75, 46.5, 46.87, 46.81, 46.73,
    46.62, 46.7, 46.84, 46.5, 47.33, 47.24, 46.95, 47.13,
  ],
};

/**
 * Fixed display order: nutritious-family, bare-staples, pantry-basics.
 * The card row sorts by totalWeekly desc at render time.
 */
export const BASKETS: Basket[] = [
  NUTRITIOUS_FAMILY,
  BARE_STAPLES,
  PANTRY_BASICS,
];

/** The basket selected by default (the headline framing). */
export const DEFAULT_BASKET: BasketKey = "nutritious-family";

export const BASKET_SOURCE_LINE =
  "Prices: live Woolworths NZ online prices, retrieved 2026-06-05 via the thecolab.ai woolworths-nz skill. History: reconstructed by re-pricing today's basket through Stats NZ Food Price Index sub-indices (CPIM.SE901*).";

export const BASKET_DISCLAIMER =
  "Experimental and indicative only — not financial, legal or policy advice. Built for thecolab.ai 'Impact for Good'. Today's totals are live Woolworths NZ prices; earlier points are reconstructed from Stats NZ FPI movements, not historical receipts. Always verify before relying on these figures.";

// ---------------------------------------------------------------------------
// Pure, testable helpers (mirror food-price-data.ts idioms)
// ---------------------------------------------------------------------------

export function round1(n: number): number {
  return Math.round((n + Number.EPSILON) * 10) / 10;
}

/** Dollar rounding to two decimals (epsilon-safe). */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Percentage change from `from` to `to`, e.g. pctChange(100, 110) === 10. */
export function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}

export function getBasket(key: BasketKey): Basket {
  const b = BASKETS.find((x) => x.key === key);
  if (!b) throw new Error(`Unknown basket: ${key}`);
  return b;
}

/** A weekly cost as a percentage of a single Jobseeker benefit. */
export function pctOfJobseeker(weekly: number): number {
  return round1((weekly / JOBSEEKER_SINGLE_WEEKLY) * 100);
}

/** Total % change across the whole history (first → last). */
export function cumulativeChangePct(history: number[]): number {
  if (history.length < 2) return 0;
  return round1(pctChange(history[0], history[history.length - 1]));
}

/** Baskets sorted by weekly cost, dearest first. */
export function basketsByCost(): Basket[] {
  return [...BASKETS].sort((a, b) => b.totalWeekly - a.totalWeekly);
}

/** Sum of the basket's item line costs, rounded to the cent. */
export function itemsTotal(b: Basket): number {
  return round2(b.items.reduce((sum, item) => sum + item.lineCost, 0));
}
