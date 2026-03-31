const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn9snfizy";

/**
 * Convert a local image path to a Cloudinary URL.
 * Use this for non-Image component references (CSS backgrounds, og:image, etc.)
 */
export function getCloudinaryImageUrl(src: string, width = 1920, quality = "auto"): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  const publicId = src.startsWith("/") ? src.slice(1) : src;

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_${quality},w_${width}/${publicId}`;
}
