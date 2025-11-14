import { NextResponse, type RouteHandlerContext } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

type RouteParams = { id: string };

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: RouteHandlerContext<RouteParams>) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }
  const data = await req.json(); // { title?, description?, date?, capacity? }
  if (data.date) data.date = new Date(data.date);
  const upd = await prisma.workshop.update({ where: { id }, data });
  return NextResponse.json(upd);
}

export async function DELETE(_req: Request, ctx: RouteHandlerContext<RouteParams>) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }
  await prisma.workshop.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
