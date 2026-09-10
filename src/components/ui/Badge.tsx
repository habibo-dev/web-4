import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Badge({
  children,
  tone = "light",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "brass" | "green" | "outline";
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold leading-none",
        tone === "light" && "bg-white/95 text-ink shadow-sm backdrop-blur",
        tone === "dark" && "bg-forest-900/90 text-bone backdrop-blur",
        tone === "brass" && "bg-brass-100 text-brass-600",
        tone === "green" && "bg-forest-800 text-bone",
        tone === "outline" && "border border-line bg-transparent text-muted",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
