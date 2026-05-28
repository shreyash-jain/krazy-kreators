const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: 'dprx4pret',
    api_key: '621363843253194',
    api_secret: 'rExED-_UaoIRUOfkRbZUEF_APu8'
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
