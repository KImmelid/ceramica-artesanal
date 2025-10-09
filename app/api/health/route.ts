import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Intenta consultar algo básico para verificar conexión
    await prisma.$queryRaw`SELECT 1`;

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Conexión con la base de datos exitosa ✅",
        time: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Error al conectar con la base de datos ❌",
        error: String(error),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
