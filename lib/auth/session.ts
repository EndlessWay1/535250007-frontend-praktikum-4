import "server-only";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
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
