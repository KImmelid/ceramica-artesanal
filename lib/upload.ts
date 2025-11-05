export type ImageInfo = {
  url: string;
  width?: number;
  height?: number;
  format?: string;
};

export type ProcessImageOptions = {
  resize?: { width: number };
};

// Placeholder helpers for future implementation
export async function processImage(_file: File, _opts?: ProcessImageOptions): Promise<ImageInfo> {
  // TODO: implementar procesamiento/subida real (local/S3/etc.)
  throw new Error("processImage no implementado");
}

