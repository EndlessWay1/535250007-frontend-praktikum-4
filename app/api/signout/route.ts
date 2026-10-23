import "server-only";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("x-real-ip") ?? forwardedFor?.split(",")[0]?.trim();

  if (!ip) {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 401 },
    );
  }
  const sessionToken = createHash("sha256").update(token).digest("hex");
  console.log(sessionToken);
  await prisma.session.update({
    where: {
      sessionToken,
      expires: {
        gt: new Date(),
      },
    },
    data: {
      expires: new Date(Date.now() - 1000),
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
