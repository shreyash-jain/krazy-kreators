const cloudinary = require('cloudinary').v2;
const path = require('path');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dprx4pret';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET environment variables.');
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const root = path.join(__dirname, '..', 'public', 'blog');

const images = [
    { path: path.join(root, 'fathers_day_2026_hero.jpg'), public_id: 'blog/fathers_day_2026_hero' },
    { path: path.join(root, 'fathers_day_2026_piece.jpg'), public_id: 'blog/fathers_day_2026_piece' },
    { path: path.join(root, 'fathers_day_2026_growth.jpg'), public_id: 'blog/fathers_day_2026_growth' },
    { path: path.join(root, 'fathers_day_2026_atelier.jpg'), public_id: 'blog/fathers_day_2026_atelier' },
    { path: path.join(root, 'fathers_day_2026_comparison.jpg'), public_id: 'blog/fathers_day_2026_comparison' },
];

(async () => {
    for (const img of images) {
        try {
            const res = await cloudinary.uploader.upload(img.path, {
                public_id: img.public_id,
                overwrite: true,
                invalidate: true,
                resource_type: 'image',
            });
            console.log(`UPLOAD_SUCCESS|${img.public_id}|${res.secure_url}`);
        } catch (e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|${e.message}`);
            process.exit(1);
        }
    }
})();
