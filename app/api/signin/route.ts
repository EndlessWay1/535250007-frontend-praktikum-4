import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Return a generic error for invalid credentials.
  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return {
      data: null,
      error: "Invalid email or password",
    };
  }

  // Generate a secure session token.
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionToken: tokenHash,
      userId: user.id,
      expires,
    },
  });

  // Store only the raw token in the browser cookie.
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });

  return {
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    error: null,
  };
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("x-real-ip") ?? forwardedFor?.split(",")[0]?.trim();

  if (!ip) {
    return Response.json(
      { error: "Unable to process request." },
      { status: 400 },
    );
  }

  // Parse and validate untrusted input
  const body = await request.json().catch(() => null);
  const result = signInSchema.safeParse(body);

  console.log(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Incorrect email or password, try again later." },
      { status: 400 },
    );
  }
  const { email, password } = result.data;

  const { data, error } = await signIn(email, password);

  if (error) {
    return NextResponse.json(
      { error: "Incorrect email or password, try again later." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: data!.id,
      email: data!.email,
    },
  });
}
