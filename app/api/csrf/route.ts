import { createHmac, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const token = randomBytes(32).toString("hex");

  const salt = process.env.PRIVATE_KEY;

  if (!salt) {
    return NextResponse.json(
      { error: "An error has occured." },
      { status: 501 },
    );
  }

  const hmacToken = createHmac("sha256", salt).update(token).digest("hex");

  const response = NextResponse.json(
    { csrfToken: token },
    { headers: { "Cache-Control": "no-store" } },
  );

  response.cookies.set("__Host-csrf", hmacToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  return response;
}
