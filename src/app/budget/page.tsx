"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { type MethodEntry, MethodInfo } from "@/components/method-info";
import { MethodologyPanel } from "@/components/methodology-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { BASKETS } from "@/lib/basket-data";
import type { BasketKey } from "@/lib/basket-data";
import {
  BUDGET_DISCLAIMER,
  BUDGET_SOURCE_LINE,
  DEFAULT_OTHER_WEEKLY,
  DEFAULT_POWER_WEEKLY,
  OTHER_MAX,
  OTHER_MIN,
  OTHER_STEP,
  POWER_MAX,
  POWER_MIN,
  POWER_STEP,
  buildBudget,
  defaultBasketFor,
} from "@/lib/budget-calc";
import { HOUSING_CENTRES } from "@/lib/housing-data";
import {
  ARCHETYPES,
  type BenefitArchetypeId,
  LEVERS,
  WAGE_INDEX_MAX_PCT,
} from "@/lib/indexation-data";

const COLORS = {
  navy: "#1C1917",
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = {
  income: { label: "Weekly income", color: COLORS.indigo },
  rent: { label: "Rent", color: COLORS.indigo },
  food: { label: "Food", color: COLORS.orange },
  power: { label: "Power", color: COLORS.cyan },
  other: { label: "Other", color: COLORS.muted },
} satisfies ChartConfig;

const fmt2 = (n: number) => n.toFixed(2);
const fmt0 = (n: number) => Math.round(n).toFixed(0);

const DEFAULT_ARCHETYPE: BenefitArchetypeId = "single-jobseeker";
const DEFAULT_CENTRE = "Auckland";

const METHODS: MethodEntry[] = [
  {
    label: "Residual left after rent, food and power",
    calculation:
      "residual = weekly income − total outgoings, where total outgoings = rent + food + power + other. A negative residual is shown as the amount underwater.",
    source: BUDGET_SOURCE_LINE,
  },
  {
    label: "Weekly income",
    calculation:
      "The chosen household archetype's benefit base rate. If the wage-indexation lever is above 0%, income is recomputed via the simulator's calcImpact so the uplift matches the Indexation Simulator exactly.",
    source: BUDGET_SOURCE_LINE,
  },
  {
    label: "Total outgoings (rent + food + power + other)",
    calculation:
      "rent (MBIE median market rent for the chosen centre) + food (the chosen weekly basket total) + power + other, rounded to the cent. Power and other are adjustable estimates (defaults $50/wk and $60/wk).",
    source: BUDGET_SOURCE_LINE,
  },
  {
    label: "Share of income on rent alone",
    calculation:
      "pctOfIncomeOnRent = rent ÷ weekly income × 100 (0 when income is zero). Highlighted when rent takes 50% or more of income.",
    source: BUDGET_SOURCE_LINE,
  },
  {
    label: "Income vs outgoings chart",
    calculation:
      "Two rows: weekly income, and outgoings stacked as rent + food + power + other. The dashed reference line marks weekly income; the right-hand label shows each row's total.",
    source: BUDGET_SOURCE_LINE,
  },
];

export default function BudgetPage() {
  const [archetypeId, setArchetypeId] =
    useState<BenefitArchetypeId>(DEFAULT_ARCHETYPE);
  const [centreName, setCentreName] = useState<string>(DEFAULT_CENTRE);
  const [basketKey, setBasketKey] = useState<BasketKey>(() =>
    defaultBasketFor(
      ARCHETYPES.find((a) => a.id === DEFAULT_ARCHETYPE) ?? ARCHETYPES[0],
    ),
  );
  const [powerWeekly, setPowerWeekly] = useState<number>(DEFAULT_POWER_WEEKLY);
  const [otherWeekly, setOtherWeekly] = useState<number>(DEFAULT_OTHER_WEEKLY);
  const [wageIndexPct, setWageIndexPct] = useState<number>(0);

  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0],
    [archetypeId],
  );

  const budget = useMemo(
    () =>
      buildBudget({
        archetypeId,
        centreName,
        basketKey,
        powerWeekly,
        otherWeekly,
        wageIndexPct,
      }),
    [
      archetypeId,
      centreName,
      basketKey,
      powerWeekly,
      otherWeekly,
      wageIndexPct,
    ],
  );

  const selectedBasket = useMemo(
    () => BASKETS.find((b) => b.key === basketKey) ?? BASKETS[0],
    [basketKey],
  );

  // When the household changes, reset the food line to the sensible default.
  const onArchetypeChange = (id: BenefitArchetypeId) => {
    setArchetypeId(id);
    const next = ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0];
    setBasketKey(defaultBasketFor(next));
  };

  const resetBudget = () => {
    setArchetypeId(DEFAULT_ARCHETYPE);
    setCentreName(DEFAULT_CENTRE);
    setBasketKey(
      defaultBasketFor(
        ARCHETYPES.find((a) => a.id === DEFAULT_ARCHETYPE) ?? ARCHETYPES[0],
      ),
    );
    setPowerWeekly(DEFAULT_POWER_WEEKLY);
    setOtherWeekly(DEFAULT_OTHER_WEEKLY);
    setWageIndexPct(0);
  };

  const {
    incomeWeekly,
    incomeUplift,
    totalOutgoings,
    residual,
    residualIsDeficit,
    pctOfIncomeOnRent,
    breakdown,
  } = budget;

  const chartData = [
    { name: "Income", income: incomeWeekly },
    {
      name: "Outgoings",
      rent: budget.rent,
      food: budget.food,
      power: budget.power,
      other: budget.other,
      total: totalOutgoings,
    },
  ];

  const niceMax =
    Math.ceil((Math.max(incomeWeekly, totalOutgoings) * 1.1) / 50) * 50;

  const archShort = archetype.name.split(",")[0].split(" (")[0];

  const links = [
    {
      href: "/simulator",
      label: "The income side →",
      desc: "Where the weekly income figure comes from — and the policy levers that lift it.",
    },
    {
      href: "/housing",
      label: "Rent vs the Accommodation Supplement →",
      desc: "The rent line: median market rent against the top-up that's meant to cover it.",
    },
    {
      href: "/basket",
      label: "The live food shop →",
      desc: "The food line: a live Woolworths NZ basket, priced item by item.",
    },
    {
      href: "/energy",
      label: "Power prices →",
      desc: "The power line: how electricity and gas have climbed since 2019.",
    },
  ];

  return (
    <main className="relative flex-1 overflow-hidden p-6 md:p-10">
      {/* signature gradient blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[12%] size-[400px] rounded-full bg-brand-indigo/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-[-10%] right-[12%] size-[400px] rounded-full bg-brand-cyan/[0.08] blur-3xl" />

      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-5xl">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <p className="mt-5 font-medium text-brand-cyan-dark text-xs uppercase tracking-wide">
          Household Budget Builder · the whole squeeze in one week
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          What&apos;s left after{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            rent, food and power
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          This is the connective hub: it composes one household&apos;s weekly
          income, rent, food and power into a single budget — and shows what is
          left over, or how far underwater. Every number is drawn from the
          suite&apos;s other tools.
        </p>
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-6 lg:grid-cols-[360px_1fr]">
        {/* Controls panel */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Build the week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Household */}
            <div className="space-y-2">
              <Label htmlFor="household">Household</Label>
              <Select
                value={archetypeId}
                onValueChange={(v) =>
                  onArchetypeChange(v as BenefitArchetypeId)
                }
              >
                <SelectTrigger id="household" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARCHETYPES.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-brand-slate-muted text-sm">
                {archetype.description}
              </p>
              <p className="text-brand-slate-muted text-xs">
                {archetype.benefitType} · {archetype.housing}
              </p>
            </div>

            <Separator />

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Where they rent</Label>
              <Select value={centreName} onValueChange={setCentreName}>
                <SelectTrigger id="region" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOUSING_CENTRES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name} — ${fmt0(c.rentWeekly)}/wk
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-brand-slate-muted text-xs">
                This is the MBIE median MARKET rent for a whole tenancy — larger
                than a single person&apos;s room or board.
              </p>
            </div>

            {/* Basket */}
            <div className="space-y-2">
              <Label htmlFor="basket">Weekly food shop</Label>
              <Select
                value={basketKey}
                onValueChange={(v) => setBasketKey(v as BasketKey)}
              >
                <SelectTrigger id="basket" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASKETS.map((b) => (
                    <SelectItem key={b.key} value={b.key}>
                      {b.title} — ${fmt2(b.totalWeekly)}/wk
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-brand-slate-muted text-xs">
                {selectedBasket.blurb}
              </p>
            </div>

            <Separator />

            {/* Power slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="power">Power / electricity</Label>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  ${powerWeekly}/wk
                </Badge>
              </div>
              <Slider
                id="power"
                min={POWER_MIN}
                max={POWER_MAX}
                step={POWER_STEP}
                value={[powerWeekly]}
                onValueChange={([v]) => setPowerWeekly(v)}
              />
              <p className="text-brand-slate-muted text-xs">
                MBIE average household electricity ≈ $2,400–2,600/yr ≈
                ~$48–50/wk; lower for a single. Adjust to your bill.
              </p>
            </div>

            {/* Other slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="other">Other essentials</Label>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  ${otherWeekly}/wk
                </Badge>
              </div>
              <Slider
                id="other"
                min={OTHER_MIN}
                max={OTHER_MAX}
                step={OTHER_STEP}
                value={[otherWeekly]}
                onValueChange={([v]) => setOtherWeekly(v)}
              />
              <p className="text-brand-slate-muted text-xs">
                Transport, phone, etc. — an estimate you can change.
              </p>
            </div>

            <Separator />

            {/* Wage-indexation lever */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wage-index">{LEVERS.wageIndex.label}</Label>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  +{wageIndexPct}%
                </Badge>
              </div>
              <Slider
                id="wage-index"
                min={0}
                max={WAGE_INDEX_MAX_PCT}
                step={1}
                value={[wageIndexPct]}
                onValueChange={([v]) => setWageIndexPct(v)}
              />
              <p className="text-brand-slate-muted text-xs">
                {LEVERS.wageIndex.helptext}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" onClick={resetBudget}>
              Reset budget
            </Button>
          </CardFooter>
        </Card>

        {/* Result panel */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="font-serif text-brand-navy">
                {archetype.name}
              </CardTitle>
              {residualIsDeficit ? (
                <Badge className="border-brand-orange/30 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/10">
                  Underwater
                </Badge>
              ) : (
                <Badge className="bg-brand-cyan-dark text-white hover:bg-brand-cyan-dark">
                  In surplus
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Headline residual */}
            <div>
              <p
                className={`font-serif text-4xl tabular-nums md:text-5xl ${
                  residualIsDeficit
                    ? "text-brand-orange"
                    : "text-brand-cyan-dark"
                }`}
              >
                <span className="font-mono">${fmt2(Math.abs(residual))}</span>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-brand-slate-muted text-sm">
                /wk{" "}
                {residualIsDeficit
                  ? "underwater after rent, food and power"
                  : "left after rent, food and power"}
                <MethodInfo {...METHODS[0]} />
              </p>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-serif text-2xl text-brand-indigo tabular-nums">
                  <span className="font-mono">${fmt2(incomeWeekly)}</span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-brand-slate-muted text-xs">
                  Weekly income
                  {incomeUplift > 0 && (
                    <span className="font-mono text-brand-cyan-dark">
                      +${fmt2(incomeUplift)}/wk
                    </span>
                  )}
                  <MethodInfo {...METHODS[1]} />
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brand-navy tabular-nums">
                  <span className="font-mono">${fmt2(totalOutgoings)}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-brand-slate-muted text-xs">
                  Rent + food + power + other
                  <MethodInfo {...METHODS[2]} />
                </p>
              </div>
              <div>
                <p
                  className={`font-serif text-2xl tabular-nums ${
                    pctOfIncomeOnRent >= 50
                      ? "text-brand-orange"
                      : "text-brand-slate-dark"
                  }`}
                >
                  <span className="font-mono">{fmt0(pctOfIncomeOnRent)}%</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-brand-slate-muted text-xs">
                  of income on rent alone
                  <MethodInfo {...METHODS[3]} />
                </p>
              </div>
            </div>

            {/* Legend chips */}
            <div className="flex flex-wrap gap-2">
              {breakdown.map((line) => (
                <span
                  key={line.key}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1 text-brand-slate-dark text-xs"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: line.color }}
                  />
                  {line.label}{" "}
                  <span className="font-mono tabular-nums">
                    ${fmt2(line.value)}
                  </span>
                </span>
              ))}
            </div>

            {/* Chart — income vs stacked outgoings */}
            <div className="flex items-center gap-1.5">
              <CardTitle className="font-serif text-brand-navy text-base">
                Income vs outgoings
              </CardTitle>
              <MethodInfo {...METHODS[4]} />
            </div>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[320px] w-full md:h-[380px]"
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 64, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  domain={[0, niceMax]}
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
                  width={84}
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
                      formatter={(value, name) => {
                        const cfg =
                          chartConfig[name as keyof typeof chartConfig];
                        return (
                          <div className="flex w-full items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span
                                className="size-2 rounded-[2px]"
                                style={{ backgroundColor: cfg?.color }}
                              />
                              {cfg?.label ?? name}
                            </span>
                            <span className="font-mono text-foreground tabular-nums">
                              ${Number(value).toFixed(2)}/wk
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <ReferenceLine
                  x={incomeWeekly}
                  stroke={COLORS.indigo}
                  strokeDasharray="6 4"
                  label={{
                    value: `income $${fmt0(incomeWeekly)}`,
                    position: "top",
                    fill: COLORS.indigo,
                    fontSize: 12,
                    fontFamily: "var(--font-sans)",
                  }}
                />
                {/* Income bar (its own row) */}
                <Bar
                  dataKey="income"
                  stackId="a"
                  fill={COLORS.indigo}
                  radius={[6, 6, 6, 6]}
                  maxBarSize={48}
                >
                  <LabelList
                    dataKey="income"
                    position="right"
                    formatter={(v: number) => (v ? `$${fmt0(v)}` : "")}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={13}
                  />
                </Bar>
                {/* Stacked outgoings (separate row) */}
                <Bar
                  dataKey="rent"
                  stackId="b"
                  fill={COLORS.indigo}
                  radius={[6, 0, 0, 6]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="food"
                  stackId="b"
                  fill={COLORS.orange}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="power"
                  stackId="b"
                  fill={COLORS.cyan}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="other"
                  stackId="b"
                  fill={COLORS.muted}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={48}
                >
                  <LabelList
                    dataKey="total"
                    position="right"
                    formatter={(v: number) => (v ? `$${fmt0(v)}` : "")}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={13}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>

            {/* Dynamic takeaway */}
            <p className="text-brand-slate-muted text-sm">
              <span className="font-medium text-brand-slate-dark">
                What this means:
              </span>{" "}
              {residualIsDeficit ? (
                <>
                  {archShort} in {centreName} is ${fmt2(Math.abs(residual))}/wk
                  underwater — income of ${fmt2(incomeWeekly)} can&apos;t cover
                  ${fmt2(totalOutgoings)} of rent, food and power. Rent alone
                  takes {fmt0(pctOfIncomeOnRent)}% of income.
                </>
              ) : (
                <>
                  {archShort} in {centreName} has ${fmt2(residual)}/wk left
                  after the essentials — but that must also stretch to clothing,
                  health, debt and the unexpected.
                </>
              )}{" "}
              Income here is the benefit base rate only — it excludes Working
              for Families and the Accommodation Supplement, so the real picture
              is usually less tight than the headline figure shows.
            </p>

            <p className="text-brand-slate-muted text-xs">
              {BUDGET_SOURCE_LINE}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cross-links */}
      <Card className="relative mx-auto mt-6 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="font-serif text-brand-navy">
            Where each number comes from
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group block rounded-lg border border-stone-200 p-4 transition-[border-color,box-shadow] hover:border-brand-cyan/40 hover:shadow-sm"
            >
              <p className="font-medium text-brand-slate-dark text-sm group-hover:text-brand-cyan-dark">
                {l.label}
              </p>
              <p className="mt-1 text-brand-slate-muted text-xs">{l.desc}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Methodology & sources */}
      <MethodologyPanel entries={METHODS} />

      {/* Source + disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl space-y-2 border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        <p>{BUDGET_SOURCE_LINE}</p>
        <p>{BUDGET_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
