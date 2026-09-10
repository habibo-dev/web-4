"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ChevronLeftIcon, ChevronDownIcon, CloseIcon, ExpandIcon } from "@/components/icons";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";

/**
 * Editorial gallery: one wide lead image + mosaic, full-screen lightbox with
 * keyboard navigation (←/→/Esc) and swipe support.
 */
export function Gallery({ images, locale }: { images: { src: string; alt: { fr: string; ar: string } }[]; locale: Locale }) {
  const m = getMessages(locale);
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
  );

  /** Keep Tab inside the lightbox while it is open. */
  const trapTab = useCallback((e: KeyboardEvent) => {
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !root.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !root.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (open === null) return;
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // In RTL the reading direction — and the on-screen arrows — are
      // mirrored, so the arrow keys must be mirrored too.
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
      if (e.key === "Tab") trapTab(e);
    };
    const previousFocus = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previousFocus?.focus?.();
    };
  }, [open, close, step, trapTab]);

  const [touchX, setTouchX] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-[1.9fr_1fr]">
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand"
          aria-label={m.a11y.openImage}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt[locale]}
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
          <span className="absolute bottom-3 end-3 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-[0.75rem] font-semibold text-bone opacity-0 backdrop-blur transition group-hover:opacity-100">
            <ExpandIcon size={14} />
            {m.detail.gallery} ({images.length})
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {images.slice(1, 3).map((img, i) => (
            <button key={i} type="button" onClick={() => setOpen(i + 1)} className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand sm:aspect-auto">
              <Image src={img.src} alt={img.alt[locale]} fill sizes="(min-width: 1024px) 31vw, 48vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/15" />
              {i === 1 && images.length > 3 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/45 text-[0.85rem] font-bold text-bone backdrop-blur-[2px]">
                  +{images.length - 3}
                  <ChevronDownIcon size={14} className="ms-1 inline" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {open !== null ? (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-forest-950/97 backdrop-blur-sm animate-fade-in"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={m.detail.gallery}
          tabIndex={-1}
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const dx = (e.changedTouches[0]?.clientX ?? 0) - (touchX ?? 0);
            if (Math.abs(dx) > 44) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-bone/80">
            <span className="text-sm tabular-nums">
              {open + 1} / {images.length}
            </span>
            <button type="button" onClick={close} className="btn btn-light !px-3" aria-label={m.a11y.closeLightbox}>
              <CloseIcon size={18} />
            </button>
          </div>
          <figure className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-6" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open].src}
              alt={images[open].alt[locale]}
              fill
              sizes="100vw"
              className="object-contain !p-2"
              priority
            />
            <figcaption className="absolute bottom-1 inset-x-0 text-center text-[0.8rem] text-bone/70">{images[open].alt[locale]}</figcaption>
          </figure>
          <button
            type="button"
            className="btn btn-light absolute start-3 top-1/2 !px-3.5"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={m.a11y.prevImage}
          >
            <ChevronLeftIcon size={18} className="rtl:rotate-180" />
          </button>
          <button
            type="button"
            className="btn btn-light absolute end-3 top-1/2 !px-3.5"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={m.a11y.nextImage}
          >
            <ChevronLeftIcon size={18} className="rotate-180 rtl:rotate-0" />
          </button>
          {/* thumbnails */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(i)}
                className={clsx("relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition", i === open ? "border-brass-400" : "border-transparent opacity-60 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
