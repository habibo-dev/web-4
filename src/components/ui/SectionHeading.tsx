import { clsx } from "clsx";
import { SparkIcon } from "@/components/icons";

export function SectionHeading({
  kicker,
  title,
  lead,
  align = "center",
  tone = "dark",
  className,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" ? "mx-auto text-center" : "", className)}>
      {kicker ? (
        <p
          className={clsx(
            "eyebrow tracking-eyebrow mb-3 inline-flex items-center gap-2",
            tone === "dark" ? "text-brass-600" : "text-brass-300",
          )}
        >
          <SparkIcon size={14} />
          {kicker}
        </p>
      ) : null}
      <h2
        className={clsx(
          "font-display text-3xl leading-[1.12] sm:text-4xl lg:text-[2.65rem]",
          tone === "dark" ? "text-ink" : "text-bone",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={clsx("mt-4 text-[1.02rem] leading-relaxed", tone === "dark" ? "text-muted" : "text-bone/70")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
