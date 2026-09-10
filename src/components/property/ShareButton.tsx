"use client";

import { useState } from "react";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { LinkIcon, CheckIcon } from "@/components/icons";

export function ShareButton({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ url, title: document.title });
        return;
      } catch {
        /* user dismissed → fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(m.common.copy, url);
    }
  }

  return (
    <button type="button" onClick={share} className="btn btn-outline btn-sm">
      {copied ? <CheckIcon size={15} className="text-forest-700" /> : <LinkIcon size={15} />}
      {copied ? m.common.copied : m.common.share}
    </button>
  );
}
