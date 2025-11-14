import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { validateProduct } from "@/lib/validate";

type RouteContext = { params?: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const resolved = params ? await params : null;
  const id = Number(resolved?.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }
  const payload = await req.json();
  const result = validateProduct(payload, { partial: true });
  if (!result.ok) {
    return NextResponse.json({ error: "Validacion", details: result.errors }, { status: 400 });
  }
  const upd = await prisma.product.update({ where: { id }, data: result.data });
  return NextResponse.json(upd);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const resolved = params ? await params : null;
  const id = Number(resolved?.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
