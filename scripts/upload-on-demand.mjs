/**
 * Upload the four On-Demand Manufacturing blog images to Cloudinary.
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=dn9snfizy \
 *   CLOUDINARY_API_KEY=... \
 *   CLOUDINARY_API_SECRET=... \
 *   node scripts/upload-on-demand.mjs
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
    { file: "blog/on_demand_hero.png", publicId: "blog/on_demand_hero" },
    { file: "blog/on_demand_unsold_inventory.png", publicId: "blog/on_demand_unsold_inventory" },
    { file: "blog/on_demand_production_flow.png", publicId: "blog/on_demand_production_flow" },
    { file: "blog/on_demand_zero_moq.png", publicId: "blog/on_demand_zero_moq" },
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
    console.log(`Uploading On-Demand images to Cloudinary (${CLOUD_NAME})...\n`);
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
