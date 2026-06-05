import type { MethodEntry } from "@/components/method-info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * A per-page "Methodology & sources" panel listing every figure on the page
 * with its calculation and data source. Server-safe (no client hooks). Mirrors
 * the sibling card shell. Stays visible in print so a saved page is auditable.
 */
export function MethodologyPanel({
  entries,
  note,
}: {
  entries: MethodEntry[];
  note?: string;
}) {
  return (
    <section className="relative mx-auto mt-6 max-w-5xl">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-brand-indigo to-brand-cyan" />
        <div className="p-5">
          <h2 className="font-serif font-bold text-brand-navy text-lg">
            Methodology &amp; sources
          </h2>
          <p className="mt-1 text-brand-slate-muted text-sm">
            {note ??
              "How every figure on this page is calculated, and where the data comes from."}
          </p>
          <Accordion type="single" collapsible className="mt-3">
            {entries.map((e) => (
              <AccordionItem key={e.label} value={e.label}>
                <AccordionTrigger className="text-left font-serif text-brand-navy">
                  {e.label}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-brand-slate-dark text-sm">
                    <span className="font-medium">Calculation: </span>
                    <span className="text-brand-slate-muted">
                      {e.calculation}
                    </span>
                  </p>
                  <p className="mt-1.5 text-brand-slate-dark text-sm">
                    <span className="font-medium">Source: </span>
                    <span className="text-brand-slate-muted">{e.source}</span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
