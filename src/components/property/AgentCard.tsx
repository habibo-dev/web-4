import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Agent } from "@/lib/data/types";
import { settings, telLink, waLink } from "@/lib/data/settings";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export function AgentCard({ agent, locale, title, whatsappText }: { agent: Agent; locale: Locale; title: string; whatsappText: string }) {
  const m = getMessages(locale);
  return (
    <div className="card p-6">
      <p className="eyebrow tracking-eyebrow mb-4 text-muted">{m.detail.agentTitle}</p>
      <div className="flex items-start gap-4">
        <span className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 text-xl font-semibold text-brass-300 ring-1 ring-brass-400/30">
          {agent.initials}
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-tight text-ink">{agent.name[locale]}</p>
          <p className="mt-1 text-[0.8rem] font-semibold uppercase tracking-wide text-brass-600">{agent.role[locale]}</p>
          <p className="mt-1 text-[0.78rem] text-muted">{agent.languages.join(" · ")}</p>
        </div>
      </div>
      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">{agent.bio[locale]}</p>

      <div className="mt-5 grid gap-2">
        <a href={waLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-3 w-full">
          <WhatsAppIcon size={17} /> {m.detail.agentWhatsapp}
        </a>
        <div className="grid grid-cols-2 gap-2">
          <a href={telLink()} className="btn btn-outline !py-2.5 w-full">
            <PhoneIcon size={16} /> <span dir="ltr">{m.detail.agentCall}</span>
          </a>
          <a href={`mailto:${agent.email}?subject=${encodeURIComponent(title)}`} className="btn btn-outline !py-2.5 w-full">
            <MailIcon size={16} /> {m.detail.agentEmail}
          </a>
        </div>
        <p className="mt-1 text-center text-[0.72rem] text-muted/80">{settings.contact.address[locale]}</p>
      </div>
    </div>
  );
}
