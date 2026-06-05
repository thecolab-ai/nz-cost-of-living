"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { type MethodEntry, MethodInfo } from "@/components/method-info";
import { MethodologyPanel } from "@/components/methodology-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DEPRIVATION_CONTEXT,
  DEPRIVATION_DISCLAIMER,
  DEPRIVATION_META,
  DEPRIVATION_SOURCE_LINE,
  type Geography,
  NATIONAL_BASELINE_PCT,
  depBand,
  depColor,
  depColorByDecile,
  overIndex,
  topByDeprivation,
} from "@/lib/deprivation-data";

const COLORS = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = {
  pct910: { label: "Deciles 9–10 share", color: COLORS.orange },
  meanDecile: { label: "Mean decile", color: COLORS.indigo },
} satisfies ChartConfig;

// Ramp legend stops, anchored at the ~20% national baseline.
const LEGEND_STOPS: { color: string; label: string }[] = [
  { color: depColor(5), label: "below baseline" },
  { color: depColor(20), label: "~20% national" },
  { color: depColor(45), label: "over-represented" },
  { color: depColor(78), label: "concentrated" },
];

const fmtPct1 = (n: number) => `${n.toFixed(1)}%`;
const fmtInt = (n: number) => n.toLocaleString("en-NZ");
const fmtDecile = (n: number) => n.toFixed(2);

const METHODS: MethodEntry[] = [
  {
    label: "Highest concentration (worst district)",
    calculation:
      "pct910 is an area's share of usually-resident population living in NZDep2023 deciles 9–10 (the most-deprived 20% of small areas nationally). The headline picks the top-ranked district — Kawerau at 78.0% — taken verbatim from the source aggregation, no recomputation.",
    source: DEPRIVATION_SOURCE_LINE,
  },
  {
    label: "~20% national baseline",
    calculation:
      "NZDep is relative: by construction about 20% of New Zealanders fall in deciles 9–10 (the most-deprived 20% of small areas), so this baseline is exact by design. A district far above 20% carries a disproportionate share of deprivation.",
    source: DEPRIVATION_SOURCE_LINE,
  },
  {
    label: "Usually-resident population",
    calculation:
      "Total usually-resident population (4,992,801) across 67 territorial authorities / 16 regions from the 2023 Census, as aggregated in the NZDep2023 source.",
    source: DEPRIVATION_SOURCE_LINE,
  },
  {
    label: "Where deprivation concentrates (ranked heat bars)",
    calculation:
      "Top 15 areas for the selected geography, ranked descending by pct910 (share of residents in NZDep2023 deciles 9–10). Bars are coloured on a heat ramp anchored at the 20% national baseline; the dashed line marks 20% (the national share by construction). A ranked heat view of concentration, not a polygon choropleth.",
    source: DEPRIVATION_SOURCE_LINE,
  },
  {
    label: "How deep the deprivation runs (mean decile)",
    calculation:
      "Population-weighted mean NZDep2023 decile (1 = least, 10 = most deprived) for the same top-15 areas, taken verbatim from the source. The dashed line marks the 5.5 national mid-point.",
    source: DEPRIVATION_SOURCE_LINE,
  },
];

export default function DeprivationMapPage() {
  const [geo, setGeo] = useState<Geography>("ta");

  const rows = useMemo(() => topByDeprivation(geo, 15), [geo]);
  const worst = useMemo(() => topByDeprivation(geo, 1)[0], [geo]);

  const shareData = useMemo(
    () =>
      rows.map((r) => ({
        name: r.name,
        pct910: r.pct910,
        meanDecile: r.meanDecile,
        pop: r.pop,
        fill: depColor(r.pct910),
      })),
    [rows],
  );

  const decileData = useMemo(
    () =>
      rows.map((r) => ({
        name: r.name,
        meanDecile: r.meanDecile,
        pct910: r.pct910,
        pop: r.pop,
        fill: depColorByDecile(r.meanDecile),
      })),
    [rows],
  );

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          NZDep2023 Deprivation · University of Otago (HIRP)
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          The postcode{" "}
          <span className="bg-gradient-to-r from-brand-orange to-brand-cyan bg-clip-text text-transparent">
            penalty
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Where poverty concentrates geographically. This is a ranked heat view
          of deprivation concentration — the NZDep2023 districts and regions
          where most residents live in the country&apos;s most-deprived areas
          (deciles 9–10). NZDep is relative: about a fifth of New Zealanders
          fall in those deciles by design, so a place far above 20% carries a
          disproportionate share of deprivation. A child&apos;s address, not the
          national average, largely decides their odds.
        </p>
      </div>

      {/* EHINZ official-map callout — honest framing */}
      <Card className="relative mx-auto mb-6 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full bg-gradient-to-r from-brand-cyan to-brand-indigo" />
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-brand-slate-dark text-sm">
            This is a ranked heat view of deprivation concentration, not a
            literal boundary map. For the true geographic choropleth, open the
            official EHINZ deprivation web map.
          </p>
          <Button asChild variant="default" className="shrink-0">
            <a
              href={DEPRIVATION_META.officialMapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the official EHINZ map →
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Highlight stats */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                {fmtPct1(worst.pct910)}
              </p>
              <MethodInfo {...METHODS[0]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              {worst.name} — the highest concentration in NZ: nearly four in
              five residents live in the most-deprived deciles 9–10
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-indigo" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-indigo tabular-nums">
                ~20%
              </p>
              <MethodInfo {...METHODS[1]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              By construction, about a fifth of New Zealanders live in deciles
              9–10. NZDep is relative — districts far above this line carry a
              disproportionate share.
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-cyan" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-cyan-dark tabular-nums">
                {fmtInt(DEPRIVATION_META.nationalPop)}
              </p>
              <MethodInfo {...METHODS[2]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              usually-resident population across 67 districts / 16 regions (2023
              Census)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead chart: ranked heat bars by share in deciles 9–10 */}
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
            <span>
              Where deprivation concentrates{" "}
              <span className="font-normal text-brand-slate-muted text-sm">
                (top 15 by share of residents in NZDep deciles 9–10)
              </span>
            </span>
            <MethodInfo {...METHODS[3]} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Geography toggle */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "ta" as const, label: "Districts (TA)" },
                { id: "region" as const, label: "Regions" },
              ] satisfies { id: Geography; label: string }[]
            ).map((opt) => {
              const on = geo === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGeo(opt.id)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
                    on
                      ? "border-transparent bg-stone-100 text-brand-slate-dark"
                      : "border-stone-200 text-brand-slate-muted opacity-60 hover:opacity-100"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Ramp legend */}
          <div className="flex flex-wrap items-center gap-3">
            {LEGEND_STOPS.map((stop) => (
              <span
                key={stop.label}
                className="inline-flex items-center gap-1.5 text-brand-slate-muted text-xs"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: stop.color }}
                />
                {stop.label}
              </span>
            ))}
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[560px] w-full md:h-[600px]"
          >
            <BarChart
              accessibilityLayer
              data={shareData}
              layout="vertical"
              margin={{ top: 4, right: 56, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={COLORS.grid} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                x={NATIONAL_BASELINE_PCT}
                stroke={COLORS.muted}
                strokeDasharray="4 4"
                label={{
                  value: "national average — 20% by design",
                  position: "insideTopRight",
                  fill: COLORS.muted,
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_label, payload) =>
                      String(payload?.[0]?.payload?.name ?? "")
                    }
                    formatter={(_value, _name, item) => {
                      const p = item?.payload as {
                        pct910: number;
                        meanDecile: number;
                        pop: number;
                      };
                      return (
                        <div className="grid gap-0.5">
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            Deciles 9–10
                            <span className="font-mono text-foreground tabular-nums">
                              {fmtPct1(p.pct910)}
                            </span>
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            Mean decile
                            <span className="font-mono text-foreground tabular-nums">
                              {fmtDecile(p.meanDecile)}
                            </span>
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            Residents
                            <span className="font-mono text-foreground tabular-nums">
                              {fmtInt(p.pop)}
                            </span>
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey="pct910"
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                isAnimationActive={false}
              >
                {shareData.map((r) => (
                  <Cell key={r.name} fill={r.fill} />
                ))}
                <LabelList
                  dataKey="pct910"
                  position="right"
                  formatter={(v: number) => `${v.toFixed(1)}%`}
                  className="font-mono"
                  fill={COLORS.navy}
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          <p className="text-brand-slate-muted text-xs">
            Each bar is one area&apos;s share of residents living in NZDep2023
            deciles 9–10, coloured on a heat ramp anchored at the 20% national
            baseline. This is a ranked heat view of concentration, not a polygon
            choropleth — for the true geographic map, open the official EHINZ
            web map above.
          </p>
        </CardContent>
      </Card>

      {/* Lower grid: mean-decile companion + framing/cross-links */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Mean decile chart */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
              <span>
                How deep the deprivation runs
                <span className="ml-1 font-normal text-brand-slate-muted text-sm">
                  (population-weighted mean decile)
                </span>
              </span>
              <MethodInfo {...METHODS[4]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[560px] w-full md:h-[600px]"
            >
              <BarChart
                accessibilityLayer
                data={decileData}
                layout="vertical"
                margin={{ top: 4, right: 56, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  domain={[0, 10]}
                  tickFormatter={(v) => `${v}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine
                  x={5.5}
                  stroke={COLORS.muted}
                  strokeDasharray="4 4"
                  label={{
                    value: "national mid-point",
                    position: "insideTopRight",
                    fill: COLORS.muted,
                    fontSize: 11,
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_label, payload) =>
                        String(payload?.[0]?.payload?.name ?? "")
                      }
                      formatter={(value) => (
                        <span className="font-mono text-foreground tabular-nums">
                          mean decile {fmtDecile(Number(value))}
                        </span>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="meanDecile"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                  isAnimationActive={false}
                >
                  {decileData.map((r) => (
                    <Cell key={r.name} fill={r.fill} />
                  ))}
                  <LabelList
                    dataKey="meanDecile"
                    position="right"
                    formatter={(v: number) => v.toFixed(2)}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Framing + cross-links */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              The postcode penalty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              {worst.name}&apos;s{" "}
              <span className="font-mono text-brand-slate-dark tabular-nums">
                {fmtPct1(worst.pct910)}
              </span>{" "}
              is about{" "}
              <span className="font-mono text-brand-slate-dark tabular-nums">
                {overIndex(worst.pct910).toFixed(1)}×
              </span>{" "}
              the national 20% share — {depBand(worst.pct910)}. NZDep is
              relative by construction, so concentration like this means a
              disproportionate share of the country&apos;s deprivation pools in
              a handful of places.
            </p>
            <div className="space-y-2 border-stone-200 border-t pt-3">
              <p className="font-serif font-medium text-brand-navy text-sm">
                The wider picture
              </p>
              <ul className="space-y-1.5 text-brand-slate-muted">
                {DEPRIVATION_CONTEXT.map((f) => (
                  <li key={f.source} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-cyan" />
                    <span>
                      {f.fact}{" "}
                      <span className="text-brand-slate-muted/80">
                        ({f.source})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-brand-slate-muted">
              This is Driver 5 — spatial pooling: when deprivation concentrates,
              cold homes, thin transport, closed GP books and thinned services
              compound in the same postcodes, so place itself becomes a
              multiplier on every other pressure.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default">
                <Link href="/housing">See where rent bites →</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/budget">Build the weekly budget →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & sources */}
      <div className="relative mx-auto mt-10 max-w-5xl">
        <MethodologyPanel entries={METHODS} />
      </div>

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{DEPRIVATION_SOURCE_LINE}</p>
        <p>{DEPRIVATION_DISCLAIMER}</p>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          {[DEPRIVATION_META.sourceUrl, DEPRIVATION_META.officialMapUrl].map(
            (url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cyan-dark underline-offset-2 hover:underline"
              >
                {new URL(url).hostname.replace(/^www\./, "")}
              </a>
            ),
          )}
        </p>
      </footer>
    </main>
  );
}
