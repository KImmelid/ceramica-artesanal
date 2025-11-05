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
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${maybeFile.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo guardar el archivo" }, { status: 500 });
  }
}
