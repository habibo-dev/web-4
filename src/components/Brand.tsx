import { clsx } from "clsx";

/**
 * ISLEM Immobilier — brand mark: a horseshoe arch (Alger's architectural
 * signature) framing the door of a house, struck in forest & brass.
 */
export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="ISLEM Immobilier"
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="var(--color-forest-800)" />
      <path
        d="M24 11c-6.4 0-10.6 4.1-10.6 9.6V37h21.2V20.6C34.6 15.1 30.4 11 24 11Z"
        fill="none"
        stroke="var(--color-brass-400)"
        strokeWidth="2.4"
      />
      <path d="M24 19.5c-3 0-5 1.9-5 4.6V37h10V24.1c0-2.7-2-4.6-5-4.6Z" fill="var(--color-brass-400)" opacity="0.9" />
      <path d="M24 26v11" stroke="var(--color-forest-900)" strokeWidth="1.6" />
      <path d="M15.5 37h17" stroke="var(--color-brass-300)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={clsx("flex flex-col leading-none", className)}>
      <span
        className={clsx(
          "font-display text-[1.28rem] font-semibold tracking-[0.14em] uppercase",
          tone === "dark" ? "text-ink" : "text-bone",
        )}
      >
        Islem
      </span>
      <span
        className={clsx(
          "mt-0.5 text-[0.62rem] font-semibold tracking-[0.42em] uppercase",
          tone === "dark" ? "text-brass-600" : "text-brass-300",
        )}
      >
        Immobilier
      </span>
    </span>
  );
}
