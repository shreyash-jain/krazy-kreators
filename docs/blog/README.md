# Krazy Kreators Blog — START HERE

**If you are a new teammate, or an AI session about to touch the KK blog: read this folder before you write or ship anything.** These files are the single source of truth. You do not need any prior chat history or tribal knowledge — everything is here.

Read in this order:
1. **[STATUS.md](./STATUS.md)** — *where the work stands right now*: which blogs are drafted/pushed/merged, what's blocked, what to do next. **Start here so you can continue the series.**
2. **[MASTER_PROMPT.md](./MASTER_PROMPT.md)** — how to *write* a KK blog (voice, rules, structure, images, exact output format). A paste-ready generation prompt.
3. **[PIPELINE.md](./PIPELINE.md)** — how to *build and ship* it (branch → scaffold → images → verify → PR → publish), the code architecture, and the traps that will bite you.

**Handoff rule:** before you step away, update **STATUS.md** (statuses, blockers, next actions) and push your branch. That single habit is what lets the next person pick up exactly where you left off.

---

## 60-second context

**Krazy Kreators** is an end-to-end brand-building partner for **US clothing founders** — design, sampling, premium fabric sourcing, retail-grade production, packaging, under one roof, one project manager. India-based manufacturing, US-facing. **A partner, not a vendor/factory/sourcing-agent/discount-manufacturer.**

**The reader** is a US clothing-brand founder, roughly 25–45, a time-poor decision-maker who has already read the surface-level stuff. They want a frame, a number, or a move they can make Monday morning — not a tutorial.

**The blog** exists to earn that reader's trust with genuinely useful, specific, well-sourced industry analysis — and to route them, at the end, toward talking to KK. It is a Bloomberg-style trade dispatch, not a content-marketing mill.

## Tech stack in one line

Next.js App Router · each post is a server `page.tsx` + a client `*Client.tsx` · `runtime = "edge"` · likes/comments via Supabase API routes · images served from `public/blog/` through a custom Cloudinary loader · deploys to **Cloudflare** on push — **`main` = production**.

> **Deploys go to Cloudflare only.** The Vercel integration is **no longer active**, but the Vercel GitHub app was never disconnected — so it still posts a `Vercel` status check on every PR, and that check **always fails**. Ignore it. It says nothing about your branch: a branch whose `npm run build` passes cleanly will still show `Vercel — fail`. Never block a merge on it and never chase its logs (`npx vercel inspect` just hangs). The real gates are the local production `npm run build` and the Cloudflare build.

## The non-negotiables (full detail in the two docs)

1. **Byline is always "Krazy Kreators Team"** (+ a desk label). Never a personal name unless explicitly told otherwise. *(This overrode an earlier persona system on 2026-06-30.)*
2. **Every statistic gets an inline source link on first mention.** If you can't verify a number, reframe it qualitatively — never invent one.
3. **Run `npm run build` before handing off or pushing** — not just `next dev`. It's the build the deploy actually runs.
4. **Check `postcss.config.mjs` is clean before every push** — it's a recurring malware-injection target (see PIPELINE § Operational guards).
5. **After any blog merge, entry count in `src/data/blogPosts.ts` must equal the number of blog page directories.** A silent merge can drop a post from the listing.
6. **A failing `Vercel` check on a PR is expected noise — never a merge blocker.** We deploy to Cloudflare only (see "Tech stack" above).

## Where everything lives

| Thing | Path |
|---|---|
| Blog listing metadata (one entry per post) | `src/data/blogPosts.ts` |
| A post's page + content | `src/app/blogs/<slug>/page.tsx` + `<Name>Client.tsx` |
| Images (hero, section, teaching, etc.) | `public/blog/` |
| Likes/comments/view API client | `src/lib/blogApi.ts` |
| Local-vs-Cloudinary image routing | `src/lib/cloudinaryLoader.ts` |
| Shared chrome | `src/components/` (Navbar, Footer, ContactDialog, Toast, BlogViewTracker) |

## For an AI session specifically

Read all of `docs/blog/` before writing or shipping a post. These files **supersede** the older, scattered blog memories. When something here conflicts with an older memory note, **this folder wins.** If the user gives a new standing instruction, update the relevant file here so the next session inherits it.

*Last reviewed: 2026-07-01.*
