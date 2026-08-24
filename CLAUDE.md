# Krazy Kreators — session context

Next.js App Router marketing site + blog for **Krazy Kreators**, an end-to-end
brand-building partner for US clothing founders.

## Deployment: Cloudflare only

**We deploy to Cloudflare. Nothing else.** `main` = production.

The **Vercel integration is no longer active**, but the Vercel GitHub app was
never disconnected — so it still posts a `Vercel` status check on every PR, and
**that check always fails**.

- **Ignore it.** A failing `Vercel` check is expected noise, never a merge blocker.
- It says nothing about your branch. A branch whose `npm run build` passes
  cleanly will still show `Vercel — fail`. (`Vercel Preview Comments` passes;
  only the deploy check fails.)
- **Do not** run `npx vercel inspect --logs` to chase it — it hangs for minutes
  and needs auth we don't have.
- The real gates are the local production **`npm run build`** and the Cloudflare
  build.

**Cloudflare build guard:** the repo-root **`.npmrc`** (`legacy-peer-deps=true`)
must stay on `main`. Without it Cloudflare fails with `ERESOLVE` (wrangler wants
`workers-types@^5`, next-on-pages wants `^4`). `next build` passes locally
either way, so its absence hides until deploy. **Never delete `.npmrc`.**

## Before you push, every time

1. **Run the production `npm run build`** — not just `next dev`, `tsc`, or eslint.
   It's the build the deploy actually runs.
2. **Check `postcss.config.mjs` is clean.** It is a recurring malware-injection
   target. The whole legitimate file is 5 lines; anything longer, obfuscated, or
   containing `eval`/`atob`/`_0x…` is a payload. Check it on every branch and
   after every merge.
3. **Check `git status` for stray root-level `upload-*.js`.** These reappear
   carrying a plaintext Cloudinary secret for the disabled `dn9snfizy` cloud.
   Never run them; delete them. Posts reference local `/blog/...` paths.
4. **After any blog merge**, entry count in `src/data/blogPosts.ts` must equal
   the number of blog page directories (excluding `[slug]`). Concurrent blog
   branches all insert at the top of that array and a merge can silently
   collapse an object boundary, dropping a post from every listing surface while
   its page stays live.

## Git rules

- **Never push without being told to.** Stop at the local commit.
- **Never merge directly to `main`.** Always branch → PR → wait for explicit
  confirmation → merge. "Push to main" means "push the branch and open the PR."

## Blog work

**Read `docs/A_Blog_Structure/README.md` first** — it is the single source of truth
(README → CLIENT → BLOG_PLAYBOOK → ARCHITECTURE → STATUS). The day-to-day
workflow is the **`/blog`** command. Byline is always
**"Krazy Kreators Team"**. Every statistic needs an inline source link on first
mention; if you can't verify a number, reframe it qualitatively rather than
inventing one.

## Where things live

| Thing | Path |
|---|---|
| Blog listing metadata (one entry per post) | `src/data/blogPosts.ts` |
| A post's page + content | `src/app/blogs/<slug>/page.tsx` + `<Name>Client.tsx` |
| Blog images | `public/blog/` |
| Likes/comments/views API client | `src/lib/blogApi.ts` |
| Local-vs-Cloudinary image routing | `src/lib/cloudinaryLoader.ts` |
| Shared chrome | `src/components/` |
