/**
 * In-memory sliding-window limiter for public form endpoints.
 * Per single-origin deployment this is sufficient; front it with a CDN rule
 * if you need network-level protection.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (!v.length || now - v[v.length - 1] > windowMs * 4) buckets.delete(k);
    }
  }
  return true;
}

/**
 * Best-effort client address. Behind a proxy the forwarded headers are the
 * only signal available; without one every request would otherwise collapse
 * into a single shared bucket and the limits would apply site-wide.
 */
export function clientIp(req: { headers: { get(name: string): string | null } }): string {
  const h = req.headers;
  for (const name of ["x-forwarded-for", "x-real-ip", "cf-connecting-ip", "fly-client-ip"]) {
    const v = h.get(name);
    if (v) return v.split(",")[0]!.trim();
  }
  return "local";
}
