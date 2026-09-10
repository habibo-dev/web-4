import type { Metadata } from "next";
import { clsx } from "clsx";
import { fontInter, fontPlexArabic } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Espace agence — ISLEM Immobilier",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={clsx(fontInter.variable, fontPlexArabic.variable)}>
      <body className="min-h-screen bg-[#f1efe7] font-sans text-[#0b1f17] antialiased">{children}</body>
    </html>
  );
}
