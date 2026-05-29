// Phase 1 migration: upload all 20 recoverable images from public/blog/ to dprx4pret
// using the same blog/<public_id> structure. Captures new versioned URLs and writes
// a mapping to scripts/.migration-url-map.json for downstream URL replacement.

const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dprx4pret',
    api_key: '621363843253194',
    api_secret: 'rExED-_UaoIRUOfkRbZUEF_APu8',
});

const root = path.join(__dirname, '..', 'public', 'blog');

// 20 files to migrate. Each maps to a public_id matching its bare filename (without extension).
const images = [
    // Real Cost / Wrong Manufacturer (id 30)
    { file: 'defective_bulk.png', public_id: 'blog/defective_bulk' },
    { file: 'wrong_samples.png', public_id: 'blog/wrong_samples' },
    { file: 'no_one_to_call.png', public_id: 'blog/no_one_to_call' },
    { file: 'krazy_solution.png', public_id: 'blog/krazy_solution' },

    // Made-in-India (id 36)
    { file: 'made_in_india_hero.jpg', public_id: 'blog/made_in_india_hero' },
    { file: 'made_in_india_capabilities.jpg', public_id: 'blog/made_in_india_capabilities' },
    { file: 'made_in_india_positioning.jpg', public_id: 'blog/made_in_india_positioning' },
    { file: 'made_in_india_window.jpg', public_id: 'blog/made_in_india_window' },

    // Quiet Luxury (id 37)
    { file: 'quiet_luxury_hero.jpg', public_id: 'blog/quiet_luxury_hero' },
    { file: 'quiet_luxury_commodified.jpg', public_id: 'blog/quiet_luxury_commodified' },
    { file: 'quiet_luxury_next.jpg', public_id: 'blog/quiet_luxury_next' },
    { file: 'quiet_luxury_perspective.jpg', public_id: 'blog/quiet_luxury_perspective' },

    // DONDA-Core (id 38)
    { file: 'donda_core_hero.jpg', public_id: 'blog/donda_core_hero' },
    { file: 'donda_core_scarcity.jpg', public_id: 'blog/donda_core_scarcity' },
    { file: 'donda_core_artifact.jpg', public_id: 'blog/donda_core_artifact' },
    { file: 'donda_core_batch.jpg', public_id: 'blog/donda_core_batch' },

    // Five-Year-Fail (id 39 — unmerged branch)
    { file: 'five_year_fail_hero.jpg', public_id: 'blog/five_year_fail_hero' },
    { file: 'five_year_fail_inventory.jpg', public_id: 'blog/five_year_fail_inventory' },
    { file: 'five_year_fail_samples.jpg', public_id: 'blog/five_year_fail_samples' },
    { file: 'five_year_fail_fabric.jpg', public_id: 'blog/five_year_fail_fabric' },
];

(async () => {
    const map = {};
    for (const img of images) {
        const fullPath = path.join(root, img.file);
        if (!fs.existsSync(fullPath)) {
            console.error(`SKIP_MISSING|${img.file}`);
            continue;
        }
        try {
            const res = await cloudinary.uploader.upload(fullPath, {
                public_id: img.public_id,
                overwrite: true,
                invalidate: true,
                resource_type: 'image',
            });
            console.log(`UPLOAD_SUCCESS|${img.public_id}|v${res.version}|${res.secure_url}`);
            map[img.public_id] = { version: res.version, url: res.secure_url };
        } catch (e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|${e.message}`);
        }
    }
    const outPath = path.join(__dirname, '.migration-url-map.json');
    fs.writeFileSync(outPath, JSON.stringify(map, null, 2));
    console.log(`\nWrote URL map: ${outPath}`);
})();
