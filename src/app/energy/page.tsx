"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { CPI_SOURCE_LINE, cpiRebasedTo } from "@/lib/cpi-data";
import {
  ENERGY_CONTEXT_FACTS,
  ENERGY_DISCLAIMER,
  ENERGY_POVERTY_PREMIUM_PCT,
  ENERGY_SERIES,
  ENERGY_SOURCE_LINE,
  EPI_DATES,
  type EnergySeriesKey,
  cumulativeChangePct,
  getSeries,
  rebaseToStart,
} from "@/lib/energy-data";

const COLORS = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = {
  ...Object.fromEntries(
    ENERGY_SERIES.map((s) => [s.key, { label: s.label, color: s.color }]),
  ),
  cpi: { label: "Headline CPI", color: COLORS.navy },
} satisfies ChartConfig;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(d: string): string {
  const [y, m] = d.split("-");
  return `${MONTHS[Number(m) - 1]} '${y.slice(2)}`;
}

const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

const METHODS: MethodEntry[] = [
  {
    label: "Electricity, annual change to April 2026",
    calculation:
      "Annual % change at the latest point: the April 2026 electricity index level versus the level 12 months prior. As published by Stats NZ (+13.1%).",
    source: ENERGY_SOURCE_LINE,
  },
  {
    label: "Cumulative electricity rise since January 2019",
    calculation:
      "Total % change across the whole series: latest index level ÷ January 2019 level × 100 − 100. Mains gas is computed the same way over the same window.",
    source: ENERGY_SOURCE_LINE,
  },
  {
    label: "Power 'poverty premium'",
    calculation:
      "Range that prepay/credit-meter tariffs run per unit above the cheapest plans low-income households cannot access; taken directly from the thecolab.ai poverty report, not derived from the index data.",
    source: "thecolab.ai poverty report (Driver 7: the poverty premium)",
  },
  {
    label: "Power prices since January 2019 (chart)",
    calculation:
      "Each Stats NZ monthly price index is rebased so January 2019 = 100 (each value ÷ January 2019 value × 100). A value of 133 means power is 33% dearer than in January 2019.",
    source: ENERGY_SOURCE_LINE,
  },
];

export default function EnergyPage() {
  // Headline CPI (all groups) rebased to 100 at Jan 2019 — same base as the
  // electricity/gas series — so it reads as a general-inflation benchmark.
  const cpi = useMemo(() => cpiRebasedTo(EPI_DATES), []);

  // Rebase each series to 100 at Jan 2019 so divergence reads at a glance.
  const lineData = useMemo(() => {
    const rebased = new Map<EnergySeriesKey, number[]>();
    for (const s of ENERGY_SERIES) rebased.set(s.key, rebaseToStart(s.values));
    return EPI_DATES.map((date, i) => {
      const row: Record<string, number | string> = { date };
      for (const s of ENERGY_SERIES) {
        row[s.key] = (rebased.get(s.key) as number[])[i];
      }
      const cpiVal = cpi[i];
      if (cpiVal != null) row.cpi = cpiVal;
      return row;
    });
  }, [cpi]);

  const elecCumulative = cumulativeChangePct(getSeries("electricity").values);
  const gasCumulative = cumulativeChangePct(getSeries("gas").values);
  const xTicks = EPI_DATES.filter((d) => d.endsWith("-01")); // one tick per year

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          Power Prices · Stats NZ Selected Price Indexes
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          Why the power bill is the steepest rise{" "}
          <span className="bg-gradient-to-r from-brand-orange to-brand-cyan bg-clip-text text-transparent">
            since 1989
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Electricity is now the single biggest driver of CPI inflation — the
          steepest rise since 1989. The poorest households pay a "poverty
          premium" on power, while benefits indexed to general CPI quietly lag
          energy inflation each year. This tracks the real Stats NZ electricity
          and gas price indexes since 2019.
        </p>
      </div>

      {/* Highlight stats */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                +13.1%/yr
              </p>
              <MethodInfo {...METHODS[0]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              Electricity, year to April 2026 — the single largest contributor
              to annual CPI and the steepest rise since 1989
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-indigo" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-indigo tabular-nums">
                {fmtPct(elecCumulative)}
              </p>
              <MethodInfo {...METHODS[1]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              Cumulative electricity rise since January 2019; mains gas is up{" "}
              {fmtPct(gasCumulative)} over the same window
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                {ENERGY_POVERTY_PREMIUM_PCT}
              </p>
              <MethodInfo {...METHODS[2]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              The "poverty premium": prepay/credit-meter tariffs the poorest pay
              per unit above the cheapest plans they can't access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hero line chart */}
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
            <span>
              Power prices since January 2019{" "}
              <span className="font-normal text-brand-slate-muted text-sm">
                (indexed to 100 = Jan 2019)
              </span>
            </span>
            <MethodInfo {...METHODS[3]} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Legend pills (static — two series + CPI benchmark) */}
          <div className="flex flex-wrap gap-2">
            {ENERGY_SERIES.map((s) => (
              <span
                key={s.key}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs">
              <span
                className="inline-block h-0 w-3.5 border-t-2 border-dashed"
                style={{ borderColor: COLORS.navy }}
              />
              Headline CPI
            </span>
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[340px] w-full md:h-[420px]"
          >
            <LineChart
              data={lineData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke={COLORS.grid} />
              <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={["dataMin - 4", "dataMax + 4"]}
                width={40}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={100}
                stroke={COLORS.muted}
                strokeDasharray="4 4"
                label={{
                  value: "Jan 2019 = 100",
                  position: "insideBottomRight",
                  fill: COLORS.muted,
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatDate(String(label))}
                    formatter={(value, name) => {
                      const isCpi = name === "cpi";
                      const s = ENERGY_SERIES.find((g) => g.key === name);
                      const pct = Number(value) - 100;
                      return (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            {isCpi ? (
                              <span
                                className="inline-block h-0 w-3 border-t-2 border-dashed"
                                style={{ borderColor: COLORS.navy }}
                              />
                            ) : (
                              <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: s?.color }}
                              />
                            )}
                            {isCpi ? "Headline CPI" : (s?.shortLabel ?? name)}
                          </span>
                          <span className="font-mono text-foreground tabular-nums">
                            {fmtPct(pct)}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="electricity"
                stroke={COLORS.orange}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="gas"
                stroke={COLORS.indigo}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="cpi"
                name="Headline CPI"
                stroke={COLORS.navy}
                strokeDasharray="5 4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
          <p className="text-brand-slate-muted text-xs">
            Each line is a Stats NZ price index rebased so January 2019 = 100. A
            value of 133 means power is 33% dearer than in January 2019. The
            dashed navy line is headline CPI (all groups) on the same base —
            both electricity and gas sit well above it, so power has far
            outpaced general inflation.
          </p>
        </CardContent>
      </Card>

      {/* Lower grid: who it hits + electricity vs gas summary */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Who it hits + framing/cross-links */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Who the power bill hits hardest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              The poorest households pay a "poverty premium" on power — prepay
              and credit-meter tariffs run about {ENERGY_POVERTY_PREMIUM_PCT}{" "}
              more per unit than the cheapest plans they can't access.
              Electricity takes about 7.5% of the poorest households' income,
              versus under 1.5% for the richest, so the same price rise lands
              where there is least slack.
            </p>
            <ul className="space-y-1.5 text-brand-slate-muted">
              {ENERGY_CONTEXT_FACTS.map((f) => (
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
            <div className="flex flex-col gap-2">
              {/* /budget is built separately by another agent — the link is
                  intentional even though src/app/budget/ may not exist yet. */}
              <Button asChild variant="default">
                <Link href="/budget">See the full budget squeeze →</Link>
              </Button>
              <Link
                href="/grocery"
                className="font-medium text-brand-cyan-dark text-sm underline-offset-2 hover:underline"
              >
                Compare the food spend →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Electricity vs gas mini summary */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Electricity vs gas since 2019
              <span className="ml-1 font-normal text-brand-slate-muted text-sm">
                (cumulative rise)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              Both have climbed sharply since January 2019, but from different
              shapes: electricity's rise is recent and steep, while gas has
              risen further over the full window.
            </p>
            <ul className="space-y-1.5">
              {ENERGY_SERIES.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-brand-slate-dark">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                  <span className="font-mono text-brand-slate-dark tabular-nums">
                    {fmtPct(cumulativeChangePct(s.values))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-brand-slate-muted">
              Benefits are indexed to general CPI, which lags the steeper
              inflation of power — so even "maintained" support quietly buys
              less warmth each year.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & sources */}
      <div className="relative mx-auto mt-6 max-w-5xl">
        <MethodologyPanel entries={METHODS} />
      </div>

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{ENERGY_SOURCE_LINE}</p>
        <p>{CPI_SOURCE_LINE}</p>
        <p>{ENERGY_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
