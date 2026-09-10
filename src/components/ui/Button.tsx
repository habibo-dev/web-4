import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "brass" | "outline" | "light";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Common & { href: string } & Partial<Pick<ComponentProps<typeof Link>, "prefetch" | "target" | "rel">>) {
  const cls = clsx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
  if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={cls} target={rest.target} rel={rest.rel ?? (rest.target === "_blank" ? "noopener noreferrer" : undefined)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} prefetch={rest.prefetch}>
      {children}
    </Link>
  );
}

export function ButtonEl({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={clsx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className)} {...rest}>
      {children}
    </button>
  );
}
