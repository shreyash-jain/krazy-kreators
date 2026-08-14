# Krazy Kreators — Short-Form Video Master Prompt (Veo 3 · 9:16 · 30–60s)

This is the authoritative, **paste-ready** prompt for turning a rough idea into a finished Krazy Kreators short. Give any AI session **this whole file + your script idea** (one line is enough), and it produces: a tightened script, a shot-by-shot **Veo 3** prompt set engineered for continuity, the stitch/edit plan, and the end contact card. If a required element is missing from the output, that's a bug — fix it before finishing.

It is the video sibling of `docs/blog/MASTER_PROMPT.md`. Same discipline: the reader/viewer is a **US clothing-brand founder**, and the job is to earn trust and route them to talk to KK.

---

## 0) HOW TO USE THIS (read once)

1. Paste this file into the session.
2. Add your idea below the line `TOPIC/SCRIPT:` — a sentence, a paragraph, or a full script. Anything.
3. The session returns the full package in the **OUTPUT** format at the bottom.
4. You take the per-shot prompts into **Google Flow / Gemini (Veo 3)**, generate each clip **by chaining last-frame → next clip** (the continuity method in §3), then stitch with **one audio bed** in your editor.

**The #1 thing this fixes:** shorts that end abruptly and where the look "jumps" between clips (wardrobe, face, set, color, or motion changing shot-to-shot). That is not a Veo quality problem — it's a *workflow* problem, solved by §3. Follow §3 and the drift/abruptness goes away.

---

## 1) WHO WE ARE / WHO WE'RE TALKING TO

- **Krazy Kreators** = end-to-end brand-building partner for US clothing founders: design, sampling, premium fabric sourcing, retail-grade production, packaging — under one roof, one project manager. India-based manufacturing, US-facing. **A partner, not a vendor/factory/sourcing-agent.**
- **Viewer** = US clothing-brand founder, 25–45, scrolling Reels/Shorts/TikTok. You have ~2 seconds to stop the thumb, ~30–60 to earn the profile tap.
- **Goal of every short:** one clear idea + one feeling + one action (visit krazykreators.com / DM / "talk to a production lead").

## 2) BRAND LOOK & VOICE (the identity every shot must hold)

- **Palette:** warm tan `#CBB49A`, near-black `#2D2A2E`, cream `#F8F7F4`. Editorial, premium, calm — Bloomberg-meets-lookbook, never loud "dropshipping ad."
- **Camera feel:** real-camera, cinematic. Shallow depth, natural/available light, slight handheld life. Not glossy CGI, not stock.
- **Voice (VO/captions):** senior, confident, specific. A frame, a number, or a move — never hype. Banned: "unlock, elevate, seamless, game-changing, revolutionize, in today's fast-paced world."
- **People/trademark safety:** use **generic, non-famous** people (or hands/backs/silhouettes) and **unbranded** garments. No real logos/marks. This mirrors the blog rule.
- **Contact card (always the last ~4s):** KK wordmark, tagline, `krazykreators.com`, one CTA line. Spec in §7.

## 3) THE CONTINUITY SYSTEM ★ (this is the whole game — get it right)

Veo 3 generates **~8-second clips** with **native audio**. A 30–60s short is therefore **4–7 clips chained together**. Abruptness and drift come from generating each clip independently. Kill both with these five rules — **every** shot prompt must obey them.

**RULE 1 — Chain by the last frame (the single most important step).**
Never generate shot _n+1_ from scratch. In Google Flow, take the **final frame of shot _n_** and feed it as the **first frame** of shot _n+1_ ("Frames to Video"), or use **"Extend"** to continue the clip. This guarantees the same face, wardrobe, set, and lighting carry over. Text-to-video for every clip is the #1 cause of the "genes/pattern keep changing" problem you saw.

**RULE 2 — The locked Style Bible (paste-identical in every prompt).**
Write the subject once, then repeat that **exact wording** in every shot. Veo re-invents anything you re-describe differently. The Bible block (fill once, reuse verbatim):
> STYLE BIBLE — repeat verbatim in every shot:
> Subject: [e.g. a 30s female founder, shoulder-length dark hair, cream linen shirt, minimal gold ring — generic, non-famous].
> Product: [e.g. an unbranded heavyweight cream tee, visible topstitch].
> Setting: [e.g. a sunlit minimalist studio, oak table, bolts of fabric].
> Look: warm editorial grade, tan/cream/charcoal palette, shallow depth, 35mm, natural light, subtle film grain, not CGI.

**RULE 3 — One reference image per recurring subject.**
Generate (or shoot) a single clean reference of the founder and of the hero product, and reuse it as a Flow **"ingredient"** across shots. Same reference = same identity.

**RULE 4 — Handoff framing (kills the abrupt ending).**
End every shot on a **stable, describable moment** — a held pose, a settled object, a look to camera — **not** mid-fast-motion. Begin the next shot from that same frame/pose. Each prompt states its **END frame** explicitly so the next shot can pick it up. A clip that ends mid-swing always feels chopped; a clip that lands on a held beat cuts clean.

**RULE 5 — One audio bed, added in the edit (not per clip).**
Veo's per-clip audio will seam and jump if you keep all of it. Plan for **one continuous music/VO track laid over the whole 30–60s in your editor** (CapCut/Premiere). In the Veo prompts, specify **only** diegetic SFX you actually want (fabric rustle, scissors, a single spoken line) and keep music description consistent so any kept audio matches. This removes the audio "abruptness" between clips.

> **Continuity pre-flight (all must be true before you stitch):** same face/wardrobe/set across all clips · each clip starts from the prior clip's last frame · each clip ends on a held beat · one music bed over the top · palette holds shot-to-shot.

## 4) SCRIPT FRAMEWORK (30–60s arc)

Map the idea to this beat sheet. Keep it to **one idea**; do not over-stuff — the abruptness you disliked is often too many beats crammed into too few seconds. Fewer, fuller beats.

| Beat | Time | Job | Example (KK) |
|---|---|---|---|
| **Hook** | 0–8s | Stop the thumb. A tension, a number, a bold claim. | "80% of clothing brands die in year one. Here's the part nobody films." |
| **Turn** | 8–24s | Name the real problem the founder feels. | Wrong samples, MOQ traps, a factory that ghosts you. |
| **Proof** | 24–48s | Show the KK way — process, craft, one project manager. | Sampling on the table, fabric sourced, retail-grade stitch, packed. |
| **Payoff** | 48–56s | The founder outcome/feeling. | "From sketch to shelf — one partner." |
| **Card** | 56–60s | Contact card + CTA. | KK wordmark · krazykreators.com · "Talk to a production lead." |

For a 30s cut: compress to Hook (0–6) → Proof (6–22) → Card (22–30). Same rules.

## 5) VEO 3 SHOT-PROMPT TEMPLATE (use for every shot)

Veo 3 responds best to prompts built from these fields, in this order. Output one filled block per shot.

```
SHOT n — [role: hook / proof / payoff / card]  (duration ~8s, 9:16 vertical)
START FRAME: [text-to-video for shot 1; for n>1: "continues from Shot n-1 final frame — <describe that frame>"]
SUBJECT + ACTION: [what happens, one clear action — from the Style Bible subject, verbatim]
SETTING: [Style Bible setting, verbatim]
CAMERA: [shot size + movement + lens — e.g. "slow push-in, 35mm, eye-level"]
LIGHTING: [Style Bible look — e.g. "soft window light from left, warm"]
STYLE: warm editorial grade, tan/cream/charcoal, shallow depth, film grain, real-camera, not CGI
AUDIO: [only what you want kept — e.g. "fabric rustle SFX; no music" OR one spoken line in "quotes"]
END FRAME (handoff): [the held beat this clip lands on — the next shot starts here]
NEGATIVE: no text artifacts, no logos/brands, no distorted hands/faces, no fast whip-motion at the end
```

**Camera vocabulary that reads well in Veo 3:** slow push-in / dolly, static locked-off, gentle handheld, overhead top-down, rack focus, macro detail. **Avoid** rapid whip-pans and hard zooms — they make cuts feel abrupt.

## 6) OUTPUT — the session must return, in this exact order

1. **Concept line** — the one idea, in a sentence.
2. **Style Bible** — filled once (§3 Rule 2), to be reused verbatim.
3. **Script** — VO/on-screen caption lines mapped to the §4 beats, with running timecodes summing to the target length.
4. **Shot list** — table: shot #, beat, duration, one-line action.
5. **Per-shot Veo 3 prompts** — one filled §5 block per shot, each with START/END handoff wired to its neighbors.
6. **Stitch & audio plan** — clip order, where the single music bed sits, caption/CTA timing, aspect 9:16.
7. **End contact card** (§7).
8. **QA checklist** (§8), each box ticked.

## 7) END CONTACT CARD (last ~4s, every video)

- **Background:** cream `#F8F7F4` or near-black `#2D2A2E`. **Wordmark:** "Krazy Kreators" (+ KK mark). **Accent:** tan `#CBB49A`.
- **Line 1 (tagline):** "From sketch to shelf — one partner."
- **Line 2 (CTA):** "Talk to a production lead → krazykreators.com"
- Hold static 3–4s, legible on mobile, palette-matched to the film so it doesn't feel bolted on. Can be a Veo clip **or** (cleaner) a still card added in the editor.

## 8) QA CHECKLIST (gate every short)

- [ ] One idea only; beats not overstuffed; nothing ends mid-motion.
- [ ] Style Bible identical across all shot prompts.
- [ ] Every shot n>1 starts from shot n-1's final frame (chained, not fresh).
- [ ] Each shot lists an explicit END/handoff frame.
- [ ] One continuous audio bed planned for the edit; per-clip audio not left to jump.
- [ ] Palette (tan/cream/charcoal) and camera feel hold shot-to-shot.
- [ ] Generic non-famous people, unbranded garments, no real logos.
- [ ] 9:16 vertical throughout; total length hits 30–60s.
- [ ] Ends on the KK contact card with CTA.

---

## 9) WORKED MINI-EXAMPLE (40s, 5 shots) — shows the format

**Concept:** "The part of your brand nobody films" — the messy middle between a sketch and a shelf, and how KK owns it.

**Style Bible:** Subject: a 30s male founder, short dark hair, charcoal tee — generic, non-famous. Product: an unbranded heavyweight cream hoodie, visible flatlock stitch. Setting: a sunlit studio, long oak table, bolts of fabric, a rack behind. Look: warm editorial grade, tan/cream/charcoal, shallow depth, 35mm, natural light, subtle grain, not CGI.

- **Shot 1 — Hook (8s):** founder alone at the table sliding a sketch forward; VO: "Everyone films the launch. Nobody films this." Camera slow push-in. **END:** his hand resting flat on the sketch.
- **Shot 2 — Turn (8s):** *from Shot 1 end frame* — same hand lifts a wrong, ill-fitting sample; slight frown. SFX fabric rustle. **END:** the reject sample dropped on the table.
- **Shot 3 — Proof (8s):** *from Shot 2 end frame* — macro of hands on the correct hoodie, flatlock stitch, fabric sourced beside it. **END:** the hoodie laid flat, centered.
- **Shot 4 — Payoff (8s):** *from Shot 3 end frame* — the finished hoodie on a form, packed box beside it, founder nods to camera. VO: "From sketch to shelf — one partner." **END:** founder settled, looking to camera.
- **Shot 5 — Card (8s / still):** cream card, KK wordmark, "Talk to a production lead → krazykreators.com."

**Stitch/audio:** one calm editorial music bed under all 5; keep only Shot 2's fabric SFX; captions on Hook + Payoff; 9:16.

---

*Last reviewed: 2026-07-15. Tool target: Google Veo 3 (Flow/Gemini), 9:16, ~8s clips chained to 30–60s. Pair with `docs/blog/` for topic ideas — blogs and shorts can share a concept.*
