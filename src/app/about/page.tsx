import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASKET_HISTORY_METHOD } from "@/lib/basket-data";
import { BRIEF_DISCLAIMER, SUITE_SOURCES } from "@/lib/brief-data";
import {
  BUDGET_DISCLAIMER,
  DEFAULT_OTHER_WEEKLY,
  DEFAULT_POWER_WEEKLY,
} from "@/lib/budget-calc";
import { DEPRIVATION_META } from "@/lib/deprivation-data";

export const metadata = { title: "About, methodology & sources" };

function hostname(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

const CAVEATS: { title: string; body: string }[] = [
  {
    title: "Power dollars are an estimate, not from the energy index",
    body: `The energy module holds a price INDEX only, not a dollar level. The ~$${DEFAULT_POWER_WEEKLY}/wk power line in the Budget Builder is budget-calc's DEFAULT_POWER_WEEKLY — an MBIE-cited estimate (average household electricity ≈ $2,400–2,600/yr). The 'other essentials' line is DEFAULT_OTHER_WEEKLY ($${DEFAULT_OTHER_WEEKLY}/wk), also an adjustable estimate.`,
  },
  {
    title: "Some income anchors are inferred",
    body: "Benefit base rates use real published MSD figures where available, but the couple-Jobseeker anchor is inferred (roughly twice the single rate) and base rates exclude Working for Families and the Accommodation Supplement, so they understate true disposable income.",
  },
  {
    title: "The deprivation view is a ranked heat view, not a choropleth",
    body: `${DEPRIVATION_META.note} A reliable polygon boundary file was not available in this build, so the map is a graded ranked heat view of deprivation concentration. For the true geographic map, see the official EHINZ web map.`,
  },
  {
    title: "Basket history is reconstructed, not historical receipts",
    body: BASKET_HISTORY_METHOD,
  },
];

export default function AboutPage() {
  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          thecolab.ai · Impact for Good — Methodology
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          How this suite is{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            built &amp; sourced
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Every figure in these tools comes from a public source. This page sets
          out what each tool draws on, the date of each dataset, and an honest
          account of the estimates and limitations — so the numbers can be
          trusted, checked and challenged.
        </p>
        <div className="mt-5">
          <Button asChild variant="default">
            <Link href="/brief">Export the one-page brief →</Link>
          </Button>
        </div>
      </div>

      {/* 1. What each tool draws on */}
      <h2 className="relative mx-auto mt-10 mb-4 max-w-5xl font-serif font-bold text-2xl text-brand-navy">
        What each tool draws on
      </h2>
      <div className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SUITE_SOURCES.map((s) => (
          <Card key={s.module} className="h-full overflow-hidden pt-0">
            <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
            <CardHeader className="pt-5">
              <CardTitle className="font-serif text-base text-brand-navy">
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="space-y-1.5 text-brand-slate-muted">
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                  <span>{s.sourceLine}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                  <span>Reference period: {s.date}</span>
                </li>
              </ul>
              <Link
                href={s.href}
                className="font-medium text-brand-slate-muted text-sm hover:text-brand-cyan-dark"
              >
                Open the tool →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Every data source, with its date */}
      <h2 className="relative mx-auto mt-10 mb-4 max-w-5xl font-serif font-bold text-2xl text-brand-navy">
        Every data source, with its date
      </h2>
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
        <CardContent className="space-y-4 pt-5">
          {SUITE_SOURCES.map((s) => (
            <div
              key={s.module}
              className="space-y-1 border-stone-200 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <p className="font-serif font-medium text-brand-navy text-sm">
                {s.title}{" "}
                <span className="font-normal text-brand-slate-muted">
                  · {s.date}
                </span>
              </p>
              <p className="text-brand-slate-muted text-xs">{s.sourceLine}</p>
              {s.urls && s.urls.length > 0 && (
                <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                  {s.urls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-cyan-dark text-xs underline-offset-2 hover:underline"
                    >
                      {hostname(url)}
                    </a>
                  ))}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Confidence & honest caveats */}
      <h2 className="relative mx-auto mt-10 mb-4 max-w-5xl font-serif font-bold text-2xl text-brand-navy">
        Confidence &amp; honest caveats
      </h2>
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-indigo" />
        <CardContent className="space-y-4 pt-5 text-sm">
          <p className="text-brand-slate-muted">
            This is an experimental proof-of-concept, not advice.{" "}
            {BUDGET_DISCLAIMER}
          </p>
          <ul className="space-y-3">
            {CAVEATS.map((c) => (
              <li key={c.title} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-orange" />
                <span>
                  <span className="font-serif font-medium text-brand-navy">
                    {c.title}.
                  </span>{" "}
                  <span className="text-brand-slate-muted">{c.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="border-stone-200 border-t pt-3 text-brand-slate-muted">
            For the true geographic deprivation map, see{" "}
            <a
              href={DEPRIVATION_META.officialMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-cyan-dark underline-offset-2 hover:underline"
            >
              {hostname(DEPRIVATION_META.officialMapUrl)}
            </a>
            .
          </p>
        </CardContent>
      </Card>

      {/* Footer disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        {BRIEF_DISCLAIMER}
      </footer>
    </main>
  );
}
