/**
 * Upload the four real Met Gala 2026 photos to Cloudinary.
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=dn9snfizy \
 *   CLOUDINARY_API_KEY=... \
 *   CLOUDINARY_API_SECRET=... \
 *   node scripts/upload-met-gala-real.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import { join } from "path";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dn9snfizy";
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
    console.error("Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.");
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const PUBLIC_DIR = join(process.cwd(), "public");

const images = [
    { file: "blog/met_gala_real_hero.jpg", publicId: "blog/met_gala_real_hero" },
    { file: "blog/met_gala_real_hours.jpg", publicId: "blog/met_gala_real_hours" },
    { file: "blog/met_gala_real_techniques.jpg", publicId: "blog/met_gala_real_techniques" },
    { file: "blog/met_gala_real_moves.jpg", publicId: "blog/met_gala_real_moves" },
];

async function uploadOne({ file, publicId }) {
    const absPath = join(PUBLIC_DIR, file);
    try {
        const result = await cloudinary.uploader.upload(absPath, {
            public_id: publicId,
            resource_type: "image",
            overwrite: true,
            invalidate: true,
            use_filename: false,
            unique_filename: false,
        });
        return { ok: true, publicId, url: result.secure_url, bytes: result.bytes };
    } catch (err) {
        return { ok: false, publicId, error: err.message || String(err) };
    }
}

async function main() {
    console.log(`Uploading real Met Gala 2026 photos to Cloudinary (${CLOUD_NAME})...\n`);
    for (const img of images) {
        const r = await uploadOne(img);
        if (r.ok) {
            console.log(`OK  ${r.publicId}  ${(r.bytes / 1024).toFixed(0)} KB`);
            console.log(`    ${r.url}`);
        } else {
            console.error(`ERR ${r.publicId}: ${r.error}`);
            process.exitCode = 1;
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
