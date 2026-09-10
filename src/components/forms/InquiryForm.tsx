"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { inquiryFormSchema, collectErrors, type FieldErrors } from "@/lib/validation";
import { CheckIcon, CalendarIcon } from "@/components/icons";
import { STATIC_SITE, sendViaWhatsApp } from "@/lib/submit-mode";

export type PropertyOption = { slug: string; title: string };

/**
 * One component powering both inbound funnels:
 *  – the visit request (listing page + anchored block)
 *  – the general contact message
 */
export function InquiryForm({
  locale,
  kind,
  defaultProperty,
  properties,
  lockProperty = false,
  className,
}: {
  locale: Locale;
  kind: "visit" | "contact";
  defaultProperty?: string;
  properties: PropertyOption[];
  lockProperty?: boolean;
  className?: string;
}) {
  const m = getMessages(locale);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    propertySlug: defaultProperty ?? "",
    preferredDate: "",
    message: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");

  const set = (k: keyof typeof values) => (v: (typeof values)[keyof typeof values]) =>
    setValues((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    const parsed = inquiryFormSchema.safeParse({
      kind,
      locale,
      name: values.name,
      phone: values.phone,
      whatsapp: values.whatsapp || undefined,
      email: values.email || undefined,
      propertySlug: values.propertySlug || undefined,
      preferredDate: values.preferredDate || undefined,
      message: values.message || undefined,
      company: values.company,
      ts: Date.now(),
    });
    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      return;
    }
    setErrors({});

    // Static build: no `/api` to POST to — hand the visitor to WhatsApp.
    if (STATIC_SITE) {
      const property = properties.find((p) => p.slug === values.propertySlug);
      const lines = [
        kind === "visit" ? m.form.waIntroVisit : m.form.waIntroContact,
        "",
        `${m.form.name} : ${parsed.data.name}`,
        `${m.form.phone} : ${parsed.data.phone}`,
        parsed.data.whatsapp ? `WhatsApp : ${parsed.data.whatsapp}` : "",
        parsed.data.email ? `E-mail : ${parsed.data.email}` : "",
        property ? `${m.form.property} : ${property.title}` : "",
        parsed.data.preferredDate ? `${m.form.date} : ${parsed.data.preferredDate}` : "",
        parsed.data.message ? `${m.form.message} : ${parsed.data.message}` : "",
      ].filter(Boolean);
      sendViaWhatsApp(lines.join("\n"));
      setStatus("ok");
      return;
    }

    setStatus("busy");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className={clsx("card flex flex-col items-start gap-3 p-6", className)}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <CheckIcon size={22} />
        </span>
        <p className="text-[0.98rem] font-semibold text-ink">
          {kind === "visit" ? m.form.successVisit : m.form.successContact}
        </p>
        <button type="button" className="link-arrow" onClick={() => setStatus("idle")}>
          {m.form.submit}
          <span className="arr">→</span>
        </button>
      </div>
    );
  }

  const err = (k: string) => (errors[k] ? m.form[errors[k] as keyof typeof m.form] ?? errors[k] : undefined);

  return (
    <form onSubmit={submit} noValidate className={clsx("grid grid-cols-2 gap-4", className)} aria-busy={status === "busy"}>
      {/* honeypot — visually hidden, bots fill it */}
      <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        {m.form.honeypot}
        <input tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company")(e.target.value)} />
      </label>

      <Field label={m.form.name} error={err("name")} required>
        <input className="field-input" autoComplete="name" placeholder={m.form.namePlaceholder} value={values.name} onChange={(e) => set("name")(e.target.value)} />
      </Field>
      <Field label={m.form.phone} error={err("phone")} required>
        <input className="field-input" dir="ltr" autoComplete="tel" inputMode="tel" placeholder={m.form.phonePlaceholder} value={values.phone} onChange={(e) => set("phone")(e.target.value)} />
      </Field>
      <Field label={m.form.whatsapp} error={err("whatsapp")}>
        <input className="field-input" dir="ltr" inputMode="tel" placeholder={m.form.whatsappPlaceholder} value={values.whatsapp} onChange={(e) => set("whatsapp")(e.target.value)} />
      </Field>
      <Field label={m.form.email} error={err("email")}>
        <input className="field-input" dir="ltr" autoComplete="email" inputMode="email" placeholder={m.form.emailPlaceholder} value={values.email} onChange={(e) => set("email")(e.target.value)} />
      </Field>

      <Field label={m.form.property} error={err("propertySlug")}>
        <select className="field-input" disabled={lockProperty} value={values.propertySlug} onChange={(e) => set("propertySlug")(e.target.value)}>
          <option value="">{m.form.propertyNone}</option>
          {properties.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>

      {kind === "visit" ? (
        <Field label={m.form.date} error={err("preferredDate")}>
          <div className="relative">
            <input
              type="date"
              className="field-input pe-9"
              dir="ltr"
              min={new Date().toISOString().slice(0, 10)}
              value={values.preferredDate}
              onChange={(e) => set("preferredDate")(e.target.value)}
            />
            <CalendarIcon size={16} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </Field>
      ) : null}

      <Field className="col-span-2" label={m.form.message} error={err("message")}>
        <textarea className="field-input min-h-28 resize-y" placeholder={m.form.messagePlaceholder} value={values.message} onChange={(e) => set("message")(e.target.value)} />
      </Field>

      {kind === "visit" ? (
        <label className="col-span-2 flex cursor-pointer items-start gap-2.5 text-[0.85rem] text-muted">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[var(--color-forest-800)]"
            checked={values.consent}
            onChange={(e) => set("consent")(e.target.checked)}
          />
          <span>
            {m.form.consentVisit}
            {errors.consent ? <em className="field-error block not-italic">{m.form.consentRequired}</em> : null}
          </span>
        </label>
      ) : null}

      {status === "err" ? <p className="col-span-2 field-error">{m.form.errorGeneric}</p> : null}

      {STATIC_SITE ? <p className="col-span-2 text-[0.78rem] leading-relaxed text-muted/80">{m.submit.staticNote}</p> : null}

      <div className="col-span-2 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "busy"} className="btn btn-primary">
          {status === "busy" ? m.form.sending : m.form.submit}
        </button>
        {kind === "visit" ? <p className="text-[0.78rem] text-muted">{m.detail.visitBoxLead}</p> : null}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="field-label">
        {label}
        {required ? <span className="ms-0.5 text-brass-600">*</span> : null}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
