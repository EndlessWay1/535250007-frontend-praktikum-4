import { NextRequest, NextResponse } from "next/server";
import { validateCsrf } from "./lib/csrf/csrf";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export function proxy(request: NextRequest) {
  if (SAFE_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  if (!validateCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/((?!csrf(?:/|$)).*)"],
};
