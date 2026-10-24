import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }, // Next 15: params is a Promise
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: { imageData: true, imageType: true },
  });

  if (!post?.imageData || !post.imageType) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(post.imageData), {
    headers: {
      "Content-Type": post.imageType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
