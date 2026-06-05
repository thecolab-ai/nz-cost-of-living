import Link from "next/link";

import { type MethodEntry, MethodInfo } from "@/components/method-info";
import { MethodologyPanel } from "@/components/methodology-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BRIEF_DISCLAIMER } from "@/lib/brief-data";
import {
  REPORT_GENERATED,
  REPORT_INTRO,
  REPORT_SECTIONS,
  REPORT_TITLE,
} from "@/lib/report-content";

export const metadata = {
  title: "Full report — Poverty in Aotearoa 2026",
  description:
    "The full long-form evidence brief: who is poor in New Zealand, where hardship pools, and which levers would move it.",
};

// Every stat across every section, flattened, for the page-wide methodology
// panel. Labels are de-duplicated so the same headline figure (e.g. the
// ~62,000-child gap) shows once.
function allMethodEntries(): MethodEntry[] {
  const seen = new Set<string>();
  const entries: MethodEntry[] = [];
  for (const section of REPORT_SECTIONS) {
    for (const stat of section.stats) {
      const key = `${stat.label}::${stat.value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        label: `${stat.value} — ${stat.label}`,
        calculation: stat.calculation,
        source: stat.source,
      });
    }
  }
  return entries;
}

export default function ReportPage() {
  const methodEntries = allMethodEntries();

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Hero header */}
      <header className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          thecolab.ai · Impact for Good — the report
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            {REPORT_TITLE}
          </span>
        </h1>
        <p className="mt-4 max-w-3xl text-brand-slate-muted leading-relaxed">
          {REPORT_INTRO}
        </p>
        <p className="mt-3 font-mono text-brand-slate-muted text-xs tabular-nums">
          Generated {REPORT_GENERATED}
        </p>
      </header>

      {/* Table of contents */}
      <nav
        aria-label="Report contents"
        className="relative mx-auto mb-10 max-w-5xl"
      >
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardContent className="pt-5">
            <p className="font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
              On this page
            </p>
            <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {REPORT_SECTIONS.map((section, i) => (
                <li key={section.id} className="flex items-baseline gap-2">
                  <span className="font-mono text-brand-slate-muted text-xs tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${section.id}`}
                    className="font-medium text-brand-slate-dark text-sm hover:text-brand-cyan-dark"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </nav>

      {/* Sections */}
      <div className="relative mx-auto max-w-5xl space-y-16">
        {REPORT_SECTIONS.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-6"
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
            <p className="mt-4 font-mono text-brand-slate-muted text-xs uppercase tracking-wide tabular-nums">
              Section {String(i + 1).padStart(2, "0")}
            </p>
            <h2
              id={`${section.id}-heading`}
              className="mt-1 font-serif font-bold text-3xl text-brand-navy tracking-tight"
            >
              {section.title}
            </h2>
            <p className="mt-3 max-w-3xl text-brand-slate-muted leading-relaxed">
              {section.subhead}
            </p>

            {/* Stat callouts */}
            {section.stats.length > 0 && (
              <div className="mt-6 grid max-w-5xl gap-4 sm:grid-cols-2">
                {section.stats.map((stat) => (
                  <Card key={stat.label} className="overflow-hidden pt-0">
                    <div className="h-1 w-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-1.5">
                        <p className="font-mono font-serif text-2xl text-brand-indigo tabular-nums">
                          {stat.value}
                        </p>
                        <MethodInfo
                          label={`${stat.value} — ${stat.label}`}
                          calculation={stat.calculation}
                          source={stat.source}
                        />
                      </div>
                      <p className="mt-1 text-brand-slate-dark text-sm">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-brand-slate-muted text-xs">
                        {stat.source}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Prose paragraphs */}
            <div className="mt-6 max-w-3xl space-y-4">
              {section.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 48)}
                  className="text-brand-slate-dark leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pullquote */}
            {section.pullquote && (
              <blockquote className="mt-6 max-w-3xl border-brand-indigo border-l-4 pl-5">
                <p className="font-serif text-brand-indigo text-xl leading-snug">
                  {section.pullquote}
                </p>
              </blockquote>
            )}

            {/* Recommendations */}
            {section.recommendations && section.recommendations.length > 0 && (
              <ol className="mt-8 max-w-3xl space-y-5">
                {section.recommendations.map((rec, ri) => (
                  <li key={rec.action}>
                    <Card className="overflow-hidden pt-0">
                      <div className="h-1 w-full bg-gradient-to-r from-brand-orange to-brand-cyan" />
                      <CardContent className="pt-5">
                        <div className="flex items-start gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 font-mono font-serif text-brand-indigo text-sm tabular-nums">
                            {ri + 1}
                          </span>
                          <div className="space-y-2">
                            <p className="font-serif font-medium text-brand-navy">
                              {rec.action}
                            </p>
                            <p className="text-brand-slate-dark text-sm leading-relaxed">
                              {rec.rationale}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-brand-cyan-dark">
                                Leverage:{" "}
                              </span>
                              <span className="text-brand-slate-muted">
                                {rec.leverage}
                              </span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
            )}

            {/* Cross-link to the live tool */}
            {section.crossLink && (
              <div className="mt-6">
                <Button asChild variant="default">
                  <Link href={section.crossLink.href}>
                    {section.crossLink.label} →
                  </Link>
                </Button>
              </div>
            )}

            {/* Section sources */}
            {section.sources.length > 0 && (
              <details className="group mt-6 max-w-3xl">
                <summary className="cursor-pointer font-medium text-brand-slate-muted text-sm hover:text-brand-cyan-dark">
                  Sources for this section ({section.sources.length})
                </summary>
                <ul className="mt-3 space-y-2">
                  {section.sources.map((src) => (
                    <li
                      key={src.slice(0, 64)}
                      className="flex gap-2 text-brand-slate-muted text-xs leading-relaxed"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-cyan" />
                      <span>{src}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        ))}
      </div>

      {/* Page-wide methodology panel, built from every stat */}
      <MethodologyPanel
        entries={methodEntries}
        note="How every headline figure in this report is calculated, and where the data comes from — collated across all sections."
      />

      {/* Footer disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        {BRIEF_DISCLAIMER}
      </footer>
    </main>
  );
}
