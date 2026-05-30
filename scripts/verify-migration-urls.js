// Quick HEAD-check on every migrated URL to confirm dprx4pret is delivering.
const fs = require('fs');
const path = require('path');

const map = JSON.parse(fs.readFileSync(path.join(__dirname, '.migration-url-map.json'), 'utf8'));

const urls = Object.entries(map).flatMap(([publicId, info]) => {
    const base = `https://res.cloudinary.com/dprx4pret/image/upload/v${info.version}/${publicId}`;
    return [`${base}.jpg`, `${base}.png`];
});

(async () => {
    const results = await Promise.all(urls.map(async u => {
        try {
            const r = await fetch(u, { method: 'HEAD' });
            return { u, ok: r.ok, status: r.status };
        } catch (e) {
            return { u, ok: false, status: 0, error: e.message };
        }
    }));
    let pass = 0, fail = 0;
    for (const r of results) {
        if (r.ok) pass++;
        else { fail++; console.log(`FAIL: ${r.status} ${r.u}`); }
    }
    console.log(`\nTotal: ${results.length} | Pass: ${pass} | Fail: ${fail}`);
    process.exit(fail > 0 ? 1 : 0);
})();
