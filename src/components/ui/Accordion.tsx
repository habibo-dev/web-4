"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDownIcon } from "@/components/icons";

export interface AccordionItem {
  q: string;
  a: string;
}

/** FAQ accordion — accessible, zero-dependency, RTL friendly. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 px-5 py-4.5 text-start transition hover:bg-sand/40 sm:px-7 sm:py-5"
            >
              <span className="font-display text-[1.05rem] font-semibold leading-snug text-ink sm:text-lg">{item.q}</span>
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  isOpen ? "rotate-180 border-forest-800 bg-forest-800 text-bone" : "border-line text-muted",
                )}
              >
                <ChevronDownIcon size={15} />
              </span>
            </button>
            <div
              className={clsx(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-muted sm:px-7 sm:pb-6">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
