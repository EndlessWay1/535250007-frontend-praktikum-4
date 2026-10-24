import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import "server-only";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }, // Next 15: params is a Promise
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      content: true,
      imageType: true,
      eventDate: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Unable to access post!" },
      { status: 404 },
    );
  }

  return NextResponse.json({ post }, { status: 200 });
}
