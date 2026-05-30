type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn9snfizy";

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  // Skip external URLs (already on a CDN)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Skip SVGs and ICOs — Cloudinary doesn't optimize these well
  if (src.endsWith(".svg") || src.endsWith(".ico")) {
    return src;
  }

  // Bypass Cloudinary for local files in public/ — Next.js can optimize them
  // natively via /_next/image. This keeps local blog images working even when
  // the configured Cloudinary cloud is offline.
  if (src.startsWith("/")) {
    return src;
  }

  // Remove leading slash for Cloudinary public ID
  const publicId = src.startsWith("/") ? src.slice(1) : src;

  const transforms = [
    "f_auto",      // Auto format (AVIF/WebP based on browser)
    "q_auto",      // Auto quality (Cloudinary analyzes each image)
    `w_${width}`,  // Responsive width from Next.js
  ];

  if (quality) {
    // Override auto quality if Next.js passes a specific quality
    transforms[1] = `q_${quality}`;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`;
}
