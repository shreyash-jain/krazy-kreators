# Blog Work — Status & Handoff Ledger

**This is the living state of blog work.** It exists so anyone picking up — a new teammate, or a fresh AI session — knows exactly where things stand and what to do next, without needing any chat history. The other docs say *how* to make a blog; this says *where we are*.

> **Handoff protocol (everyone follows this):**
> - **Before you start:** read `docs/blog/README.md`, then this file.
> - **While you work:** keep the "In flight" table current.
> - **Before you leave:** update statuses, record blockers, and list the next actions. Push your branch. That's what lets the next person continue the series.

*Last updated: 2026-08-05.*

---

## In flight — branches, state, next action

| Blog / work | Branch | State | Open item / next action |
|---|---|---|---|
| How to Start a Clothing Brand in 2026 — step-by-step guide | `blog/how-to-start-a-clothing-brand-2026` | Scaffolded; **build green (exit 0)**, route `ƒ /blogs/how-to-start-a-clothing-brand-2026`; tsc/eslint clean; invariant 57==57 | id **59** (57 reserved by `second-origin`, 58 by `de-minimis-hangover`). Business / Growth &amp; Business. Top-of-funnel SEO pillar for the focus keyword **"how to start a clothing brand"**; 8-step build order; JSON-LD `BlogPosting` + `HowTo` + `FAQPage` + `BreadcrumbList` for AEO. ⚠️ **Keyword cannibalisation, accepted by the owner:** the older post `how-to-start-clothing-brand-2026` (id 9, "Launching a Global Clothing Brand") holds the exact-match slug and stays live — two pages now target the same query. If rankings split, 301 the old slug to this one. ⚠️ **Editorial exception:** MASTER_PROMPT bans "How to" tutorial framing; overridden by the owner for SEO. ✅ **All 5 images in place and individually opened** (`start-clothing-brand-{hero,section1,teaching,macro,closing}.jpg`, 1024×1024, 5 distinct MD5s — no byte-dupes). Teaching graphic = "The First-Year Build Order"; its first cut had a broken axis (month 6 missing, 12 duplicated) and bars that overlapped/shared endpoints — **regenerated 2026-08-05 13:27 and re-verified**: axis now a clean 1–12 scale, all 8 rows labelled, bars strictly sequential, all bands match the body table (1–2 Niche · 2–3 Range plan · 3–4 Entity/trademark · 4–5 Tech pack · 5–7 Fabric &amp; sampling · 7–8 Landed cost &amp; labelling · 8–10 First production run · 10–12 Launch). Residual nit, not blocking: the Niche bar is drawn ~2 months wide, shifting later bars ~0.5 month right of the axis; every bar is individually labelled and the authoritative table sits directly below, so the sequence still reads correctly. Swap for an inline SVG if pixel-exact registration is ever wanted. Facts verified live (Statista US apparel $373bn 2026; BLS BED survival; USPTO $350 base + $100/$200 surcharges per FY2025 fee rule; CBP de-minimis indefinite suspension 2026-06-24; HTS 6109.10.00 at 16.5%; FTC Textile/Wool + Care Labeling Rule; NRF 15.8%/19.3% returns). **No direct-to-main.** |
| After the Cliff — landed-cost rebuild (Aug) | `blog/rebuild-landed-cost-august-2026` | Scaffolded; **build green (exit 0)**, route `ƒ /blogs/rebuild-landed-cost-august-2026`; invariant 55==55; PR flow | id **55**. Production & Sourcing. Sequel to the July-24 cliff post — the post-lapse *landed-cost rebuild* for Aug-clearing goods (duty follows entry date; 3 scenarios 16.5% / 26.5% / 29%; + MPF/HMF/brokerage; consolidate; pass-through clause). Facts verified on live web (CRS, White & Case, CBP fee table, Tariffs Tool, Greenwich). **Needs 4 images** in `public/blog/`: `rebuild-cost-august-hero.jpg`, `-section1.jpg`, `-teaching.jpg`, `-closing.jpg` (teaching = "The $14 tee's August landed cost, three ways" — columns must total **$16.43 / $17.83 / $18.18** to match body). Push branch → PR → await sign-off → merge. **No direct-to-main.** |
| Tennis-Core / Wimbledon (July #5) | `blog/tenniscore-wimbledon-us-brands-2026` | Scaffolded; **build green (exit 0)**; PR flow | id **52**. Culture & Brand. Facts verified on live web. **Needs 4 images** in `public/blog/`: `tenniscore-hero.jpg`, `-section1.jpg`, `-teaching.jpg`, `-closing.jpg` (teaching = "Anatomy of a Tenniscore Piece": 5 cues + 200–260 GSM + optic-white/cream/kelly-green/navy palette — must match body). Push branch → PR → await sign-off → merge. **No direct-to-main.** |
| Forced-labor 301 regime (10% vs 12.5%) | pushed direct to `main` (c4a573b, 2026-07-06) | ✅ Live | id 51. Merged fast-forward to main and pushed (no PR, per owner). 4 images in place, build green, invariant 51==51. Verify the provider deploy went green on the dashboard. |
| Tariff cliff (July 24 / Section 122) | merged to `main` (PR #47) | ✅ Live | Its byline on `main` still shows a persona name until the byline-fix (on the de-minimis branch) reaches `main`. |
| De-minimis ($800 rule) | `blog/de-minimis-end-us-brands-2026` | Pushed to origin; **not merged** | (1) Closing image is a **duplicate of the Section-1 macro** — replace `public/blog/de_minimis_closing.jpg` with the parcel-vs-pallet shot. (2) This branch also carries the **"Krazy Kreators Team" byline fix** for 6 older posts — merging it standardizes all bylines. Open a PR. |
| Osaka Wimbledon (walk-on) | `blog/naomi-osaka-wimbledon-kimono-us-brands-2026` | Pushed to origin; **not merged** | **Licensing** on the 3 real press photos (`.webp`) must be cleared before merge. Otherwise complete (6 images, build green). Open a PR. |
| Blog system docs (this folder) | `docs/blog-system-runbook` | Pushed to origin; **not merged** | Merge to `main` to make the pipeline + master prompt canonical for everyone. |

## Standing decisions (so nobody re-litigates them)
- **Byline = "Krazy Kreators Team"** + desk label. No persona names. (Set 2026-06-30.)
- **Images:** the assistant can't save chat-pasted images — files must land in `public/blog/`. Naming: `<slug>-hero`, `<slug>-section1`, `<slug>-teaching`, `<slug>-macro`, `<slug>-closing`.
- **One blog at a time** until the shared-`<BlogArticle>` refactor lands (avoids id collisions + the merge-drop hazard). See `PIPELINE.md`.

## Open blockers / decisions pending
- **Osaka press-photo licensing** — owner to confirm before merge.
- **De-minimis closing image** — swap the duplicate.
- **Deploy:** an earlier Vercel preview failed on the tariff PR while the local build passed → likely env/config/stale, not code. If a preview fails, read the provider dashboard log (the `gh`/`vercel` CLIs aren't authenticated in the working environment).

## Recommended next actions (in order)
1. Decide licensing on the Osaka photos → open its PR.
2. Swap the de-minimis closing image → open its PR (this also lands the byline fix).
3. Merge `docs/blog-system-runbook` to `main` so the system is canonical.
4. Then merge the blog PRs one at a time, re-checking the `blogPosts.ts` count invariant after each (see `PIPELINE.md` § merge-drop).
5. When bandwidth allows: greenlight the shared-`<BlogArticle>` refactor (`PIPELINE.md`) to end the copy-paste.
