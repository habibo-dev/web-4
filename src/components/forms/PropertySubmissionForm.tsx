"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { submissionFormSchema, collectErrors, type FieldErrors } from "@/lib/validation";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { CloseIcon, LinkIcon, UploadIcon, CheckIcon } from "@/components/icons";
import { settings } from "@/lib/data/settings";
import { STATIC_SITE, sendViaWhatsApp } from "@/lib/submit-mode";

type TypeKey = "apartment" | "villa" | "land" | "commercial" | "office";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function PropertySubmissionForm({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const [values, setValues] = useState({
    ownerName: "",
    phone: "",
    whatsapp: "",
    email: "",
    propertyType: "apartment" as TypeKey,
    transaction: "sale" as "sale" | "rent",
    neighborhood: NEIGHBORHOODS[0].id,
    price: "",
    surface: "",
    bedrooms: "",
    description: "",
    consent: false,
    company: "",
  });
  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [recordId, setRecordId] = useState<string>("");

  const set = (patch: Partial<typeof values>) => setValues((v) => ({ ...v, ...patch }));
  const err = (k: string) => (errors[k] ? m.form[k as keyof typeof m.form] ?? errors[k] : undefined);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: File[] = [];
    for (const f of Array.from(list)) {
      if (files.length + accepted.length >= MAX_FILES) break;
      if (f.size > MAX_FILE_BYTES) continue;
      if (!/^image\/(jpeg|png|webp|avif|gif)$/.test(f.type)) continue;
      accepted.push(f);
    }
    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
      setPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
    }
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, j) => j !== i));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, j) => j !== i);
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    const cleanLinks = links.map((l) => l.trim()).filter(Boolean);
    const parsed = submissionFormSchema.safeParse({
      ...values,
      photoLinks: cleanLinks,
      locale,
    });
    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      window.scrollTo({ top: (document.getElementById("submit-form")?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
      return;
    }
    setErrors({});

    // Static build: no upload endpoint — send the details over WhatsApp instead.
    if (STATIC_SITE) {
      const d = parsed.data;
      const hood = NEIGHBORHOODS.find((n) => n.id === d.neighborhood)?.name[locale] ?? d.neighborhood;
      const lines = [
        m.submit.waIntro,
        "",
        `${m.submit.propertyType} : ${m.types[d.propertyType]}`,
        `${m.submit.transactionLabel} : ${d.transaction === "sale" ? m.submit.transactionSale : m.submit.transactionRent}`,
        `${m.submit.neighborhoodLabel} : ${hood}`,
        d.price ? `${m.submit.priceLabel} : ${d.price}` : "",
        d.surface ? `${m.submit.surfaceLabel} : ${d.surface}` : "",
        d.bedrooms !== undefined ? `${m.submit.bedroomsLabel} : ${d.bedrooms}` : "",
        `${m.submit.ownerName} : ${d.ownerName}`,
        `${m.submit.ownerPhone} : ${d.phone}`,
        d.whatsapp ? `WhatsApp : ${d.whatsapp}` : "",
        d.email ? `E-mail : ${d.email}` : "",
        cleanLinks.length ? `Photos : ${cleanLinks.join(" · ")}` : "",
        "",
        d.description,
        files.length ? `(+ ${files.length} ${m.submit.photosUploaded})` : "",
      ].filter(Boolean);
      sendViaWhatsApp(lines.join("\n"));
      setRecordId(`wa-${Date.now().toString(36)}`);
      setStatus("ok");
      return;
    }

    setStatus("busy");
    try {
      const fd = new FormData();
      const data = parsed.data;
      fd.set("kind", "submission");
      fd.set("ownerName", data.ownerName);
      fd.set("phone", data.phone);
      if (data.whatsapp) fd.set("whatsapp", data.whatsapp);
      if (data.email) fd.set("email", data.email);
      fd.set("propertyType", data.propertyType);
      fd.set("transaction", data.transaction);
      fd.set("neighborhood", data.neighborhood);
      if (data.price) fd.set("price", String(data.price));
      if (data.surface) fd.set("surface", String(data.surface));
      if (data.bedrooms !== undefined) fd.set("bedrooms", String(data.bedrooms));
      fd.set("description", data.description);
      fd.set("consent", "true");
      fd.set("locale", locale);
      cleanLinks.forEach((l, i) => fd.set(`photoLink${i}`, l));
      files.forEach((f) => fd.append("photos", f));

      const res = await fetch("/api/property-submissions", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { id?: string };
      setRecordId(json.id ?? "");
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <CheckIcon size={26} />
        </span>
        <h3 className="font-display text-2xl text-ink">{m.submit.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-muted">{m.submit.successLead}</p>
        <p className="mt-3 inline-block rounded-full border border-line bg-sand px-4 py-1.5 font-mono text-sm font-semibold tracking-wider text-forest-900">
          {recordId.toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <form id="submit-form" onSubmit={submit} noValidate className="card p-5 sm:p-8">
      <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        {m.form.honeypot}
        <input tabIndex={-1} value={values.company} onChange={(e) => set({ company: e.target.value })} />
      </label>

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field label={m.submit.ownerName} error={err("ownerName")} required>
          <input className="field-input" autoComplete="name" placeholder={m.form.namePlaceholder} value={values.ownerName} onChange={(e) => set({ ownerName: e.target.value })} />
        </Field>
        <Field label={m.submit.ownerPhone} error={err("phone")} required>
          <input className="field-input" dir="ltr" autoComplete="tel" inputMode="tel" placeholder={m.form.phonePlaceholder} value={values.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field label={m.submit.ownerWhatsapp} error={err("whatsapp")}>
          <input className="field-input" dir="ltr" inputMode="tel" placeholder={m.form.whatsappPlaceholder} value={values.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} />
        </Field>
        <Field label={m.submit.ownerEmail} error={err("email")}>
          <input className="field-input" dir="ltr" autoComplete="email" placeholder={m.form.emailPlaceholder} value={values.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>

        <Field label={m.submit.propertyType} required>
          <select className="field-input" value={values.propertyType} onChange={(e) => set({ propertyType: e.target.value as TypeKey })}>
            {(["apartment", "villa", "land", "commercial", "office"] as const).map((t) => (
              <option key={t} value={t}>
                {m.types[t]}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="field-label">{m.submit.transactionLabel}</span>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {(["sale", "rent"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={values.transaction === t}
                onClick={() => set({ transaction: t })}
                className={clsx("chip !py-2.5 !justify-center", values.transaction === t && "is-active")}
              >
                {t === "sale" ? m.submit.transactionSale : m.submit.transactionRent}
              </button>
            ))}
          </div>
        </div>

        <Field label={m.submit.neighborhoodLabel} required>
          <select className="field-input" value={values.neighborhood} onChange={(e) => set({ neighborhood: e.target.value })}>
            {NEIGHBORHOODS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name[locale]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={m.submit.priceLabel} help={m.submit.priceHelp} error={err("price")}>
          <input className="field-input" inputMode="numeric" placeholder={values.transaction === "sale" ? "ex. 25 000 000" : "ex. 120 000"} value={values.price} onChange={(e) => set({ price: e.target.value })} />
        </Field>
        <Field label={m.submit.surfaceLabel} error={err("surface")}>
          <input className="field-input" inputMode="numeric" placeholder="ex. 120" value={values.surface} onChange={(e) => set({ surface: e.target.value })} />
        </Field>
        <Field label={m.submit.bedroomsLabel}>
          <input className="field-input" inputMode="numeric" placeholder="3" value={values.bedrooms} onChange={(e) => set({ bedrooms: e.target.value })} />
        </Field>

        <Field className="sm:col-span-2" label={m.submit.descriptionLabel} error={err("description")} required>
          <textarea className="field-input min-h-32 resize-y" placeholder={m.submit.descriptionPlaceholder} value={values.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>

        {/* ── Photos: links + files ── */}
        <div className="sm:col-span-2">
          <span className="field-label">{m.submit.photosLabel}</span>
          <p className="mb-3 text-[0.82rem] text-muted">{m.submit.photosHelp}</p>

          <ul className="space-y-2">
            {links.map((l, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-sand text-muted">
                  <LinkIcon size={15} />
                </span>
                <input
                  className={clsx("field-input", errors[`photoLinks.${i}`] && "!border-red-400")}
                  dir="ltr"
                  placeholder={m.submit.photosLinkPlaceholder}
                  value={l}
                  onChange={(e) => setLinks((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {links.length > 1 ? (
                  <button type="button" className="rounded-full p-2 text-muted hover:bg-sand hover:text-ink" onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))} aria-label={m.a11y.close}>
                    <CloseIcon size={15} />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="link-arrow"
              onClick={() => setLinks((prev) => (prev.length < 12 - files.length ? [...prev, ""] : prev))}
            >
              + {m.submit.photosAddLink}
            </button>
            <label className="link-arrow cursor-pointer !text-forest-800">
              <UploadIcon size={15} /> {m.submit.photosAddFiles}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="text-[0.75rem] text-muted">
              {files.length}/{MAX_FILES} {m.submit.photosUploaded} · {m.submit.photosMax}
            </span>
          </div>

          {previews.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {previews.map((src, i) => (
                <li key={src} className="relative h-20 w-24 overflow-hidden rounded-xl border border-line">
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" unoptimized />
                  <button type="button" onClick={() => removeFile(i)} className="absolute end-1 top-1 rounded-full bg-ink/70 p-1 text-bone transition hover:bg-ink" aria-label={m.a11y.close}>
                    <CloseIcon size={12} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[0.85rem] leading-relaxed text-muted">
        <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[var(--color-forest-800)]" checked={values.consent} onChange={(e) => set({ consent: e.target.checked })} />
        <span>
          {m.submit.consentLabel}
          {errors.consent ? <em className="field-error block not-italic">{m.form.consentRequired}</em> : null}
        </span>
      </label>

      <p className="mt-3 text-[0.78rem] leading-relaxed text-muted/80">{settings.content.privacyNote[locale]}</p>
      {STATIC_SITE ? <p className="mt-2 text-[0.78rem] leading-relaxed text-muted/80">{m.submit.staticNote}</p> : null}

      {status === "err" ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] font-medium text-red-700">
          {m.submit.errorLead} <a className="underline" dir="ltr" href={`tel:${settings.contact.phoneE164}`}>{settings.contact.phoneDisplay}</a>
        </p>
      ) : null}

      <div className="mt-6">
        <button type="submit" disabled={status === "busy"} className="btn btn-primary w-full sm:w-auto">
          {status === "busy" ? m.submit.sending : m.submit.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  help,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  help?: string;
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
      {help ? <span className="mt-1 block text-[0.76rem] text-muted">{help}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
