import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAppUrl } from "~/utils/env";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/api/github",  
];

// Paths that should skip token validation
const PUBLIC_PATHS = [
  "/api/auth/callback",
  "/api/auth/refresh",
  "/api/auth/device",
];

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

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

async function validateGitHubToken(token: string, retryCount = 0): Promise<Response> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok && retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return validateGitHubToken(token, retryCount + 1);
    }

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return validateGitHubToken(token, retryCount + 1);
    }
    throw error;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
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
      { 
        status: 401,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        }
      }
    );
  }

  try {
    // Validate token with GitHub
    const response = await validateGitHubToken(token);

    if (!response.ok) {
      // Check if token needs refresh
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Token expired", requiresRefresh: true },
          { 
            status: 401,
            headers: {
              "Cache-Control": "no-store, must-revalidate",
            }
          }
        );
      }

      return NextResponse.json(
        { error: "Invalid token" },
        { 
          status: 401,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          }
        }
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

    // Add headers
    response2.headers.set("Cache-Control", "no-store, must-revalidate");
    response2.headers.set("Access-Control-Allow-Origin", "*");
    response2.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response2.headers.set(
      "Access-Control-Allow-Headers",
      "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization"
    );
    response2.headers.set(
      "Access-Control-Expose-Headers",
      "x-github-token"
    );

    return response2;
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate token" },
      { 
        status: 401,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        }
      }
    );
  }
}
