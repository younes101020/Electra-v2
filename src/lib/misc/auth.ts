import type { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";
import { getJwtSecretKey } from "./constants";

export class AuthError extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 * You can pass it either the request object or directly the value of the cookie
 */
export async function verifyAuth({
  req,
  cookieValue,
}: {
  req?: NextRequest;
  cookieValue?: string;
}) {
  const token = req ? req.cookies.get("user_token")?.value : cookieValue;
  if (!token) throw new AuthError("Missing user token");

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );
    return verified.payload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(res: NextResponse, session_id: string) {
  const token = await new SignJWT({ session_id })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(getJwtSecretKey()));

  res.cookies.set("user_token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours in seconds
  });

  return res;
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextResponse) {
  res.cookies.set("user_token", "", { httpOnly: true, maxAge: 0 });
  return res;
}
