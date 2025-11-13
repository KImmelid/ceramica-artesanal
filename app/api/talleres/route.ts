import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

type WorkshopPayload = {
  title?: string;
  description?: string;
  date?: string;
  capacity?: number;
};

function validateWorkshopInput(raw: unknown): WorkshopPayload | null {
  const data = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const title = typeof data?.title === "string" ? data.title.trim() : "";
  const date = typeof data?.date === "string" ? data.date : "";
  const capacity = Number(data?.capacity);
  if (!title || !date || !Number.isFinite(capacity)) return null;
  return {
    title,
    description: typeof data.description === "string" ? data.description : "",
    date,
    capacity,
  };
}

export async function GET() {
  const PRE_CLOSE_HOURS = 2;
  const now = new Date();
  const preCloseLimit = new Date(now.getTime() + PRE_CLOSE_HOURS * 60 * 60 * 1000);
  await prisma.workshop.updateMany({ where: { date: { lt: now }, open: true }, data: { open: false } });
  await prisma.workshop.updateMany({ where: { date: { lte: preCloseLimit, gte: now }, open: true }, data: { open: false } });
  const talleres = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { enrollments: true } } },
  });
  return NextResponse.json(talleres);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const payload = validateWorkshopInput(await req.json());
  if (!payload) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const nuevo = await prisma.workshop.create({
    data: {
      title: payload.title,
      description: payload.description ?? "",
      date: new Date(payload.date),
      capacity: Number(payload.capacity),
    },
  });
  return NextResponse.json(nuevo, { status: 201 });
}
