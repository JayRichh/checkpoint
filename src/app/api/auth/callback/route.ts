import { NextRequest, NextResponse } from "next/server";
import { getAppUrl, validateServerEnv, normalizeUrl } from "~/utils/env";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

async function exchangeCodeForToken(code: string) {
  const appUrl = getAppUrl();
  const { clientId, clientSecret } = validateServerEnv();

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: normalizeUrl(appUrl, 'api/auth/callback'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

async function fetchUserData(token: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`User data fetch failed: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl();
  
  try {
    const code = request.nextUrl.searchParams.get("code");
    
    if (!code) {
      return NextResponse.redirect(new URL('/', appUrl), {
        status: 302,
      });
    }

    const tokenData = await exchangeCodeForToken(code);
    
    if (tokenData.error || !tokenData.access_token) {
      console.error("Token exchange error:", tokenData.error_description || "Failed to get access token");
      return NextResponse.redirect(new URL('/', appUrl), {
        status: 302,
      });
    }

    const userData = await fetchUserData(tokenData.access_token);
    
    if (!userData || !userData.login) {
      console.error("User data error:", "Failed to get user data");
      return NextResponse.redirect(new URL('/', appUrl), {
        status: 302,
      });
    }

    const redirectUrl = new URL("/github", appUrl);
    redirectUrl.searchParams.set("token", tokenData.access_token);
    redirectUrl.searchParams.set("username", userData.login);
    redirectUrl.searchParams.set("oauth", "true");

    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set("refresh_token", tokenData.refresh_token);
    }

    if (tokenData.expires_in) {
      const expiresAt = Date.now() + tokenData.expires_in * 1000;
      redirectUrl.searchParams.set("expires_at", expiresAt.toString());
    }

    const response = NextResponse.redirect(redirectUrl, {
      status: 302,
    });

    // Set cache headers to prevent stale data
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL('/', appUrl), {
      status: 302,
    });
  }
}
