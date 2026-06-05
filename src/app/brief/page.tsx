import Link from "next/link";

import { MethodInfo } from "@/components/method-info";
import { Card, CardContent } from "@/components/ui/card";
import {
  BRIEF_DISCLAIMER,
  BRIEF_GENERATED,
  KEY_FINDINGS,
} from "@/lib/brief-data";

import { PrintButton } from "./print-button";

export const metadata = { title: "State of Play brief" };

// Per-finding "how it's calculated" text, ordered to match KEY_FINDINGS. The
// source for each is reused from the finding's own `.source` line. Print-hidden.
const FINDING_CALCULATIONS = [
  "Count published by Stats NZ; the percentage is that count as a share of all New Zealand children (14.3% in the year ended June 2025).",
  "Children below the after-housing-costs poverty line (210,600); the before-housing-costs measure is 148,700, so roughly 62,000 (the difference) are poor purely because of housing costs.",
  "Annual percentage change in the meat, poultry & fish subgroup of the Stats NZ Food Price Index — the fastest-rising of the food groups tracked.",
  "Bare-staples basket weekly total summed from live Woolworths NZ shelf prices, then expressed as a share of a single Jobseeker benefit.",
  "Maximum Accommodation Supplement for a family divided by Auckland's median weekly rent; national median rent and the worst-covered centre are shown for context.",
  "Annual percentage change in the electricity series of the Stats NZ energy price index — the steepest CPI rise since 1989.",
  "Share of the territorial authority's residents living in NZDep2023 deciles 9–10 (most deprived), divided by the national baseline to give the over-index multiple.",
  "Total weekly outgoings minus base benefit income for a sole parent with three children in Auckland (base rate only — excludes Working for Families and the Accommodation Supplement); a negative residual is the shortfall.",
] as const;

// Brand accent rotated across the finding cards (same idiom as the home stats).
const ACCENT_BG = [
  "bg-brand-orange",
  "bg-brand-indigo",
  "bg-brand-cyan",
] as const;
const ACCENT_TEXT = [
  "text-brand-orange",
  "text-brand-indigo",
  "text-brand-cyan-dark",
] as const;

export default function BriefPage() {
  return (
    <main
      className="relative flex-1 overflow-hidden p-6 md:p-10"
      data-print-root
    >
      {/* signature gradient blobs (hidden on paper) */}
      <div className="print-blob pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl print:hidden" />
      <div className="print-blob pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
              thecolab.ai · Impact for Good — State of Play
            </p>
            <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
              The cost-of-living squeeze, on{" "}
              <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
                one page
              </span>
            </h1>
          </div>
          {/* Action bar — screen only */}
          <div className="flex items-center gap-3 print:hidden">
            <PrintButton />
            <Link
              href="/"
              className="text-brand-slate-muted text-sm hover:text-brand-cyan-dark"
            >
              ← Back
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Every headline figure from the suite, assembled for a single sheet of
          paper. Low and fixed incomes are drifting below a cost-driven floor
          while food, power and a roof keep climbing — pulled together here from
          real Stats NZ, MSD, MBIE, WINZ, CPAG and University of Otago figures.
          Save it as a PDF and hand it to an analyst or advocate.
        </p>
      </div>

      {/* Key findings */}
      <div className="relative mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
        {KEY_FINDINGS.map((f, i) => (
          // Stretched-link pattern: the card-wide <Link> is an overlay sibling
          // (not a parent) so the MethodInfo button is not nested in an anchor.
          <div
            key={f.label}
            data-print-card
            className="group relative rounded-xl"
          >
            <Card className="h-full overflow-hidden pt-0 transition-[border-color,box-shadow] group-hover:border-brand-cyan/40 group-hover:shadow-md print:break-inside-avoid">
              <div
                className={`h-1 w-full ${ACCENT_BG[i % ACCENT_BG.length]}`}
              />
              <CardContent className="pt-5">
                <div className="flex items-center gap-1.5">
                  <p
                    className={`font-mono font-serif text-3xl tabular-nums ${ACCENT_TEXT[i % ACCENT_TEXT.length]}`}
                  >
                    {f.value}
                  </p>
                  <MethodInfo
                    label={f.label}
                    calculation={
                      FINDING_CALCULATIONS[i % FINDING_CALCULATIONS.length]
                    }
                    source={f.source}
                    className="relative z-10"
                  />
                </div>
                <p className="mt-1 text-brand-slate-dark text-sm">{f.label}</p>
                <p className="mt-1 text-brand-slate-muted text-xs">
                  {f.detail}
                </p>
                <p className="mt-2 text-brand-slate-muted text-xs">
                  {f.source}
                </p>
              </CardContent>
            </Card>
            <Link
              href={f.href}
              aria-label={f.label}
              className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
            />
          </div>
        ))}
      </div>

      {/* The thesis */}
      <Card
        className="relative mx-auto mt-6 max-w-5xl overflow-hidden pt-0 print:break-inside-avoid"
        data-print-card
      >
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
        <CardContent className="space-y-3 pt-5 text-sm">
          <p className="font-serif font-medium text-brand-navy">
            The squeeze, in one line
          </p>
          <p className="text-brand-slate-muted">
            Income is held to general CPI while the things the poorest must buy
            — protein, power and rent — rise faster. Housing is the master
            multiplier: it is the single biggest reason after-housing-costs
            child poverty runs so far above the before-housing measure. Pull the
            income side up; watch the spend side rise to meet it.
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>State of Play brief · thecolab.ai · {BRIEF_GENERATED}.</p>
        <p>{BRIEF_DISCLAIMER}</p>
        <p>
          Full methodology and every data source with its date:{" "}
          <Link
            href="/about"
            className="text-brand-cyan-dark underline-offset-2 hover:underline"
          >
            About &amp; sources →
          </Link>
        </p>
      </footer>
    </main>
  );
}
