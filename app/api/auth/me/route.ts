import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { id, name, email, role } = session.user;

  return NextResponse.json({
    user: { id, name, email, role },
  });
}
