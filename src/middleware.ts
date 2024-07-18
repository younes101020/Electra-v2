import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fetcher from "./utils/http";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/server/web/spec-extension/cookies";
import { ITMDBNewAuthSessionResp } from "./utils/api/tmdb";
import { setUserCookie, verifyAuth } from "./lib/misc/auth";

// Apply middleware on these path only
export const config = {
  matcher: ["/approved/:path*", "/accueil", "/api/account/:path*"],
};

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
  if (request.nextUrl.pathname.startsWith("/approved")) {
    // TMDB Session generation
    // application of this procedure: https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id
    const request_token = request.nextUrl.searchParams.get("request_token");
    try {
      const session = await fetcher<ITMDBNewAuthSessionResp>(
        `${process.env.BASETMDBURL}/authentication/session/new`,
        { body: JSON.stringify({ request_token: request_token }) },
        {
          tmdbContext: {
            api_key: process.env.TMDB_API_KEY!,
          },
        },
      );
      const response = NextResponse.redirect(new URL("/accueil", request.url));
      const responseWithJWT = await setUserCookie(response, session.session_id);
      // Apply those cookies to the request
      applySetCookie(request, responseWithJWT);
      return responseWithJWT;
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  try {
    const user = await verifyAuth(request);
    /**
     * Append tmdb `session_id` to request pathname so that the `/api/account/(appending_session_id)/details` endpoint could read it for retrieving user account details from tmdb service
     */
    console.log(
      request.nextUrl.pathname.endsWith("/details"),
      request.nextUrl.pathname,
    );
    if (request.nextUrl.pathname.endsWith("/details")) {
      return NextResponse.rewrite(
        new URL(`/api/account/${user.session_id}/details`, request.url),
      );
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    if (request.nextUrl.pathname.startsWith("api/account")) {
      return NextResponse.json(
        { error: "authentication required" },
        { status: 401 },
      );
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
