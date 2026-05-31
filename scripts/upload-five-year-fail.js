const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: 'dn9snfizy',
    api_key: '644429988616382',
    api_secret: 'd11XIyI5e12AJ--FnAeQRPh6j68'
});

const root = path.join(__dirname, '..', 'public', 'blog');

const images = [
    { path: path.join(root, 'five_year_fail_hero.jpg'), public_id: 'blog/five_year_fail_hero' },
    { path: path.join(root, 'five_year_fail_inventory.jpg'), public_id: 'blog/five_year_fail_inventory' },
    { path: path.join(root, 'five_year_fail_samples.jpg'), public_id: 'blog/five_year_fail_samples' },
    { path: path.join(root, 'five_year_fail_fabric.jpg'), public_id: 'blog/five_year_fail_fabric' },
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
