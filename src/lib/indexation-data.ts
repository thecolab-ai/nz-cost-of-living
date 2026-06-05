// Indexation Impact Simulator — pure data module (no React, no DOM).
// All dollar anchors and shortfalls are embedded exactly from the build's DATA SPEC.
// Sources: MSD benefit rate tables (1 April 2026), CPAG "Below the Income Floor" (2025),
// WEAG (2019). Income-floor figures are CPAG-derived estimates (see DISCLAIMER).
//
// Employed (non-beneficiary) archetypes — net-income derivation:
// Net = gross − PAYE (IRD 2026/27 brackets) − ACC earners' levy 1.75% (cap $156,641);
// excludes KiwiSaver, Working for Families and student loan.
// IRD 2026/27 PAYE brackets: 10.5% to $15,600; 17.5% to $53,500; 30% to $78,100;
// 33% to $180,000; 39% above $180,000.
// Source: IRD tax-rates (1 Apr 2025+), ACC earners' levy 2026/27.
// Net figures below for employed archetypes are after PAYE+ACC only.

export type BenefitArchetypeId =
  | "single-jobseeker"
  | "sole-parent-3kids"
  | "couple-jobseeker-2kids"
  | "minwage-couple-2kids"
  | "single-minwage"
  | "single-60k"
  | "single-100k"
  | "working-couple-2kids";

export interface Archetype {
  id: BenefitArchetypeId;
  name: string;
  description: string;
  children: number;
  /** true = at least one parent in paid work (already receiving the in-work credit). */
  hasWorkingParent: boolean;
  /**
   * true = income derives from a main benefit; the benefit-policy levers
   * (wage-indexation, WEAG lift) act on it. false = wage/salary earner; the
   * benefit levers are no-ops (changing a wage-earner's income would be a
   * false output). IWTC gating is separate and keyed on hasWorkingParent.
   */
  isBeneficiary: boolean;
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
    isBeneficiary: true,
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
    isBeneficiary: true,
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
    isBeneficiary: true,
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
    isBeneficiary: false,
    benefitType:
      "Wages + Working for Families (Family Tax Credit + In-Work Tax Credit) + Accommodation Supplement",
    housing: "Private rental",
    currentNetWeekly: 880,
    weeklyShortfallVsFloor: 50,
    incomeFloorWeekly: 930,
    baseBenefitNote:
      "Estimated. One earner at the real adult minimum wage of $23.95/hr from 1 April 2026 x 40 hrs = $958 gross/wk; after PAYE/ACC and Working for Families top-ups gives an inferred figure near $880/wk. CPAG finds a minimum-wage couple with 2 children in deficit even at 40 hours; modelled here as about $50/wk short. Demonstrates in-work poverty: about 60% of poor children have a working parent.",
  },
  {
    id: "single-minwage",
    name: "Single adult, full-time minimum wage",
    description:
      "Single working-age adult, no children, working 40 hours a week on the adult minimum wage. Income is wages, not a benefit, so the benefit-policy levers do not change it.",
    children: 0,
    hasWorkingParent: true,
    isBeneficiary: false,
    benefitType: "Wages — minimum wage 40 hrs ($23.95/hr, $49,816/yr)",
    housing: "Private rental (1 adult)",
    currentNetWeekly: 794.59,
    weeklyShortfallVsFloor: -322.04,
    incomeFloorWeekly: 472.55,
    baseBenefitNote:
      "Wage earner: $23.95/hr x 40 hrs x 52 = $49,816 gross/yr. Net = gross − PAYE (IRD 2026/27 brackets) − ACC earners' levy 1.75% (cap $156,641) = $794.59/wk; excludes KiwiSaver, Working for Families and student loan. Sits about $322/wk ABOVE the basic-needs floor (a surplus). The benefit-policy levers do not apply to a wage earner.",
  },
  {
    id: "single-60k",
    name: "Single adult earning $60,000",
    description:
      "Single adult, no children, on a $60,000 salary. Income is wages, not a benefit, so the benefit-policy levers do not change it.",
    children: 0,
    hasWorkingParent: true,
    isBeneficiary: false,
    benefitType: "Wages/salary — $60,000/yr",
    housing: "Private rental (1 adult)",
    currentNetWeekly: 937.11,
    weeklyShortfallVsFloor: -464.56,
    incomeFloorWeekly: 472.55,
    baseBenefitNote:
      "Wage/salary earner: $60,000 gross/yr. Net = gross − PAYE (IRD 2026/27 brackets) − ACC earners' levy 1.75% (cap $156,641) = $937.11/wk; excludes KiwiSaver, Working for Families and student loan. Sits about $465/wk ABOVE the basic-needs floor (a surplus). The benefit-policy levers do not apply to a wage earner.",
  },
  {
    id: "single-100k",
    name: "Single adult earning $100,000",
    description:
      "Single adult, no children, on a $100,000 salary. Income is wages, not a benefit, so the benefit-policy levers do not change it.",
    children: 0,
    hasWorkingParent: true,
    isBeneficiary: false,
    benefitType: "Wages/salary — $100,000/yr",
    housing: "Private rental or mortgage (1 adult)",
    currentNetWeekly: 1449.47,
    weeklyShortfallVsFloor: -976.92,
    incomeFloorWeekly: 472.55,
    baseBenefitNote:
      "Wage/salary earner: $100,000 gross/yr. Net = gross − PAYE (IRD 2026/27 brackets) − ACC earners' levy 1.75% (cap $156,641) = $1,449.47/wk; excludes KiwiSaver, Working for Families and student loan. Sits about $977/wk ABOVE the basic-needs floor (a surplus). The benefit-policy levers do not apply to a wage earner.",
  },
  {
    id: "working-couple-2kids",
    name: "Working couple, two incomes, 2 children",
    description:
      "Two-parent household with two children and two earners on $60,000 each. Income is wages, not a benefit, so the benefit-policy levers do not change it.",
    children: 2,
    hasWorkingParent: true,
    isBeneficiary: false,
    benefitType: "Wages/salary — two earners on $60,000 each",
    housing: "Private rental or mortgage (family)",
    currentNetWeekly: 1874.21,
    weeklyShortfallVsFloor: -934.21,
    incomeFloorWeekly: 940,
    baseBenefitNote:
      "Two wage/salary earners on $60,000 each. Each net = gross − PAYE (IRD 2026/27 brackets) − ACC earners' levy 1.75% (cap $156,641) = $937.11/wk; combined $1,874.21/wk; excludes KiwiSaver, Working for Families and student loan. Sits about $934/wk ABOVE the family basic-needs floor (a surplus). The benefit-policy levers do not apply to wage earners.",
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
