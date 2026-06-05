"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Line,
  ReferenceDot,
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
  BASKETS,
  BASKET_DATES,
  BASKET_DISCLAIMER,
  BASKET_HISTORY_METHOD,
  BASKET_SOURCE_LINE,
  type BasketKey,
  DEFAULT_BASKET,
  JOBSEEKER_SINGLE_WEEKLY,
  basketsByCost,
  getBasket,
  pctOfJobseeker,
} from "@/lib/basket-data";
import { CPI_SOURCE_LINE, cpiRebasedTo } from "@/lib/cpi-data";

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
    BASKETS.map((b) => [b.key, { label: b.title, color: b.color }]),
  ),
  cpi: { label: "Headline CPI", color: COLORS.navy },
} satisfies ChartConfig;

// Per-figure method + source for every basket card and the history chart.
const METHODS: MethodEntry[] = [
  ...basketsByCost().flatMap((b): MethodEntry[] => [
    {
      label: `${b.title} — weekly cost`,
      calculation: `Sum of the live Woolworths NZ line costs for the ${b.itemCount} items in this basket (each item's qty × unit price), totalling $${b.totalWeekly.toFixed(2)} a week.`,
      source: BASKET_SOURCE_LINE,
    },
    {
      label: `${b.title} — % of a single Jobseeker benefit`,
      calculation: `Weekly basket cost ($${b.totalWeekly.toFixed(2)}) divided by a single Jobseeker benefit ($${JOBSEEKER_SINGLE_WEEKLY.toFixed(2)}/wk) × 100 = ${b.pctOfJobseeker}%.`,
      source: BASKET_SOURCE_LINE,
    },
  ]),
  {
    label: "Weekly cost history chart",
    calculation: BASKET_HISTORY_METHOD,
    source: BASKET_SOURCE_LINE,
  },
];

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

const dollar2 = (n: number) => `$${n.toFixed(2)}`;

export default function BasketPage() {
  const [selected, setSelected] = useState<BasketKey>(DEFAULT_BASKET);
  const sel = getBasket(selected);

  // Headline CPI rebased to 100 at Jan-2022 (the basket history's start), then
  // scaled into dollars off the SELECTED basket's Jan-2022 cost so it shares the
  // $ axis: a counterfactual "what this shop would cost if it had only tracked
  // general inflation". Recomputes when the selected basket changes.
  const cpi = useMemo(() => cpiRebasedTo(BASKET_DATES), []);
  const cpiDollars = useMemo(
    () => cpi.map((v) => (v == null ? null : (v / 100) * sel.costHistory[0])),
    [cpi, sel.costHistory],
  );

  // All three basket series in every row, so the chart can show the selected
  // basket as an area and the other two as faint context lines, plus the CPI
  // counterfactual line on the same $ axis.
  const chartData = useMemo(
    () =>
      BASKET_DATES.map((date, i) => ({
        date,
        ...Object.fromEntries(BASKETS.map((b) => [b.key, b.costHistory[i]])),
        cpi: cpiDollars[i],
      })),
    [cpiDollars],
  );

  const cards = basketsByCost(); // dearest first
  const others = BASKETS.filter((b) => b.key !== selected);
  const xTicks = BASKET_DATES.filter((d) => d.endsWith("-01")); // one tick per year

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-orange/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          Live Basket Tracker · Woolworths NZ
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          What a weekly shop{" "}
          <span className="bg-gradient-to-r from-brand-orange to-brand-cyan bg-clip-text text-transparent">
            actually costs
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Live Woolworths NZ prices, retrieved today, turned into real dollars —
          a bare-staples survival shop, a nutritious family week, and a pantry
          re-stock. See what each basket costs now, how much of a single
          Jobseeker benefit it eats, and how its price has moved since 2022.
        </p>
      </div>

      {/* Selectable basket cards (sorted by cost, dearest first) */}
      <div className="relative mx-auto mb-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        {cards.map((b) => {
          const on = selected === b.key;
          return (
            // Stretched-button pattern: the selector is a real <button> overlay
            // (native a11y), and the MethodInfo triggers sit above it (z-10) so
            // neither popover button is nested inside the selector.
            <div key={b.key} className="group relative rounded-xl">
              <Card
                className={`h-full overflow-hidden pt-0 text-left transition-[border-color,box-shadow] ${
                  on
                    ? "border-brand-cyan/60 shadow-md ring-1 ring-brand-cyan/30"
                    : "border group-hover:border-brand-cyan/40"
                }`}
              >
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: b.color }}
                />
                <CardContent className="pt-5">
                  <p className="font-serif text-brand-navy">{b.title}</p>
                  <p
                    className="mt-2 flex items-center gap-1.5 font-mono font-serif text-3xl tabular-nums"
                    style={{ color: b.color }}
                  >
                    <span>
                      {dollar2(b.totalWeekly)}
                      <span className="text-base text-brand-slate-muted">
                        /wk
                      </span>
                    </span>
                    <MethodInfo
                      label={`${b.title} — weekly cost`}
                      calculation={`Sum of the live Woolworths NZ line costs for the ${b.itemCount} items in this basket (each item's qty × unit price), totalling $${b.totalWeekly.toFixed(2)} a week.`}
                      source={BASKET_SOURCE_LINE}
                      className="relative z-10"
                    />
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2 py-0.5 font-mono text-brand-slate-dark text-xs tabular-nums">
                    {b.pctOfJobseeker}% of a single Jobseeker benefit
                    <MethodInfo
                      label={`${b.title} — % of a single Jobseeker benefit`}
                      calculation={`Weekly basket cost ($${b.totalWeekly.toFixed(2)}) divided by a single Jobseeker benefit ($${JOBSEEKER_SINGLE_WEEKLY.toFixed(2)}/wk) × 100 = ${b.pctOfJobseeker}%.`}
                      source={BASKET_SOURCE_LINE}
                      className="relative z-10"
                    />
                  </span>
                  <p className="mt-3 text-brand-slate-muted text-sm">
                    {b.blurb}
                  </p>
                  <p className="mt-3 text-brand-slate-muted text-xs">
                    {b.itemCount} items
                  </p>
                </CardContent>
              </Card>
              <button
                type="button"
                onClick={() => setSelected(b.key)}
                aria-pressed={on}
                aria-label={`Show the ${b.title} basket`}
                className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50"
              />
            </div>
          );
        })}
      </div>

      {/* Hero history chart for the selected basket */}
      <Card className="relative mx-auto max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
            <span>
              Weekly cost of the {sel.title} shop{" "}
              <span className="font-normal text-brand-slate-muted text-sm">
                (re-priced through Stats NZ FPI sub-indices · live total today)
              </span>
            </span>
            <MethodInfo
              label="Weekly cost history chart"
              calculation={BASKET_HISTORY_METHOD}
              source={BASKET_SOURCE_LINE}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[340px] w-full md:h-[420px]"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`fill-${sel.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={sel.color} stopOpacity={0.35} />
                  <stop
                    offset="100%"
                    stopColor={sel.color}
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>
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
                domain={["dataMin - 6", "dataMax + 6"]}
                width={48}
                tickFormatter={(v) => `$${Math.round(v)}`}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatDate(String(label))}
                    formatter={(value, name) => {
                      // The CPI counterfactual line: a dashed benchmark, not a
                      // basket — render it with a dashed swatch + label.
                      if (name === "cpi") {
                        return (
                          <div className="flex w-full items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span
                                className="inline-block h-0 w-3 border-t-2 border-dashed"
                                style={{ borderColor: COLORS.navy }}
                              />
                              If it had only tracked CPI
                            </span>
                            <span className="font-mono text-muted-foreground tabular-nums">
                              {dollar2(Number(value))}/wk
                            </span>
                          </div>
                        );
                      }
                      const b = BASKETS.find((x) => x.key === name);
                      const isSel = name === selected;
                      return (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span
                            className={`flex items-center gap-1.5 ${
                              isSel
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: b?.color }}
                            />
                            {b?.title ?? name}
                          </span>
                          <span
                            className={`font-mono tabular-nums ${
                              isSel
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {dollar2(Number(value))}/wk
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              {/* Faint context lines for the non-selected baskets */}
              {others.map((b) => (
                <Line
                  key={b.key}
                  type="monotone"
                  dataKey={b.key}
                  stroke={b.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.25}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                />
              ))}
              {/* Selected basket as the emphasised area */}
              <Area
                type="monotone"
                dataKey={sel.key}
                stroke={sel.color}
                strokeWidth={3}
                fill={`url(#fill-${sel.key})`}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              {/* CPI counterfactual: a dashed benchmark drawn on top — what the
                  selected shop would cost if it had only tracked general
                  inflation since Jan 2022. */}
              <Line
                type="monotone"
                dataKey="cpi"
                name="cpi"
                stroke={COLORS.navy}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
              <ReferenceDot
                x={BASKET_DATES.at(-1)}
                y={sel.totalWeekly}
                r={4}
                fill={sel.color}
                stroke="#fff"
                strokeWidth={2}
              >
                <Label
                  value={`today $${sel.totalWeekly.toFixed(2)}`}
                  position="left"
                  offset={10}
                  fill={COLORS.navy}
                  fontSize={12}
                  className="font-mono"
                />
              </ReferenceDot>
            </AreaChart>
          </ChartContainer>
          {/* Legend — selected basket, faint context lines, and the dashed CPI
              benchmark. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-brand-slate-muted text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: sel.color }}
              />
              {sel.title} (selected)
            </span>
            {others.map((b) => (
              <span key={b.key} className="inline-flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full opacity-30"
                  style={{ backgroundColor: b.color }}
                />
                {b.title}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0 w-4 border-t-2 border-dashed"
                style={{ borderColor: COLORS.navy }}
              />
              If it had only tracked CPI
            </span>
          </div>
          <p className="text-brand-slate-muted text-xs">
            Today's point is the live Woolworths NZ basket total. Earlier points
            re-price the same basket through Stats NZ Food Price Index sub-group
            movements — indicative of how this shop's cost has moved, not a
            historical receipt. The dashed line is headline CPI (all groups),
            rebased to this shop's Jan-2022 cost: where the basket sits above
            it, it has grown dearer than general inflation.
          </p>
        </CardContent>
      </Card>

      {/* Lower grid: item breakdown + benefit framing */}
      <div className="relative mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Item breakdown for the selected basket */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Inside the {sel.title} shop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-stone-200 border-b text-brand-slate-muted text-xs">
                  <th className="py-1.5 text-left font-medium">Item</th>
                  <th className="py-1.5 text-right font-medium">Qty</th>
                  <th className="py-1.5 text-right font-medium">Unit</th>
                  <th className="py-1.5 text-right font-medium">Line</th>
                </tr>
              </thead>
              <tbody>
                {sel.items.map((item) => (
                  <tr
                    key={`${item.label}-${item.matched}`}
                    className="border-stone-100 border-b align-top"
                  >
                    <td className="py-2 pr-2">
                      <span className="text-brand-slate-dark">
                        {item.label}
                      </span>
                      <span className="block text-brand-slate-muted text-xs">
                        {item.matched.trim()}
                        {item.size ? ` · ${item.size}` : ""}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-brand-slate-muted tabular-nums">
                      ×{item.qty}
                    </td>
                    <td className="py-2 text-right font-mono text-brand-slate-dark tabular-nums">
                      {dollar2(item.unitPrice)}
                    </td>
                    <td className="py-2 text-right font-mono text-brand-slate-dark tabular-nums">
                      {dollar2(item.lineCost)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    className="py-2.5 font-serif font-semibold text-brand-navy"
                    colSpan={3}
                  >
                    Total weekly
                  </td>
                  <td className="py-2.5 text-right font-mono font-serif font-semibold text-brand-navy tabular-nums">
                    {dollar2(sel.totalWeekly)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Benefit-context framing + cross-links */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              What a benefit actually stretches to
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-brand-slate-muted">
              The nutritious family shop is{" "}
              <span className="font-medium text-brand-slate-dark">
                {dollar2(getBasket("nutritious-family").totalWeekly)} a week —
                about {getBasket("nutritious-family").pctOfJobseeker}% of a
                single Jobseeker benefit
              </span>{" "}
              ({dollar2(JOBSEEKER_SINGLE_WEEKLY)}/wk), before a dollar goes on
              rent or power. The bare-staples survival shop (
              {dollar2(getBasket("bare-staples").totalWeekly)},{" "}
              {getBasket("bare-staples").pctOfJobseeker}%) buys carbs, dairy and
              eggs and almost no fresh protein, fruit or veg.
            </p>
            <ul className="space-y-1.5">
              {BASKETS.map((b) => (
                <li
                  key={b.key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-brand-slate-dark">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                    {b.title}
                  </span>
                  <span className="font-mono text-brand-slate-dark tabular-nums">
                    {b.pctOfJobseeker}%
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-brand-slate-muted">
              Benefits are indexed to general CPI, which lags the steeper
              inflation of the basics — so even "maintained" support quietly
              buys less food each year.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="default">
                <Link href="/grocery">See the FPI category squeeze →</Link>
              </Button>
              {/* /budget is built separately by another agent — the link is
                  intentional even though src/app/budget/ may not exist yet. */}
              <Link
                href="/budget"
                className="font-medium text-brand-cyan-dark text-sm underline-offset-2 hover:underline"
              >
                See the full budget squeeze →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & sources */}
      <MethodologyPanel entries={METHODS} />

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{BASKET_SOURCE_LINE}</p>
        <p>{CPI_SOURCE_LINE}</p>
        <p>{BASKET_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
