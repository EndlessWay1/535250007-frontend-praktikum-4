import { NextRequest, NextResponse } from "next/server";
import { validateCsrf } from "./lib/csrf/csrf";

export function proxy(request: NextRequest) {
  if (!validateCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/((?!csrf(?:/|$)).*)"],
};
