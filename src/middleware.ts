import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fetcher from "./utils/http";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/server/web/spec-extension/cookies";

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse) {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers);

  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  // 3. Set up the “request header overrides” (see https://github.com/vercel/next.js/pull/41380)
  //    on a dummy response
  // NextResponse.next will set x-middleware-override-headers / x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  // 4. Copy the “request header overrides” headers from our dummy response to the real response
  dummyRes.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function middleware(request: NextRequest) {
  // TMDB Session generation
  // application of this procedure: https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id
  const request_token = request.nextUrl.searchParams.get("request_token");
  try {
    const session = await fetcher(
      `${process.env.NEXT_PUBLIC_BASETMDBURL}/authentication/session/new`,
      { body: JSON.stringify({ request_token: request_token }) },
      {
        tmdbContext: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
        },
      },
    );
    const accountDetails = await fetcher(
      `${process.env.NEXT_PUBLIC_BASETMDBURL}/account`,
      { method: "GET" },
      {
        tmdbContext: {
          api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
          session_id: session.session_id,
        },
      },
    );
    const response = NextResponse.rewrite(new URL("/accueil", request.url));
    response.cookies.set("account_id", accountDetails.id);
    // Apply those cookies to the request
    applySetCookie(request, response);
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/approved/:path*",
};
