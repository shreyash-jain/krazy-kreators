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
    { path: path.join(root, 'plus_one_sourcing_hero.jpg'), public_id: 'blog/plus_one_sourcing_hero' },
    { path: path.join(root, 'plus_one_sourcing_categories.jpg'), public_id: 'blog/plus_one_sourcing_categories' },
    { path: path.join(root, 'plus_one_sourcing_india.jpg'), public_id: 'blog/plus_one_sourcing_india' },
    { path: path.join(root, 'plus_one_sourcing_playbook.jpg'), public_id: 'blog/plus_one_sourcing_playbook' },
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
