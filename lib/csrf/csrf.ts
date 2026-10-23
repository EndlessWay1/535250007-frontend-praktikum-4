import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function validateCsrf(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const appUrl = process.env.APP_URL;
  console.log("Here Why here?");

  if (!origin || !appUrl || origin !== new URL(appUrl).origin) {
    return false;
  }

  console.log("Here is fine?");
  const salt = process.env.PRIVATE_KEY;

  if (!salt) {
    return false;
  }

  const cookieToken = request.cookies.get("__Host-csrf")?.value;
  const headerToken = request.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    return false;
  }
  console.log("Maybe Here is fine?");

  const hmacToken = createHmac("sha256", salt)
    .update(headerToken)
    .digest("hex");

  console.log("Cookie Token", cookieToken);
  console.log("Header Token", hmacToken);

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(hmacToken);

  if (a.length !== b.length) return false;

  if (hmacToken !== cookieToken) return false;

  return timingSafeEqual(a, b);
}
