import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadProductImage(
  file: string,
  folder = "lc-suplements/products"
) {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteProductImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
