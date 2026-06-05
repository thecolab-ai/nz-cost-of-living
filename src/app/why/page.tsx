import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: 'Why "for good"' };

// The data sources this suite pulls together — the point is the breadth.
const SOURCES: { label: string; detail: string }[] = [
  {
    label: "Stats NZ",
    detail:
      "Child Poverty Reduction Act measures, the Food Price Index and electricity sub-indices",
  },
  {
    label: "MBIE",
    detail: "Tenancy bond data — real median market rents by district",
  },
  {
    label: "MSD / Work and Income",
    detail: "benefit base rates and Accommodation Supplement maxima",
  },
  {
    label: "University of Otago",
    detail: "NZDep2023 deprivation by small area, from the 2023 Census",
  },
  {
    label: "Woolworths NZ",
    detail: "live supermarket prices for a real weekly basket",
  },
];

const STEPS: { num: string; title: string; body: string }[] = [
  {
    num: "1",
    title: "Too diverse for one person to hold",
    body: "NZ poverty is not one number — it is income adequacy, food prices, power bills, rent, and where you happen to live. Each lives in a different place: a Stats NZ release, an MBIE CSV, an MSD rate table, an Otago census file, a supermarket website. Reconciling them by hand is slow, and most people never see them side by side.",
  },
  {
    num: "2",
    title: "AI is unusually good at this",
    body: "Fetching scattered datasets, reconciling units and dates, doing the arithmetic, and joining them into one consistent picture is exactly the kind of broad, patient, multi-source work AI does well — and a human analyst rarely has time for. The machine does the gathering so a person can do the judging.",
  },
  {
    num: "3",
    title: "Turned into one connected, real-dollar picture",
    body: "The result is a set of tools where the income side and the spend side meet: drag a policy lever and watch a household cross — or miss — the basic-needs floor; price a real weekly shop; see rent against the subsidy; and tie it all together in one weekly budget.",
  },
  {
    num: "4",
    title: "In service of the people it describes",
    body: 'That is the "for good": using AI and open data to make the cost-of-living squeeze legible and actionable — for a case worker, an advocate, an analyst, or anyone trying to understand why work no longer guarantees a way out.',
  },
];

export default function WhyPage() {
  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          thecolab.ai · Impact for Good — the reasoning
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          Data too diverse for one person,{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            connected by AI
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          New Zealand's cost-of-living squeeze is scattered across a dozen
          official datasets that no one person can hold in their head at once.
          This is an experiment in using AI to bring them together — and turn
          them into something a person can actually act on.
        </p>
      </div>

      {/* The argument, in steps */}
      <div className="relative mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <Card key={s.num} className="overflow-hidden pt-0">
            <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
            <CardHeader className="pt-5">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-indigo/10 font-mono font-serif text-brand-indigo text-sm tabular-nums">
                  {s.num}
                </span>
                <CardTitle className="font-serif text-brand-navy">
                  {s.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-brand-slate-muted text-sm">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What it pulls together */}
      <Card className="relative mx-auto mt-6 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="font-serif text-brand-navy">
            Five sources, one picture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-brand-slate-muted">
            The point is the breadth. Each tool here draws on official, public
            data that normally sits apart:
          </p>
          <ul className="space-y-1.5">
            {SOURCES.map((src) => (
              <li
                key={src.label}
                className="flex items-baseline gap-2 text-brand-slate-dark"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                <span>
                  <span className="font-medium text-brand-navy">
                    {src.label}
                  </span>{" "}
                  — {src.detail}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-3">
            <Button asChild variant="default">
              <Link href="/budget">See it all in one budget →</Link>
            </Button>
            <Link
              href="/how-its-built"
              className="font-medium text-brand-cyan-dark text-sm underline-offset-2 hover:underline"
            >
              How it was built →
            </Link>
            <Link
              href="/about"
              className="font-medium text-brand-cyan-dark text-sm underline-offset-2 hover:underline"
            >
              Every source &amp; its date →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        Experimental proof-of-concept built for thecolab.ai's Impact for Good
        programme — not financial, legal or policy advice. It brings public data
        together to make the squeeze legible; always verify figures against the
        original Stats NZ, MBIE, MSD and Otago sources before relying on them.
        British/NZ spelling used throughout (organisation, colours).
      </footer>
    </main>
  );
}
