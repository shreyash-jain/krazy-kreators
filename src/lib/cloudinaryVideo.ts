const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn9snfizy";

/**
 * Convert a local video path to a Cloudinary video URL with optimized delivery.
 */
export function getCloudinaryVideoUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Bypass Cloudinary for local videos in public/ — browser plays the .mp4 directly.
  // Keeps testimonial/hero videos working even when the Cloudinary cloud is offline.
  if (src.startsWith("/")) {
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

  // Local videos in public/ don't have a separately-stored poster image.
  // ClientTestimonials sets video.currentTime = 0.1 to render the first frame
  // as the thumbnail, so returning an empty poster URL is fine and avoids a
  // 401 from the dead Cloudinary cloud.
  if (src.startsWith("/")) {
    return "";
  }

  const publicId = src.startsWith("/") ? src.slice(1) : src;
  const id = publicId.replace(/\.[^.]+$/, "");

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,f_auto,q_auto,w_600/${id}.jpg`;
}
