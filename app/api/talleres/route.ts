import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  const talleres = await prisma.workshop.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(talleres);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { title, description, date, capacity } = await req.json();
  if (!title || !date || capacity == null) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const nuevo = await prisma.workshop.create({
    data: {
      title,
      description: description ?? "",
      date: new Date(date),
      capacity: Number(capacity),
    },
  });
  return NextResponse.json(nuevo, { status: 201 });
}
