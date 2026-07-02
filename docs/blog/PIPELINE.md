# Krazy Kreators Blog — Pipeline (build & ship runbook)

How a blog goes from topic to live, in this repo. [MASTER_PROMPT.md](./MASTER_PROMPT.md) covers *what to write*; this covers *how to build, verify, and ship it* — plus the architecture and the traps. Run top to bottom. **Do one blog at a time** (concurrent blog branches cause id collisions and the merge-drop hazard below).

---

## The phases

### Phase 0 — Standards
The content is governed by [MASTER_PROMPT.md](./MASTER_PROMPT.md). Everything below is mechanics.

### Phase 1 — Topic & research
- Get the topic (a packet, or topic + category/desk).
- **Verify every fact on the live web before writing** — accuracy is the gate. Correct or reframe anything that doesn't hold up (packets have shipped wrong numbers; e.g. a tariff spread and a de-minimis timeline both needed correcting).

### Phase 2 — Branch
```bash
git fetch origin
git checkout main && git merge --ff-only origin/main      # get current
git checkout -b blog/<slug>
```
- If the fast-forward aborts on `public/hero-video.mp4` ("should have been a pointer") — that's the **Git-LFS snag**; run `git checkout origin/main -- public/hero-video.mp4` then retry the merge.
- **Pick the `id`** = (max existing id in `blogPosts.ts`) + 1, **skipping any id already used by an unmerged blog branch** (that's why we've had 48/49/50 on separate branches — reusing one collides at merge).

### Phase 3 — Scaffold
Create the two files (copy an existing post as the template — see architecture below):
- `src/app/blogs/<slug>/page.tsx` — server component: `metadata`, `export const dynamic = "force-dynamic"`, `export const runtime = "edge"`, `<BlogViewTracker slug/>`, and `Promise.all([getBlogLikeCount(slug,{baseUrl}), getComments(slug,{baseUrl})])`.
- `src/app/blogs/<slug>/<Name>Client.tsx` — the full layout-grammar client (hero, TL;DR, TOC rail, sections, mid CTA, end CTA pair, read-next, comments, sticky mobile CTA). **Byline = "Krazy Kreators Team"**.
- Add the entry at the **top** of `src/data/blogPosts.ts` (schema below).
- Wire image slots to **local `/blog/<name>` paths**; add inline source links + 2–3 internal links to existing posts (verify those slugs exist).

### Phase 4 — Images (the #1 source of friction — follow exactly)
- **The assistant cannot save a chat-pasted image to disk.** Images must exist as *files* in `public/blog/`. The owner saves/downloads them there (drag into the folder in VS Code, or save-as from the source). If they're saved anywhere with any name, the assistant can `cp`/rename them into place.
- **Naming convention:** `<slug>-hero`, `<slug>-section1`, `<slug>-teaching`, `<slug>-macro`, `<slug>-closing` (`.jpg`/`.webp`/`.png` all work — the loader passes local paths straight to Next).
- Generate the non-photo images from the MASTER_PROMPT image prompts (no faces, KK watermark). Supplied press/product photos are the owner's licensing call.
- **Verify each image:** open it (don't trust the filename), confirm no two slots are the *same file* (byte-dupes have shipped by accident), and confirm any teaching-graphic's numbers match the article body.

### Phase 5 — Verify gate (do all of these; don't hand off without them)
```bash
# count invariant — must be equal (merge-drop guard)
grep -cE '^\s*slug:' src/data/blogPosts.ts
find src/app/blogs -mindepth 1 -maxdepth 1 -type d ! -name '[slug]' | wc -l

npx tsc --noEmit          # note: next.config ignores TS/ESLint at build, so check here
npx eslint src/app/blogs/<slug>/*.tsx
rm -rf .next && npm run build   # THE gate — exit 0 AND route shows as: ƒ /blogs/<slug>
```
- `npm run build` is the build the deploy runs. `next dev` passing is **not** the same thing. Stop any `next dev` first (it shares `.next`).
- Local preview: page returns 200 and **every image returns 200**. If a reused filename shows a stale image, `rm -rf .next/cache/images` and hard-refresh (Ctrl+Shift+R); confirm with `curl <img> | wc -c` == disk bytes.

### Phase 6 — Commit / push / PR
- Commit **scoped to this blog's files only** — leave unrelated working-tree files (`.claude/`, `.github/`, other people's WIP) alone.
- Push the branch; open a PR; the provider preview build runs on the PR.

### Phase 7 — Merge = publish
- `main` is production. Merge only after the build is green and image **licensing** is cleared. After merging, re-run the Phase-5 count invariant on `main`.

---

## Architecture (what you're editing)

**Per-post pattern** — every post is a folder under `src/app/blogs/<slug>/` with:
- `page.tsx` (~30 lines, near-identical boilerplate): server metadata + edge runtime + fetch likes/comments + render the client.
- `<Name>Client.tsx` (600–1074 lines): `"use client"` component holding all the UI.

**`BlogPostMeta`** (in `src/data/blogPosts.ts`) — one entry per post, newest at index 0:
```ts
{ id: string|number; title; excerpt; category; author; date; readTime;
  image; card_image?; slug; readers; likes }
```
`image` and `card_image` accept local `/blog/...` or full Cloudinary URLs. `export const BLOG_SLUGS = blogPosts.map(p => p.slug)` lives at the bottom.

**Shared libs/components (already built — reuse, don't recreate):**
- `src/lib/blogApi.ts` — `getBlogLikeCount`, `getComments`, `likeBlog`, `addComment`, `likeComment`, `recordBlogView`, type `PublicComment`.
- `src/lib/blogLikeSync.ts` / `blogViewSync.ts` — sessionStorage sync helpers.
- `src/lib/cloudinaryLoader.ts` — Next image loader: **local `/…` paths pass straight through** (served from `public/`), external URLs untouched, bare public-ids get Cloudinary transforms. This is why local `/blog/...` images "just work."
- `src/components/` — `Navbar`, `Footer`, `ContactDialog`, `Toast` (`useToast`), `BlogViewTracker`.
- `next.config.ts` — `loaderFile` = the cloudinary loader; `remotePatterns` allows `res.cloudinary.com`; `@/` → `src/`.

**Routing:** dedicated per-post folders are the norm; `src/app/blogs/[slug]/` is a Supabase/static fallback. **Nothing else needs updating** when you add a post — `sitemap.ts` is a static manual list that does not enumerate blogs (don't add blogs there unless the convention changes).

---

## Operational guards (each has bitten us — check every time)

- **postcss malware.** `postcss.config.mjs` is a recurring obfuscated-payload target. **Clean = ~81 bytes / 5 lines.** Infected = a huge single line (~20 KB) containing `createRequire` and `_0x…` hex vars. It executes on every build (can read env secrets). **Scan before every push:** `awk '{print length}' postcss.config.mjs | sort -n | tail -1` (expect ≤ ~40). If infected: restore the clean 5-line file, and **rotate all secrets** (Supabase service-role + anon + URL, Cloudinary key/secret, Google Analytics key/email, Resend token, admin user/pass), then find the source dev machine.
- **Cloudinary.** Active cloud = **`dprx4pret`**. URL pattern `https://res.cloudinary.com/dprx4pret/image/upload/v<version>/blog/<id>.jpg`. **Never** reuse the disabled `dn9snfizy`. Most posts now just use local `/blog/...` files, which is simpler and avoids this entirely.
- **Merge-drop hazard.** Every post inserts at the top of the `blogPosts` array, so two branches merging can silently keep one entry and drop the other. The dropped post's page/route still work, so it "exists" but never appears in the `/blogs` listing. **After any merge, entry count must equal page-dir count** (Phase 5). If a post "isn't showing," check `blogPosts.ts` before suspecting the build.
- **Git-LFS `hero-video.mp4`** — see Phase 2.
- **Deploy.** Happens via the provider dashboard (Vercel/Cloudflare) on push; `main` = production. The `gh` and `vercel` CLIs are typically **not authenticated** in this environment, so read build logs from the dashboard, and don't assume you can trigger/inspect deploys from the shell.

---

## Known tech debt + target architecture (recommended next build — NOT yet done)

Every post client is ~55–65% **duplicated chrome** — the state hooks, like/share/comment handlers, comment form + list, TOC-pinning logic, CTA blocks and sticky bar are copy-pasted into all 40+ posts (~15,000–20,000 duplicated lines). The tell: changing the byline once required editing 6 files.

**Target:** a single shared **`<BlogArticle>`** layout component that owns all the chrome and handlers, with each post supplying **content as data** — metadata + `sections[]` (`{id, label, heading, content}`) + image slots + CTA/related-cards as props — plus a `scripts/new-blog.mjs` scaffold that stamps `page.tsx` + client + `blogPosts.ts` entry + image-slot stubs. Known obstacles: TOC ids are tied to section anchors, images are module-level consts, and the JS-pinned rail needs the sections rendered upfront — all solvable by passing a `sections` array.

Until that lands: **one blog at a time**, and accept that layout/byline changes touch every file. This refactor is scoped and awaiting greenlight; do not start it mid-blog.

---

## Worked example (compressed)

Shipping `july-24-tariff-cliff-recost-fall-2026` (a real post):
1. Topic packet → **verified** the Section 122 / tariff numbers on the web and corrected the packet's country-rate spread.
2. `git checkout -b blog/july-24-tariff-cliff-recost-fall-2026`; id = 48.
3. Scaffolded `page.tsx` + `TariffCliffClient.tsx` (copied from a recent post), added the `blogPosts.ts` entry, wired 4 image slots to `/blog/tariff_cliff_*`.
4. Wrote 4 image prompts; the owner generated them into `public/blog/`; the teaching decision-tree first shipped with **wrong numbers**, was regenerated to match the body, and the byte-dupe hero/closing was caught and fixed.
5. Verify gate: 50 == 50, `tsc`/`eslint` clean, `npm run build` exit 0 with `ƒ /blogs/july-24-tariff-cliff-recost-fall-2026`.
6. Committed scoped, pushed, PR — later merged to `main`.

*Last reviewed: 2026-07-01.*
