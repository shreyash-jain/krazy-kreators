// Phase 2 regeneration: upload the 8 newly-generated Met Gala + Rhode images
// to dprx4pret. Credentials read from environment per the team convention
// established in scripts/upload-plus-one-sourcing.js.
//
// Usage:
//   CLOUDINARY_CLOUD_NAME=dprx4pret CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
//     node scripts/upload-met-gala-rhode-regen.js

const cloudinary = require('cloudinary').v2;
const path = require('path');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dprx4pret';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET environment variables.');
    process.exit(1);
}

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

const root = path.join(__dirname, '..', 'public', 'blog');

const images = [
    // Met Gala
    { file: 'met_gala_real_hero.jpg', public_id: 'blog/met_gala_real_hero' },
    { file: 'met_gala_real_hours.jpg', public_id: 'blog/met_gala_real_hours' },
    { file: 'met_gala_real_techniques.jpg', public_id: 'blog/met_gala_real_techniques' },
    { file: 'met_gala_real_moves.jpg', public_id: 'blog/met_gala_real_moves' },
    // Rhode
    { file: 'rhode_lesson_hero.jpg', public_id: 'blog/rhode_lesson_hero' },
    { file: 'rhode_lesson_sku_discipline.jpg', public_id: 'blog/rhode_lesson_sku_discipline' },
    { file: 'rhode_lesson_authenticity.jpg', public_id: 'blog/rhode_lesson_authenticity' },
    { file: 'rhode_lesson_repeatability.jpg', public_id: 'blog/rhode_lesson_repeatability' },
];

(async () => {
    for (const img of images) {
        try {
            const res = await cloudinary.uploader.upload(path.join(root, img.file), {
                public_id: img.public_id,
                overwrite: true,
                invalidate: true,
                resource_type: 'image',
            });
            console.log(`UPLOAD_SUCCESS|${img.public_id}|v${res.version}`);
        } catch (e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|${e.message}`);
            process.exit(1);
        }
    }
})();
