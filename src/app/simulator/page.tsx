"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
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
import { Switch } from "@/components/ui/switch";
import {
  COST_GROWTH,
  incomeGrowthRate,
  projectGap,
} from "@/lib/floor-projection";
import { DEFAULT_SETTINGS, calcImpact } from "@/lib/indexation-calc";
import {
  ARCHETYPES,
  type BenefitArchetypeId,
  DISCLAIMER,
  LEVERS,
  type LeverSettings,
  SOURCE_LINE,
  WAGE_INDEX_MAX_PCT,
} from "@/lib/indexation-data";

const COLORS = {
  indigo: "#2E4057",
  cyan: "#0EA5E9",
  orange: "#C2410C",
  navy: "#1C1917",
  muted: "#78716C",
  grid: "#E7E5E4",
} as const;

const chartConfig = {
  current: { label: "Current weekly income", color: COLORS.indigo },
  after: { label: "After your settings", color: COLORS.cyan },
} satisfies ChartConfig;

const driftConfig = {
  income: { label: "Projected weekly income", color: COLORS.cyan },
  floor: { label: "Basic-needs floor", color: COLORS.orange },
  gap: { label: "Weekly shortfall", color: COLORS.orange },
} satisfies ChartConfig;

const fmt2 = (n: number) => n.toFixed(2);
const fmt0 = (n: number) => Math.round(n).toFixed(0);
const round2Local = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const WEAG_OPTIONS = [
  { value: 0, label: "No change" },
  { value: 12, label: "+12% (WEAG low)" },
  { value: 25, label: "+25%" },
  { value: 47, label: "+47% (WEAG high)" },
];

export default function SimulatorPage() {
  const [archetypeId, setArchetypeId] =
    useState<BenefitArchetypeId>("single-jobseeker");
  const [settings, setSettings] = useState<LeverSettings>(DEFAULT_SETTINGS);

  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0],
    [archetypeId],
  );

  const impact = useMemo(
    () => calcImpact(archetype, settings),
    [archetype, settings],
  );

  const projection = useMemo(
    () => projectGap(archetype, settings),
    [archetype, settings],
  );

  const chartData = [
    { name: "Current", value: impact.baseWeekly, key: "current" },
    { name: "After your settings", value: impact.newWeekly, key: "after" },
  ];

  const floor = archetype.incomeFloorWeekly;
  const niceMax =
    Math.ceil((Math.max(floor, impact.newWeekly) * 1.1) / 50) * 50;

  const archetypeShort = archetype.name.split(",")[0].split(" (")[0];
  const gapCleared = impact.newGap < 0 ? Math.abs(impact.newGap) : 0;
  const gapClause = impact.crossedFloor
    ? `clearing the $${fmt0(floor)} floor by $${fmt2(gapCleared)}/wk`
    : `still $${fmt2(impact.newGap)}/wk short of the $${fmt0(floor)} basic-needs floor`;
  const movedALever = impact.delta !== 0;

  // Drift-over-time derivations (from the projection array, not the module).
  const firstYear = projection[0].year;
  const lastYear = projection[projection.length - 1].year;
  const firstPoint = projection[0];
  const lastPoint = projection[projection.length - 1];
  const gapGrew = round2Local(lastPoint.gap - firstPoint.gap);
  const startsAboveFloor = firstPoint.crossed;
  const wageRestored = settings.wageIndexPct > 0;
  const incomeRatePct = (incomeGrowthRate(settings) * 100).toFixed(1);
  const costGrowthPct = (COST_GROWTH * 100).toFixed(1);
  const niceDriftMax =
    Math.ceil(
      (Math.max(...projection.map((p) => Math.max(p.floor, p.income))) * 1.08) /
        50,
    ) * 50;

  const METHODS: MethodEntry[] = [
    {
      label: "Current weekly income",
      calculation:
        "The household's data-grounded net/base weekly figure (archetype.currentNetWeekly) that the levers act on — e.g. $372.55/wk for the single Jobseeker. Base benefit only; excludes Working for Families and the Accommodation Supplement, so it understates true disposable income.",
      source: SOURCE_LINE,
    },
    {
      label: "After your settings",
      calculation:
        "base + additive lever effects: wage-index uplift (base × wageIndexPct%) + WEAG uplift (base × weagLiftPct%, stepped 0/12/25/47%) + IWTC ($50/wk × children, beneficiary households only). Levers are applied additively on the same base, not compounded.",
      source: SOURCE_LINE,
    },
    {
      label: "Gap to the floor",
      calculation:
        "incomeFloorWeekly − after-settings income. Positive = short of the CPAG basic-needs floor; negative means the floor is cleared by that amount. The floor is the current rate plus CPAG's estimated weekly shortfall.",
      source: SOURCE_LINE,
    },
    {
      label: "Current vs after-settings snapshot (bar chart)",
      calculation:
        "Two bars — current weekly income and after-settings income — against the dashed CPAG basic-needs floor reference line for the selected household. After-settings = base + wage-index + WEAG + IWTC additive lever effects.",
      source: SOURCE_LINE,
    },
    {
      label: "The drift over time (income vs floor projection)",
      calculation:
        "From Year 0 (your current settings), income compounds at the chosen indexation rate (CPI 3.1%/yr at +0%, rising linearly toward wage growth 4.8%/yr at the +15% max) while the basic-needs floor compounds at ~6.2%/yr cost growth. Each series grows independently from its own Year-0 anchor; the orange band is the widening weekly shortfall. Illustrative, not a compounding microsimulation.",
      source: SOURCE_LINE,
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
          Indexation Impact Simulator
        </p>
        <h1 className="mt-2 font-serif font-bold text-4xl text-brand-navy tracking-tight md:text-5xl">
          Move each household toward{" "}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
            the income floor
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-brand-slate-muted">
          Pick a household, drag the policy levers, and watch its weekly income
          shift against the CPAG basic-needs floor — the line below which a
          household cannot meet basic and participation costs. Before and after,
          in real dollars.
        </p>
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-6 lg:grid-cols-[360px_1fr]">
        {/* Controls panel */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <CardTitle className="font-serif text-brand-navy">
              Pick a household
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="archetype">Household</Label>
              <Select
                value={archetypeId}
                onValueChange={(v) => setArchetypeId(v as BenefitArchetypeId)}
              >
                <SelectTrigger id="archetype" className="w-full">
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

            {/* Lever 1 — wage indexation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="wage-index">{LEVERS.wageIndex.label}</Label>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  +{settings.wageIndexPct}%
                </Badge>
              </div>
              <Slider
                id="wage-index"
                min={0}
                max={WAGE_INDEX_MAX_PCT}
                step={1}
                value={[settings.wageIndexPct]}
                onValueChange={([v]) =>
                  setSettings((s) => ({ ...s, wageIndexPct: v }))
                }
              />
              <p className="text-brand-slate-muted text-xs">
                {LEVERS.wageIndex.helptext}
              </p>
            </div>

            {/* Lever 2 — IWTC toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="iwtc" className="leading-snug">
                  {LEVERS.iwtc.label}
                </Label>
                <Switch
                  id="iwtc"
                  checked={settings.iwtcExtended}
                  onCheckedChange={(checked) =>
                    setSettings((s) => ({ ...s, iwtcExtended: checked }))
                  }
                />
              </div>
              <p className="text-brand-slate-muted text-xs">
                {LEVERS.iwtc.helptext}
              </p>
            </div>

            {/* Lever 3 — WEAG lift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="weag">{LEVERS.weag.label}</Label>
                <Badge variant="secondary" className="font-mono tabular-nums">
                  +{settings.weagLiftPct}%
                </Badge>
              </div>
              <Select
                value={String(settings.weagLiftPct)}
                onValueChange={(v) =>
                  setSettings((s) => ({ ...s, weagLiftPct: Number(v) }))
                }
              >
                <SelectTrigger id="weag" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEAG_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-brand-slate-muted text-xs">
                {LEVERS.weag.helptext}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              onClick={() => setSettings(DEFAULT_SETTINGS)}
            >
              Reset levers
            </Button>
          </CardFooter>
        </Card>

        {/* Result panel */}
        <Card className="overflow-hidden pt-0">
          <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
          <CardHeader className="pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
                {archetype.name}
                <MethodInfo {...METHODS[3]} />
              </CardTitle>
              {impact.crossedFloor ? (
                <Badge className="bg-brand-cyan-dark text-white hover:bg-brand-cyan-dark">
                  Above the floor
                </Badge>
              ) : (
                <Badge className="border-brand-orange/30 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/10">
                  Still short
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stat blocks */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-serif text-2xl text-brand-indigo tabular-nums">
                  <span className="font-mono">${fmt2(impact.baseWeekly)}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-brand-slate-muted text-xs">
                  Current weekly income
                  <MethodInfo {...METHODS[0]} />
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brand-cyan-dark tabular-nums">
                  <span className="font-mono">${fmt2(impact.newWeekly)}</span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-brand-slate-muted text-xs">
                  After your settings
                  <MethodInfo {...METHODS[1]} />
                  {impact.delta > 0 && (
                    <span className="font-mono text-brand-cyan-dark">
                      +${fmt2(impact.delta)}/wk
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p
                  className={`font-serif text-2xl tabular-nums ${
                    impact.newGap > 0
                      ? "text-brand-orange"
                      : "text-brand-cyan-dark"
                  }`}
                >
                  <span className="font-mono">
                    {impact.newGap > 0
                      ? `$${fmt2(impact.newGap)}`
                      : `cleared by $${fmt2(gapCleared)}`}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-brand-slate-muted text-xs">
                  Gap to the floor
                  <MethodInfo {...METHODS[2]} />
                </p>
              </div>
            </div>

            {/* Chart */}
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[320px] w-full md:h-[380px]"
            >
              <BarChart
                data={chartData}
                margin={{ top: 28, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke={COLORS.grid} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: COLORS.muted,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  domain={[0, niceMax]}
                  width={56}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
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
                      formatter={(value, _name, item) => {
                        const isAfter = item?.payload?.key === "after";
                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">
                              {item?.payload?.name}
                            </span>
                            <span className="font-mono text-foreground tabular-nums">
                              ${Number(value).toFixed(2)}/wk
                            </span>
                            {isAfter && impact.delta > 0 && (
                              <span className="mt-1 text-muted-foreground text-xs">
                                <span className="font-mono">
                                  ${fmt2(impact.components.base)}
                                </span>{" "}
                                base
                                {impact.components.wageIndexAdd > 0 && (
                                  <>
                                    {" "}
                                    + ${fmt2(impact.components.wageIndexAdd)}{" "}
                                    wage index
                                  </>
                                )}
                                {impact.components.weagAdd > 0 && (
                                  <>
                                    {" "}
                                    + ${fmt2(impact.components.weagAdd)} WEAG
                                  </>
                                )}
                                {impact.components.iwtcAdd > 0 && (
                                  <>
                                    {" "}
                                    + ${fmt2(impact.components.iwtcAdd)} IWTC
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  }
                />
                <ReferenceLine
                  y={floor}
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  label={{
                    value: `CPAG basic-needs floor $${fmt0(floor)}/wk`,
                    position: "insideTopRight",
                    fill: COLORS.orange,
                    fontSize: 12,
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={120}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        entry.key === "current" ? COLORS.indigo : COLORS.cyan
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: number) => `$${fmt0(v)}`}
                    className="font-mono"
                    fill={COLORS.navy}
                    fontSize={13}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>

            {/* What this means */}
            <p className="text-brand-slate-muted text-sm">
              {movedALever ? (
                <>
                  <span className="font-medium text-brand-slate-dark">
                    What this means:
                  </span>{" "}
                  with these settings, {archetypeShort.toLowerCase()} moves from
                  ${fmt2(impact.baseWeekly)}/wk to ${fmt2(impact.newWeekly)}/wk
                  — {gapClause}. Based on MSD benefit rates (April 2026), WEAG
                  (2019) and CPAG's 'Below the Income Floor' (2025).
                </>
              ) : (
                <>
                  <span className="font-medium text-brand-slate-dark">
                    Move a lever to see the change.
                  </span>{" "}
                  This household is currently ${fmt2(impact.baseGap)}/wk short
                  of the ${fmt0(floor)} basic-needs floor.
                </>
              )}
            </p>
            <p className="text-brand-slate-muted text-xs">{SOURCE_LINE}</p>
          </CardContent>
        </Card>
      </div>

      {/* The drift over time — multi-year income vs floor projection */}
      <Card className="relative mx-auto mt-6 max-w-5xl overflow-hidden pt-0">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <CardHeader className="pt-5">
          <CardTitle className="flex items-center gap-1.5 font-serif text-brand-navy">
            The drift over time
            <span className="font-normal text-brand-slate-muted text-sm">
              ({firstYear}–{lastYear})
            </span>
            <MethodInfo {...METHODS[4]} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={driftConfig}
            className="aspect-auto h-[340px] w-full md:h-[420px]"
          >
            <ComposedChart
              data={projection}
              margin={{ top: 28, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke={COLORS.grid} />
              <defs>
                <linearGradient id="driftGap" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={COLORS.orange}
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor={COLORS.orange}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: COLORS.muted,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
              <YAxis
                width={56}
                domain={[0, niceDriftMax]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
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
                    labelFormatter={(l) => `Year ${l}`}
                    formatter={(value, name, item) => {
                      if (name === "gap") return null;
                      const isIncome = name === "income";
                      const colour = isIncome ? COLORS.cyan : COLORS.orange;
                      const gap = item?.payload?.gap ?? 0;
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-foreground">
                            <span
                              className="inline-block size-2 rounded-[2px]"
                              style={{ backgroundColor: colour }}
                            />
                            {isIncome
                              ? "Projected weekly income"
                              : "Basic-needs floor"}
                          </span>
                          <span className="font-mono text-foreground tabular-nums">
                            ${Number(value).toFixed(2)}/wk
                          </span>
                          {isIncome && gap > 0 && (
                            <span className="mt-0.5 text-muted-foreground text-xs">
                              <span className="font-mono tabular-nums">
                                ${fmt2(gap)}
                              </span>
                              /wk short
                            </span>
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="gap"
                stroke="none"
                fill="url(#driftGap)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="floor"
                stroke={COLORS.orange}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke={COLORS.cyan}
                strokeWidth={3}
                dot={{ r: 3, fill: COLORS.cyan }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ChartContainer>

          <p className="text-brand-slate-muted text-sm">
            <span className="font-medium text-brand-slate-dark">
              What this means:
            </span>{" "}
            {startsAboveFloor && !lastPoint.crossed ? (
              <>
                with these settings the household starts above the floor, but
                cost growth (~{costGrowthPct}%/yr) outpaces income growth — so
                by {lastYear} the line dips back to{" "}
                <span className="font-mono tabular-nums">
                  ${fmt2(lastPoint.gap)}
                </span>
                /wk short. Without ongoing intervention, even a household above
                the floor today drifts below it.
              </>
            ) : wageRestored ? (
              <>
                restoring wage-indexation lifts income growth toward ~
                <span className="font-mono tabular-nums">{incomeRatePct}</span>
                %/yr, but the floor still rises ~{costGrowthPct}%/yr — so the
                shortfall narrows its growth yet keeps widening, reaching{" "}
                <span className="font-mono tabular-nums">
                  ${fmt2(lastPoint.gap)}
                </span>
                /wk short by {lastYear}. The lever slows the drift; it doesn't
                reverse it.
              </>
            ) : (
              <>
                even held at CPI indexation, this household's income rises ~
                <span className="font-mono tabular-nums">{incomeRatePct}</span>
                %/yr while its basic-needs floor climbs ~{costGrowthPct}%/yr —
                so by {lastYear} the weekly shortfall widens from{" "}
                <span className="font-mono tabular-nums">
                  ${fmt2(firstPoint.gap)}
                </span>{" "}
                to{" "}
                <span className="font-mono tabular-nums">
                  ${fmt2(lastPoint.gap)}
                </span>
                , a further{" "}
                <span className="font-mono tabular-nums">${fmt2(gapGrew)}</span>
                /wk underwater. Indexation choice changes the slope, not the
                direction.
              </>
            )}
          </p>

          <p className="text-brand-slate-muted text-xs">
            Year 0 is your current settings. Income grows at the indexation rate
            you've chosen (CPI 3.1%/yr at +0%, rising toward wage growth 4.8%/yr
            at the +15% max); the basic-needs floor grows at ~6.2%/yr, the
            faster basket of costs beneficiary households actually face. The
            orange band is the widening weekly shortfall. Projection is
            illustrative — simple year-on-year growth from your current-year
            anchors, not a compounding microsimulation.
          </p>
        </CardContent>
      </Card>

      {/* Methodology & sources */}
      <MethodologyPanel entries={METHODS} />

      {/* Disclaimer */}
      <footer className="relative mx-auto mt-10 max-w-5xl border-stone-200 border-t pt-4 text-brand-slate-muted text-xs">
        {DISCLAIMER}
      </footer>
    </main>
  );
}
