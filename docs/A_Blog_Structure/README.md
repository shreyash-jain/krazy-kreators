# START HERE — Krazy Kreators blog

**This folder is the single source of truth for blog work in this repo.** A new teammate
or a fresh AI session with zero chat history can ship a correct post using only these
files.

**Read in this order:**

1. **README.md** (this file) — what the client is, the rules you must not break
2. **[CLIENT.md](CLIENT.md)** — who they are, who reads them, the voice, and everything
   they have asked for or rejected
3. **[BLOG_PLAYBOOK.md](BLOG_PLAYBOOK.md)** — how to write and build a post *here*
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** — commands, image pipeline, traps, deploy
5. **[STATUS.md](STATUS.md)** — the living ledger: what's published, what's in flight

> **These files win.** When they disagree with an old memory, a stale README, a code
> comment, or chat history — believe these. If you find one wrong, fix it and update the
> date at the bottom; don't work around it.

The day-to-day workflow is the **`/blog`** command (`.claude/commands/blog.md`). It is
identical in every client repo; everything client-specific is here.

---

## 60-second context

**Krazy Kreators** is an end-to-end brand-building partner for **US clothing founders** —
design, sampling, premium fabric sourcing, retail-grade production and packaging under
one roof, one project manager. Manufacturing is India-based; the market is the US. They
are **a partner, not a vendor, factory, sourcing agent or discount manufacturer**, and
the writing must never make them sound like one.

Live site: **https://krazykreators.com** · blog at `/blogs`.

**The reader** is a US clothing-brand founder, 25–45 — a time-poor decision-maker who has
already read the surface-level stuff and wants a frame, a number, or a move they can make
on Monday morning.

**The blog** is a Bloomberg-style trade dispatch: genuinely useful, well-sourced industry
analysis that earns trust and, only at the very end, routes the reader toward talking to
Krazy Kreators.

## Stack in one line

Next.js 15.4 (App Router) · React · TypeScript · Tailwind · each post is a server
`page.tsx` + a client `*Client.tsx` · `runtime = "edge"` · likes/comments via Supabase API
routes · images served from `public/blog/` through a custom Cloudinary loader · deployed
to **Cloudflare** on push, `main` = production.

## The non-negotiables

1. **Byline is always "Krazy Kreators Team"** plus a desk label. Never a personal name
   unless explicitly told otherwise. *(This overrode an earlier persona system on
   2026-06-30.)*
2. **Every statistic gets an inline source link on first mention.** If you can't verify a
   number, reframe it qualitatively — never invent one.
3. **Krazy Kreators is named only at the close**, never mid-body. No pricing, MOQ or
   "free sampling" language anywhere in the editorial prose.
4. **Run the production `npm run build` before pushing** — not `next dev`, not `tsc`.
   It's the build the deploy actually runs.
5. **Check `postcss.config.mjs` before every push.** It is a recurring malware target.
   Clean = 5 lines / 81 bytes / longest line 36 chars. See ARCHITECTURE § Traps.
6. **`.npmrc` must stay at the repo root and on `main`.** Without it the Cloudflare build
   fails with `ERESOLVE` even though the local build is green.
7. **After any blog merge, the entry count in `src/data/blogPosts.ts` must equal the
   number of post folders.** A merge can silently drop one, leaving a post live but
   invisible in the listing.
8. **A failing `Vercel` check on a pull request is expected noise.** We deploy to
   Cloudflare only. Never block on it, never chase its logs.

## Where everything lives

| Thing | Path |
|---|---|
| Blog listing metadata (one entry per post) | `src/data/blogPosts.ts` |
| A post's page + content | `src/app/blogs/<slug>/page.tsx` + `<Name>Client.tsx` |
| Images | `public/blog/` |
| Likes/comments/views API client | `src/lib/blogApi.ts` |
| Local-vs-Cloudinary image routing | `src/lib/cloudinaryLoader.ts` |
| Shared chrome | `src/components/` |

*Last reviewed: 2026-08-21.*
