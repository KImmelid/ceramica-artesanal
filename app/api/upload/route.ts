import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const maybeFile = data.get("file");

    if (!(maybeFile instanceof File)) {
      return NextResponse.json({ error: "No se adjuntó archivo" }, { status: 400 });
    }

    const bytes = await maybeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // límites básicos: 5 MB
    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx 5MB)" }, { status: 413 });
    }

    // nombre seguro del archivo
    const baseName = maybeFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 80);
    const fileName = `${Date.now()}-${baseName || "archivo"}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "No se pudo guardar el archivo" }, { status: 500 });
  }
}
