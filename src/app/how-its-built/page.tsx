import Link from "next/link";

import { type MethodEntry, MethodInfo } from "@/components/method-info";
import { MethodologyPanel } from "@/components/methodology-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUITE_SOURCES } from "@/lib/brief-data";

export const metadata = { title: "How it's built" };

const STATS: { value: string; label: string; method: MethodEntry }[] = [
  {
    value: "8",
    label: "connected tools, each its own page",
    method: {
      label: "Connected tools",
      calculation:
        "Count of distinct tool routes (one page per feature) in this repository's App Router.",
      source: "this repository (self-reported).",
    },
  },
  {
    value: "122",
    label: "automated tests across the suite",
    method: {
      label: "Automated tests",
      calculation:
        "Count of Vitest tests across the suite's pure calculation and data modules.",
      source: "this repository (self-reported).",
    },
  },
  {
    value: "5+",
    label: "official data sources, fetched live",
    method: {
      label: "Official data sources",
      calculation:
        "Count of distinct official data sources (Stats NZ, MBIE, MSD, Otago and live supermarket prices) drawn on across the suite.",
      source: "this repository (self-reported).",
    },
  },
];

const METHODS: MethodEntry[] = STATS.map((s) => s.method);

const PHASES: { title: string; body: string }[] = [
  {
    title: "One AI workflow per feature",
    body: "Each tool was built by a small multi-agent workflow that runs in three phases — Design (blueprint the page and data shape), Build (write the data module, page and tests), and Verify (run the type-checker, the full test suite and the linter independently). Nothing ships until those gates are green.",
  },
  {
    title: "Real data, fetched honestly",
    body: "No figures are invented. Stats NZ price indices come straight from the published Selected Price Indexes CSV; MBIE rents and the Otago NZDep2023 deprivation data are behind bot gates, so a headless browser (Puppeteer) clears them and downloads the real files; live supermarket prices come from thecolab.ai's own woolworths-nz skill. Where a number is an estimate, it is labelled as one.",
  },
  {
    title: "Pure, testable calculations",
    body: "The maths lives in small pure modules with no UI — the indexation calculator, the floor projection, the budget composer — each covered by unit tests that pin the numbers so they can't quietly drift. The Budget Builder imports income, rent and food from the other modules rather than copying values.",
  },
  {
    title: "Consistent, verifiable, on-brand",
    body: "Every page shares one shell, the thecolab.ai palette and typography, and NZ/British spelling. Each carries its sources and an experimental-proof-of-concept disclaimer, and the whole suite exports to a one-page brief and an About page so any figure can be traced back to its origin.",
  },
];

const STACK = [
  "Next.js 15 (App Router)",
  "TypeScript",
  "Tailwind CSS v4",
  "Recharts",
  "Vitest",
  "Biome",
  "thecolab.ai .skills library",
];

export default function HowItsBuiltPage() {
  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          thecolab.ai · Impact for Good — how it was made
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          Built by AI,{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            grounded in real data
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          This whole suite was assembled by an AI multi-agent process — but
          every number traces to an official source, every calculation is
          unit-tested, and every estimate is labelled. Here's how it works.
        </p>
      </div>

      {/* By the numbers */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label} className="overflow-hidden pt-0">
            <div className="h-1 w-full bg-brand-indigo" />
            <CardContent className="pt-5">
              <div className="flex items-center gap-1.5">
                <p className="font-mono font-serif text-3xl text-brand-indigo tabular-nums">
                  {s.value}
                </p>
                <MethodInfo {...s.method} />
              </div>
              <p className="mt-1 text-brand-slate-dark text-sm">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* The method */}
      <div className="relative mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {PHASES.map((p) => (
          <Card key={p.title} className="overflow-hidden pt-0">
            <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
            <CardHeader className="pt-5">
              <CardTitle className="font-serif text-brand-navy">
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-slate-muted text-sm">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stack + data coverage */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              The stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              What each tool draws on
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <ul className="space-y-1.5">
              {SUITE_SOURCES.map((src) => (
                <li
                  key={src.module}
                  className="flex items-baseline gap-2 text-brand-slate-dark"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                  <span>
                    <Link
                      href={src.href}
                      className="font-medium text-brand-navy hover:text-brand-cyan-dark"
                    >
                      {src.title}
                    </Link>{" "}
                    <span className="text-brand-slate-muted">· {src.date}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-3">
              <Button asChild variant="default">
                <Link href="/why">Why we built it →</Link>
              </Button>
              <Link
                href="/about"
                className="font-medium text-brand-cyan-dark text-sm underline-offset-2 hover:underline"
              >
                Full sources &amp; confidence →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <MethodologyPanel entries={METHODS} />

      {/* Disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        Experimental proof-of-concept built for thecolab.ai's Impact for Good
        programme — not financial, legal or policy advice. AI assembled the
        tooling; the underlying figures are public Stats NZ, MBIE, MSD and Otago
        data and should be verified against those sources before use. British/NZ
        spelling used throughout (organisation, colours).
      </footer>
    </main>
  );
}
