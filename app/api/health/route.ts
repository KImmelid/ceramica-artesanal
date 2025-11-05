import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.user.count();
    return NextResponse.json({ ok: true, db: "up" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, db: "down", error: String(e) },
      { status: 500 }
    );
  }
}
