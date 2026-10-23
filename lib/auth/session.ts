import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  // Hash the raw cookie token to match the stored sessionToken.
  const sessionToken = createHash("sha256").update(token).digest("hex");

  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      expires: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  return {
    user: session.user,
    expires: session.expires,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    await prisma.session.create({
      data: {
        sessionToken: tokenHash,
        userId,
        expires,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
    });
  } catch (error) {
    console.error(error);
    return null;
  }

  return token;
}
