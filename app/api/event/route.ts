import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import "server-only";
import { z } from "zod";

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const postSchema = z.object({
  title: z
    .string()
    .min(1)
    .transform((val) => toTitleCase(val)),
  content: z.string().min(1),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5Mb.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    )
    .optional(),
  eventDate: z.date(),
});

// CURRENT EVENTS
export async function GET() {
  const post = await prisma.post.findMany({
    where: { eventDate: { gt: new Date(Date.now()) } },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Unable to access post!" },
      { status: 204 },
    );
  }

  return NextResponse.json(
    {
      post,
    },
    { status: 200 },
  );
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

  const body = await request.json().catch(() => null);
  const result = postSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid parameter" }, { status: 400 });
  }

  const { title, content, eventDate, image } = result.data;

  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  await prisma.post.create({
    data: {
      title,
      content,
      imageData: image,
      eventDate,
      userId: user.id,
      validated: user.role === "ADMIN" || user.role === "MODERATOR",
    },
  });

  return NextResponse.json(
    { success: "Successfully created post" },
    { status: 201 },
  );
}
