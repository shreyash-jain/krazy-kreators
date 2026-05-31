// Re-host Real Cost / Wrong Manufacturer blog images on dprx4pret
// (keeps Real Cost on dn9snfizy policy intact only if dn9snfizy is alive —
// since the user has chosen substitution + dprx4pret for all currently-broken
// hardcoded URLs, this maps the 4 PNGs to the new cloud).

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
    { path: path.join(root, 'defective_bulk.png'), public_id: 'blog/defective_bulk' },
    { path: path.join(root, 'wrong_samples.png'), public_id: 'blog/wrong_samples' },
    { path: path.join(root, 'no_one_to_call.png'), public_id: 'blog/no_one_to_call' },
    { path: path.join(root, 'krazy_solution.png'), public_id: 'blog/krazy_solution' },
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
            console.log(`UPLOAD_SUCCESS|${img.public_id}|v${res.version}`);
        } catch (e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|${e.message}`);
            process.exit(1);
        }
    }
})();
