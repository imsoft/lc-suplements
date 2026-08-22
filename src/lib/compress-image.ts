/**
 * Reescala y recomprime una imagen en el navegador antes de enviarla.
 *
 * Una foto de celular pesa 3–8 MB, y el cuerpo de una Server Action está
 * limitado (~4.5 MB en Vercel sin importar `bodySizeLimit`). Al subir varias
 * fotos de golpe la petición se rechazaba y el panel mostraba la pantalla de
 * error genérica. Aquí se reducen a un tamaño más que suficiente para la
 * ficha de producto (~1600 px), quedando en unos cientos de KB.
 */

const MAX_DIMENSION = 1600;
const QUALITY = 0.85;

export async function compressImage(file: File): Promise<File> {
  // Los formatos que el canvas no reproduce bien (SVG, GIF animado) se dejan igual.
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

    // Si ya es pequeña y ligera, no vale la pena recomprimirla.
    if (scale === 1 && file.size <= 600 * 1024) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    // Si algo falla se usa el archivo original: la validación del servidor
    // seguirá protegiendo el tamaño máximo.
    return file;
  }
}
