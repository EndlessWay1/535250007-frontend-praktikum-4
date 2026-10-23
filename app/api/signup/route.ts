import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(1),
    email: z.email({ message: "Invaid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords don't match",
    path: ["confirm"],
  });

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
  const result = signUpSchema.safeParse(body);

  console.log(result.error);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid email, password, or confirm format." },
      { status: 400 },
    );
  }

  const { email, password, name } = result.data;

  // Create Supabase client

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, salt),
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 400 },
    );
  }
}
