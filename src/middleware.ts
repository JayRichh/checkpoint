import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAppUrl } from "~/utils/env";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/api/github",  // Protected API routes
  "/github",      // Protected client routes
];

// Paths that should skip token validation
const PUBLIC_PATHS = [
  "/api/auth/callback",
  "/api/auth/refresh",
  "/api/auth/device",
];

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/ (Next.js internals)
     * 2. /static/ (static files)
     * 3. /favicon.ico, /robots.txt (static files)
     */
    "/((?!_next/|static/|favicon.ico|robots.txt).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Add cache control headers to prevent stale data
  response.headers.set('Cache-Control', 'no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return response;
  }

  // Check if path requires authentication
  const requiresAuth = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  if (!requiresAuth) {
    return response;
  }

  // Get auth token from header or query param
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || request.nextUrl.searchParams.get("token");

  if (!token) {
    // Redirect to home page if accessing protected client routes without auth
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Validate token with GitHub
    const githubResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!githubResponse.ok) {
      // Clear invalid auth state and redirect for client routes
      if (!pathname.startsWith('/api/')) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.headers.set('Clear-Site-Data', '"storage"');
        return response;
      }
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Clone the request headers
    const requestHeaders = new Headers(request.headers);
    
    // Add validated token and user info to headers
    requestHeaders.set("x-github-token", token);
    const userData = await githubResponse.json();
    requestHeaders.set("x-github-user", userData.login);

    // Forward the request with the validated token
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add CORS headers if needed
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    console.error("Token validation error:", error);
    // Clear invalid auth state and redirect for client routes
    if (!pathname.startsWith('/api/')) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.headers.set('Clear-Site-Data', '"storage"');
      return response;
    }
    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 401 }
    );
  }
}
