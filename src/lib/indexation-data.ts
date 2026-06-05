// Indexation Impact Simulator — pure data module (no React, no DOM).
// All dollar anchors and shortfalls are embedded exactly from the build's DATA SPEC.
// Sources: MSD benefit rate tables (1 April 2026), CPAG "Below the Income Floor" (2025),
// WEAG (2019). Income-floor figures are CPAG-derived estimates (see DISCLAIMER).

export type BenefitArchetypeId =
  | "single-jobseeker"
  | "sole-parent-3kids"
  | "couple-jobseeker-2kids"
  | "minwage-couple-2kids";

export interface Archetype {
  id: BenefitArchetypeId;
  name: string;
  description: string;
  children: number;
  /** true = at least one parent in paid work (already receiving the in-work credit). */
  hasWorkingParent: boolean;
  benefitType: string;
  housing: string;
  /** Data-grounded net/base weekly figure the levers act on. */
  currentNetWeekly: number;
  /** CPAG-derived weekly shortfall vs the basic-needs floor. */
  weeklyShortfallVsFloor: number;
  /** currentNetWeekly + weeklyShortfallVsFloor (the basic-needs floor). */
  incomeFloorWeekly: number;
  baseBenefitNote: string;
}

export interface LeverSettings {
  /** 0–15 (%), percentage uplift on base for restoring wage-indexation. */
  wageIndexPct: number;
  /** Extend the in-work tax credit to beneficiary children. */
  iwtcExtended: boolean;
  /** 0/12/25/47 (%), WEAG-benchmark lift as a percentage uplift on base. */
  weagLiftPct: number;
}

export interface LeverMeta {
  id: string;
  label: string;
  helptext: string;
}

// Shared constants — the calc module imports these so there are no magic numbers there.
export const IWTC_PER_CHILD_WEEKLY = 50;
export const WAGE_INDEX_MAX_PCT = 15;
export const WEAG_MAX_PCT = 47;
// WEAG recommended range 12–47%.
export const WEAG_STEPS = [0, 12, 25, 47] as const;

export const ARCHETYPES: Archetype[] = [
  {
    id: "single-jobseeker",
    name: "Single adult on Jobseeker / Supported Living Payment",
    description:
      "Single working-age adult, no children, on a main benefit (Jobseeker Support or Supported Living Payment).",
    children: 0,
    hasWorkingParent: false,
    benefitType: "Jobseeker Support (single, 25+) / SLP",
    housing:
      "Single rental (often shared or boarding); Accommodation Supplement assumed",
    currentNetWeekly: 372.55,
    weeklyShortfallVsFloor: 100,
    incomeFloorWeekly: 472.55,
    baseBenefitNote:
      "Anchored on the real net Jobseeker single 25+ rate of $372.55/wk from 1 April 2026 (up from $361.32, CPI 3.11% uplift). CPAG puts this household about $100/wk short of basic and participation costs; the floor is the rate plus that shortfall.",
  },
  {
    id: "sole-parent-3kids",
    name: "Sole parent with 3 children, private rental",
    description:
      "Single parent of three children renting privately, on Sole Parent Support plus Working for Families and Accommodation Supplement.",
    children: 3,
    hasWorkingParent: false,
    benefitType:
      "Sole Parent Support + Family Tax Credit + Accommodation Supplement",
    housing: "Private rental (high housing-cost exposure)",
    currentNetWeekly: 521.52,
    weeklyShortfallVsFloor: 200,
    incomeFloorWeekly: 721.52,
    baseBenefitNote:
      "Anchored on the real Sole Parent Support base rate of $521.52/wk from April 2026. This is the base benefit only — real disposable income would also include Family Tax Credit and the Accommodation Supplement, so it understates true net income. CPAG shortfall is about $200/wk.",
  },
  {
    id: "couple-jobseeker-2kids",
    name: "Couple on Jobseeker with 2 children",
    description:
      "Two-parent household, both on a main benefit (couple Jobseeker rate), with two dependent children.",
    children: 2,
    hasWorkingParent: false,
    benefitType:
      "Jobseeker Support (couple) + Family Tax Credit + Accommodation Supplement",
    housing: "Rental, family-sized; Accommodation Supplement assumed",
    currentNetWeekly: 620,
    weeklyShortfallVsFloor: 320,
    incomeFloorWeekly: 940,
    baseBenefitNote:
      "Estimated. The report gives no exact couple-Jobseeker dollar figure; the couple combined base is roughly twice the single 25+ rate (about $620/wk, base only, excluding Working for Families and the Accommodation Supplement). CPAG finds this household $300+/wk short; modelled here as $320. This is the softest of the four anchors.",
  },
  {
    id: "minwage-couple-2kids",
    name: "Minimum-wage couple with 2 children (40 hrs)",
    description:
      "Working two-parent household with two children; one earner on the adult minimum wage working 40 hours, topped up by Working for Families / in-work tax credit.",
    children: 2,
    hasWorkingParent: true,
    benefitType:
      "Wages + Working for Families (Family Tax Credit + In-Work Tax Credit) + Accommodation Supplement",
    housing: "Private rental",
    currentNetWeekly: 880,
    weeklyShortfallVsFloor: 50,
    incomeFloorWeekly: 930,
    baseBenefitNote:
      "Estimated. One earner at the real adult minimum wage of $23.95/hr from 1 April 2026 x 40 hrs = $958 gross/wk; after PAYE/ACC and Working for Families top-ups gives an inferred figure near $880/wk. CPAG finds a minimum-wage couple with 2 children in deficit even at 40 hours; modelled here as about $50/wk short. Demonstrates in-work poverty: about 60% of poor children have a working parent.",
  },
];

export const LEVERS: {
  wageIndex: LeverMeta;
  iwtc: LeverMeta;
  weag: LeverMeta;
} = {
  wageIndex: {
    id: "restore-wage-indexation",
    label: "Restore wage-indexation of main benefits",
    helptext:
      "NZ switched main-benefit upratings from wage growth to CPI in 2024, locking in a widening real gap. This slider adds a wage-catch-up uplift to the base benefit. Try up to +15%.",
  },
  iwtc: {
    id: "extend-iwtc-to-beneficiary-children",
    label: "Extend the in-work tax credit to beneficiary children",
    helptext:
      "Budget 2026's $50/week in-work tax credit reaches working families but excludes beneficiary children. Switch this on to pay $50/week per child to benefit-dependent households too. No effect on households already receiving the in-work credit.",
  },
  weag: {
    id: "lift-rates-to-weag",
    label: "Lift core benefit rates toward the WEAG benchmark",
    helptext:
      "The 2019 Welfare Expert Advisory Group judged main benefits too low for basic needs and recommended increases of 12–47%. Pick how far to lift the base rate.",
  },
};

// Shared attribution + disclaimer copy — one source of truth for the page and tests.
export const SOURCE_LINE =
  "Source: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019). Income-floor figures are CPAG-derived estimates.";

export const DISCLAIMER =
  "Experimental and indicative only — not financial, legal or policy advice. Built for thecolab.ai 'Impact for Good'. Dollar anchors use real published MSD rates where available; income-floor and couple-Jobseeker figures are estimated/inferred from CPAG and WEAG, and benefit base rates exclude Working for Families and the Accommodation Supplement, so they understate true disposable income. Lever effects are simplified, additive models for illustration, not a Treasury microsimulation. Underlying analysis is an AI-generated proof-of-concept ('The Baseline We Built', thecolab.ai, 31 May 2026) and has not been peer-reviewed.";
