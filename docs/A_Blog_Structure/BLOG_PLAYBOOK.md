# BLOG PLAYBOOK — Krazy Kreators

How a post is **written** and **built** in this repo. Voice and client rules live in
[CLIENT.md](CLIENT.md); commands, traps and the image pipeline live in
[ARCHITECTURE.md](ARCHITECTURE.md). The end-to-end process is `/blog`.

**Do one blog at a time.** Concurrent blog branches cause id collisions and the
merge-drop hazard.

---

## Part 1 — Writing

### Headline (≤ 62 characters, so it doesn't truncate on mobile)

Pick one of four modes and **rotate across a batch** — no more than 2 Hook headlines in
any 5:

1. **Promise** — the gain they walk away with. *"What to Lock for Holiday Before the Window Closes"*
2. **Number** — lead with a figure. *"18% vs 46%: The Tariff Math Reshaping Sourcing"*
3. **Hook** — curiosity or news tension, used sparingly. *"NYFW Men's Just Signaled Where US Fashion's Headed"*
4. **Frame** — a named lens or concept. *"The Tunnel-Fit Economy Reshaping US Menswear"*

**Subhead (dek)** delivers a *different beat* than the title — the payoff, not a
restatement.

### Structure and length

- **1,400–1,800 words** unless the brief says otherwise.
- **TL;DR block** if read time > 5 min: 3 bullets, ~40 words total, visually distinct.
- **Table of contents** if read time > 6 min — sticky rail on desktop, jump-pills on mobile.
- **Max 3 sentences per paragraph.** No paragraph over ~80 words. Vary sentence length.
- **One pull quote per ~600 words** (large serif, left rule).
- **Descriptive H2s** that telegraph the payoff — never generic filler like "The Common Thread".
- Any numbered framework ends **each** section with a repeating branded callout box:
  > **Signs you're making this mistake**
  > - bullet — bullet — bullet

### Sources and accuracy (non-negotiable)

- Every percentage or "widely cited" stat gets an **inline source link on first
  mention**, to a real checkable source.
- Verify time-sensitive and policy claims against the live web *before* writing.
- If you can't verify a figure, **don't invent it** — reframe qualitatively.
- Every prescriptive piece acknowledges at least one **counterexample or edge case**.

### CTAs and internal linking (no dead ends)

- **Mid-article (~55% scroll):** a *soft* lead magnet — checklist, template, glossary
  download. **Not** "book a call".
- **Closing prose:** one tight section, max 3 sentences, ending on a question that
  invites a reply or a short "what we'd do in your shoes". Never a sales pitch.
- **End block (separate from the prose):** a CTA **pair** — editorial ("Read next: …")
  plus commercial ("Talk to a Krazy Kreators production lead about …").
- **2–3 inline contextual internal links** to foundation posts, plus a curated **3-card
  "Read next"** block (image + title + one-line dek + read time). Curate by hand; never
  auto-generate by tag. **Verify every slug you link to actually exists.**

### The About footer (verbatim, every post)

> **About Krazy Kreators**
> Krazy Kreators is the end-to-end brand-building partner for US clothing founders —
> design, sampling, fabric sourcing, retail-grade production, and packaging, under one
> roof, from first sketch to shelf. krazykreators.com

---

## Part 2 — Images

Treat the image set as an **editorial photo essay in a fashion-trade magazine** — not
stock photography. Produce **4–6 images**, each a different register and subject.
Client-level bans (flat-lays, paper tags, factory clichés, logos, faces) are in
[CLIENT.md § Visual direction](CLIENT.md) and are absolute.

**Each image picks a different register:**

1. **Macro detail** — extreme close-up of texture, stitch, weave or trim; shallow depth of field.
2. **Single finished garment as hero** — one piece on a form or in motion, dramatic directional light.
3. **Documentary wide** — an environment with a story: design studio, fabric mill at golden hour, container port, retail floor, packing station. Cinematic, lived-in.
4. **Abstract / conceptual** — shadow play, split frame, a single shaft of light, motion blur on hands, a silhouette. Moody, editorial.
5. **The teaching graphic — REQUIRED, at least one.** A clean branded infographic tied to
   the article's framework: decision tree, cost-math diagram, 90-day timeline,
   before/after, or data-viz. A designed graphic, not a photo. **Its numbers and labels
   must match the article body exactly.**

**Realism technique** — make photographs look like real cameras, not AI: name a camera
body, a prime lens and a real film stock (Kodak Portra for daylight, CineStill 800T for
night/tungsten), natural grain, available light, slight handheld imperfection, and depth
layering (foreground out of focus → sharp subject → background). Add *"not a render, not
CGI, not over-smoothed, not AI-glossy."*

**Pre-flight:** scan the last two posts' image sets. If a prompt resembles one, rewrite it.

**Section 1 gets its own image** — it is the most-read section.

For each image, decide: slot and purpose (hero / Section 1 / teaching / closing) ·
register · composition · lighting · subject · mood · aspect ratio · then write a
40–70-word ready-to-run generation prompt. Generate them per
[ARCHITECTURE.md § Images](ARCHITECTURE.md).

**Naming:** `<slug>-hero`, `<slug>-section1`, `<slug>-teaching`, `<slug>-macro`,
`<slug>-closing` — `.jpg` / `.webp` / `.png` all work — saved into `public/blog/`.

---

## Part 3 — Building it in this repo

### 1. Branch

```bash
git fetch origin
git checkout main && git merge --ff-only origin/main
git checkout -b blog/<slug>
```

If the fast-forward aborts on `public/hero-video.mp4` ("should have been a pointer"),
that's the Git-LFS snag: `git checkout origin/main -- public/hero-video.mp4`, then retry.

**Pick the `id`** = (max existing id in `blogPosts.ts`) + 1, **skipping any id already
used by an unmerged blog branch**. Reusing one collides at merge.

### 2. Scaffold — copy a recent post as the template

- `src/app/blogs/<slug>/page.tsx` — server component: `metadata`,
  `export const dynamic = "force-dynamic"`, `export const runtime = "edge"`,
  `<BlogViewTracker slug />`, and
  `Promise.all([getBlogLikeCount(slug, { baseUrl }), getComments(slug, { baseUrl })])`.
- `src/app/blogs/<slug>/<Name>Client.tsx` — the full layout-grammar client: hero, TL;DR,
  TOC rail, sections, mid CTA, end CTA pair, read-next, comments, sticky mobile CTA.
  **Byline = "Krazy Kreators Team".**
- Add the entry at the **top** of `src/data/blogPosts.ts`:
  ```ts
  { id, title, excerpt, category, author, date, readTime,
    image, card_image?, slug, readers, likes }
  ```
- Wire image slots to **local `/blog/<name>` paths**.

### 3. Verify gate — all of it, every time

```bash
# count invariant — must be equal (merge-drop guard)
grep -cE '^\s*slug:' src/data/blogPosts.ts
find src/app/blogs -mindepth 1 -maxdepth 1 -type d ! -name '[slug]' | wc -l

npx tsc --noEmit                      # next.config ignores TS/ESLint at build — check here
npx eslint src/app/blogs/<slug>/*.tsx
rm -rf .next && npm run build         # THE gate: exit 0 AND route shows as ƒ /blogs/<slug>
```

Stop any `next dev` first — it shares `.next`. A passing `next dev` is **not** the same
as a passing build.

Then preview locally: the page returns 200 and **every image returns 200**. If a reused
filename shows a stale image, `rm -rf .next/cache/images` and hard-refresh; confirm with
`curl <img> | wc -c` against the bytes on disk.

### 4. Ship

- Confirm `.npmrc` exists at the repo root before pushing.
- Commit **scoped to this blog's files only.**
- Push, open the PR, hand over the link. **Don't merge** until told.
- After merging, re-run the count invariant on `main`.

---

## Pre-ship checklist

- [ ] Headline ≤ 62 chars, one of the four modes; dek is a different beat
- [ ] Byline = Krazy Kreators Team + desk
- [ ] TL;DR (> 5 min) + TOC (> 6 min)
- [ ] ≤ 3 sentences/paragraph; one pull quote per ~600 words; descriptive H2s
- [ ] Every stat has an inline source link on first mention; every jargon term defined on
      first use; at least one counterexample
- [ ] KK named only at the close; no pricing/MOQ language in the body
- [ ] Mid soft CTA + tight closing + end CTA pair + 3-card read-next + 2–3 inline
      internal links, all slugs verified
- [ ] 4–6 images, ≥1 teaching graphic, a Section-1 image, varied registers, no banned
      compositions, realism + trademark rules applied, KK watermark, teaching-graphic
      numbers match the body, no two slots byte-identical
- [ ] About-KK footer verbatim
- [ ] Count invariant equal · `tsc` clean · `eslint` clean · `npm run build` exit 0
- [ ] `postcss.config.mjs` clean · `.npmrc` present · no stray `upload-*.js`

*Last reviewed: 2026-08-21.*
