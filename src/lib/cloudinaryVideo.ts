const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn9snfizy";

/**
 * Convert a local video path to a Cloudinary video URL with optimized delivery.
 */
export function getCloudinaryVideoUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  const publicId = src.startsWith("/") ? src.slice(1) : src;
  const id = publicId.replace(/\.[^.]+$/, "");

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto/${id}.mp4`;
}

/**
 * Get a poster/thumbnail image from a Cloudinary video (extracts first frame).
 */
export function getCloudinaryVideoPoster(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    // Extract public ID from full Cloudinary URL
    const match = src.match(/\/video\/upload\/[^/]+\/(.+)\.mp4/);
    if (match) {
      return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,f_auto,q_auto,w_600/${match[1]}.jpg`;
    }
    return "";
  }

  const publicId = src.startsWith("/") ? src.slice(1) : src;
  const id = publicId.replace(/\.[^.]+$/, "");

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,f_auto,q_auto,w_600/${id}.jpg`;
}
