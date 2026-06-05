"use client";

import Link from "next/link";
import { useMemo } from "react";
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
  AS_AREA_LABELS,
  HOUSING_CENTRES,
  HOUSING_CONTEXT,
  HOUSING_DISCLAIMER,
  HOUSING_SOURCES,
  HOUSING_SOURCE_LINE,
  sortByCoverage,
  sortByResidual,
} from "@/lib/housing-data";

const COLORS = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = {
  asCovered: {
    label: "Accommodation Supplement (max)",
    color: COLORS.cyan,
  },
  residual: { label: "Residual rent gap", color: COLORS.orange },
} satisfies ChartConfig;

const fmt0 = (n: number) => Math.round(n).toFixed(0);
const fmtPct1 = (n: number) => `${n.toFixed(1)}%`;
const dollar = (n: number) => `$${fmt0(n)}`;

const METHODS: MethodEntry[] = [
  {
    label: "Auckland: AS covers ~47.7% of rent",
    calculation:
      "AS coverage % = maximum family Accommodation Supplement (Area 1, family 2+ children = $305/wk) ÷ Auckland median weekly rent ($640/wk) × 100 = 47.7%.",
    source: HOUSING_SOURCE_LINE,
  },
  {
    label: "Largest residual rent gap",
    calculation:
      "Residual gap = median weekly rent − maximum family Accommodation Supplement, clamped at zero. The centre with the largest gap is shown (Queenstown-Lakes: $750 − $305 = $445/wk).",
    source: HOUSING_SOURCE_LINE,
  },
  {
    label: "385,025 AS recipients · $42.5m per week",
    calculation:
      "National Accommodation Supplement recipients and weekly spend, summed across the 12 MSD regions in the HUD dataset: 385,025 recipients, $42,451,479/week (≈$2.2b/yr). Corrects an earlier 769,954 / $84.9m figure that triple-counted across overlapping geographic levels (Region + TLA + local board).",
    source:
      "public-housing-nz skill — HUD Accommodation Supplement recipients & weekly spend (data.govt.nz), as at 1 Dec 2024",
  },
  {
    label: "Chart: Rent vs maximum Accommodation Supplement",
    calculation:
      "Each centre's median weekly rent split into the cyan portion the maximum family AS covers and the orange residual (rent − AS max), ranked by residual gap, largest first.",
    source: HOUSING_SOURCE_LINE,
  },
  {
    label: "Chart: How much of the rent the supplement covers",
    calculation:
      "AS coverage % = maximum family Accommodation Supplement ÷ median weekly rent × 100, per centre, ranked ascending (worst coverage first). The dashed line marks 50% (half of rent).",
    source: HOUSING_SOURCE_LINE,
  },
];

export default function HousingPage() {
  const ranked = useMemo(() => sortByResidual(), []);
  const coverageData = useMemo(() => sortByCoverage(), []);

  const barData = useMemo(
    () =>
      ranked.map((c) => ({
        name: c.name,
        asArea: c.asArea,
        rentWeekly: c.rentWeekly,
        asCovered: c.asMaxFamily,
        residual: c.residualFamily,
        coversPct: c.asCoversFamilyPct,
      })),
    [ranked],
  );

  const auckland = HOUSING_CENTRES.find((c) => c.name === "Auckland");
  const worstGap = ranked[0];
  const worstCoverage = coverageData[0];

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          Accommodation Supplement vs Rent · WINZ &amp; MBIE
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          How far the rent subsidy{" "}
          <span className="bg-gradient-to-r from-brand-orange to-brand-cyan bg-clip-text text-transparent">
            falls short
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          The Accommodation Supplement is the country&apos;s biggest housing
          subsidy — yet across every main centre its maximum payment covers
          under half the rent. This shows, per centre, what the cap pays versus
          what a family must still find from income. Housing is the master
          poverty multiplier: it is the single biggest reason
          after-housing-costs child poverty runs so far above the before-housing
          measure.
        </p>
      </div>

      {/* Highlight stats */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                {auckland ? fmtPct1(auckland.asCoversFamilyPct) : "39.6%"}
              </p>
              <MethodInfo {...METHODS[0]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              In Auckland the maximum Accommodation Supplement covers under half
              of a family&apos;s median weekly rent
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                {dollar(worstGap.residualFamily)}/wk
              </p>
              <MethodInfo {...METHODS[1]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              Largest residual rent gap — {worstGap.name} — left for a family to
              find after the maximum supplement
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-indigo" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-indigo tabular-nums">
                385,025
              </p>
              <MethodInfo {...METHODS[2]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              households receive the Accommodation Supplement, costing about
              $42.5m every week
              <span className="text-brand-slate-muted"> (HUD, 1 Dec 2024)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead chart: rent vs AS, stacked, ranked by residual gap */}
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
            <span>
              Rent vs the maximum Accommodation Supplement{" "}
              <span className="font-normal text-brand-slate-muted text-sm">
                (family with 2+ children · ranked by residual gap)
              </span>
            </span>
            <MethodInfo {...METHODS[3]} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Legend pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS.cyan }}
              />
              Accommodation Supplement (max)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS.orange }}
              />
              Residual rent gap
            </span>
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[520px] w-full md:h-[560px]"
          >
            <BarChart
              accessibilityLayer
              data={barData}
              layout="vertical"
              margin={{ top: 4, right: 56, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={COLORS.grid} />
              <XAxis
                type="number"
                domain={[0, "dataMax + 40"]}
                tickFormatter={(v) => `$${v}`}
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
                width={120}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_label, payload) => {
                      const area = payload?.[0]?.payload?.asArea as
                        | 1
                        | 2
                        | 3
                        | 4
                        | undefined;
                      return area ? AS_AREA_LABELS[area] : "";
                    }}
                    formatter={(_value, name, item) => {
                      // Stacked bars fire the formatter once per series; render
                      // the full breakdown only on the first (cyan) series.
                      if (name !== "Accommodation Supplement (max)")
                        return null;
                      const p = item?.payload as {
                        name: string;
                        rentWeekly: number;
                        asCovered: number;
                        residual: number;
                        coversPct: number;
                      };
                      return (
                        <div className="grid gap-0.5">
                          <span className="font-medium text-foreground">
                            {p.name}
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            Weekly rent
                            <span className="font-mono text-foreground tabular-nums">
                              {dollar(p.rentWeekly)}/wk
                            </span>
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            AS max
                            <span className="font-mono text-foreground tabular-nums">
                              {dollar(p.asCovered)}/wk
                            </span>
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            Residual gap
                            <span className="font-mono text-foreground tabular-nums">
                              {dollar(p.residual)}/wk
                            </span>
                          </span>
                          <span className="flex w-full items-center justify-between gap-3 text-muted-foreground">
                            AS covers
                            <span className="font-mono text-foreground tabular-nums">
                              {fmtPct1(p.coversPct)} of rent
                            </span>
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey="asCovered"
                name="Accommodation Supplement (max)"
                stackId="rent"
                fill={COLORS.cyan}
                radius={[4, 0, 0, 4]}
                maxBarSize={22}
                isAnimationActive={false}
              />
              <Bar
                dataKey="residual"
                name="Residual rent gap"
                stackId="rent"
                fill={COLORS.orange}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="residual"
                  position="right"
                  formatter={(v: number) => `$${v}`}
                  className="font-mono"
                  fill={COLORS.navy}
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          <p className="text-brand-slate-muted text-xs">
            Each bar is one centre&apos;s real median weekly rent (MBIE bond
            data, March 2026), split into the cyan portion the maximum
            supplement covers and the orange residual a family must fund from
            income. Most recipients receive less than the maximum, so real
            shortfalls are typically larger.
          </p>
        </CardContent>
      </Card>

      {/* Lower grid: coverage chart + framing/cross-link */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Coverage % chart */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
              <span>
                How much of the rent the supplement covers
                <span className="ml-1 font-normal text-brand-slate-muted text-sm">
                  (family maximum as a % of weekly rent)
                </span>
              </span>
              <MethodInfo {...METHODS[4]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[520px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={coverageData}
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
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine
                  x={50}
                  stroke={COLORS.muted}
                  strokeDasharray="4 4"
                  label={{
                    value: "Half of rent",
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
                      labelFormatter={(label) => String(label)}
                      formatter={(value) => (
                        <span className="font-mono text-foreground tabular-nums">
                          {fmtPct1(Number(value))} of rent
                        </span>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="asCoversFamilyPct"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                  isAnimationActive={false}
                >
                  {coverageData.map((c) => (
                    <Cell
                      key={c.name}
                      fill={
                        c.asCoversFamilyPct < 40 ? COLORS.orange : COLORS.indigo
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="asCoversFamilyPct"
                    position="right"
                    formatter={(v: number) => `${v.toFixed(1)}%`}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Framing + cross-link */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Housing: the poverty multiplier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              After-housing-costs child poverty (
              <span className="font-mono text-brand-slate-dark tabular-nums">
                210,600
              </span>
              ) runs far above the before-housing-costs measure (
              <span className="font-mono text-brand-slate-dark tabular-nums">
                148,700
              </span>
              ): roughly{" "}
              <span className="font-mono text-brand-slate-dark tabular-nums">
                62,000
              </span>{" "}
              children are poor purely because of housing costs. The
              Accommodation Supplement is capped well below actual rent, so even
              at the maximum a deep gap remains — and most households receive
              less than the maximum. The worst coverage is {worstCoverage.name},
              where the family cap reaches only{" "}
              <span className="font-mono text-brand-slate-dark tabular-nums">
                {fmtPct1(worstCoverage.asCoversFamilyPct)}
              </span>{" "}
              of rent.
            </p>
            <div className="space-y-2 border-stone-200 border-t pt-3">
              <p className="font-serif font-medium text-brand-navy text-sm">
                The wider picture
              </p>
              <ul className="space-y-1.5 text-brand-slate-muted">
                {HOUSING_CONTEXT.map((f) => (
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
            <Button asChild variant="default">
              <Link href="/simulator">See the income side →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & sources */}
      <div className="relative mx-auto mt-10 max-w-5xl">
        <MethodologyPanel entries={METHODS} />
      </div>

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{HOUSING_SOURCE_LINE}</p>
        <p>{HOUSING_DISCLAIMER}</p>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          {HOUSING_SOURCES.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-cyan-dark underline-offset-2 hover:underline"
            >
              {new URL(url).hostname.replace(/^www\./, "")}
            </a>
          ))}
        </p>
      </footer>
    </main>
  );
}
