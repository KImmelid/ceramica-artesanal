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
export async function processImage(file: File, opts?: ProcessImageOptions): Promise<ImageInfo> {
  void file;
  void opts;
  throw new Error("processImage no implementado");
}
