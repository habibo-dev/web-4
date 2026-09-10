import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Inquiry, Submission } from "@/lib/data/types";

/**
 * Tiny JSON-file persistence for inbound records (demo-grade).
 * Shape matches the `inquirySchema` / `submissionSchema` CMS models, so
 * replacing this module with a database adapter touches nothing else.
 *
 * DB file: /data/db.json (git-ignored; created on first write).
 */

export interface Db {
  inquiries: Inquiry[];
  submissions: Submission[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let lock: Promise<void> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Db;
    return {
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
    };
  } catch {
    return { inquiries: [], submissions: [] };
  }
}

async function writeDb(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
}

export async function appendInquiry(
  data: Omit<Inquiry, "id" | "createdAt" | "status">,
): Promise<Inquiry> {
  return withLock(async () => {
    const db = await readDb();
    const record: Inquiry = {
      ...data,
      id: newId("inq"),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    db.inquiries.unshift(record);
    await writeDb(db);
    return record;
  });
}

export async function appendSubmission(
  data: Omit<Submission, "id" | "createdAt" | "status">,
): Promise<Submission> {
  return withLock(async () => {
    const db = await readDb();
    const record: Submission = {
      ...data,
      id: newId("sub"),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    db.submissions.unshift(record);
    await writeDb(db);
    return record;
  });
}

export async function listDb(): Promise<Db> {
  return withLock(readDb);
}

export async function setRecordStatus(
  kind: "inquiry" | "submission",
  id: string,
  status: string,
): Promise<void> {
  await withLock(async () => {
    const db = await readDb();
    if (kind === "inquiry") {
      const rec = db.inquiries.find((r) => r.id === id);
      if (rec) rec.status = status as Inquiry["status"];
    } else {
      const rec = db.submissions.find((r) => r.id === id);
      if (rec) rec.status = status as Submission["status"];
    }
    await writeDb(db);
  });
}

/* ── uploads (submission photos) ─────────────────────────────────── */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(filename: string, buffer: Buffer): Promise<string> {
  const safeBase = filename.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "");
  const month = new Date().toISOString().slice(0, 7);
  const dir = path.join(UPLOAD_ROOT, month);
  await fs.mkdir(dir, { recursive: true });
  const finalName = `${randomBytes(4).toString("hex")}-${safeBase}`;
  await fs.writeFile(path.join(dir, finalName), buffer);
  return `/uploads/${month}/${finalName}`;
}

export function isAllowedImage(name: string): boolean {
  return /\.(jpe?g|png|webp|avif|gif)$/i.test(name);
}
