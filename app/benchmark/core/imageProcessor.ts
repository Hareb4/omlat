import type { BenchmarkImage, CompressedImage } from "./types";

/**
 * Compresses an image File to match Expo ImagePicker behavior:
 * - Max dimension: 1920px (Expo default)
 * - Quality: 0.8 (Expo default quality setting)
 * - Output: base64 JPEG
 * - Target size: under 1MB (mobile data friendly)
 */
export async function compressImageLikeExpo(
  file: File
): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_DIM = 1920;
      const QUALITY = 0.8;

      let { width, height } = img;

      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not create canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
      const base64 = dataUrl.split(",")[1] ?? "";

      URL.revokeObjectURL(url);

      resolve({
        base64,
        mimeType: "image/jpeg",
        width,
        height,
        sizeKB: Math.round((base64.length * 0.75) / 1024),
        originalSizeKB: Math.round(file.size / 1024),
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };

    img.src = url;
  });
}

export async function fileFromRemoteUrl(
  url: string,
  filename: string
): Promise<File> {
  const proxyUrl = `/api/benchmark/sample-image?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error("Could not fetch sample image");
  }
  const blob = await response.blob();
  const type = blob.type || "image/jpeg";
  return new File([blob], filename, { type });
}

export async function toBenchmarkImage(file: File): Promise<BenchmarkImage> {
  const compressed = await compressImageLikeExpo(file);
  const preview = URL.createObjectURL(file);
  return {
    file,
    base64: compressed.base64,
    mimeType: compressed.mimeType,
    preview,
    originalSizeKB: compressed.originalSizeKB,
    compressedSizeKB: compressed.sizeKB,
    width: compressed.width,
    height: compressed.height,
  };
}
