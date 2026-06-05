"use client";

import { Info } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** A single figure's method + source — shared shape used by both the per-stat
 *  popover and the per-page methodology panel. */
export interface MethodEntry {
  /** Short name of the statistic, e.g. "Meat & fish, annual change". */
  label: string;
  /** Plain-English calculation / how the number is derived. */
  calculation: string;
  /** The data source (and date), ideally the lib's exported SOURCE_LINE. */
  source: string;
}

/**
 * An inline ⓘ affordance placed next to a statistic or chart title. Click/hover
 * reveals how the figure is calculated and where the data comes from. Hidden in
 * print (the printable brief shows methodology inline / on /about instead).
 */
export function MethodInfo({
  label,
  calculation,
  source,
  className,
}: MethodEntry & { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`How "${label}" is calculated, and its source`}
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-brand-slate-muted transition-colors hover:text-brand-cyan-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 print:hidden",
            className,
          )}
        >
          <Info className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 text-sm">
        <p className="font-serif font-medium text-brand-navy">{label}</p>
        <p className="mt-2 text-brand-slate-dark">
          <span className="font-medium">Calculation: </span>
          <span className="text-brand-slate-muted">{calculation}</span>
        </p>
        <p className="mt-1.5 text-brand-slate-dark">
          <span className="font-medium">Source: </span>
          <span className="text-brand-slate-muted">{source}</span>
        </p>
      </PopoverContent>
    </Popover>
  );
}
