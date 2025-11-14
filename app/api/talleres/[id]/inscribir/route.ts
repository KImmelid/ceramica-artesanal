import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(_req: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const resolved = await params;
  const workshopId = Number(resolved.id);
  if (!Number.isFinite(workshopId)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!workshop) return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });

  const now = Date.now();
  const ts = new Date(workshop.date).getTime();
  const preWindowMs = 2 * 60 * 60 * 1000;
  const fueraDeVentana = ts - now > preWindowMs;
  const disponibles = Math.max(0, Number(workshop.capacity) - Number(workshop._count?.enrollments ?? 0));
  const abierto = (workshop.open ?? true) && disponibles > 0 && ts > now && fueraDeVentana;
  if (!abierto) {
    return NextResponse.json({ error: "Taller cerrado o sin cupos" }, { status: 409 });
  }

  const exists = await prisma.workshopEnrollment.findFirst({ where: { userId, workshopId } });
  if (exists) {
    return NextResponse.json({ error: "Ya estas inscrito" }, { status: 409 });
  }

  const enrollment = await prisma.workshopEnrollment.create({
    data: { userId, workshopId },
  });

  return NextResponse.json(enrollment, { status: 201 });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const resolved = await params;
  const workshopId = Number(resolved.id);
  if (!Number.isFinite(workshopId)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  const { count } = await prisma.workshopEnrollment.deleteMany({
    where: { userId, workshopId },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Inscripcion no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
