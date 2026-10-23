import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth/session";

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
  await createSession(user.id);

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
