"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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
import {
  FOOD_DISCLAIMER,
  FOOD_SOURCE_LINE,
  FOOD_SUBGROUPS,
  FPI_DATES,
  type FoodSubgroupKey,
  cumulativeChangePct,
  getSubgroup,
  rebaseToStart,
  subgroupsBySqueeze,
} from "@/lib/food-price-data";

const COLORS = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = Object.fromEntries(
  FOOD_SUBGROUPS.map((g) => [g.key, { label: g.label, color: g.color }]),
) satisfies ChartConfig;

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

// Default-visible lines: the all-food benchmark plus the grocery staples.
// Beverages and eating-out start hidden to keep the chart legible.
const DEFAULT_VISIBLE: FoodSubgroupKey[] = [
  "total",
  "meat_poultry_fish",
  "fruit_veg",
  "grocery_food",
];

const FOODBANK_SOURCE_LINE =
  "Source: thecolab.ai 'Impact for Good' report, citing NZ Food Network (foodbank demand vs pre-COVID baseline).";

const METHODS: MethodEntry[] = [
  {
    label: "Meat & fish — fastest-rising group (+7.8%)",
    calculation:
      "Annual change for the meat, poultry & fish subgroup: latest index level (April 2026) versus the level 12 months prior, as published by Stats NZ. The sharpest annual rise of any grocery group.",
    source: FOOD_SOURCE_LINE,
  },
  {
    label: "All food, year to April 2026 (+2.6%)",
    calculation:
      "Annual change for the all-food index: latest level (April 2026) versus 12 months prior. Compared against headline CPI of 3.1% (annual inflation to March 2026).",
    source: FOOD_SOURCE_LINE,
  },
  {
    label: "Foodbank demand vs pre-COVID (+165%)",
    calculation:
      "Increase in foodbank demand relative to the pre-COVID baseline, equating to over 500,000 people a month. Reported figure, not derived from the Food Price Index.",
    source: FOODBANK_SOURCE_LINE,
  },
  {
    label: "Food prices since January 2022 (rebased index)",
    calculation:
      "Each Stats NZ Food Price Index subgroup is rebased so January 2022 = 100, by dividing every monthly level by its January 2022 level and multiplying by 100. A value of 120 means prices are 20% higher than in January 2022.",
    source: FOOD_SOURCE_LINE,
  },
  {
    label: "Annual change by category (year to April 2026)",
    calculation:
      "For each subgroup, the annual % change: latest index level (April 2026) versus the level 12 months prior, as published by Stats NZ. Bars are ranked sharpest-first.",
    source: FOOD_SOURCE_LINE,
  },
];

export default function GroceryPage() {
  const [visible, setVisible] = useState<Set<FoodSubgroupKey>>(
    () => new Set(DEFAULT_VISIBLE),
  );

  const toggle = (key: FoodSubgroupKey) =>
    setVisible((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // Rebase every series to 100 at Jan 2022 so divergence reads at a glance.
  const lineData = useMemo(() => {
    const rebased = new Map<FoodSubgroupKey, number[]>();
    for (const g of FOOD_SUBGROUPS) rebased.set(g.key, rebaseToStart(g.values));
    return FPI_DATES.map((date, i) => {
      const row: Record<string, number | string> = { date };
      for (const g of FOOD_SUBGROUPS) {
        row[g.key] = (rebased.get(g.key) as number[])[i];
      }
      return row;
    });
  }, []);

  // Latest annual change, ranked sharpest-first (all six groups).
  const annualData = useMemo(
    () =>
      [...FOOD_SUBGROUPS]
        .sort((a, b) => b.annualPct - a.annualPct)
        .map((g) => ({
          key: g.key,
          label: g.shortLabel,
          annualPct: g.annualPct,
          color: g.color,
        })),
    [],
  );

  const sharpest = subgroupsBySqueeze({ groceryOnly: true })[0];
  const xTicks = FPI_DATES.filter((d) => d.endsWith("-01")); // one tick per year

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          Grocery Price Tracker · Stats NZ Food Price Index
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          Where the grocery squeeze{" "}
          <span className="bg-gradient-to-r from-brand-orange to-brand-cyan bg-clip-text text-transparent">
            bites hardest
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          The income side moves slowly; the spend side does not. This tracks the
          real Stats NZ Food Price Index by category since 2022 — and shows that
          the fastest-rising groceries are the protein and fresh produce a
          healthy diet depends on, the first things a tight budget cuts.
        </p>
      </div>

      {/* Highlight stats */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                {fmtPct(sharpest.annualPct)}
              </p>
              <MethodInfo {...METHODS[0]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              {sharpest.label} — fastest-rising group, year to April 2026
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-indigo" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-indigo tabular-nums">
                +2.6%
              </p>
              <MethodInfo {...METHODS[1]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              All food, year to April 2026 — below headline CPI (3.1%), but the
              basics keep climbing
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full bg-brand-orange" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-serif text-3xl text-brand-orange tabular-nums">
                +165%
              </p>
              <MethodInfo {...METHODS[2]} />
            </div>
            <p className="mt-1 text-brand-slate-dark text-sm">
              Foodbank demand vs pre-COVID — over 500,000 people a month
              <span className="text-brand-slate-muted"> (NZ Food Network)</span>
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
              Food prices since January 2022{" "}
              <span className="font-normal text-brand-slate-muted text-sm">
                (indexed to 100 = Jan 2022)
              </span>
            </span>
            <MethodInfo {...METHODS[3]} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category toggles (legend) */}
          <div className="flex flex-wrap gap-2">
            {FOOD_SUBGROUPS.map((g) => {
              const on = visible.has(g.key);
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => toggle(g.key)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
                    on
                      ? "border-transparent bg-stone-100 text-brand-slate-dark"
                      : "border-stone-200 text-brand-slate-muted opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: on ? g.color : "transparent",
                      boxShadow: `inset 0 0 0 1.5px ${g.color}`,
                    }}
                  />
                  {g.shortLabel}
                </button>
              );
            })}
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
                  value: "Jan 2022 = 100",
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
                      const g = FOOD_SUBGROUPS.find((s) => s.key === name);
                      const pct = Number(value) - 100;
                      return (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: g?.color }}
                            />
                            {g?.shortLabel ?? name}
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
              {FOOD_SUBGROUPS.filter((g) => visible.has(g.key)).map((g) => (
                <Line
                  key={g.key}
                  type="monotone"
                  dataKey={g.key}
                  stroke={g.color}
                  strokeWidth={g.key === "total" ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
          <p className="text-brand-slate-muted text-xs">
            Each line is a Stats NZ Food Price Index subgroup, rebased so
            January 2022 = 100. A value of 120 means prices in that group are
            20% higher than in January 2022.
          </p>
        </CardContent>
      </Card>

      {/* Lower grid: annual change + framing */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Annual change bar chart */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
              <span>
                Annual change by category
                <span className="ml-1 font-normal text-brand-slate-muted text-sm">
                  (year to April 2026)
                </span>
              </span>
              <MethodInfo {...METHODS[4]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={annualData}
                layout="vertical"
                margin={{ top: 4, right: 44, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  domain={[0, "dataMax + 1"]}
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
                  dataKey="label"
                  width={96}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="annualPct" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {annualData.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="annualPct"
                    position="right"
                    formatter={(v: number) => fmtPct(v)}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={12}
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
              The squeeze on the basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              Since January 2022, cumulative grocery rises land hardest on
              staples:
            </p>
            <ul className="space-y-1.5">
              {["grocery_food", "meat_poultry_fish", "fruit_veg", "total"].map(
                (k) => {
                  const g = getSubgroup(k as FoodSubgroupKey);
                  return (
                    <li
                      key={k}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2 text-brand-slate-dark">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: g.color }}
                        />
                        {g.label}
                      </span>
                      <span className="font-mono text-brand-slate-dark tabular-nums">
                        {fmtPct(cumulativeChangePct(g.values))}
                      </span>
                    </li>
                  );
                },
              )}
            </ul>
            <p className="text-brand-slate-muted">
              Benefits are indexed to general CPI, which lags the steeper
              inflation of the food groups poor households actually rely on — so
              even "maintained" support quietly buys less food each year. A bare
              staples basket already eats ~12% of a single Jobseeker benefit
              before any fresh meat, fish or fruit.
            </p>
            <Button asChild variant="default">
              <Link href="/simulator">See the income side →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & sources */}
      <MethodologyPanel entries={METHODS} />

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{FOOD_SOURCE_LINE}</p>
        <p>{FOOD_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
