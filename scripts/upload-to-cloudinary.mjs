/**
 * Bulk upload all public/ assets to Cloudinary.
 *
 * Usage:
 *   1. Install cloudinary SDK:  npm install cloudinary --save-dev
 *   2. Set environment variables:
 *        export CLOUDINARY_CLOUD_NAME=dwtmtd0oz
 *        export CLOUDINARY_API_KEY=your_api_key
 *        export CLOUDINARY_API_SECRET=your_api_secret
 *   3. Run:  node scripts/upload-to-cloudinary.mjs
 *
 * This uploads every file in public/ to Cloudinary preserving the folder structure.
 * For example, public/brands/drover-coverimage.jpg → brands/drover-coverimage
 *
 * Files that already exist on Cloudinary (same public_id) are skipped.
 */

import { v2 as cloudinary } from "cloudinary";
import { readdir, stat } from "fs/promises";
import { join, relative, extname } from "path";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dwtmtd0oz";
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error("Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET environment variables.");
  console.error("Set them before running this script:");
  console.error("  export CLOUDINARY_API_KEY=your_key");
  console.error("  export CLOUDINARY_API_SECRET=your_secret");
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const PUBLIC_DIR = join(process.cwd(), "public");

// Extensions to skip (not useful on CDN)
const SKIP_EXTENSIONS = new Set([".ico", ".xml", ".txt", ".json", ".webmanifest"]);

// Extensions that are videos
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".avi"]);

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function uploadFile(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath);
  const ext = extname(filePath).toLowerCase();

  if (SKIP_EXTENSIONS.has(ext)) {
    return { status: "skipped", path: relativePath, reason: "excluded extension" };
  }

  // Remove extension for public_id (Cloudinary convention)
  const publicId = relativePath.replace(/\\/g, "/").replace(/\.[^.]+$/, "");

  const resourceType = VIDEO_EXTENSIONS.has(ext) ? "video" : "image";

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,       // Don't re-upload existing files
      invalidate: false,
      use_filename: true,
      unique_filename: false,
    });

    return { status: "uploaded", path: relativePath, url: result.secure_url, size: result.bytes };
  } catch (err) {
    if (err.http_code === 409 || (err.message && err.message.includes("already exists"))) {
      return { status: "exists", path: relativePath };
    }
    return { status: "error", path: relativePath, error: err.message };
  }
}

async function main() {
  console.log(`\nUploading public/ assets to Cloudinary (${CLOUD_NAME})...\n`);

  const files = await getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} files in public/\n`);

  let uploaded = 0, skipped = 0, errors = 0, exists = 0;

  // Process in batches of 5 to avoid rate limits
  const BATCH_SIZE = 5;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(uploadFile));

    for (const r of results) {
      switch (r.status) {
        case "uploaded":
          uploaded++;
          console.log(`  ✓ ${r.path} (${(r.size / 1024).toFixed(0)} KB)`);
          break;
        case "exists":
          exists++;
          break;
        case "skipped":
          skipped++;
          break;
        case "error":
          errors++;
          console.error(`  ✗ ${r.path}: ${r.error}`);
          break;
      }
    }

    // Progress update every 20 files
    if ((i + BATCH_SIZE) % 20 === 0) {
      console.log(`  ... ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} processed`);
    }
  }

  console.log(`\nDone!`);
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  Already exists: ${exists}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(console.error);
