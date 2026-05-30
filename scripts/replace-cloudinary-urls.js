// Phase 1 migration step 2: replace every dn9snfizy URL across the codebase
// with the corresponding dprx4pret URL from .migration-url-map.json.
//
// Only the 20 recoverable images are migrated. URLs for images we cannot recover
// (Met Gala 4, Rhode 4, On-Demand 4, EU DPP 4, Freelance 4) are left alone —
// they will be addressed in Phase 2 with regeneration + a separate replacement pass.

const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const map = JSON.parse(fs.readFileSync(path.join(__dirname, '.migration-url-map.json'), 'utf8'));

// Files known to contain dn9snfizy URLs.
const FILES = [
    'src/data/blogPosts.ts',
    'src/app/blogs/the-real-cost-of-wrong-clothing-manufacturer/RealCostClient.tsx',
    'src/app/blogs/made-in-india-american-luxury-2026/MadeInIndiaClient.tsx',
    'src/app/blogs/quiet-luxury-dead-whats-next-us-brands-2026/QuietLuxuryClient.tsx',
    'src/app/blogs/donda-core-resurgence-us-founders-2026/DondaCoreClient.tsx',
];

// For each migrated public_id, build a regex that matches every variant of the dn9snfizy URL
// (with or without version, with .jpg or .png extension) and replace with the canonical
// dprx4pret URL containing the new version number.
function buildReplacements() {
    const replacements = [];
    for (const [publicId, info] of Object.entries(map)) {
        // publicId is like "blog/donda_core_hero" — strip "blog/" prefix for the base name.
        const baseName = publicId.replace(/^blog\//, '');
        // Match: https://res.cloudinary.com/dn9snfizy/image/upload/[optional v...]/blog/<baseName>.<ext>
        const oldPattern = new RegExp(
            `https://res\\.cloudinary\\.com/dn9snfizy/image/upload(?:/v\\d+)?/blog/${baseName}\\.(jpg|png|webp)`,
            'g'
        );
        replacements.push({
            publicId,
            regex: oldPattern,
            replacement: (match, ext) =>
                `https://res.cloudinary.com/dprx4pret/image/upload/v${info.version}/blog/${baseName}.${ext}`,
        });
    }
    return replacements;
}

function processFile(relPath, replacements) {
    const fullPath = path.join(REPO, relPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`SKIP_MISSING|${relPath}`);
        return;
    }
    const before = fs.readFileSync(fullPath, 'utf8');
    let after = before;
    let totalReplacements = 0;
    for (const r of replacements) {
        const matches = after.match(r.regex);
        if (matches) {
            totalReplacements += matches.length;
            after = after.replace(r.regex, r.replacement);
        }
    }
    if (after !== before) {
        fs.writeFileSync(fullPath, after);
        console.log(`UPDATED|${relPath}|${totalReplacements} URLs replaced`);
    } else {
        console.log(`UNCHANGED|${relPath}`);
    }
}

const replacements = buildReplacements();
console.log(`Built ${replacements.length} URL replacement rules.\n`);

for (const f of FILES) {
    processFile(f, replacements);
}

console.log('\nNote: dn9snfizy URLs for Met Gala, Rhode, On-Demand, EU DPP, and Freelance Designer blogs left untouched (Phase 2 regeneration scope).');
