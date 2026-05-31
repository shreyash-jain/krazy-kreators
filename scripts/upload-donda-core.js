const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: 'dn9snfizy',
    api_key: '644429988616382',
    api_secret: 'd11XIyI5e12AJ--FnAeQRPh6j68'
});

const root = path.join(__dirname, '..', 'public', 'blog');

const images = [
    { path: path.join(root, 'donda_core_hero.jpg'), public_id: 'blog/donda_core_hero' },
    { path: path.join(root, 'donda_core_scarcity.jpg'), public_id: 'blog/donda_core_scarcity' },
    { path: path.join(root, 'donda_core_artifact.jpg'), public_id: 'blog/donda_core_artifact' },
    { path: path.join(root, 'donda_core_batch.jpg'), public_id: 'blog/donda_core_batch' },
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
