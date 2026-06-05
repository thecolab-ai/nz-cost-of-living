// Long-form report content — the full evidence brief rendered at /report.
//
// Pure data module (no React, no DOM). The drafted sections are embedded
// verbatim (only obvious typos fixed); no figures are altered. Each section
// carries paragraphs, stat callouts (with calculation + source for the ⓘ
// popover and the methodology panel), an optional pullquote, optional
// recommendations, an optional cross-link to a live tool, and its source list.
//
// Experimental proof-of-concept for thecolab.ai "Impact for Good" — not advice.

export interface ReportStat {
  value: string;
  label: string;
  calculation: string;
  source: string;
}

export interface ReportRecommendation {
  action: string;
  rationale: string;
  leverage: string;
}

export interface ReportCrossLink {
  href: string;
  label: string;
}

export interface ReportSection {
  id: string;
  title: string;
  subhead: string;
  paragraphs: string[];
  stats: ReportStat[];
  pullquote?: string;
  recommendations?: ReportRecommendation[];
  crossLink?: ReportCrossLink;
  sources: string[];
}

export const REPORT_TITLE =
  "Poverty in Aotearoa 2026 — who, where, and how deeply";

export const REPORT_GENERATED = "5 June 2026";

export const REPORT_INTRO =
  "An experimental, evidence-led proof-of-concept brief from a thecolab.ai Impact for Good build. It assembles official statistics, a live grocery basket and directional modelling into one connected picture of New Zealand's poverty — who is poor, where hardship pools, and which levers would move it. It is not financial, legal or policy advice; every figure traces to a named source line or a live data module, and the live tools let you interrogate the numbers yourself.";

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "exec",
    title: "Executive summary",
    subhead:
      "Poverty in Aotearoa is no longer a question of how many, but of who, where, and how deeply — and the levers that would move it are known, while Budget 2026 leaves the architecture treading water.",
    paragraphs: [
      "This is an experimental proof-of-concept brief from a thecolab.ai Impact for Good build, generated as at 5 June 2026. It is evidence-led, not financial or policy advice. Its purpose is to make a hard truth legible: New Zealand's poverty in 2026 is no longer primarily a question of how many people are poor, but of who, where, and how deeply. Hardship pools by postcode and ethnicity, is multiplied by housing, and is handed down across generations. Every figure below traces to an official source line or a live data module, and the report names what would change it. The headline figures are drawn directly from thecolab.ai's open-data skills — child-poverty-nz and household-hardship-nz (Stats NZ), public-housing-nz (HUD), deprivation-nz (NZDep2023) and stats-nz (CPI) — pulled live from the underlying official releases.",
      "The human stakes come first. One in seven tamariki — 169,300 children, or 14.3% — are now in material hardship, the highest rate since 2015; 71,000 (6.0%) are in severe hardship, up from 4.0% in 2022. That means going without the warmth, fresh food, doctor visits and decent shoes that most New Zealanders take for granted. This is not random misfortune spread thinly across the country. It is concentrated: Pacific children sit at 31.0% and Māori at 25.1%, children in disabled households at 27.5%, against European at 11.5% and Asian at 5.9%. A child's address and whānau, not the national average, largely decide who goes without.",
      "Housing is the master multiplier that converts a modest income gap into a deep one. After housing costs, 210,600 children fall below the anchored poverty line, against 148,700 before housing costs — roughly 62,000 children are poor purely because of where the rent goes. Work no longer guarantees an exit: a record 409,575 working-age people draw a main benefit, about half (~54%) of poor children have a working parent, and both benefits and minimum-wage work fall short of a basic income floor by $100 to $300 a week. A non-cyclical hard core of about 101,600 children is simultaneously low-income and in hardship, part of 697,000 New Zealanders facing sustained, multi-domain disadvantage that a growing economy alone will not reach.",
      "The squeeze is compounding through the essentials the poorest cannot avoid. Electricity is up 13.1% over the year and 33.5% since January 2019; meat, poultry and fish are up 7.8%, outpacing benefits indexed to roughly 3.1% headline inflation. The poorest then pay the most: a prepay power premium of 11–17% per unit is the clearest face of a wider poverty premium that surcharges those least able to pay. Brought down to one lived budget — a sole parent with three children in Auckland — base benefit income of $521.52 a week meets outgoings of $859.69, leaving a deficit of -$338.17 before anything discretionary. (That income is base benefit only; it excludes Working for Families and the Accommodation Supplement, so the real gap for some households is smaller — but the structural shortfall is the point.)",
      "The verdict is that the levers that would move this are known and largely undisputed. The strongest evidence points to restoring wage-indexation of main benefits and lifting rates toward the WEAG benchmark, extending the In-Work Tax Credit to beneficiary children, and growing income-related-rent social housing to close the after-housing-costs gap. Yet Budget 2026 leaves the anti-poverty architecture treading water: its flagship $50/week In-Work Tax Credit still excludes beneficiary children — the very group at greatest risk — Treasury concedes it will meet only 1 of 3 modelled 2027 targets, and about 47,500 more children are in hardship than three years ago. The targets are on track to be missed by design, not by accident.",
      "The eight points that follow map the whole picture: a concentrated hardship rate at its highest since 2015; work that no longer reliably lifts families out; housing as the dominant multiplier; a cost-of-living shock in power and food; an intergenerational hard core; a poverty premium that makes scarcity more expensive; spatial pooling by postcode; and a Budget that routes help away from the poorest by rule. The live tools — /brief as the full data overview and /budget for the one-household hook — let you interrogate the figures directly. This remains an experimental proof-of-concept, offered as evidence to inform debate, not as advice.",
    ],
    stats: [
      {
        value: "169,300 (14.3%)",
        label:
          "Children in material hardship — the highest rate since 2015; 71,000 (6.0%) in severe hardship, up from 4.0% in 2022",
        calculation:
          "CHILD_MATERIAL_HARDSHIP (brief-data.ts); severe MEASI 6.0% vs 4.0% in 2022",
        source:
          "child-poverty-nz skill — Stats NZ Child poverty statistics YE June 2025 (MEASC 14.3%/169,300; MEASI 6.0%/71,000)",
      },
      {
        value: "~62,000",
        label:
          "Children poor purely because of housing costs — 210,600 below the anchored AHC line vs 148,700 BHC",
        calculation:
          "AHC_CHILD_POVERTY (brief-data.ts): count 210,600 − bhc 148,700 = housingOnly 62,000",
        source:
          "child-poverty-nz skill — Stats NZ YE June 2025 (MEASB AHC<50% 17.8%/210,600; MEASA BHC<50% 12.6%/148,700)",
      },
      {
        value: "-$338.17/wk",
        label:
          "Weekly deficit for a sole parent with 3 children in Auckland: income $521.52 vs outgoings $859.69 (base benefit only)",
        calculation:
          "repBudget (budget-calc.ts): 521.52 − (rent 640 + food 109.69 + power 50 + other 60 = 859.69) = -338.17",
        source:
          "brief-data.ts repBudget; housing-data.ts; basket-data.ts (live Woolworths, 2026-06-05)",
      },
      {
        value: "1 of 3",
        label:
          "2027 child-poverty targets Budget 2026 will meet, per Treasury; about 47,500 more children in hardship than three years ago",
        calculation:
          "Treasury modelling; child material hardship rise 10.6% (2022) to 14.3% (2025)",
        source: "RNZ Budget 2026 coverage, 28 May 2026; CPAG",
      },
    ],
    pullquote:
      "169,300 children in material hardship is the highest rate since 2015 — but the story is who, where, and how deeply: Pacific 31.0%, Māori 25.1%, and roughly 62,000 children poor purely because of housing costs.",
    sources: [
      "child-poverty-nz skill — Stats NZ, Child poverty statistics year ended June 2025 (MEASC material hardship 14.3%/169,300; MEASI severe 6.0%/71,000; MEASA BHC<50% 12.6%/148,700; MEASB AHC<50% 17.8%/210,600; ethnicity and disability breakdowns)",
      "brief-data.ts: CHILD_MATERIAL_HARDSHIP (169,300 / 14.3%); AHC_CHILD_POVERTY (count 210,600, bhc 148,700, housingOnly 62,000); BRIEF_GENERATED / SUITE_GENERATED_ON '5 June 2026'",
      "budget-calc.ts / brief-data.ts repBudget — BUDGET_SOURCE_LINE: income $521.52, outgoings $859.69, residual -$338.17 (base benefit only; excludes Working for Families and Accommodation Supplement)",
      "indexation-data.ts ARCHETYPES — SOURCE_LINE: single Jobseeker 25+ $372.55/wk (1 April 2026); CPAG 'Below the Income Floor' (2025); WEAG (2019)",
      "energy-data.ts — ENERGY_SOURCE_LINE: electricity +13.1%/yr, +33.5% since Jan 2019; ENERGY_POVERTY_PREMIUM_PCT '11–17%' (Stats NZ CPI Level 3, CPIM.SE904501)",
      "food-price-data.ts — FOOD_SOURCE_LINE: food +2.6%/yr, meat/poultry/fish +7.8%/yr (Stats NZ Food Price Index, April 2026, CPIM.SE901)",
      "MSD Benefit Fact Sheets Snapshot, March 2026 quarter — 409,575 working-age on a main benefit",
      "Save the Children / CPAG NZ (Feb 2026) — ~half (~54%) of poor children have a working parent",
      "NZ Productivity Commission / Treasury, A Fair Chance for All (2023) — 697,000 facing sustained multi-domain disadvantage",
      "RNZ Budget 2026 coverage, 28 May 2026 (https://www.rnz.co.nz/news/political/596701/50-000-more-children-suffering-from-material-hardship-than-three-years-ago); CPAG latest official child poverty measures, 26 Feb 2026",
      "MSD Supplementary Analysis Report, indexing main benefits to inflation (https://www.msd.govt.nz/documents/about-msd-and-our-work/publications-resources/regulatory-impact-statements/sar-indexing-main-benefits-to-inflation.docx)",
    ],
  },
  {
    id: "baseline",
    title: "The baseline: where Aotearoa is in 2026",
    subhead:
      "One in seven tamariki are in material hardship — the highest rate since 2015 — and a child's address and ethnicity, not the national average, decide who goes without.",
    paragraphs: [
      "In the year ended June 2025, 169,300 New Zealand children — 14.3% of all tamariki — were living in material hardship, the highest rate since 2015. Material hardship is poverty measured in lived terms: it counts households going without six or more basics from a list of seventeen, things like heating the home, eating fresh fruit and vegetables, seeing a doctor, or replacing worn-out shoes. Within that group, 71,000 children (6.0%) are in severe hardship, lacking nine or more essentials — up from 4.0% in 2022. A third measure, the combined count of children who are both on a low income and in hardship, sits at 101,600 (8.6%). This is the non-cyclical hard core: the children whose poverty does not lift when the economy turns.",
      "These three statutory measures matter because the Child Poverty Reduction Act 2018 binds the Government to reduce them. All three are now off track and moving the wrong way. The legislated 2028 target for material hardship is 6.0% — less than half today's rate — while the interim 2024 targets (the before-housing-costs line at 10% and the after-housing-costs line at 15%) were all missed. Treasury concedes that on current settings Budget 2026 will meet only one of its three modelled 2027 targets, and about 47,500 more children are in hardship than three years ago. The targets are being missed by design, not by accident: officials advised that around $3 billion a year would be needed to hit them, and that advice was not taken up.",
      "Behind the rise, the trajectory is unambiguous. Pulled live from the child-poverty-nz skill, the official series runs from 13.3% (147,600 children) in 2018, down to a low of 10.6% (121,800) in 2022, then back up to 14.3% (169,300) in 2025 — a 3.7 percentage-point climb off the 2022 trough that is an additional 47,500 children in hardship in just three years. The latest single-year move was +0.8 points, about 10,500 more children, against a total child population of 1,182,800. The highest hardship rate since 2015 alongside stalled income measures shows the country moving away from its own legislated goals.",
      "The central thesis of this report is that poverty here is concentrated and structural, not cyclical. It is pooled by ethnicity, by disability and by postcode. Pacific children face material hardship at 31.0% (54,400 children) and Māori children at 25.1% (76,900), against 11.5% for European (86,000) and 5.9% for Asian children (14,700) — Pacific and Māori children at roughly two to three times the European rate. Disability compounds it: disabled children sit at 26.9% and children in a disabled household at 27.5%, about double their non-disabled counterparts (12.7% and 8.4% respectively). At the severe end the gap is starker still: Pacific 14.9% and Māori 12.2%, versus European 4.7% and Asian 1.1%. Nearly 80% of the lowest-income households are sole parents — overwhelmingly women — living on under $46,000 in average disposable income. A national average of 14.3% conceals these multiples; it tells you almost nothing about who actually goes without.",
      "Geography tells the same story in map form. Because the NZDep2023 index is relative, the most-deprived roughly 20% of New Zealanders sit in deciles 9–10 by construction — but that disadvantage is not spread evenly. In Kawerau District, 78.0% of people live in those most-deprived areas, 3.9 times the national baseline; Wairoa sits at 74.5% and Ōpōtiki at 69.3%. Gisborne is the worst-affected region at 47.8%. This pooling is the join key that localises every other driver — income, housing, energy, food, health — into named communities. And it tends to repeat across generations: A Fair Chance for All estimated 697,000 New Zealanders face sustained, multi-domain disadvantage that a growing economy alone will not reach.",
      "This section is an experimental, evidence-led proof of concept, not financial or policy advice. It sets the baseline the rest of the report builds on: known, largely undisputed levers exist to move these numbers, but the architecture is treading water. The live data brief at /brief gives the full overview, and /map lets you trace the postcode penalty centre by centre — the foundational ideas to keep in mind as the drivers stack up in the sections that follow.",
    ],
    stats: [
      {
        value: "169,300",
        label:
          "Children in material hardship (14.3%) — the highest rate since 2015; +47,500 since the 2022 low of 10.6% (121,800)",
        calculation:
          "MEASC, YE June 2025 169,300 minus YE June 2022 low 121,800 = +47,500 children",
        source:
          "child-poverty-nz skill — Stats NZ Child poverty statistics YE June 2025 (MEASC; 2018=13.3%/147,600, 2022=10.6%/121,800, 2025=14.3%/169,300)",
      },
      {
        value: "71,000",
        label:
          "Children in severe material hardship (6.0%), up from 4.0% in 2022",
        calculation: "MEASI, year ended June 2025; subset of material hardship",
        source:
          "child-poverty-nz skill — Stats NZ YE June 2025 (MEASI 6.0%/71,000)",
      },
      {
        value: "31.0% / 25.1%",
        label:
          "Pacific and Māori child material hardship, vs 11.5% European and 5.9% Asian; disabled-household children 27.5%",
        calculation:
          "MEASC by ethnicity and disability, YE June 2025 — concentration, not randomness",
        source:
          "child-poverty-nz skill — Stats NZ YE June 2025 (MEASC by ethnicity: Pacific 31.0%, Māori 25.1%, European 11.5%, Asian 5.9%; disabled household 27.5%)",
      },
      {
        value: "697,000",
        label:
          "New Zealanders facing sustained multi-domain disadvantage — the non-cyclical hard core",
        calculation: "Persistent/intergenerational estimate",
        source:
          "NZ Productivity Commission / Treasury, A Fair Chance for All, 2023",
      },
    ],
    pullquote:
      "A national average of 14.3% tells you almost nothing about who actually goes without. A child's address and ethnicity do.",
    sources: [
      "child-poverty-nz skill — Stats NZ, Child poverty statistics, year ended June 2025 (MEASC material hardship 14.3% / 169,300; MEASI severe 6.0% / 71,000; MEASJ combined low-income-and-hardship 8.6% / 101,600; ethnicity: Pacific 31.0%/54,400, Māori 25.1%/76,900, European 11.5%/86,000, Asian 5.9%/14,700; disability: disabled children 26.9%, disabled household 27.5%; trend 2018 13.3%/147,600 → 2022 low 10.6%/121,800 → 2025 14.3%/169,300; total child population 1,182,800)",
      "Child Poverty Reduction Act 2018 — 2028 material-hardship target 6.0%; interim 2024 targets BHC50 10% / AHC50 15% (all missed). CPAG, 'Latest official child poverty measures 2024/25', 26 February 2026",
      "RNZ, Budget 2026 coverage, 28 May 2026 ('50,000 more children suffering...', Treasury meets only 1 of 3 modelled 2027 targets; ~$3b/yr advised)",
      "NZ Productivity Commission / Treasury, A Fair Chance for All, 2023 (697,000 sustained multi-domain disadvantage)",
      "deprivation-data.ts, DEPRIVATION_SOURCE_LINE — University of Otago (HIRP) NZDep2023, 2023 Census (Kawerau 78.0%, Wairoa 74.5%, Ōpōtiki 69.3%, Gisborne region 47.8%; NATIONAL_BASELINE_PCT=20; overIndex(78.0)=3.9)",
      "brief-data.ts — CHILD_MATERIAL_HARDSHIP (169,300 / 14.3%), BRIEF_GENERATED 5 June 2026",
    ],
  },
  {
    id: "income",
    title: "Benefit adequacy and the indexation drift",
    subhead:
      "Income inadequacy is the binding constraint upstream of food, power and rent — and since 2024 a quiet change to how benefits are adjusted has been widening the gap every year.",
    paragraphs: [
      "Strip poverty back to its engine room and one number does the work: how much money a household actually has to spend each week. Every other pressure in this report — the weekly shop, the power bill, the rent — is a claim on that figure, and when it falls short the shortfall does not disappear. It shows up as a cold home, a skipped meal, a doctor's visit deferred. In Aotearoa in 2026 the income floor is too low and, by design, falling further behind. A single Jobseeker aged 25 or over receives $372.55 a week from 1 April 2026. The Child Poverty Action Group puts a basic-needs floor for that same household at $472.55 — roughly $100 a week short. A sole parent on Sole Parent Support receives $521.52 a week against a floor of $721.52, about $200 short. These are not deep-poverty edge cases; they are the standard rates.",
      "The gap is not an accident of one bad year — it is now structural, locked in by a change to how benefits are indexed. From 2020 main benefits were adjusted in line with net average wage growth; from 1 April 2024 that was reverted to the Consumers Price Index. Because wages, and the everyday costs the poorest actually face, have historically risen faster than headline CPI, indexing to inflation quietly widens the real gap each year. Official MSD modelling makes the drift concrete: by the 2028 tax year the single Jobseeker rate is forecast to sit about $18.15 a week lower under CPI indexation than it would have under wage indexation, and the reversion is estimated to push around 7,000 more children into poverty on each of the two primary measures — while saving the Crown roughly $669.5 million over the forecast period. The saving and the harm are two sides of the same decision.",
      "Work no longer reliably buys the way out. A record 409,575 working-age New Zealanders draw a main benefit — 12.7 per cent of the working-age population — including 215,214 on Jobseeker Support and 108,498 on the Supported Living Payment, the latter tying poverty tightly to disability. And the people in work are not safe either: about half (~54%) of children in poverty have a parent who works. That single finding undercuts the premise beneath the whole work-incentive architecture. When benefits and minimum-wage work both fall short of a basic income floor — by $100 to $300 a week depending on family type — the question stops being whether people are trying and becomes whether the floor itself is high enough to stand on.",
      "There is a gendered and ethnic shape to this that the averages hide. Sole-parent recipients are overwhelmingly women, and nearly 80 per cent of the lowest-income households are sole parents living on under $46,000 in average disposable income. Income inadequacy is not spread evenly either: Stats NZ's Household Economic Survey, via the household-hardship-nz skill, finds 608,300 households (about 32.8 per cent of those stating) report their income is not enough — but among Pacific households that rises to 50.5 per cent and among Māori to 40.8 per cent, against the national third. The Sole Parent Support rate of $521.52 is, moreover, base benefit only — it excludes Working for Families and the Accommodation Supplement, so it understates true disposable income — yet even on that conservative base the $200 weekly shortfall against the floor lands first and hardest on women raising children alone. Design choices about benefit adequacy are, in practice, choices about how much money mothers have to feed and warm their kids.",
      "What would move it is not mysterious. The Welfare Expert Advisory Group recommended in 2019 that core benefits rise by between 12 and 47 per cent depending on family type; five years on, not one of its 42 key recommendations has been fully implemented. The natural experiment already ran: when benefits were lifted and re-indexed to wages from 2018 to 2022, after-housing-costs child poverty fell, with an estimated tens of thousands of children lifted clear. Those gains have since unwound. The cleanest single lever is to restore wage indexation (or index to the higher of wages or CPI) and lift rates toward the WEAG benchmark — and to extend the In-Work Tax Credit to beneficiary children, who are currently excluded by rule: CPAG estimates a one-to-three-child benefit family missed out on $18,850 over five years. Budget 2026 raised the IWTC by $50 a week but kept that exclusion intact, which is why advocates called it a washout.",
      "This section is an experimental, proof-of-concept analysis, not financial or policy advice. The dollar anchors use real published MSD rates; the income-floor figures are CPAG-derived estimates, and the 2028 forecasts are directional HYEFU-based modelling with wide confidence intervals (roughly plus or minus 4,000 to 6,000 children). The Indexation Simulator lets you test the trade-off yourself — toggle wage versus CPI indexation, step through the WEAG lifts at 0, 12, 25 and 47 per cent, and add the $50-per-child IWTC — to see how the floor moves under each choice.",
    ],
    stats: [
      {
        value: "$372.55/wk",
        label:
          "Single Jobseeker (25+) net rate, 1 April 2026 — about $100/wk below CPAG's $472.55 basic-needs floor",
        calculation:
          "ARCHETYPES[0].currentNetWeekly 372.55; incomeFloorWeekly 472.55; shortfall ~$100/wk",
        source:
          "MSD benefit rate tables (1 April 2026); CPAG 'Below the Income Floor' (2025); indexation-data.ts SOURCE_LINE",
      },
      {
        value: "$521.52/wk",
        label:
          "Sole Parent Support base rate (base benefit only) — about $200/wk below the $721.52 floor",
        calculation:
          "ARCHETYPES[1].currentNetWeekly 521.52; incomeFloorWeekly 721.52; excludes Working for Families and Accommodation Supplement",
        source:
          "MSD benefit rate tables (1 April 2026); CPAG (2025); indexation-data.ts",
      },
      {
        value: "409,575",
        label:
          "Working-age people on a main benefit (12.7%) — Jobseeker 215,214, Supported Living 108,498",
        calculation:
          "MSD Benefit Fact Sheets Snapshot, March 2026 quarter (msd-benefits-nz skill is frozen at Dec 2019, so this current figure is taken from the live MSD fact sheets it directs to)",
        source: "MSD Benefit Fact Sheets Snapshot, March 2026 quarter",
      },
      {
        value: "608,300 (32.8%)",
        label:
          "Households reporting income is not adequate — Pacific 50.5%, Māori 40.8% vs the national third",
        calculation:
          "income-adequacy: 608,300 of 1,857,000 stated = 32.8%; Pacific 74,200/147,000 = 50.5%; Māori 156,900/384,300 = 40.8%",
        source:
          "household-hardship-nz skill — Stats NZ Household Economic Survey, Household Wellbeing 2020/21 (YE June 2021)",
      },
      {
        value: "~7,000",
        label:
          "More children pushed into poverty on EACH primary measure by 2028 from the CPI reversion; Jobseeker ~$18.15/wk lower vs wage-indexed; saves the Crown ~$669.5m",
        calculation:
          "MSD SAR: +7,000 (±4,000 AHC50, ±6,000 BHC50) by tax year 2028; rate ~$18.15/wk lower by 1 April 2028",
        source:
          "MSD Supplementary Analysis Report, indexing main benefits to inflation",
      },
    ],
    pullquote:
      "About half (~54%) of children in poverty have a parent who works — when the income floor itself is too low to stand on, effort is not the missing ingredient.",
    crossLink: {
      href: "/simulator",
      label:
        "Model it yourself — the Indexation Simulator: wage vs CPI, WEAG steps 0/12/25/47%, and the $50/child IWTC toggle",
    },
    sources: [
      "indexation-data.ts SOURCE_LINE: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019). Income-floor figures are CPAG-derived estimates.",
      "MSD Benefit Fact Sheets Snapshot, March 2026 quarter (409,575 on a main benefit; Jobseeker 215,214; Supported Living 108,498). The msd-benefits-nz skill is wired to a frozen Dec 2019 release and directs to the live MSD fact sheets for current figures.",
      "household-hardship-nz skill — Stats NZ Household Economic Survey, Household Wellbeing 2020/21 (income not adequate 608,300/32.8%; Pacific 50.5%, Māori 40.8%; material hardship 126,200 households nationally, Māori 25.5%, Pacific 26.7%)",
      "MSD Supplementary Analysis Report, indexing main benefits to inflation: https://www.msd.govt.nz/documents/about-msd-and-our-work/publications-resources/regulatory-impact-statements/sar-indexing-main-benefits-to-inflation.docx",
      "Treasury / MSD analysis of the 2018–2022 Families Package & benefit increases — estimated to have lifted tens of thousands of children out of AHC poverty (estimate of a bundle of policies)",
      "CPAG, Working for Families (IWTC exclusion; ~$18,850 missed over 5 years; ~$500–600m/yr to extend): https://www.cpag.org.nz/statistics/working-for-families",
      "CPAG, Govt yet to fully implement a single key WEAG recommendation: https://www.cpag.org.nz/media-releases/govt-yet-to-fully-implement-a-single-key",
      "RNZ, Budget 2026 a washout (IWTC +$50/wk, beneficiary children excluded): https://www.rnz.co.nz/news/budget-2026/596645/budget-2026-a-washout-for-struggling-families-advocates-say",
      "Save the Children / CPAG NZ (Feb 2026): ~half (~54%) of poor children have a working parent",
    ],
  },
  {
    id: "food",
    title: "The weekly shop — food price index and the live basket",
    subhead:
      "Food is the line that shrinks first when money runs out — and the gap between bare survival and a nourishing plate is the dignity poverty quietly strips away.",
    paragraphs: [
      "When a household's income runs short, food is the one bill that bends. Rent is fixed, power keeps the lights on, and the bus fare to the doctor is non-negotiable — so the plate is where families absorb the squeeze. That makes the weekly shop one of the clearest expressions of poverty in Aotearoa, and one of the most measurable. To show what a benefit actually buys, this section pairs the official Food Price Index trend with a live priced basket from a New Zealand supermarket, retrieved on 5 June 2026.",
      "The official trend is the backdrop. To April 2026, food prices rose 2.6% over the year (Stats NZ Food Price Index, series CPIM.SE901), but the average hides a sharper squeeze on the staples that matter most to a tight budget. Meat, poultry and fish — the cheapest reliable protein for most families — rose 7.8% over the year, the single fastest-inflating food group, while fruit and vegetables climbed 3.7%. Crucially, these run ahead of the 3.1% headline CPI (Stats NZ, March 2026 quarter, via the stats-nz skill) to which main benefits are now indexed, so even 'maintained' support loses ground on the food that keeps a child fed and growing.",
      "Our live basket makes the abstraction concrete. A bare-staples week for one adult — carbohydrates, dairy and eggs, with almost no fresh protein or vegetables — comes to $38.79, or just 10.4% of a single Jobseeker benefit ($372.55/wk from 1 April 2026). That sounds survivable, until you notice what it leaves out. Step up to a nutritious week for a family of four and the cost is $109.69, or 29.4% of that same single benefit. The difference between $38.79 of bare survival and a basket with fresh protein, fruit and vegetables in it is, in plain terms, the difference between not going hungry and actually eating well — and for the poorest households that difference is unaffordable before rent is even counted.",
      "The consequences are visible in the queues. Roughly one in three households is now food-insecure, and the burden falls exactly where every other driver concentrates: Pacific households at 64%, Māori at 51%, and single-parent-with-children households at 70% (NZ Food Network Hunger Monitor 2025). Foodbanks are feeding more than 500,000 people a month — about 165% more than before the pandemic. Food relief eases acute hunger, but it sits downstream of an income shortfall it cannot fix; it caps the depth of hardship rather than lifting families across the line.",
      "A note on the numbers: our headline basket prices are live Woolworths NZ prices retrieved on 5 June 2026 via the woolworths-nz skill. Other research cites a comparable PAK'nSAVE bare-staples shop at $44.78; we lead with our own live Woolworths figure of $38.79 and footnote that cross-source difference rather than blending them. Live pricing is robust for this analysis but brittle and Terms-of-Service-sensitive — the fuller caveat sits in the limitations section. This is an experimental proof-of-concept and not financial or policy advice; it is meant to make a real budget legible, not to prescribe one.",
      "The takeaway is simple and hard at once. A benefit can stretch to bare carbohydrate-and-egg survival, but it cannot reliably stretch to nutrition — and the gap widens every year that food (and especially meat at 7.8%) outpaces benefit indexation. The live basket below lets you swap the bare-staples shop for the nutritious one and watch the share of a benefit it consumes climb in real time.",
    ],
    stats: [
      {
        value: "$38.79",
        label:
          "Bare-staples week, 1 adult = 10.4% of a single Jobseeker benefit",
        calculation:
          "BARE_STAPLES.totalWeekly=38.79, 11 items, pctOfJobseeker=10.4 (of $372.55 JOBSEEKER_SINGLE_WEEKLY); live Woolworths, 2026-06-05",
        source:
          "basket-data.ts (live Woolworths NZ via woolworths-nz skill, 2026-06-05)",
      },
      {
        value: "$109.69",
        label:
          "Nutritious week, family of 4 = 29.4% of a single Jobseeker benefit",
        calculation:
          "NUTRITIOUS_FAMILY.totalWeekly=109.69, 18 items, pctOfJobseeker=29.4 (DEFAULT_BASKET='nutritious-family')",
        source: "basket-data.ts (live Woolworths NZ, 2026-06-05)",
      },
      {
        value: "+7.8%/yr",
        label:
          "Meat, poultry & fish — fastest-inflating food group (food overall +2.6%, fruit & veg +3.7%)",
        calculation:
          "META.meat_poultry_fish.annualPct=7.8, latest index 1392.0; META.total.annualPct=2.6; META.fruit_veg.annualPct=3.7 (April 2026)",
        source:
          "Stats NZ Food Price Index, April 2026 (series CPIM.SE901); food-price-data.ts META",
      },
      {
        value: "500,000+/mth",
        label:
          "People fed by foodbanks monthly (+165% vs pre-pandemic); 1 in 3 households food-insecure",
        calculation:
          "NZ Food Network Hunger Monitor 2025: food-insecure Pacific 64%, Māori 51%, single-parent 70%",
        source: "NZ Food Network Hunger Monitor 2025; NZ Food Network",
      },
    ],
    pullquote:
      "A single Jobseeker benefit stretches to $38.79 of bare survival — carbs, dairy and eggs — but a nutritious week for a family of four costs $109.69, nearly a third of that same benefit, before a cent of rent.",
    crossLink: {
      href: "/basket",
      label: "Price the live basket against a benefit yourself",
    },
    sources: [
      "basket-data.ts BASKET_SOURCE_LINE: Prices: live Woolworths NZ online prices, retrieved 2026-06-05 via the thecolab.ai woolworths-nz skill. History: reconstructed by re-pricing today's basket through Stats NZ Food Price Index sub-indices (CPIM.SE901*).",
      "food-price-data.ts FOOD_SOURCE_LINE: Source: Stats NZ Selected Price Indexes (Food Price Index), April 2026 — series CPIM.SE901. Index base: June 2017 quarter = 1000.",
      "indexation-data.ts SOURCE_LINE: Source: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019). Single Jobseeker (25+) net weekly rate $372.55/wk.",
      "stats-nz skill — Stats NZ Consumers Price Index, March 2026 quarter: headline annual CPI 3.1% (series CPIQ.SE9A), the indexation benchmark for main benefits",
      "NZ Food Network Hunger Monitor 2025 (1 in 3 households food-insecure; Pacific 64%, Māori 51%, single-parent 70%; foodbanks 500,000+/month, +165% vs pre-pandemic)",
      "Research digest cross-source note: PAK'nSAVE bare-staples basket $44.78 (paknsave-nz live, 31 May 2026) — our headline uses live Woolworths $38.79; difference footnoted.",
    ],
  },
  {
    id: "housing",
    title: "The master multiplier — rent versus the Accommodation Supplement",
    subhead:
      "Roughly 62,000 children in Aotearoa are poor for one reason alone: the cost of keeping a roof overhead.",
    paragraphs: [
      "Housing is the dimension that quietly converts a modest income gap into deep material hardship. New Zealand measures child poverty two ways: before housing costs (BHC) and after housing costs (AHC). On the anchored AHC<50% line, 210,600 children are poor; on the BHC line, 148,700 are. The roughly 62,000-child difference is not a statistical artefact — it is poverty manufactured by rent and mortgage costs. These are children whose family income would clear the line if housing did not take such a large bite first. Once the rent is paid, food, power and transport have to be found from what little remains, which is why housing sits upstream of almost every other hardship in this report.",
      "The mechanics are visible centre by centre. The national median weekly rent for a new tenancy is $595. In Auckland, a typical family rent is $640 a week, but the maximum Accommodation Supplement (AS) for a family of two-or-more children in the highest-cost area is only $305 — covering just 47.7% of the rent and leaving a residual $335 a week to find from a benefit already short of an adequate income floor. The squeeze is worse, proportionally, in smaller centres: in Invercargill the family AS maximum is $120 against $485 rent, covering only 24.7%. The largest cash gap of all is in Queenstown-Lakes, where $750 rent against the $305 cap leaves a $445 weekly shortfall. The cash subsidy, in other words, is structurally incapable of closing the gap in the markets where rents are highest.",
      "The two main housing instruments behave very differently, and the contrast is the heart of the policy question. The Accommodation Supplement is a cash top-up paid to about 385,025 households nationwide, costing around $42.5 million a week (HUD, as at 1 December 2024, via the public-housing-nz skill) — and it is capture-prone. MSD's own analysis cites international evidence that 30–78% of the subsidy is absorbed by higher rents rather than reaching tenants, because landlords can raise rents to soak up the top-up. AS maxima set in 2018 are based on 2016 rents, so their real value erodes every year the market moves. Income-related rent through the social housing system (IRRS) works the opposite way: it caps a tenant's rent at 25% of net income, with the state paying the balance to the landlord. That structurally collapses the after-housing-costs gap where hardship is generated — each IRRS place removes one household's housing-cost penalty almost in full. There are 83,576 social-housing tenancies and 83,550 public homes (Kāinga Ora 69,590 plus community providers 13,960) as at 31 March 2025 — the protective stock that grows far too slowly to match need.",
      "The catch is supply. The protective lever is being throttled at exactly the moment it is most needed. Net public-housing growth is now flat-to-negative: a Kāinga Ora plan builds around 1,500 new homes while demolishing about 700 and selling roughly 800, against a net +3,600 in the year to June 2024. So the instrument with the strongest mechanism has, on current settings, a realised effect on the baseline that is close to zero — high structural potential, flat trajectory. The social housing register stood at 19,704 applicant households at 31 March 2026, up 2.1% on the year, though falling waitlists partly reflect tighter eligibility rather than met need.",
      "At the severe end, the picture is starker still: 112,496 people were severely housing-deprived at the 2023 Census, up from 99,462 in 2018. For this group, Housing First-style sustained tenancies cost roughly $4,800 per whānau a year against about $56,000 for emergency housing, with a five-year New Zealand cohort showing higher incomes and fewer hospitalisations. The recent fall in emergency-housing motel use moved the count, not necessarily the need, even as visible unsheltered homelessness rose. Renters, sole-parent and large families, and Māori and Pacific children — who are far more likely to rent and to live in high-deprivation, high-rent areas — carry the housing-cost penalty most heavily, which is why housing concentrates the disadvantage that the rest of this report traces.",
      "These figures are an experimental proof-of-concept drawn from official and live data sources, not financial or policy advice. The 62,000-child gap is the load-bearing number this section owns; it recurs across the report but belongs here, where the mechanism that produces it can be seen plainly.",
    ],
    stats: [
      {
        value: "62,000",
        label:
          "children poor purely because of housing costs (210,600 AHC vs 148,700 BHC)",
        calculation:
          "AHC_CHILD_POVERTY: count 210,600 minus bhc 148,700 = housingOnly 62,000",
        source:
          "Stats NZ YE June 2025 (MEASA/MEASB); brief-data.ts AHC_CHILD_POVERTY",
      },
      {
        value: "47.7%",
        label:
          "of an Auckland family's $640/wk rent covered by the max Accommodation Supplement, leaving a $335/wk residual",
        calculation:
          "HOUSING_CENTRES Auckland: asMaxFamily 305 / rentWeekly 640 = 47.7%; residualFamily 335",
        source:
          "housing-data.ts (MBIE Tenancy Services bond data 2026-03-01; WINZ AS maxima 1 April 2026)",
      },
      {
        value: "385,025",
        label:
          "households on the Accommodation Supplement (~$42.5m/wk), with 30–78% lost to landlord capture",
        calculation:
          "public-housing-nz skill: HUD AS dataset summed across 12 MSD regions, 1 Dec 2024 = 385,025 recipients / $42,451,478.50 per week; MSD landlord-capture range 30–78%",
        source:
          "public-housing-nz skill — HUD Accommodation Supplement recipients & weekly spend (data.govt.nz), as at 1 Dec 2024; MSD Supplementary Analysis Report",
      },
      {
        value: "24.7%",
        label:
          "worst AS coverage of family rent — Invercargill ($485 rent, $120 AS max, $365/wk residual)",
        calculation:
          "HOUSING_CENTRES Invercargill sortByCoverage()[0]: asMaxFamily 120 / rentWeekly 485 = 24.7%",
        source:
          "housing-data.ts (WINZ AS maxima 1 April 2026; MBIE rents 2026-03-01)",
      },
    ],
    pullquote:
      "Income-related rent caps a tenant's rent at 25% of net income — the strongest housing lever there is. But with net public-housing builds flat-to-negative, its effect on the baseline today is close to zero.",
    crossLink: {
      href: "/housing",
      label:
        "Compare rent against Accommodation Supplement coverage, centre by centre",
    },
    sources: [
      "child-poverty-nz skill — Stats NZ Child poverty statistics, year ended June 2025 (MEASA BHC<50% 12.6%/148,700; MEASB AHC<50% 17.8%/210,600); brief-data.ts AHC_CHILD_POVERTY (count=210600, bhc=148700, housingOnly=62000)",
      "housing-data.ts HOUSING_SOURCE_LINE: Accommodation Supplement maxima — Work and Income NZ (effective 1 April 2026); Rents — MBIE Tenancy Services rental bond data, median weekly rent of new tenancies (2026-03-01)",
      "public-housing-nz skill — HUD Accommodation Supplement recipients & weekly spend (data.govt.nz), as at 1 Dec 2024: 385,025 recipients, $42,451,478.50/week (summed across 12 MSD regions). NOTE: this supersedes the prior 769,954 / ~$84.9m, which was a naive sum of overlapping geographic rows (Region + TLA + local board) that triple-counted recipients.",
      "public-housing-nz skill — HUD Social Housing Tenancies (83,576, 31 Mar 2025) and Public Homes Stock (83,550 total: Kāinga Ora 69,590 + CHP 13,960, 31 Mar 2025); Housing Register 21,256 (1 Oct 2024, −16.3% year-on-year)",
      "MSD Supplementary Analysis Report — Accommodation Supplement landlord capture 30–78%; IRRS rent capped at 25% of net income",
      "Stats NZ 2023 Census — 112,496 people severely housing-deprived (up from 99,462 in 2018)",
      "interest.co.nz — Kāinga Ora plan ~1,500 builds vs ~700 demolitions, ~800 sales, against net +3,600 to June 2024",
      "MSD — social housing register 19,704 applicant households at 31 March 2026 (+2.1% year-on-year)",
      "Housing First NZ five-year cohort; Sustaining Tenancies ~$4,800/whānau/yr vs ~$56,000/yr emergency housing",
    ],
  },
  {
    id: "energy",
    title: "Power and the poverty premium",
    subhead:
      "Power is leading inflation, the cold-home tax falls on renters and whānau, and the poorest pay the most per unit of it.",
    paragraphs: [
      "Power is one of the few bills a household cannot switch off, and it is rising faster than almost anything else. Electricity climbed 13.1% in the year to April 2026 — the steepest annual rise in the consumer price index since 1989 — and is now 33.5% dearer than it was in January 2019. Reticulated gas has run even harder over the longer view, up 10.8% in the past year and 61.5% since 2019. Both are pulling away from the roughly 3.1% headline inflation that benefits are indexed to, so each year the gap between a power bill and the income meant to cover it widens by design rather than by accident.",
      "The cruelty in the system is that the households least able to absorb these rises pay the most for each unit of energy. Prepay and credit-meter tariffs — the plans low-income families are pushed onto because they cannot pass a credit check or front a bond — cost 11 to 17% more per unit than the cheapest plans available to better-off, lower-risk customers. Layered on top, electricity eats more than 7.5% of the poorest households' income while taking under 1.5% from the richest. This is the poverty premium in its clearest form: a surcharge extracted from those with the least, on a cost they cannot avoid.",
      "The result is energy hardship at scale. About 30% of New Zealand households — roughly one in three — struggle to afford or access adequate energy, and the burden is sharply tenanted and ethnically patterned. Renters are unable to heat their homes at almost five times the rate of owner-occupiers (12.2% versus 2.5%), Pacific households at 14.4% and Māori at around 10%. The sharpest edge is prepay self-disconnection: when the credit runs out the power simply stops, an estimated 27,000 times a month — cold rooms, spoiled food and reconnection costs that compound into debt, falling hardest on the same beneficiary, Māori, Pacific and sole-parent households already counted in the hardship figures.",
      "The state's main cushion against winter has not kept pace. The Winter Energy Payment is frozen at $20.46 a week for a single person and $31.82 for couples or those with children — unchanged across both 2025 and 2026 — so its real value erodes every year against double-digit power inflation. It is also poorly targeted: roughly half the spend flows to superannuitants, including those who are comfortably off, rather than concentrating on the families self-disconnecting in the dark.",
      "Unlike the deeper income and housing drivers, energy hardship has fast, well-evidenced levers. Warmer Kiwi Homes insulation and heating retrofits carry a benefit-cost ratio of 4.66 and cut bills permanently rather than topping them up temporarily. New Consumer Care Obligations now require retailers to protect customers facing disconnection or medical dependence on power, and tighter disconnection and prepay rules are close to costless hardship relief. Re-targeting the Winter Energy Payment could redirect funding toward retrofits without new spend. None of these fix the income floor — but, paired with it, they can shave a meaningful slice off material hardship within a few years.",
      "This is an experimental proof-of-concept built from public data, not financial or policy advice. The energy figures are official Stats NZ price-index series; the poverty-premium band is sourced from the research digest's range, and the live tool lets you trace the electricity and gas trends and the premium yourself.",
    ],
    stats: [
      {
        value: "+13.1%/yr",
        label:
          "Electricity, year to April 2026 — steepest CPI rise since 1989; +33.5% since Jan 2019",
        calculation:
          "META.electricity.annualPct=13.1; cumulativePct=33.5 (index 1038.0 in 2019-01 to 1386.0 in 2026-04)",
        source:
          "energy-data.ts ENERGY_SOURCE_LINE: Stats NZ Selected Price Indexes (CPI Level 3), April 2026 — Electricity CPIM.SE904501",
      },
      {
        value: "11–17%",
        label:
          "Extra paid per unit of power on prepay/credit-meter tariffs — the poverty premium",
        calculation:
          "ENERGY_POVERTY_PREMIUM_PCT='11–17%' (POVERTY_PREMIUM_LOW=11, POVERTY_PREMIUM_HIGH=17)",
        source:
          "energy-data.ts ENERGY_POVERTY_PREMIUM_PCT; research 'premium' driver",
      },
      {
        value: "+10.8%/yr",
        label:
          "Reticulated/mains gas, year to April 2026 — up 61.5% since Jan 2019",
        calculation:
          "META.gas.annualPct=10.8; cumulativePct=61.5 (index 1035.0 in 2019-01 to 1672.0 in 2026-04)",
        source:
          "energy-data.ts ENERGY_SOURCE_LINE: Stats NZ CPI Level 3, Gas CPIM.SE904502",
      },
      {
        value: "$20.46/wk",
        label:
          "Winter Energy Payment, single — frozen across 2025 and 2026 ($31.82 couple/with children)",
        calculation:
          "Unchanged single rate; ~half of the payment flows to superannuitants",
        source: "Work and Income / Selectra NZ, 2026",
      },
    ],
    pullquote:
      "The households least able to absorb rising power bills pay the most for each unit: prepay tariffs cost 11–17% more, and electricity takes 7.5%+ of the poorest's income against under 1.5% for the richest.",
    crossLink: {
      href: "/energy",
      label:
        "Explore the electricity and gas index, cumulative rise since 2019, and the poverty-premium band",
    },
    sources: [
      "energy-data.ts ENERGY_SOURCE_LINE: Stats NZ Selected Price Indexes (CPI Level 3 classes), April 2026 — Electricity CPIM.SE904501, Gas CPIM.SE904502. Index base: June 2017 quarter = 1000",
      "energy-data.ts ENERGY_POVERTY_PREMIUM_PCT = '11–17%' (POVERTY_PREMIUM_LOW=11, POVERTY_PREMIUM_HIGH=17)",
      "Research digest 'premium' driver: electricity 7.5%+ of poorest income vs under 1.5% for richest",
      "MBIE energy hardship measures 2024: ~30% of households in energy hardship; renters 12.2% vs owner-occupiers 2.5%; Pacific 14.4%, Māori ~10%",
      "Electricity Authority data, Winter 2025: ~27,000 prepay self-disconnections/month",
      "Work and Income / Selectra NZ 2026: Winter Energy Payment $20.46/wk single, $31.82/wk couple/with children (unchanged 2025 & 2026)",
      "Motu/EECA: Warmer Kiwi Homes benefit-cost ratio 4.66",
      "MBIE energy-hardship insights: Consumer Care Obligations for disconnection/medically dependent customers (https://www.mbie.govt.nz/about/news/latest-insights-on-energy-hardship-in-new-zealand)",
    ],
  },
  {
    id: "deprivation",
    title: "The postcode penalty",
    subhead:
      "Poverty in Aotearoa is pooled, not spread — a child's address and ethnicity, not the national average, largely decide who goes without.",
    paragraphs: [
      "New Zealand's poverty has a map, and it is not evenly shaded. The NZDep2023 index of socioeconomic deprivation ranks every small area in the country from least to most deprived, and because it is a relative measure, the arithmetic is unforgiving: by construction the worst-off roughly one in five New Zealanders always sit in the most-deprived two deciles (9-10), and the bottom ~10% of areas always sit in decile 10. The national baseline is therefore ~20% in deciles 9-10, fixed by design. The story is not that this band exists, but where it pools — and it pools, heavily, into named towns and suburbs.",
      "At the territorial-authority level the concentration is stark. Kawerau District has 78.0% of its people living in NZDep2023 deciles 9-10 — 3.9 times the 20% national baseline, with a population-weighted mean decile of 9.13 across just 7,542 residents. It is followed by Wairoa District at 74.5% (mean decile 9.14) and Ōpōtiki District at 69.3% (mean decile 8.75). These are not pockets of disadvantage inside otherwise comfortable districts; they are whole communities where deprivation is the norm rather than the exception. At the regional scale, Gisborne is the most deprived, with 47.8% of its 51,129 people in deciles 9-10 — more than double the national share.",
      "Zoom in further and the same pattern resolves into specific neighbourhoods. Decile-10 hotspots at the small-area (SA2) level include Aorere North and Burbank in Manurewa, Cannons Creek North in Porirua, Aranui and Avonside in Christchurch, Camberley in Hastings, and Castlecliff East in Whanganui. This granularity is exactly why national averages mislead. Porirua is the textbook case: around a third of its people live in deciles 9-10, yet a comparable share live in deciles 1-2 — two cities inside one council boundary. Quoting Porirua's average would erase both the affluence and the hardship that actually define it.",
      "Geography is the join key that localises every other driver in this report. Where deprivation concentrates spatially, it co-locates with the cold, damp homes of the energy section, the rent-to-income squeeze of the housing section, the benefit inadequacy of the income section, and the closed GP books and thin transport of the access drivers. Once disadvantage pools, it becomes self-reinforcing through thinner local labour markets, higher housing stress, lower-resourced schools and longer distances to services. The postcode stops being a description of poverty and starts becoming a cause of it.",
      "The map is also, unavoidably, a map of ethnicity. Severe material hardship — the deepest measure, children lacking 9 or more of 17 essentials — runs at 14.9% for Pacific children and 12.2% for Māori children, against 4.7% for European and just 1.1% for Asian children. That concentration mirrors the geography almost exactly: the towns and suburbs carrying the heaviest deprivation loads are disproportionately Māori and Pacific communities. The same families counted in the hardship statistics are the families living in the decile-10 streets. Treating poverty as a single national figure obscures this entirely; treating it by place and people brings the burden, and who carries it, into focus. This is an experimental proof-of-concept analysis, not advice — but the spatial pattern in the official data is among the most robust findings in the brief.",
    ],
    stats: [
      {
        value: "78.0%",
        label:
          "of Kawerau District in NZDep2023 deciles 9-10 — the most deprived TA, 3.9x the national baseline",
        calculation:
          "TERRITORIAL_AUTHORITIES[0]: share=78.0, mean decile 9.13, pop 7,542; overIndex(78.0)=round1(78/20)=3.9. Cross-checked via deprivation-nz skill: all 4 SA2 areas in the Kawerau SA3 sit in deciles 9-10 (mean 9.75).",
        source:
          "deprivation-nz skill — University of Auckland / Stats NZ NZDep2023 (2023 Census); deprivation-data.ts",
      },
      {
        value: "~20%",
        label:
          "national baseline share in deciles 9-10 — fixed by construction (national pop 4,992,801)",
        calculation:
          "NATIONAL_BASELINE_PCT=20; NZDep is a relative index so ~20% of people fall in deciles 9-10 by design. deprivation-nz skill confirms 32,746 SA1 areas, 29.7% in deciles 8-10, 9.8% in decile 10.",
        source:
          "deprivation-nz skill — NZDep2023 (University of Auckland / Stats NZ); deprivation-data.ts NATIONAL_BASELINE_PCT",
      },
      {
        value: "47.8%",
        label:
          "of Gisborne Region in deciles 9-10 — the most deprived region (mean decile 7.41, pop 51,129)",
        calculation: "REGIONS[0]: share=47.8, mean decile 7.41, pop 51,129",
        source: "deprivation-data.ts REGIONS",
      },
      {
        value: "14.9% / 12.2%",
        label:
          "Pacific / Māori children in severe material hardship, vs European 4.7% and Asian 1.1%",
        calculation:
          "MEASI by ethnicity, YE June 2025 — Pacific 14.9%/26,100, Māori 12.2%/37,300, European 4.7%/34,900, Asian 1.1%/2,800; mirrors the deprivation geography",
        source:
          "child-poverty-nz skill — Stats NZ Child poverty statistics YE June 2025 (MEASI by ethnicity)",
      },
    ],
    pullquote:
      "Quote Porirua's average and you erase both its affluence and its hardship — a third of its people sit in the most-deprived deciles, a third in the least.",
    crossLink: {
      href: "/map",
      label:
        "Explore the NZDep2023 map — share in deciles 9-10 and the over-index multiplier by territorial authority and region",
    },
    sources: [
      "deprivation-nz skill / deprivation-data.ts DEPRIVATION_SOURCE_LINE: University of Auckland & Otago / Stats NZ NZDep2023 Index of Socioeconomic Deprivation (2023 Census), 32,746 SA1 areas (29.7% in deciles 8-10), aggregated to territorial authority and region by usually-resident population; metric = share in NZDep deciles 9-10 plus population-weighted mean decile",
      "deprivation-data.ts: TERRITORIAL_AUTHORITIES (Kawerau 78.0% / mean 9.13 / pop 7,542; Wairoa 74.5% / 9.14 / 8,811; Ōpōtiki 69.3% / 8.75 / 10,098), REGIONS (Gisborne 47.8% / 7.41 / 51,129), NATIONAL_BASELINE_PCT=20, national_pop=4,992,801, overIndex(78.0)=3.9",
      "NZDep2023 SA2-level hotspots (deprivation-nz): Aorere North & Burbank (Manurewa), Cannons Creek North (Porirua), Aranui & Avonside (Christchurch), Camberley (Hastings), Castlecliff East (Whanganui)",
      "child-poverty-nz skill — Stats NZ Child poverty statistics YE June 2025 (MEASI severe material hardship by ethnicity): Pacific 14.9%/26,100, Māori 12.2%/37,300, European 4.7%/34,900, Asian 1.1%/2,800",
      "Infometrics, 'Deep hotspots of deprivation', April 2025 (Porirua 33% in deciles 9-10 yet 37% in deciles 1-2)",
    ],
  },
  {
    id: "compounding",
    title: "The compounding squeeze — one household budget",
    subhead:
      "When every driver lands on the same kitchen table: a sole parent of three in Auckland is $338.17 short every week before anything discretionary.",
    paragraphs: [
      "Poverty does not arrive as separate problems. The inadequate benefit, the unaffordable rent, the rising power bill and the shrinking grocery shop all land on the same kitchen table, in the same week, in the same household. To see how the drivers compound rather than sit in tidy silos, hold them against a single real budget: a sole parent with three children, renting in Auckland. It is the most exposed of the common household types and, on the numbers, the clearest proof that the squeeze is structural, not a matter of poor budgeting.",
      "Start with what comes in. The Sole Parent Support base rate from 1 April 2026 is $521.52 a week. Now lay out what must go out. Rent alone is $640 a week — the MBIE median for a new Auckland tenancy, and already more than the entire benefit. A nutritious weekly food shop for a family of four, priced live at Woolworths NZ on 5 June 2026, is $109.69. Power runs about $50 a week on MBIE's average-household estimate, and a further $60 covers the other unavoidable essentials — transport, phone, the things a household cannot simply switch off. Total outgoings: $859.69 a week. Income minus outgoings leaves a deficit of $338.17 every week, before a single discretionary dollar is spent.",
      "One honest caveat keeps that figure defensible: $521.52 is the base benefit only. It excludes Working for Families and the Accommodation Supplement, both of which this household would in practice receive. The real gap is narrower. But the architecture of the shortfall is the point — rent alone already exceeds the base benefit, so the family is in deficit on housing before food, power or anything else is counted. And the Accommodation Supplement is itself capture-prone and falls well short of Auckland rents (covering only 47.7% of a family rent), so the top-ups soften the deficit rather than close it. This is a structural arithmetic, not an edge case: it is roughly the same maths behind the ~62,000 children counted as poor purely because of housing costs, and behind the in-work-poverty finding that about half (~54%) of poor children already have a working parent.",
      "The deficit is also worse than the headline number, because the poorest pay the most for the same essentials — the poverty premium. Power is the clearest example: prepay and credit-meter tariffs, the plans low-income families are pushed onto, cost 11–17% more per unit than the cheapest plans they cannot access. So the $50 power line is itself inflated by the household's poverty. On top of that, the state is frequently a creditor: MSD debt stood at around $2.6 billion across roughly 623,541 people in March 2024, and default deductions can strip $20–40 a week off a benefit before the family sees it — money taken before food and power, not after. The premium and the deductions compound a gap that is already mathematically impossible to close.",
      "This is where the human stakes become concrete. A $338.17 weekly gap is not an abstraction; it is the decision, every week, about which essential to go without. Food is the flexible line — the plate shrinks first — which is why one in three households is food-insecure and foodbanks are feeding more than 500,000 people a month, up 165% on pre-pandemic levels. It is the cold home a renter cannot afford to heat, the prepay meter that self-disconnects when the credit runs out, the GP visit skipped on cost. The drivers do not add; they multiply. Income inadequacy sets the gap, housing widens it, energy and food press on it, and the poverty premium quietly enlarges every line. No single lever closes it — which is precisely the argument for tackling income and housing together.",
      "These figures are an experimental, evidence-led proof of concept, not financial or policy advice. The budget builder lets you change the household, the rent, the basket and the power bill and watch the residual move — including what happens when income support is lifted or rent is capped. It is the analytical spine of this report: every other section feeds into this one weekly number.",
    ],
    stats: [
      {
        value: "-$338.17/wk",
        label:
          "Weekly deficit for a sole parent with 3 children in Auckland (base benefit only)",
        calculation:
          "income base $521.52 − total outgoings $859.69 = −$338.17 (repBudget.residual, residualIsDeficit=true)",
        source: "budget-calc.ts / brief-data.ts repBudget (BUDGET_SOURCE_LINE)",
      },
      {
        value: "$859.69/wk",
        label:
          "Total weekly outgoings: rent $640 + food $109.69 + power $50 + other $60",
        calculation:
          "rent 640 (MBIE median, 2026-03-01) + food 109.69 (live Woolworths, 2026-06-05) + power 50 + other 60 = 859.69",
        source: "brief-data.ts repBudget; housing-data.ts; basket-data.ts",
      },
      {
        value: "$521.52/wk",
        label:
          "Income: Sole Parent Support base rate only (excludes Working for Families and Accommodation Supplement)",
        calculation:
          "ARCHETYPES sole-parent-3kids currentNetWeekly = 521.52 (SPS base, 1 April 2026)",
        source: "indexation-data.ts ARCHETYPES; SOURCE_LINE",
      },
      {
        value: "11–17%",
        label:
          "Poverty premium on power: prepay/credit-meter tariffs cost more per unit than cheapest plans",
        calculation:
          "ENERGY_POVERTY_PREMIUM_PCT = '11–17%' (POVERTY_PREMIUM_LOW=11, HIGH=17)",
        source: "energy-data.ts ENERGY_SOURCE_LINE",
      },
    ],
    pullquote:
      "Rent alone is $640 a week — more than the entire benefit — before a crumb of food, a kilowatt of power, or a single bus fare is counted.",
    crossLink: {
      href: "/budget",
      label:
        "Build the household budget — adjust income, rent, food and power and watch the deficit move",
    },
    sources: [
      "budget-calc.ts / brief-data.ts repBudget — BUDGET_SOURCE_LINE: Income: MSD benefit base rates (1 April 2026) via the Indexation Simulator. Rent: MBIE Tenancy Services median weekly rent of new tenancies (2026-03-01). Food: live Woolworths NZ basket prices (2026-06-05). Power & other essentials are adjustable estimates (MBIE average household electricity ≈ $2,400–2,600/yr ≈ ~$48–50/wk).",
      "indexation-data.ts — SOURCE_LINE: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019). Sole Parent Support base $521.52/wk (base benefit only, excludes Family Tax Credit and Accommodation Supplement).",
      "housing-data.ts — HOUSING_SOURCE_LINE: AS maxima WINZ (1 April 2026); rents MBIE Tenancy Services bond data (2026-03-01). Auckland family rent $640/wk; AS covers 47.7%.",
      "basket-data.ts — BASKET_SOURCE_LINE: live Woolworths NZ online prices, retrieved 2026-06-05 via the thecolab.ai woolworths-nz skill. Nutritious family-of-4 week $109.69.",
      "energy-data.ts — ENERGY_SOURCE_LINE: Stats NZ Selected Price Indexes (CPI Level 3), April 2026. ENERGY_POVERTY_PREMIUM_PCT 11–17%.",
      "MSD debt data, March 2024 (~$2.6b across ~623,541 people); default deductions strip $20–40/wk — research 'premium' driver.",
      "Stats NZ Child poverty statistics YE June 2025; brief-data.ts AHC_CHILD_POVERTY (~62,000 children poor purely due to housing costs).",
      "NZ Food Network Hunger Monitor 2025 (1 in 3 food-insecure; foodbanks 500,000+/month, +165%); Save the Children / CPAG NZ Feb 2026 (~half (~54%) of poor children have a working parent).",
    ],
  },
  {
    id: "whatworks",
    title: "What works — the highest-leverage levers",
    subhead:
      "The levers that would move the targets are known and largely undisputed — but they are not the ones that poll best.",
    paragraphs: [
      "A central, uncomfortable finding runs through the evidence: the fast, popular, tangible interventions — school lunches, home retrofits, cheaper bus fares — are not the ones that hit New Zealand's statutory child-poverty targets. Those measures cushion how deeply families suffer; they cross few children over the formal income lines. The levers that actually bend the headline counts are structural, slower to feel, and act on the two things that decide whether a household sits above or below the line: income adequacy and housing costs. It is worth holding both ideas at once, because the report's recommendations flow directly from this split between moving the count and easing the depth. This is an experimental proof-of-concept analysis, not financial or policy advice — but on the published evidence the ranking is clear.",
      "Lever one is the engine room: restore wage-indexation of main benefits (or index to the higher of wages or CPI) and lift core rates toward the 2019 Welfare Expert Advisory Group benchmark. This is the lever with the strongest quasi-experimental evidence in the New Zealand record. When benefits were lifted and re-indexed to wages from 2019, the Families Package and 2021 increases together helped lift an estimated tens of thousands of children out of after-housing-costs poverty by 2022/23 — the clearest natural experiment we have that adequate, indexed income support moves the baseline. The 2024 reversion to CPI-indexation runs the experiment in reverse: official modelling estimates roughly 7,000 more children pushed into poverty on each primary measure by 2028, with the single Jobseeker rate about $18.15/week lower by 2028 than under wage-indexation, saving the Crown about $669.5m. WEAG recommended lifts of 12–47%; not one of its 42 key recommendations has been fully implemented. This is the only lever Treasury's own numbers suggest could plausibly hit the 2027/2028 targets.",
      "Lever two is the highest-yield targeted move: extend the In-Work Tax Credit and full Working for Families to all low-income children, regardless of whether their parents are on a benefit. The current rule routes the poorest children out of support by design — and it does so against the grain of who is actually poor, since about half (~54%) of poor children already have a working parent. CPAG estimates a one-to-three-child benefit family missed out on $18,850 over the five years to 2023, and costs full extension at about $500–600m a year. Crucially, this is the lever aimed squarely at the hard core: the 101,600 children who are both on low income and in material hardship, and the 71,000 in severe hardship. Treasury assessed the Budget 2025 and 2026 Working for Families tweaks as statistically not significant for child poverty — small, work-gated increments do little, because the design flaw, not the dollar size, is the problem.",
      "Lever three — expanding income-related-rent (IRRS) social housing in preference to the cash Accommodation Supplement — has the strongest mechanism but the weakest realised effect right now. The logic is decisive: IRRS caps a tenant's rent at 25% of net income, structurally collapsing the after-housing-costs gap where roughly 62,000 children are poor purely because of housing costs (210,600 below the AHC line versus 148,700 before housing costs). The cash alternative leaks — international evidence suggests 30–78% of the Accommodation Supplement is absorbed by higher rents through landlord capture, across about 385,025 recipient households. But the lever is currently throttled: net public-housing supply is flat-to-negative (about 1,500 builds against roughly 700 demolitions and 800 sales, versus +3,600 net in the year to June 2024). Shifting 30,000–50,000 households into IRRS over a decade could lift 20,000–40,000 children clear of the AHC line — but only if builds actually grow. High structural potential, near-zero current trajectory.",
      "Below these sit the hardship cushions — and they matter, just not for the headline count. Universal healthy school lunches (rated very good value by a 2025 BMC Public Health analysis), restored free prescriptions, Warmer Kiwi Homes retrofits (benefit-cost ratio 4.66) and protected fares credibly shave 1–3 percentage points off the 14.3% material-hardship rate over three to five years, with durable health co-benefits. What they do not do is move large numbers across the formal income thresholds, because DEP-17 spans seventeen items well beyond food and warmth. The honest framing is that these pair with — and cannot substitute for — the income and housing levers. A parallel category, stopping the system itself extracting cash from the poorest (wiping or capping the roughly $2.6b in MSD debt, easing default deductions), could plausibly cut child hardship 1–2 percentage points (about 12,000–24,000 children) by returning $20–40/week to several hundred thousand of the lowest-income households.",
      "The unifying tension is between income lines and hardship depth, and it explains why the architecture is treading water. The measures that feel tangible and poll well ease suffering for the 169,300 children in hardship without shifting the counts the Child Poverty Reduction Act tracks; the measures that shift the counts are structural and contested. Officials advised that about $3b a year was needed to hit the targets — advice the Minister rejected. Without the two income levers and a genuine lift in IRRS supply, the targets are missed by design, not by accident.",
    ],
    stats: [
      {
        value: "tens of thousands",
        label:
          "children the 2018–2022 income package helped lift out of AHC poverty — the strongest NZ natural experiment for lever 1",
        calculation:
          "Treasury / MSD estimate for the 2018–2022 Families Package & benefit increases on the AHC measure, 2022/23 (estimate of a bundle of policies)",
        source:
          "Treasury / MSD analysis of the 2018–2022 Families Package & benefit increases",
      },
      {
        value: "~7,000",
        label:
          "more children into poverty on EACH primary measure by 2028 from the 2024 CPI reversion (Jobseeker ~$18.15/wk lower by 2028)",
        calculation:
          "MSD Supplementary Analysis Report: +7,000 (±4,000) AHC50 and +7,000 (±6,000) BHC50 by tax year 2028; Crown saving ~$669.5m",
        source: "MSD SAR, indexing main benefits to inflation",
      },
      {
        value: "~$500–600m/yr",
        label:
          "cost of extending the IWTC / full Working for Families to all low-income children — reaching MEASJ 101,600 and MEASI 71,000",
        calculation:
          "CPAG costing; a 1–3 child benefit family missed out $18,850 over the 5 years to 2023",
        source:
          "CPAG Working for Families (cpag.org.nz/statistics/working-for-families)",
      },
      {
        value: "~62,000",
        label:
          "children poor purely because of housing costs — the AHC gap lever 3 (IRRS) targets but can only close if net builds grow",
        calculation:
          "AHC child poverty 210,600 minus BHC 148,700 (brief-data.ts AHC_CHILD_POVERTY housingOnly=62000)",
        source:
          "child-poverty-nz skill — Stats NZ YE June 2025 (MEASB 210,600 / MEASA 148,700); brief-data.ts",
      },
    ],
    pullquote:
      "The levers that shift the count are structural and contested; the levers that poll well ease the depth but cross few children over the line.",
    sources: [
      "child-poverty-nz skill — Stats NZ Child poverty statistics YE June 2025 (MEASC 14.3%/169,300; MEASI 6.0%/71,000; MEASJ 8.6%/101,600; MEASA 12.6%/148,700; MEASB 17.8%/210,600)",
      "brief-data.ts AHC_CHILD_POVERTY (count=210600, bhc=148700, housingOnly=62000)",
      "public-housing-nz skill — HUD, 1 Dec 2024: 385,025 Accommodation Supplement recipients (~$42.5m/week)",
      "indexation-data.ts SOURCE_LINE: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019)",
      "Treasury / MSD analysis of the 2018–2022 Families Package & benefit increases — tens of thousands of children lifted, 2022/23 (estimate of a bundle of policies)",
      "MSD Supplementary Analysis Report, indexing main benefits to inflation — ~7,000 per measure by 2028; ~$18.15/wk; ~$669.5m",
      "CPAG, Working for Families (cpag.org.nz/statistics/working-for-families) — $18,850 over 5 years; ~$500–600m/yr extension cost",
      "CPAG, govt yet to fully implement a single key WEAG recommendation (cpag.org.nz/media-releases) — 42 key recommendations, 12–47% lifts",
      "MSD SAR, treatment of housing contributions / landlord capture — IRRS rent capped at 25% net income; AS capture 30–78%",
      "public-housing-nz skill — HUD, as at 1 Dec 2024: 385,025 Accommodation Supplement recipients (~$42.5m/week)",
      "interest.co.nz — Kāinga Ora net supply: ~1,500 builds vs ~700 demolitions, ~800 sales; +3,600 net to June 2024",
      "BMC Public Health 2025 — Ka Ora Ka Ako value-for-investment; Motu/EECA — Warmer Kiwi Homes BCR 4.66",
      "MSD debt data March 2024 — ~$2.6b across ~623,541 people; Treasury EMTR analysis",
      "RNZ Budget 2026 coverage, 28 May 2026 (rnz.co.nz/news/political/596701) — only 1 of 3 modelled 2027 targets met; ~$3b/yr advised; Treasury WfF tweaks not statistically significant",
    ],
  },
  {
    id: "recommendations",
    title: "Recommendations: what New Zealand should do",
    subhead:
      "Eight evidence-led options, prioritised — lead with income and housing, then stop the system harming the poorest, then cushion hardship fast.",
    paragraphs: [
      "The levers that would move New Zealand's poverty are known and largely undisputed. What follows is not financial or policy advice — it is an experimental, evidence-led synthesis of what the data points to, ranked by leverage and by the strength of the evidence behind it. The ordering matters: the first two actions are structural income levers that bend the statutory measures themselves; the third tackles housing, the master multiplier; the fourth stops the system extracting cash from people who have none; and the last four cushion the depth of hardship quickly even where they cross few children over a formal income line.",
      "One honest tension runs through all of it. The fast, popular, tangible measures — school lunches, warm-home retrofits, cheaper fares — reduce suffering but move few children across the income or deprivation thresholds. The measures that actually hit the targets — restoring benefit adequacy and extending child credits to the poorest — are slower to feel and harder to fund against an $11.4 billion Crown deficit. Restraint and adequacy pull against each other, and we surface that rather than wish it away. The figures below are drawn from our own data modules (sourced at the foot of this section); the 'children lifted' estimates are official figures with wide confidence intervals, not settled New Zealand modelling.",
      "Read together, these actions describe a sequence, not a menu. Income and housing adequacy are the foundation; the debt and energy measures stop the floor from sinking further; the child-service and transport protections hold the line on lived hardship; and the eighth — restoring properly funded statutory targets — is the accountability that keeps the rest honest. On current settings the targets are missed by design, not by accident.",
      "A note on who this reaches: the lowest-income households are overwhelmingly sole parents — recipient of Sole Parent Support, a payment drawn by a caseload that is around nine in ten women (~90%) — so every income lever below is also, in practice, a lever on the gendered face of poverty. The representative budget that anchors this whole report is exactly that household: a sole parent with three children in Auckland, running a weekly deficit before anything discretionary.",
    ],
    recommendations: [
      {
        action:
          "1. Restore wage-indexation of main benefits (or index to the higher of wages or CPI) and lift core rates toward the WEAG benchmark.",
        rationale:
          "The single Jobseeker rate sits at $372.55/wk against a CPAG income floor of $472.55 — about $100/wk short — and Sole Parent Support at $521.52/wk is roughly $200/wk short. The 2024 switch from wage- to CPI-indexation locks in a widening real gap every year; official modelling puts ~7,000 more children into poverty on EACH primary measure by 2028 under CPI, with the single Jobseeker rate ~$18.15/wk lower by 2028. This is the only lever that plausibly bends the anchored AHC and combined measures toward the 2027/2028 targets.",
        leverage:
          "Highest. Lifting rates ~$100/wk (single Jobseeker) to $100–300/wk (families) reverses the modelled drift; the 2018–2022 wage-indexed package helped lift an estimated tens of thousands of children out of AHC poverty. Modellable directly in /simulator.",
      },
      {
        action:
          "2. Extend the In-Work Tax Credit / full Working for Families to all low-income children regardless of parental benefit status (~$500–600m/yr).",
        rationale:
          "Budget 2026's $50/wk IWTC rise still excludes beneficiary children — the very cohort at greatest risk. With about half (~54%) of poor children already having a working parent, the work-gate no longer maps onto who is poor. CPAG estimates a 1–3 child benefit family missed out on $18,850 over five years. This removes the single largest policy-design driver of severe child hardship.",
        leverage:
          "Highest-yield targeted move. Directly reaches the combined low-income-and-hardship core (101,600 children) and severe hardship (71,000). Also modellable in /simulator via the IWTC extension.",
      },
      {
        action:
          "3. Grow income-related-rent (IRRS) social housing to register scale and redirect Accommodation Supplement spend toward supply; scale Housing First.",
        rationale:
          "Housing manufactures roughly 62,000 children's poverty: 210,600 fall below the anchored AHC<50% line versus 148,700 BHC. The cash Accommodation Supplement reaches about 385,025 households but leaks 30–78% to landlord capture, while IRRS caps rent at 25% of net income. Sustaining Tenancies costs ~$4,800/whānau/yr versus ~$56,000 for emergency housing. With Auckland family rent at $640/wk and the AS maximum covering only 47.7% (a $335/wk residual), the cash subsidy cannot close the gap.",
        leverage:
          "High structural potential, near-zero realised effect today because net builds are flat-to-negative (~1,500 builds vs ~700 demolitions, ~800 sales). Could lift 20,000–40,000 children clear of AHC<50% over a decade — but only if supply actually grows. See /housing.",
      },
      {
        action:
          "4. Stop the system extracting cash from the poorest: wipe or cap historic MSD debt, auto-correct overpayments via real-time IRD data, lower default deductions, lift the frozen $160/wk abatement threshold and unwind the 70c clawback.",
        rationale:
          "MSD debt of ~$2.6b across ~623,541 people is recovered straight off benefits already $100–300/wk below an adequate floor, stripping $20–40/wk before food and power. Treasury shows single parents face effective marginal tax rates over 50%. Removing the stock and stopping new overpayment debt at source puts cash back into hundreds of thousands of the lowest-income budgets.",
        leverage:
          "Fast and targeted. Plausible 1–2pp cut in child material hardship (~12,000–24,000 children) if paired with stopping new debt at source. Stops the system actively deepening poverty rather than fixing core inadequacy.",
      },
      {
        action:
          "5. Scale energy-hardship relief: expand Warmer Kiwi Homes retrofits, enforce Consumer Care Obligations and prepay/disconnection protection, and re-target the Winter Energy Payment.",
        rationale:
          "Electricity is up 13.1%/yr (+33.5% since 2019) and mains gas up 10.8%/yr (+61.5%), far outpacing benefits indexed to ~3.1% CPI. The poverty premium means prepay/credit-meter tariffs cost 11–17% more per unit, and electricity eats 7.5%+ of the poorest's income. Warmer Kiwi Homes carries a benefit-cost ratio of 4.66 and cuts bills permanently; about half the Winter Energy Payment currently flows to superannuitants and could be re-targeted (~$380m/yr) without new spend.",
        leverage:
          "Moderate on the hardship rate (1–3pp over 3–5 years) with durable health co-benefits; marginal on the income line. See /energy.",
      },
      {
        action:
          "6. Lock in direct child services: make universal healthy school lunches permanent and protect quality, extend school-cost relief, and restore universal free prescriptions.",
        rationale:
          "These in-kind transfers attack the depth of material hardship (169,300 children, 14.3%) by removing recurring costs from a stretched budget. Ka Ora, Ka Ako is rated 'very good value' with parent-reported grocery savings of ~$30–70/wk; restoring free prescriptions is net-positive fiscally (~$32.4m/yr hospital savings) and best-evidenced on cutting avoidable hospitalisations. Unlike the work-gated credits, these are not means-gated out of the worst-off.",
        leverage:
          "Strong, fast hardship cushion and equity floor; weak mover of the headline income-line counts. Pairs with — does not substitute for — actions 1–3.",
      },
      {
        action:
          "7. Protect transport access for the poorest: retain Total Mobility at 75% (reversing the cut to 65% from 1 July 2026) and target near-free fares to Community Services Card holders.",
        rationale:
          "The poorest fifth spend nearly 20% of income getting around versus 7.6% for the richest, and 22% of sub-$30k households have no car. The cut to Total Mobility is a direct regression for disabled and elderly users; targeted fare relief improves access to GPs, jobs and cheaper food, where 159,000 people already miss a GP visit for lack of a ride.",
        leverage:
          "Small-to-moderate on the headline count; moderate-to-large on lived access. Prevents a regression rather than driving income lines, since fare relief shows no reliable earnings lift.",
      },
      {
        action:
          "8. Reinstate and properly resource the statutory 2028 targets rather than lowering interim ones.",
        rationale:
          "Treasury concedes Budget 2026 will meet only 1 of 3 modelled 2027 targets, with about 47,500 more children in hardship than three years ago. Officials advised roughly $3b/yr was needed; lowering the interim targets manages the optics, not the poverty. Accountability is a lever in its own right — without it, the income and housing levers above are easy to defer.",
        leverage:
          "Systemic. Keeps the other seven actions honest and measurable against the legislated 2028 material-hardship target of 6.0% (Child Poverty Reduction Act 2018).",
      },
    ],
    stats: [
      {
        value: "-$338.17/wk",
        label:
          "Weekly deficit for the representative household (sole parent, 3 children, Auckland) — income $521.52 minus outgoings $859.69, base benefit only",
        calculation:
          "incomeWeekly 521.52 − totalOutgoings 859.69 (rent 640 + food 109.69 + power 50 + other 60) = −338.17",
        source:
          "src/lib/budget-calc.ts / brief-data.ts repBudget (BUDGET_SOURCE_LINE)",
      },
      {
        value: "~62,000",
        label:
          "Children poor purely because of housing costs (210,600 AHC vs 148,700 BHC) — the gap action 3 targets",
        calculation:
          "AHC_CHILD_POVERTY: count 210,600 − bhc 148,700 = 62,000 housingOnly",
        source:
          "child-poverty-nz skill — Stats NZ YE June 2025 (MEASB/MEASA); brief-data.ts AHC_CHILD_POVERTY",
      },
      {
        value: "~$100/wk",
        label:
          "Shortfall of the single Jobseeker rate ($372.55) below CPAG's income floor ($472.55) — the gap action 1 closes",
        calculation: "income floor 472.55 − currentNetWeekly 372.55 = 100.00",
        source:
          "MSD benefit rate tables (1 April 2026); CPAG 'Below the Income Floor' (2025); indexation-data.ts SOURCE_LINE",
      },
      {
        value: "47.7%",
        label:
          "Share of an Auckland family's $640/wk rent covered by the maximum Accommodation Supplement ($305), leaving a $335/wk residual — why action 3 favours IRRS over cash subsidy",
        calculation:
          "HOUSING_CENTRES Auckland asCoversFamilyPct=47.7; residualFamily = 640 − 305 = 335",
        source:
          "src/lib/housing-data.ts (MBIE Tenancy Services 2026-03-01; WINZ AS maxima 1 April 2026); HOUSING_SOURCE_LINE",
      },
    ],
    pullquote:
      "The levers that hit the statutory targets — restoring benefit adequacy and reaching the poorest children — are not the ones that poll best or feel quickest. On current settings, the 2028 targets are missed by design, not by accident.",
    sources: [
      "src/lib/indexation-data.ts SOURCE_LINE: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019). Income-floor figures are CPAG-derived estimates.",
      "src/lib/housing-data.ts HOUSING_SOURCE_LINE: Accommodation Supplement maxima Work and Income NZ (effective 1 April 2026); rents MBIE Tenancy Services rental bond data, median weekly rent of new tenancies (2026-03-01).",
      "src/lib/energy-data.ts ENERGY_SOURCE_LINE: Stats NZ Selected Price Indexes (CPI Level 3), April 2026 — Electricity CPIM.SE904501, Gas CPIM.SE904502; ENERGY_POVERTY_PREMIUM_PCT 11–17%.",
      "src/lib/budget-calc.ts / brief-data.ts BUDGET_SOURCE_LINE: Income MSD base rates (1 April 2026); Rent MBIE median (2026-03-01); Food live Woolworths NZ (2026-06-05); power/other adjustable MBIE estimates.",
      "brief-data.ts AHC_CHILD_POVERTY (count 210,600, bhc 148,700, housingOnly 62,000); child-poverty-nz skill — Stats NZ YE June 2025 (MEASB 17.8%/210,600, MEASA 12.6%/148,700).",
      "public-housing-nz skill — HUD, 1 Dec 2024: 385,025 Accommodation Supplement recipients (~$42.5m/week); social-housing stock 83,550 (KO 69,590 + CHP 13,960, 31 Mar 2025).",
      "MSD Supplementary Analysis Report, indexing main benefits to inflation: https://www.msd.govt.nz/documents/about-msd-and-our-work/publications-resources/regulatory-impact-statements/sar-indexing-main-benefits-to-inflation.docx",
      "Treasury / MSD analysis of the 2018–2022 Families Package & benefit increases — tens of thousands of children (estimate of a bundle of policies)",
      "CPAG Working for Families (IWTC extension ~$500–600m/yr; $18,850 over 5 years): https://www.cpag.org.nz/statistics/working-for-families",
      "MSD Supplementary Analysis Report — treatment of housing contributions (IRRS, landlord capture 30–78%): https://www.msd.govt.nz/documents/about-msd-and-our-work/publications-resources/regulatory-impact-statements/supplementary-analysis-report-treatment-of-housing-contributions-from-boarders.pdf",
      "interest.co.nz — Kāinga Ora debt cap and net public-housing build figures: https://www.interest.co.nz/public-policy/131771/government%E2%80%99s-plan-cut-k%C4%81inga-ora%E2%80%99s-debt-18-billion-will-halt-construction-new",
      "MBIE energy hardship — Warmer Kiwi Homes, Winter Energy Payment, Consumer Care Obligations: https://www.mbie.govt.nz/about/news/latest-insights-on-energy-hardship-in-new-zealand; Motu/EECA BCR 4.66.",
      "BMC Public Health 2025 — Ka Ora, Ka Ako value-for-investment; cohort study ~$32.4m/yr hospital savings from free prescriptions.",
      "Aotearoa Collective for Public Transport Equity, Free Fares Briefing (March 2025) — transport income shares; Total Mobility cut 75%→65% from 1 July 2026.",
      "RNZ Budget 2026 coverage (28 May 2026) — 1 of 3 targets met, about 47,500 more children (RNZ headline: '50,000 more children'), ~$3b/yr advised: https://www.rnz.co.nz/news/political/596701/50-000-more-children-suffering-from-material-hardship-than-three-years-ago",
      "MSD debt data (March 2024) — ~$2.6b across ~623,541 people; Treasury EMTR analysis on abatement threshold and 70c clawback.",
    ],
  },
  {
    id: "confidence",
    title: "Confidence, limitations & sources",
    subhead:
      "What is solid, what is illustrative, and what is brittle — laid out so you can judge every figure for yourself.",
    paragraphs: [
      "This is an experimental proof-of-concept built for a thecolab.ai Impact for Good build, not financial, legal or policy advice. It assembles official statistics, a live grocery basket and directional modelling into one picture, and it is honest about where each part sits on the spectrum from settled fact to working estimate. The whole brief was generated as at 5 June 2026; treat it as a snapshot, not a live feed.",
      "The backbone is strong, and the headline figures were pulled live from thecolab.ai's open-data skills: child-poverty-nz and household-hardship-nz (Stats NZ), public-housing-nz (HUD), deprivation-nz (NZDep2023) and stats-nz (CPI). The child-poverty baseline, the income and benefit figures, the housing measures and the deprivation geography all come from official sources — Stats NZ Child poverty statistics (year ended June 2025), MSD benefit rate tables (1 April 2026), MBIE Tenancy Services bond data (1 March 2026), HUD housing datasets via data.govt.nz, and the University of Auckland / Otago / Stats NZ NZDep2023 index off the 2023 Census. On the source-research team's own scoring, driver confidence runs from 7 to 9. The most solid (9) are Deprivation Geography, Policy and Programmes, and Persistent/Intergenerational poverty, because they rest entirely on Stats NZ, Treasury and NZDep data. The most caveated (7) are Food, Energy, Transport and the Macro picture, which lean partly on live or commercial pricing and on survey figures of varying vintage.",
      "The live data is powerful but brittle. Our grocery basket is priced from live Woolworths NZ online prices, retrieved on 5 June 2026 via the thecolab.ai woolworths-nz skill — that is what lets the basket page show a real $38.79 bare-staples week against a real benefit rate. It is robust enough for this analysis, but it is Terms-of-Service-sensitive and not a basis for any hosted or redistributed price service. Historical basket costs are not real receipts; they are reconstructed by re-pricing today's basket back through Stats NZ Food Price Index sub-indices (series CPIM.SE901). One cross-source difference worth naming plainly: the research digest cites a PAK'nSAVE bare-staples week of $44.78, while our headline figure is the live Woolworths $38.79. We present our own live data as the headline and footnote the difference rather than blend the two.",
      "The forward-looking numbers are estimates, not certainties. Counterfactual figures — how many children a lever would lift out of poverty — carry wide confidence intervals or are explicitly illustrative. MSD's own modelling of the 2024 reversion to CPI indexation gives roughly 7,000 more children in poverty by 2028 on each primary measure, but quotes that as plus or minus 4,000 to 6,000. The estimate that the 2018–2022 package lifted tens of thousands of children out of after-housing-costs poverty is an official estimate of a bundle of policies, so no single component's effect is cleanly isolated. Dollar forecasts — for example a single Jobseeker rate about $18.15/week lower by 2028 under CPI than under wage indexation — are HYEFU-based and directional, to be finalised against actual Stats NZ wage and CPI data. Several Budget 2026 figures (the $50/week IWTC rise, the $44,900 abatement threshold) reached us through news reporting where primary PDFs would not parse, and should be confirmed against IRD and Treasury primary documents before any formal use.",
      "We have surfaced inconsistencies rather than silently reconciling them, and resolved several against the colab open-data skills. The rise in child material hardship since the 2022 low — previously stated as somewhere between about 44,000 and 47,500 children — is now pinned exactly: the child-poverty-nz skill returns 121,800 children in hardship in 2022 and 169,300 in 2025, an increase of 47,500. A larger correction sits in housing. The report previously cited 769,954 Accommodation Supplement recipients at about $84.9m a week; the public-housing-nz skill, reading HUD's own dataset at 1 December 2024, returns 385,025 recipients and $42.45m a week (summed across the 12 MSD regions), so we have replaced the figure throughout — the prior 769,954 / ~$84.9m was a naive sum of overlapping geographic rows (Region + TLA + local board) that triple-counted recipients. The count of households unable to adequately heat their home appears as both about 110,000 and about 116,000 across sources; the published MBIE figure (year ended June 2022) is about 110,000 households (5.8%), which is the number we use, while the about 116,000 figure is a recomputation of 5.8% applied to roughly 2 million households. Jobseeker Support counts differ by date — 215,214 at end March 2026 versus 213,321 at end December 2024; note also that the msd-benefits-nz skill is wired to a frozen December 2019 release, so current caseloads here come from the live MSD fact sheets that skill points to, not the skill itself. Where the manuscript leans on a single headline stat repeatedly, we have given one section ownership of it: the baseline owns the 169,300 / 14.3% material-hardship figure, housing owns the ~62,000 after-housing-costs gap, and deprivation owns the postcode-and-ethnicity concentration.",
      "An automated claim-by-claim fact-check was run across the report — 104 claims checked, with the figures above verified or corrected against the colab open-data skills and public sources, and those corrections applied. Every dimension also carries its provenance in code. Each data module exports a named source-line constant so any figure can be traced: SOURCE_LINE (indexation), FOOD_SOURCE_LINE, BASKET_SOURCE_LINE, HOUSING_SOURCE_LINE, ENERGY_SOURCE_LINE, DEPRIVATION_SOURCE_LINE and BUDGET_SOURCE_LINE. Known gaps are worth stating too: this is a heavily quantitative picture that under-weights education and early childhood, debt and the justice system, digital exclusion, the strongly gendered shape of sole-parent poverty (recipients are overwhelmingly women), and lived-experience voice. The figures here describe the shape of the problem; they do not capture the whole of it. Read this as evidence-led options for thinking, not settled answers — an experimental proof-of-concept, not advice.",
    ],
    stats: [
      {
        value: "7–9",
        label:
          "Driver confidence range (10-point scale); strongest 9 for Deprivation, Policy, Persistent poverty",
        calculation:
          "Per-chapter verdict scores from the research critique's driverConfidenceScores",
        source: "research critiquesAndConfidence driverConfidenceScores",
      },
      {
        value: "$38.79",
        label:
          "Live bare-staples week (Woolworths NZ, 5 June 2026) vs the digest's PAK'nSAVE $44.78 — our live data is the headline",
        calculation:
          "BARE_STAPLES.totalWeekly=38.79, priced 2026-06-05 via woolworths-nz skill",
        source: "basket-data.ts BASKET_SOURCE_LINE",
      },
      {
        value: "±4,000–6,000",
        label:
          "Confidence interval on the ~7,000-children-per-measure CPI-indexation estimate by 2028",
        calculation:
          "MSD SAR: +7,000 (±4,000 AHC50) and +7,000 (±6,000 BHC50) children by tax year 2028",
        source:
          "MSD Supplementary Analysis Report, indexing main benefits to inflation",
      },
      {
        value: "~110,000",
        label:
          "Cold-homes count to use — the published MBIE figure (5.8%, year ended June 2022); the ~116,000 figure is a 5.8%-of-~2m recomputation",
        calculation:
          "MBIE published ~110,000 households (5.8%, YE June 2022); ~116,000 is 5.8% applied to ~2 million households (a recomputation)",
        source:
          "MBIE energy hardship measures (year ended June 2022); research critiquesAndConfidence consistencyIssues",
      },
      {
        value: "385,025",
        label:
          "Accommodation Supplement recipients (~$42.5m/wk, 1 Dec 2024) — corrected from the prior 769,954 / ~$84.9m, a naive sum of overlapping geographic rows (Region + TLA + local board) that triple-counted recipients",
        calculation:
          "public-housing-nz skill: HUD AS dataset summed across 12 MSD regions = 385,025 recipients, $42,451,478.50/week",
        source:
          "public-housing-nz skill — HUD Accommodation Supplement recipients & weekly spend (data.govt.nz), 1 Dec 2024",
      },
    ],
    pullquote:
      "Strong on the backbone, honest about the edges: official data where it counts, live pricing flagged as brittle, and every forward estimate labelled as an estimate.",
    sources: [
      "child-poverty-nz skill — Stats NZ Child poverty statistics, year ended June 2025 (MEASC/MEASI/MEASB/MEASJ; ethnicity and disability breakdowns; 2018→2022→2025 trend)",
      "public-housing-nz skill — HUD Accommodation Supplement, social-housing tenancies and public-homes stock (data.govt.nz); deprivation-nz skill — NZDep2023; household-hardship-nz skill — Stats NZ HES 2020/21; stats-nz skill — CPI March 2026 quarter",
      "research-output.json critiquesAndConfidence (driverConfidenceScores, consistencyIssues, confidenceNotes)",
      "indexation-data.ts SOURCE_LINE: MSD benefit rate tables (1 April 2026), CPAG 'Below the Income Floor' (2025), WEAG (2019)",
      "food-price-data.ts FOOD_SOURCE_LINE: Stats NZ Food Price Index April 2026, series CPIM.SE901",
      "basket-data.ts BASKET_SOURCE_LINE: live Woolworths NZ online prices, retrieved 2026-06-05 via thecolab.ai woolworths-nz skill; history reconstructed via Stats NZ FPI sub-indices",
      "housing-data.ts HOUSING_SOURCE_LINE: WINZ Accommodation Supplement maxima (1 April 2026); MBIE Tenancy Services bond data (2026-03-01)",
      "energy-data.ts ENERGY_SOURCE_LINE: Stats NZ CPI Level 3, electricity CPIM.SE904501, gas CPIM.SE904502",
      "deprivation-data.ts DEPRIVATION_SOURCE_LINE: University of Otago (HIRP) NZDep2023 (2023 Census)",
      "budget-calc.ts / brief-data.ts BUDGET_SOURCE_LINE: MSD base rates, MBIE median rent, live Woolworths basket, MBIE average household power",
      "MSD Supplementary Analysis Report, indexing main benefits to inflation (CPI-reversion modelling, HYEFU-based dollar forecasts)",
      "Treasury / MSD analysis of the 2018–2022 Families Package & benefit increases (tens of thousands of children estimate; a bundle of policies)",
      "RNZ Budget 2026 coverage, 28 May 2026 (IWTC $50/wk and abatement figures via secondary reporting)",
      "brief-data.ts BRIEF_GENERATED / SUITE_GENERATED_ON = 5 June 2026",
    ],
  },
];
