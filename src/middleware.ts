import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, isLocale } from "@/lib/i18n/config";

/**
 * Locale routing for ISLEM Immobilier.
 *
 *  - `/{locale}/…`       → served as-is, locale persisted in a cookie
 *  - `/{locale}`         → redirected to `/{locale}/` (normalized)
 *  - `/` and bare paths  → redirected to the detected locale, query preserved
 *  - `/admin…`, `/api…`  → served outside the locale namespace (no redirect)
 *  - `_next`, static     → untouched
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, maybeLocale] = pathname.split("/");

  // Paths that never take a locale prefix.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    /^\/(favicon\.ico|icon\.svg|robots\.txt|sitemap\.xml|manifest\.webmanifest)/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isLocale(maybeLocale)) {
    const response = NextResponse.next();
    // Remember the locale for the bare-path redirect above.
    response.cookies.set("NEXT_LOCALE", maybeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = detectLocale(
    request.cookies.get("NEXT_LOCALE")?.value,
    request.headers.get("accept-language"),
  );
  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images|uploads).*)"],
};
