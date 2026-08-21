# ARCHITECTURE — Krazy Kreators

How the site is built, the exact commands, the image pipeline, and the traps that have
bitten us. Verified against the repo on 2026-08-21.

---

## Stack

Next.js **15.4.3** (App Router, Turbopack in dev) · React · TypeScript · Tailwind ·
Supabase-backed likes/comments through API routes · images from `public/blog/` via a
custom Cloudinary loader · deployed to **Cloudflare**, `main` = production.

## Commands

| What | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` |
| **The build that matters** | `npm run build` |
| Type check | `npx tsc --noEmit` |
| Lint | `npx eslint src/app/blogs/<slug>/*.tsx` |

`next.config.ts` **ignores TypeScript and ESLint errors at build time** — so a green
`npm run build` does not mean the types are clean. Run `tsc` separately.

## Per-post architecture

Every post is a folder under `src/app/blogs/<slug>/`:

- **`page.tsx`** (~30 lines, near-identical boilerplate) — server metadata, edge runtime,
  fetch likes/comments, render the client.
- **`<Name>Client.tsx`** (600–1,100 lines) — `"use client"` component holding all the UI.

**`src/data/blogPosts.ts`** — one `BlogPostMeta` entry per post, newest at index 0:

```ts
{ id: string|number; title; excerpt; category; author; date; readTime;
  image; card_image?; slug; readers; likes }
```

`image` / `card_image` accept local `/blog/...` paths or full Cloudinary URLs.
`export const BLOG_SLUGS = blogPosts.map(p => p.slug)` sits at the bottom.

**Shared libs and components — reuse, don't recreate:**

- `src/lib/blogApi.ts` — `getBlogLikeCount`, `getComments`, `likeBlog`, `addComment`,
  `likeComment`, `recordBlogView`, type `PublicComment`
- `src/lib/blogLikeSync.ts` / `blogViewSync.ts` — sessionStorage sync helpers
- `src/lib/cloudinaryLoader.ts` — the Next image loader. **Local `/…` paths pass straight
  through** (served from `public/`), external URLs are untouched, bare public-ids get
  Cloudinary transforms. This is why local `/blog/...` images just work.
- `src/components/` — `Navbar`, `Footer`, `ContactDialog`, `Toast` (`useToast`),
  `BlogViewTracker`

**Routing:** dedicated per-post folders are the norm; `src/app/blogs/[slug]/` is a
Supabase/static fallback. Nothing else needs updating when you add a post — `sitemap.ts`
is a static manual list that does not enumerate blogs.

---

## Images

### Where they go

`public/blog/`, named `<slug>-hero`, `<slug>-section1`, `<slug>-teaching`,
`<slug>-macro`, `<slug>-closing`. `.jpg`, `.webp` and `.png` all work. Referenced from
the post and from `blogPosts.ts` as `/blog/<name>.<ext>`.

Art direction, registers and the required teaching graphic:
[BLOG_PLAYBOOK.md § Images](BLOG_PLAYBOOK.md). Hard bans: [CLIENT.md](CLIENT.md).

### Generating them (OpenRouter)

**The key lives outside every repo**, at:

```
C:\Users\Admin\.blog-keys.env
```

`C:\Aadi` is itself a git repository, so nothing secret may live under it. Never copy the
key into a repo, never print it, never paste it into chat.

Write a **throwaway** script into the session scratchpad — never into this repo — with
this post's prompts. The API contract:

```js
// scratchpad/gen-images.mjs  —  node scratchpad/gen-images.mjs
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync("C:/Users/Admin/.blog-keys.env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

const jobs = [
  { file: "public/blog/<slug>-hero.png", prompt: "…40–70 words…" },
  // one entry per image slot
];

for (const { file, prompt } of jobs) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENROUTER_IMAGE_MODEL,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json).slice(0, 800));
  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) throw new Error("no image in response: " + JSON.stringify(json).slice(0, 800));
  writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
  console.log("wrote", file);
}
```

> **If the response shape differs from the above, fix it here.** This recipe is the
> repo's memory of the API — correcting it once saves every future session the
> rediscovery. Log the working shape and the date.

**Verified working 2026-08-21.** The recipe above ran unchanged against
`google/gemini-3-pro-image` (~25 s per image) and `google/gemini-3.1-flash-image`
(~18 s), both returning `choices[0].message.images[0].image_url.url` as a
`data:image/png;base64,...` URL. Output was 16:9 and honoured the "no people, no
text, no logos" constraints. **`qwen/qwen-image-3` does not exist on OpenRouter** —
there are no Qwen image models there, and it fails with `404 No endpoints found that
support the requested output modalities`. If a model id is ever rejected, list the
valid ones with `GET https://openrouter.ai/api/v1/models` and filter on
`architecture.output_modalities` containing `image`.

**Verify every generated image before showing it:** open it and look at it, confirm no
two slots are byte-identical (`md5sum public/blog/<slug>-*`), confirm the aspect ratio
suits the slot, and confirm any numbers inside a teaching graphic match the article body.

### Cloudinary (legacy)

Active cloud is **`dprx4pret`**; URLs look like
`https://res.cloudinary.com/dprx4pret/image/upload/v<version>/blog/<id>.jpg`. **Never**
use the disabled `dn9snfizy`. Most posts now use local `/blog/...` files, which is
simpler — prefer that.

---

## Traps (each of these has bitten us)

**`postcss.config.mjs` malware.** A recurring obfuscated build-time payload. **Clean = 5
lines, 81 bytes, longest line 36 chars.** Infected = a huge single line (~20 KB)
containing `createRequire` and `_0x…` hex vars, hidden behind hundreds of spaces so it
renders blank in editors and diffs. **Detect by line length, never by eye:**

```bash
awk '{print length}' postcss.config.mjs | sort -n | tail -1     # expect ≤ 40
```

It executes on every build and can read env secrets. If infected: restore the clean file,
then rotate **all** secrets (Supabase service-role + anon + URL, Cloudinary key/secret,
Google Analytics key/email, Resend token, admin user/pass) and find the source machine.
Full incident procedure: `.saral/docs/PLAYBOOK-force-push-worm-future-sessions.md` —
**that is a technical-owner job, not a blog-session job.**

**Cloudflare `ERESOLVE` / the `.npmrc` guard.** Cloudflare Pages builds with
`npx @cloudflare/next-on-pages@1`, which installs the latest `wrangler` (peer
`@cloudflare/workers-types@^5`) alongside `next-on-pages` (peer `^4`). Strict npm peer
resolution can't satisfy both and aborts with `npm error code ERESOLVE` — so the deploy
fails **even though `next build` is green locally**, because a local build never runs
`next-on-pages`. The fix is the repo-root **`.npmrc` → `legacy-peer-deps=true`**. It must
stay on `main`, because every blog branches off `main`. **Never delete it.** If a
Cloudflare build fails with `ERESOLVE … @cloudflare/workers-types`, the branch is simply
missing `.npmrc`.

**The Vercel check always fails.** The Vercel integration is no longer active but the
GitHub app was never disconnected, so it still posts a `Vercel` status check on every PR
and that check always fails. It says nothing about the branch. **Ignore it**; never block
a merge on it and never run `npx vercel inspect --logs` (it hangs for minutes and needs
auth we don't have). `Vercel Preview Comments` passing is also meaningless. The real
gates are the local `npm run build` and the Cloudflare build.

**Merge-drop hazard.** Every post inserts at the top of the `blogPosts` array, so two
branches merging can silently keep one entry and drop the other. The dropped post's page
still works, so it "exists" but never appears in `/blogs`. **After any merge, entry count
must equal post-folder count.** If a post "isn't showing", check `blogPosts.ts` before
suspecting the build.

**Stray `upload-*.js` at the repo root.** These reappear carrying a plaintext Cloudinary
secret for the disabled `dn9snfizy` cloud. **Never run them; delete them.** Check
`git status` before every blog commit.

**Git-LFS `hero-video.mp4`.** A `merge --ff-only` can abort with "should have been a
pointer". Fix: `git checkout origin/main -- public/hero-video.mp4`, then retry.

**CLI auth.** `gh` is authenticated on this machine (scopes: `gist`, `read:org`, `repo`).
The `vercel`/`wrangler` CLIs are not — read deploy logs from the dashboard.

---

## Known tech debt

Every post client is ~55–65% **duplicated chrome** — state hooks, like/share/comment
handlers, the comment form and list, TOC-pinning, CTA blocks and the sticky bar are
copy-pasted across 60+ posts (~15,000–20,000 duplicated lines). The tell: changing the
byline once required editing six files.

**Target:** a single shared `<BlogArticle>` layout owning the chrome and handlers, with
each post supplying content as data — metadata + `sections[]` (`{id, label, heading,
content}`) + image slots + CTA/related cards as props — plus a `scripts/new-blog.mjs`
scaffold. Obstacles: TOC ids tied to section anchors, images as module-level consts, and
the JS-pinned rail needing sections rendered upfront — all solvable by passing a
`sections` array.

Until that lands: **one blog at a time**, and accept that layout changes touch every
file. This refactor is scoped and awaiting greenlight — **do not start it mid-blog.**

*Last reviewed: 2026-08-21.*
