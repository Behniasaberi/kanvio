import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/shared/config/env";

const PROTECTED_ROUTES = ["/dashboard", "/w/", "/workspaces"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not put any code between createServerClient and getClaims.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (pathname === "/") {
    return redirectTo(request, isLoggedIn ? "/dashboard" : "/login", response);
  }
  if (isProtected && !isLoggedIn) {
    return redirectTo(request, "/login", response);
  }
  if (isAuthRoute && isLoggedIn) {
    return redirectTo(request, "/dashboard", response);
  }

  return response;
}

function redirectTo(request: NextRequest, path: string, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";

  const redirect = NextResponse.redirect(url);

  // Keep any refreshed session cookies, otherwise the user gets logged out.
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  ["cache-control", "expires", "pragma"].forEach((key) => {
    const value = from.headers.get(key);
    if (value) redirect.headers.set(key, value);
  });

  return redirect;
}
