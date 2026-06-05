import Link from "next/link";

import { type MethodEntry, MethodInfo } from "@/components/method-info";
import { MethodologyPanel } from "@/components/methodology-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AHC_CHILD_POVERTY, CHILD_MATERIAL_HARDSHIP } from "@/lib/brief-data";
import { FOOD_SOURCE_LINE } from "@/lib/food-price-data";
import { HOUSING_SOURCE_LINE } from "@/lib/housing-data";

type Accent = "orange" | "indigo" | "cyan";

const ACCENT_BG: Record<Accent, string> = {
  orange: "bg-brand-orange",
  indigo: "bg-brand-indigo",
  cyan: "bg-brand-cyan",
};

// cyan text needs the darker shade to stay legible (same idiom as sibling pages)
const ACCENT_TEXT: Record<Accent, string> = {
  orange: "text-brand-orange",
  indigo: "text-brand-indigo",
  cyan: "text-brand-cyan-dark",
};

// Method + source for every headline figure, authored from the actual data
// libs. Reused both in the per-stat ⓘ popovers and the Methodology panel.
const METHODS: MethodEntry[] = [
  {
    label: "Children in material hardship",
    calculation:
      "CHILD_MATERIAL_HARDSHIP.count from @/lib/brief-data: 169,300 children, equal to 14.3% of all NZ children, are in material hardship (lacking 6+ of 17 essential items).",
    source: CHILD_MATERIAL_HARDSHIP.source,
  },
  {
    label: "Meat, poultry & fish, annual change",
    calculation:
      "Twelve-month change in the meat, poultry & fish subgroup of the Stats NZ Food Price Index to April 2026: +7.8% per year — the fastest-rising of the food groups.",
    source: FOOD_SOURCE_LINE,
  },
  {
    label: "Accommodation Supplement coverage of Auckland rent",
    calculation:
      "Maximum Accommodation Supplement for the area, divided by the Auckland median weekly rent for new tenancies, covers roughly 48% — under half of the rent.",
    source: HOUSING_SOURCE_LINE,
  },
  {
    label: "Children poor purely because of housing costs",
    calculation:
      "AHC_CHILD_POVERTY from @/lib/brief-data: ~62,000 children fall below the poverty line only after housing costs are deducted (210,600 after-housing-costs minus 148,700 before-housing-costs).",
    source: AHC_CHILD_POVERTY.source,
  },
];

const STATS: {
  value: string;
  accent: Accent;
  label: string;
  source: string;
  method: MethodEntry;
}[] = [
  {
    value: "169,300",
    accent: "orange",
    label: "children in material hardship — 14.3% of all Kiwi kids",
    source: "Stats NZ, year ended June 2025",
    method: METHODS[0],
  },
  {
    value: "+7.8%/yr",
    accent: "orange",
    label: "meat, poultry & fish — the basics climb fastest",
    source: "Stats NZ Food Price Index, April 2026",
    method: METHODS[1],
  },
  {
    value: "<½",
    accent: "indigo",
    label:
      "of an Auckland median rent the maximum Accommodation Supplement covers (~48%)",
    source: "WINZ rates 2026 · MBIE rents Mar 2026",
    method: METHODS[2],
  },
  {
    value: "~62,000",
    accent: "cyan",
    label: "children in poverty purely because of housing costs",
    source: "CPAG",
    method: METHODS[3],
  },
];

// /housing is feature 3, built separately by another agent — the link is
// intentional even though src/app/housing/ may not exist in this worktree yet.
const TOOLS: {
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  gradient: string;
}[] = [
  {
    href: "/budget",
    eyebrow: "The whole squeeze",
    title: "Budget Builder",
    blurb:
      "Compose the suite into one week: income minus rent, food and power — and what's left, or how far underwater. The connective hub that ties every tool together.",
    cta: "Build the budget",
    gradient: "from-brand-indigo to-brand-cyan",
  },
  {
    href: "/simulator",
    eyebrow: "The income side",
    title: "Indexation Simulator",
    blurb:
      "Pick a household, drag the policy levers, and watch its weekly income move against the CPAG basic-needs floor.",
    cta: "Move the levers",
    gradient: "from-brand-indigo to-brand-cyan",
  },
  {
    href: "/grocery",
    eyebrow: "The food spend",
    title: "Grocery Tracker",
    blurb:
      "The real Stats NZ Food Price Index by category since 2022 — and where the grocery squeeze bites hardest.",
    cta: "See the prices",
    gradient: "from-brand-orange to-brand-cyan",
  },
  {
    href: "/basket",
    eyebrow: "Today's real dollars",
    title: "Live Basket",
    blurb:
      "Live Woolworths NZ prices turned into a weekly shop — what a bare-staples or nutritious-family basket actually costs, and how much of a benefit it eats.",
    cta: "Price the shop",
    gradient: "from-brand-cyan to-brand-orange",
  },
  {
    href: "/energy",
    eyebrow: "The power bill",
    title: "Power & Energy",
    blurb:
      "Electricity and gas since 2019 — the steepest CPI rise since 1989, and the 'poverty premium' the poorest pay for power.",
    cta: "See the bill",
    gradient: "from-brand-orange to-brand-indigo",
  },
  {
    href: "/housing",
    eyebrow: "The rent gap",
    title: "Housing",
    blurb:
      "Rent against the Accommodation Supplement — how far the top-up falls short of what a roof actually costs.",
    cta: "See the gap",
    gradient: "from-brand-indigo to-brand-orange",
  },
  {
    href: "/map",
    eyebrow: "The postcode penalty",
    title: "Deprivation Map",
    blurb:
      "Where poverty concentrates geographically — the NZDep2023 districts where most residents live in the country's most-deprived areas, far above the national 20% share.",
    cta: "See the map",
    gradient: "from-brand-orange to-brand-indigo",
  },
];

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          thecolab.ai · Impact for Good
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          The squeeze from{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            both ends
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          In Aotearoa, low and fixed incomes are drifting below a cost-driven
          floor while the price of food and a roof keeps climbing. This is a
          small set of tools that makes that squeeze visible — in real dollars,
          from real Stats NZ, MSD and CPAG figures. Pull the income side up;
          watch the spend side rise to meet it.
        </p>
      </div>

      {/* Headline stats */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label} className="overflow-hidden pt-0">
            <div className={`h-1 w-full ${ACCENT_BG[s.accent]}`} />
            <CardContent className="pt-5">
              <div className="flex items-center gap-1.5">
                <p
                  className={`font-mono font-serif text-3xl tabular-nums ${ACCENT_TEXT[s.accent]}`}
                >
                  {s.value}
                </p>
                <MethodInfo {...s.method} />
              </div>
              <p className="mt-1 text-brand-slate-dark text-sm">{s.label}</p>
              <p className="mt-1 text-brand-slate-muted text-xs">{s.source}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reason for hope */}
      <Link
        href="/report#whatsworking"
        className="group relative mx-auto mb-6 block max-w-5xl rounded-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
      >
        <Card className="overflow-hidden pt-0 transition-[border-color,box-shadow] group-hover:border-brand-cyan/40 group-hover:shadow-md">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-cyan to-brand-indigo" />
          <CardContent className="flex flex-col gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-brand-slate-dark text-sm">
              <span className="font-medium text-brand-navy">
                And it&apos;s not hopeless.
              </span>{" "}
              The 2018&ndash;2022 package lifted around 66,500 children out of
              after-housing-costs poverty before some gains unwound &mdash;
              proof the levers work.
            </p>
            <span className="shrink-0 font-medium text-brand-cyan-dark text-sm">
              What&apos;s working{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </span>
          </CardContent>
        </Card>
      </Link>

      {/* Tools */}
      <h2 className="relative mx-auto mt-10 mb-4 max-w-5xl font-serif font-bold text-2xl text-brand-navy">
        Seven ways in
      </h2>
      <div className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group block rounded-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
          >
            <Card className="h-full overflow-hidden pt-0 transition-[border-color,box-shadow] group-hover:border-brand-cyan/40 group-hover:shadow-md">
              <div
                className={`h-1 w-full rounded-t-md bg-gradient-to-r ${t.gradient}`}
              />
              <CardHeader className="pt-5">
                <p className="font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
                  {t.eyebrow}
                </p>
                <CardTitle className="font-serif text-brand-navy">
                  {t.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-brand-slate-muted text-sm">{t.blurb}</p>
                <p className="font-medium text-brand-slate-muted text-sm group-hover:text-brand-cyan-dark">
                  {t.cta}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Export CTA */}
      <Card className="relative mx-auto mt-10 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <p className="font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
            Ship it · Hand it over
          </p>
          <CardTitle className="font-serif text-brand-navy">
            Export a one-page brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="max-w-2xl text-brand-slate-muted text-sm">
            Assemble every headline figure into a branded, print-ready State of
            Play — Save as PDF and hand it to an analyst or advocate.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild variant="default">
              <Link href="/brief">Open the brief →</Link>
            </Button>
            <Link
              href="/about"
              className="text-brand-slate-muted text-sm hover:text-brand-cyan-dark"
            >
              About &amp; sources →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Full report CTA */}
      <Card className="relative mx-auto mt-6 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
        <CardHeader className="pt-5">
          <p className="font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
            Read it all · The evidence in full
          </p>
          <CardTitle className="font-serif text-brand-navy">
            Read the full report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="max-w-2xl text-brand-slate-muted text-sm">
            The long-form brief behind these tools — who is poor in Aotearoa,
            where hardship pools by postcode and ethnicity, how housing
            multiplies it, and the eight evidence-led levers that would move it
            — plus the real, sourced gains that prove the levers work. Twelve
            sections, every figure sourced.
          </p>
          <Button asChild variant="default">
            <Link href="/report">Read the full report →</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Methodology & sources */}
      <MethodologyPanel entries={METHODS} />

      {/* Disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        Experimental proof-of-concept built for thecolab.ai's Impact for Good
        programme. Figures are drawn from public Stats NZ, MSD and CPAG sources
        and simplified for illustration — they are indicative, not exact, and
        this is not financial, legal or policy advice. British/NZ spelling used
        throughout (organisation, colours).
      </footer>
    </main>
  );
}
