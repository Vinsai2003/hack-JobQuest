import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

const protectedRoutes = ["/dashboard", "/profile", "/applications", "/bookmarks"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Add security headers for all routes
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    try {
      const { data: session } = await betterFetch("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (!session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Middleware session check error:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname === "/login" || pathname === "/register") {
    try {
      const { data: session } = await betterFetch("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (session) {
        const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }
    } catch (error) {
      // If session check fails, allow access to auth pages
      console.error("Auth page session check error:", error);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};