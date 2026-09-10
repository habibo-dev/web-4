import Link from "next/link";
import { BrandMark } from "@/components/Brand";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { listDb } from "@/lib/store";
import { properties } from "@/lib/data/properties";
import { agents } from "@/lib/data/agents";
import { services } from "@/lib/data/services";
import { publishedTestimonials } from "@/lib/data/testimonials";
import { LoginForm } from "@/components/admin/LoginForm";
import { logoutAction, statusAction } from "@/components/admin/actions";
import type { Inquiry, Submission } from "@/lib/data/types";

const INQUIRY_STATUS: Record<string, string> = {
  new: "Nouveau",
  "in-progress": "En cours",
  done: "Traité",
  archived: "Archivé",
};
const SUBMISSION_STATUS: Record<string, string> = {
  new: "Nouveau",
  reviewing: "En revue",
  contacted: "Rappelé",
  listed: "Publié",
  closed: "Clôturé",
};
const TYPE_LABEL: Record<string, string> = {
  apartment: "Appartement",
  villa: "Villa",
  land: "Terrain",
  commercial: "Local",
  office: "Bureau",
};

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <Shell>
        <div className="card max-w-md border border-[#ddd4c1] bg-white p-8">
          <h1 className="font-display text-2xl">Back-office désactivé</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5d6a60]">
            Définissez <code className="rounded bg-[#ede6d7] px-1.5 py-0.5">ADMIN_PASSWORD</code> dans{" "}
            <code className="rounded bg-[#ede6d7] px-1.5 py-0.5">.env.local</code>, puis redémarrez le serveur pour
            activer la réception des demandes.
          </p>
          <Link href="/fr" className="mt-6 inline-block rounded-full border border-[#ddd4c1] px-4 py-2 text-sm font-semibold hover:border-[#14432f]">
            ← Retour au site
          </Link>
        </div>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <div className="max-w-md">
          <p className="eyebrow mt-2 text-[#9c7228]">ISLEM Immobilier — espace agence</p>
          <h1 className="font-display mt-2 text-4xl">Connexion</h1>
          <p className="mt-2 text-sm text-[#5d6a60]">{"Accès réservé à l'équipe. Le mot de passe se configure côté serveur."}</p>
          <LoginForm />
        </div>
      </Shell>
    );
  }

  const db = await listDb();
  const inquiries = db.inquiries;
  const submissions = db.submissions;
  const newCount = inquiries.filter((i) => i.status === "new").length + submissions.filter((s) => s.status === "new").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark size={38} className="rounded-xl" />
          <div>
            <p className="eyebrow leading-none text-[#9c7228]">Espace agence</p>
            <h1 className="font-display text-2xl font-semibold leading-tight">Tableau de bord</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/fr" className="rounded-full border border-[#ddd4c1] bg-white px-4 py-2 font-semibold hover:border-[#14432f]">
            Voir le site →
          </Link>
          <form action={logoutAction}>
            <button className="rounded-full border border-[#ddd4c1] bg-white px-4 py-2 font-semibold hover:border-red-400 hover:text-red-700">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* stat tiles — only truthful counters from inbound records */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="À traiter" value={newCount} accent />
        <Stat label="Demandes (visites & contact)" value={inquiries.length} />
        <Stat label="Biens soumis" value={submissions.length} />
        <Stat label="Annonces publiées" value={properties.length} sub={`${agents.length} conseillers · ${services.length} services · ${publishedTestimonials().length} avis`} />
      </div>

      {/* Inbox */}
      <Section title="Demandes reçues" count={inquiries.length} exportHref="/api/admin/export?kind=inquiries" note="Formulaire « Demander une visite » & page Contact — stockées dans data/db.json.">
        {inquiries.length === 0 ? (
          <Empty text={"Aucune demande pour l'instant. Elles arriveront ici dès qu'un visiteur enverra le formulaire."} />
        ) : (
          <div className="card overflow-x-auto border border-[#ddd4c1] bg-white">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[#ede6d7] text-start text-[0.7rem] uppercase tracking-wider text-[#5d6a60]">
                  <Th>Date</Th>
                  <Th>Nom</Th>
                  <Th>Contact</Th>
                  <Th>Objet</Th>
                  <Th>Bien</Th>
                  <Th>Message</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i: Inquiry) => (
                  <tr key={i.id} className="border-b border-[#f1efe7] align-top last:border-0">
                    <Td>{new Date(i.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</Td>
                    <Td>
                      <strong>{i.name}</strong>
                      <div className="text-[0.72rem] text-[#5d6a60]">{i.kind === "visit" ? "Visite" : "Contact"}</div>
                    </Td>
                    <Td>
                      <div dir="ltr">{i.phone}</div>
                      {i.email ? <div dir="ltr" className="text-[0.78rem] text-[#5d6a60]">{i.email}</div> : null}
                    </Td>
                    <Td>{i.preferredDate ? <span className="rounded-full bg-[#ede6d7] px-2 py-0.5 text-[0.72rem] font-semibold">📅 {i.preferredDate}</span> : "—"}</Td>
                    <Td>
                      {i.propertySlug ? (
                        <a href={`/fr/property/${i.propertySlug}`} target="_blank" rel="noreferrer" className="font-mono text-[0.72rem] underline decoration-dotted">
                          {i.propertySlug.slice(0, 22)}…
                        </a>
                      ) : (
                        "Recherche générale"
                      )}
                    </Td>
                    <Td className="max-w-[220px]">
                      <p className="line-clamp-3 text-[0.8rem] text-[#41504a]">{i.message ?? "—"}</p>
                    </Td>
                    <Td>
                      <StatusForm kind="inquiry" id={i.id} value={i.status} options={INQUIRY_STATUS} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Submissions */}
      <Section title="Biens soumis par les propriétaires" count={submissions.length} exportHref="/api/admin/export?kind=submissions" note="Formulaire « Déposer un bien » — photos dans /public/uploads.">
        {submissions.length === 0 ? (
          <Empty text={"Aucun dépôt pour 'instant."} />
        ) : (
          <div className="grid gap-4">
            {submissions.map((s: Submission) => (
              <article key={s.id} className="card border border-[#ddd4c1] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {s.ownerName} <span className="ms-1 rounded-full bg-[#ede6d7] px-2 py-0.5 align-middle text-[0.7rem] font-bold uppercase">{TYPE_LABEL[s.propertyType] ?? s.propertyType} · {s.transaction === "sale" ? "Vente" : "Location"}</span>
                    </p>
                    <p className="mt-1 text-[0.82rem] text-[#5d6a60]">
                      {new Date(s.createdAt).toLocaleString("fr-FR")} · Quartier <strong>{s.neighborhood}</strong>
                      {s.surface ? ` · ${s.surface} m²` : ""}
                      {s.price ? ` · ${s.price.toLocaleString("fr-FR")} DA` : ""}
                    </p>
                    <p className="mt-1 text-[0.82rem]" dir="ltr">
                      <a href={`tel:${s.phone}`} className="font-semibold">{s.phone}</a>
                      {s.email ? <> · <a href={`mailto:${s.email}`} className="underline decoration-dotted">{s.email}</a></> : null}
                    </p>
                  </div>
                  <StatusForm kind="submission" id={s.id} value={s.status} options={SUBMISSION_STATUS} />
                </div>
                <p className="mt-3 whitespace-pre-line text-[0.88rem] leading-relaxed text-[#41504a]">{s.description}</p>
                {s.photos.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.photos.map((p, i) => (
                      <li key={i}>
                        <a href={p} target="_blank" rel="noreferrer" className="block h-16 w-24 overflow-hidden rounded-lg border border-[#ddd4c1] bg-[#f1efe7]">
                          {p.startsWith("/uploads/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center px-1 text-center text-[0.6rem] font-semibold text-[#5d6a60]">lien ↗</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </Section>

      <footer className="mt-10 rounded-2xl border border-dashed border-[#ddd4c1] p-5 text-[0.82rem] leading-relaxed text-[#5d6a60]">
        <strong className="text-[#0b1f17]">Modèle de données.</strong> Inquiries & submissions suivent{" "}
        <code>src/lib/data/types.ts</code> (validé par zod), prêt à brancher sur un CMS — voir <code>docs/CMS.md</code>. Catalogue : <code>src/lib/data/properties.ts</code> · Équipe : <code>agents.ts</code> · Avis clients :{" "}
        {"<code>testimonials.ts</code> (masqués tant qu'aucun avis validé n'existe)."}
      </footer>
    </div>
  );
}

/* ── pieces ─────────────────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 py-16">
      {children}
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div className={`card border p-5 ${accent ? "border-[#14432f] bg-[#14432f] text-[#f7f4ed]" : "border-[#ddd4c1] bg-white"}`}>
      <p className={`eyebrow ${accent ? "text-[#cfa454]" : "text-[#5d6a60]"}`}>{label}</p>
      <p className="font-display mt-1 text-4xl font-semibold tabular-nums">{value}</p>
      {sub ? <p className={`mt-1 text-[0.72rem] ${accent ? "text-[#f7f4ed]/60" : "text-[#5d6a60]"}`}>{sub}</p> : null}
    </div>
  );
}

function Section({ title, count, note, exportHref, children }: { title: string; count: number; note?: string; exportHref?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">
            {title} <span className="ms-1 align-middle rounded-full border border-[#ddd4c1] bg-white px-2 py-0.5 text-xs font-bold">{count}</span>
          </h2>
          {note ? <p className="mt-1 text-[0.78rem] text-[#5d6a60]">{note}</p> : null}
        </div>
        {exportHref && count > 0 ? (
          <a href={exportHref} className="rounded-full border border-[#ddd4c1] bg-white px-3.5 py-1.5 text-xs font-semibold hover:border-[#14432f]">
            Exporter JSON ↓
          </a>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="card border-dashed border-[#ddd4c1] bg-white px-6 py-10 text-center text-sm text-[#5d6a60]">
      {text}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-start font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function StatusForm({ kind, id, value, options }: { kind: "inquiry" | "submission"; id: string; value: string; options: Record<string, string> }) {
  return (
    <form action={statusAction} className="flex items-center gap-1.5">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={value}
        className="rounded-lg border border-[#ddd4c1] bg-white px-2 py-1.5 text-xs font-semibold outline-none focus:border-[#236b4c]"
      >
        {Object.entries(options).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      <button className="rounded-lg bg-[#14432f] px-2.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide text-white transition hover:bg-[#0e2a1e]" aria-label={`Changer le statut ${options[value] ?? value}`}>
        ✓
      </button>
    </form>
  );
}
