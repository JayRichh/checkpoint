import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAppUrl } from "~/utils/env";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/api/github",  // Protected API routes
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

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const requiresAuth = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Get auth token from header or query param
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Validate token with GitHub
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Clone the request headers
    const requestHeaders = new Headers(request.headers);
    
    // Add validated token to header
    requestHeaders.set("x-github-token", token);

    // Forward the request with the validated token
    const response2 = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add CORS headers if needed
    response2.headers.set("Access-Control-Allow-Origin", "*");
    response2.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response2.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response2;
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 401 }
    );
  }
}
