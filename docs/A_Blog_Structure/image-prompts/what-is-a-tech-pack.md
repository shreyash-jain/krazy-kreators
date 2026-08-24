# Image prompts — `what-is-a-tech-pack` (id 63)

Five photographic slots. The three teaching graphics (Infographic 01 "The eight pages",
02 "One wrong sleeve length, four places to catch it", 03 "Twelve working days, four passes")
are **built in code** inside `TechPackExplainedClient.tsx` — do not generate them as images,
and do not let a generated image restate their numbers.

**Save to:** `public/blog/` — filenames exactly as below, `.jpg`, square 1024×1024.
**Global constraints (apply to every prompt):** no logos, no brand marks, no legible text,
no identifiable faces (hands, backs and tight crops only), no overhead flat-lay of fabric
swatches, no small handwritten paper tags. Real-camera look, not a render, not CGI, not
over-smoothed or AI-glossy. One cohesive warm-neutral treatment across all four. Small
"KK" watermark, bottom-right corner.

---

## 1 — `what-is-a-tech-pack-hero.jpg`

- **Slot / purpose:** Hero. Establishes the document as a working object on the factory floor, not an abstraction.
- **Register:** Documentary wide, cinematic.
- **Composition:** A thick printed spec document lying open on a long wooden cutting table, tailor's chalk and a steel rule beside it, a half-cut fabric lay receding out of focus behind. Foreground edge of the table soft, paper sharp, room falling away.
- **Lighting:** Warm early-morning window light raking low across the paper, long shadows off the chalk.
- **Mood:** Quiet, before the shift starts. Consequential.
- **Aspect ratio:** 1:1.

> Shot on a Canon EOS R5 with a 35mm f/1.4 prime, Kodak Portra 400, natural window light only. A thick printed garment specification document lies open on a long worn wooden cutting table in an apparel workroom, tailor's chalk and a steel rule beside it, a half-cut fabric lay blurred in the background. Low raking morning light, long shadows, fine natural grain, shallow depth of field, slight handheld imperfection. No text legible, no logos, no people. Not a render, not CGI, not over-smoothed.

## 2 — `what-is-a-tech-pack-section1.jpg`

- **Slot / purpose:** Section 1, "What a tech pack actually is." Shows the act of turning a garment into a number.
- **Register:** Documentary detail — hands at work.
- **Composition:** A technical designer's hands stretching a tape measure across the chest of an unbranded garment laid flat on a studio table. Tape, knuckles and fabric grain sharp in the foreground; the room dissolving softly behind.
- **Lighting:** Cool, even north-facing daylight. No hard shadow.
- **Mood:** Precise, unhurried, procedural.
- **Aspect ratio:** 1:1.

> Shot on a Nikon Z6 with an 85mm f/1.8 prime, Kodak Portra 160, soft north-window daylight. Close on a person's hands drawing a yellow tape measure across the chest of a plain unbranded cotton garment laid flat on a pale studio table. Knuckles, tape markings and fabric grain in sharp focus, the studio behind falling into soft blur. Natural grain, available light, no faces, no logos, no legible text. Not a render, not CGI, not over-smoothed.

## 3 — `what-is-a-tech-pack-macro.jpg`

- **Slot / purpose:** Section 5, "What skipping it actually costs." The stitch that a construction page names.
- **Register:** Extreme macro.
- **Composition:** A twin-needle coverstitch hem on cotton jersey filling the frame at an angle, individual stitch loops and thread twist resolved, depth falling away to black within a centimetre.
- **Lighting:** Single low raking light from camera left, deep shadow at right.
- **Mood:** Forensic. Beautiful up close.
- **Aspect ratio:** 1:1.

> Shot on a Sony A7R IV with a 90mm f/2.8 macro lens, CineStill 800T, one low raking tungsten light from the left. Extreme macro of a twin-needle coverstitch hem on unbranded heavyweight cotton jersey, individual stitch loops and thread twist clearly resolved, knit texture visible between rows. Razor-thin depth of field falling away into deep shadow. Natural grain, no logos, no labels, no text, no people. Not a render, not CGI, not over-smoothed.

## 4 — `what-is-a-tech-pack-patterns.jpg`

- **Slot / purpose:** Section 6, "How a tech pack gets built." The document as physical output, without showing a document.
- **Register:** Abstract / conceptual — shadow play.
- **Composition:** Paper pattern pieces hanging from a rail in a darkened studio, overlapping at different depths. A single hard shaft of low window light cuts across them and throws crisp, layered shadows onto the wall behind. The shadows carry as much of the frame as the paper does.
- **Lighting:** One low, hard shaft of late-afternoon window light through a gap. Everything outside the beam falls to near-black.
- **Mood:** Quiet, graphic, a little severe. Instruction as an object.
- **Aspect ratio:** 1:1.

> Shot on a Leica M10 with a 50mm f/1.4 prime, CineStill 800T, one hard shaft of late-afternoon window light and no fill. Paper garment pattern pieces hang overlapping from a metal rail in a darkened studio, the beam cutting across them and throwing crisp layered shadows onto the wall behind. Deep shadow surrounds the lit area, dust visible in the light, natural grain, slight handheld imperfection. No text, no markings legible, no logos, no people. Not a render, not CGI, not over-smoothed.

## 5 — `what-is-a-tech-pack-closing.jpg`

- **Slot / purpose:** Section 9, "When you don't need the full document." The finished object the whole document exists to produce.
- **Register:** Single finished garment as hero.
- **Composition:** One unbranded heavyweight hoodie on an invisible mannequin form, turned three-quarters, cuff rib and shoulder seam catching the light, background falling to near-black.
- **Lighting:** One hard directional key from high camera right, no fill, deep shadow side.
- **Mood:** Editorial, still, slightly reverent.
- **Aspect ratio:** 1:1.

> Shot on a Hasselblad X1D with a 65mm prime, Kodak Portra 400, single hard directional studio key from high right with no fill. One plain unbranded heavyweight cotton hoodie on an invisible mannequin form, turned three-quarters, light picking out the shoulder seam, cuff rib and drawcord channel against a deep shadowed charcoal background. Fabric texture and seam construction clearly visible, natural grain, subtle falloff. No logos, no labels, no text, no people. Not a render, not CGI, not over-smoothed.

---

## Pre-flight (done)

Checked against the previous two image sets (id 62 `no-moq-clothing-manufacturers`, id 61
`how-to-start-a-clothing-brand-2026`):

- id 62 already used a cut-and-sew workshop wide, a rolling rail, a garment-on-form, a flatlock
  macro and a retail rail. **Overlap risk on slots 3 and 5.** Differentiated deliberately:
  the macro here is a *coverstitch hem* under tungsten (id 62's was a *flatlock shoulder seam*
  under daylight), and the garment hero here is a *hoodie* with a hard high-right key
  (id 62's was a *crew tee* with a hard side key).
- Slot 4 is the only rail in this set, and it carries **paper pattern pieces, not garments** — so it
  does not read as id 62's rolling garment rail.
- No sewing-machine close-up, no fabric-swatch flat-lay, no paper tags anywhere in this set.

## Register coverage (master prompt asks for a different one per image)

| Slot | File | Register |
|---|---|---|
| 1 | `-hero` | Documentary wide, cinematic |
| 2 | `-section1` | Documentary detail — hands at work |
| 3 | `-macro` | Extreme macro |
| 4 | `-patterns` | Abstract / conceptual — shadow play |
| 5 | `-closing` | Single finished garment as hero |

The required **teaching graphic** register is covered three times over in code (Infographics 01–03),
which is why no generated image in this set carries text or numbers.

---

# Set B — the 5 informative / teaching photos (2026-08-10, requested after Set A landed)

Five more, each mapped onto one page of the tech pack the article describes, and each placed in the
section that explains it. **Save to `public/blog/`, same 1024×1024 JPEG spec, same global constraints.**

### ⚠️ The one rule that matters for this set

These are *informative* images, so the temptation is to ask the generator for labels, callouts and
arrows. **Do not.** Generated labels are exactly what blocked id 61 for weeks — that post shipped a
tech-pack graphic with a ninth callout reading **"label and careolock"**, a nonsense word, plus stray
quote marks. Every prompt below is therefore written to teach through *composition alone*: the tapes,
the nesting, the row of components, the three hangers.

**The labels live in code instead.** Each image renders inside a `<TeachingPhoto>` figure that supplies
a real HTML eyebrow label and caption — accessible, indexable, editable, and incapable of garbling. If a
generated frame comes back with legible text anywhere, reject it and regenerate.

| # | File | Article slot | Teaches |
|---|---|---|---|
| B1 | `-flats.jpg` | §4 "Tech pack, CAD or spec sheet?" | Page 02 — what a CAD actually is |
| B2 | `-pom.jpg` | §3, points-of-measure paragraph | Page 03 — points of measure |
| B3 | `-grading.jpg` | §3, grading paragraph | Page 04 — grading rules |
| B4 | `-bom.jpg` | §3, BOM paragraph | Page 05 — bill of materials |
| B5 | `-sampling.jpg` | §5 "What skipping it actually costs" | Where errors get caught |

---

## B1 — `what-is-a-tech-pack-flats.jpg`

- **Register:** Document / artefact photography — the drawing as object.
- **Composition:** A single sheet of gridded paper filling the frame slightly askew, carrying a precise black-ink technical flat of a hoodie, front and back, drawn straight on with no body in it. Seams, topstitching, pocket opening and hood construction all rendered as clean line work.
- **Lighting:** Flat, even, shadowless copy light — this one should read as a document, not a mood.
- **Why it teaches:** It shows the reader the exact artefact they have probably been emailing factories, so the article's "a CAD is one page, not the document" lands visually.
- **Aspect ratio:** 1:1.

> Shot on a Fujifilm GFX with a 63mm lens, even diffused copy lighting, no shadow. A single sheet of pale gridded paper photographed straight down and very slightly askew, carrying a precise black-ink technical line drawing of a hooded sweatshirt, front view and back view side by side, drawn flat with no body in it. Clean confident linework showing seams, topstitching, hood and pocket construction. Fine paper grain and a soft edge shadow. **No lettering, no numbers, no annotations, no arrows anywhere.** No logos. Not a render, not CGI, not over-smoothed.

## B2 — `what-is-a-tech-pack-pom.jpg`

- **Register:** Documentary overhead-adjacent — instructional still life.
- **Composition:** An unbranded tee laid flat, shot from slightly above and to one side, with four yellow tape measures laid across it at once: chest width, full body length, sleeve length and hem opening. The four tapes make the abstract idea of a "point of measure" instantly readable.
- **Lighting:** Soft, even daylight; no drama. Clarity is the point.
- **Why it teaches:** Four simultaneous tapes show that a spec is a *set* of measurements, not one.
- **Aspect ratio:** 1:1.

> Shot on a Canon EOS R5 with a 50mm f/2 lens, Kodak Portra 160, soft even daylight from a large window. A plain unbranded light grey cotton tee laid perfectly flat on a pale wooden table, photographed from slightly above and to one side. Four yellow tape measures lie across it at once — one spanning the chest, one down the full body length, one along a sleeve, one across the hem opening. Crisp fabric texture, gentle shadows, natural grain. No hands, no faces, no logos, **no written labels or callouts**. Not a render, not CGI, not over-smoothed.

## B3 — `what-is-a-tech-pack-grading.jpg`

- **Register:** Instructional still life — nesting.
- **Composition:** Three paper pattern pieces of the same garment front, in three sizes, stacked and centred so they nest inside one another with a visible margin of growth between each outline. The uneven margins are the teaching.
- **Lighting:** Raking side light so each paper edge throws a thin shadow and the three outlines separate cleanly.
- **Why it teaches:** It makes visible the article's claim that bodies don't scale evenly — shoulder growth is visibly smaller than chest growth.
- **Aspect ratio:** 1:1.

> Shot on a Nikon Z7 with a 60mm macro lens, Kodak Portra 160, low raking side light. Three manila paper garment pattern pieces of the same shirt front in three different sizes, stacked and centred so each nests inside the next with a clearly visible margin of growth between the outlines, the margins deliberately uneven — wider at the chest and hem, narrower at the shoulder and neckline. Thin shadows separate each paper edge. Warm neutral surface, natural grain. **No writing, numbers or notches legible.** No logos, no people. Not a render, not CGI, not over-smoothed.

## B4 — `what-is-a-tech-pack-bom.jpg`

- **Register:** Instructional still life — the exploded component row.
- **Composition:** The components of one hoodie arranged in a single row across a workbench, shot at a low raking three-quarter angle (**not overhead**): a cone of thread, a metal zipper, a drawcord with metal aglets, a folded length of jersey off the roll, a blank woven label, two spare buttons.
- **Lighting:** Warm directional light from the left, each object throwing its own shadow.
- **Why it teaches:** It converts "bill of materials" from jargon into a countable row of things you have to buy.
- **⚠️ Hard-ban watch:** must **not** become an overhead flat-lay of folded fabric swatches. Angle it, keep the cloth as a length off the roll, and keep the objects varied.
- **Aspect ratio:** 1:1.

> Shot on a Sony A7 IV with a 55mm f/1.8 lens, Kodak Portra 400, warm directional light from the left. The components of a single hoodie arranged in one row along a worn wooden workbench, photographed at a low three-quarter angle so the objects recede and each throws its own shadow — a cone of grey thread, a metal zipper, a cotton drawcord with metal aglets, a folded length of grey jersey off the roll, a blank woven label, two spare buttons. Shallow depth of field, warm natural grain. No overhead view, no flat-lay of fabric squares, **no lettering on the label**, no logos, no people. Not a render, not CGI, not over-smoothed.

## B5 — `what-is-a-tech-pack-sampling.jpg`

- **Register:** Documentary — the progression.
- **Composition:** Three versions of the **same** unbranded hoodie hanging side by side on a rail, reading left to right as a progression: the first in an obviously different, cheaper cloth and a looser fit; the second corrected in fit but still plain calico-toned; the third in the final grey fabric, clean and resolved.
- **Lighting:** Even studio daylight so the three read as a comparison, not a mood piece.
- **Why it teaches:** It shows the sample rounds as the cheap places to catch an error, directly above the cost-escalation chart.
- **⚠️ Accuracy note:** all three must be the **same garment type**. id 61's sampling image drew three *different* garments and was logged as a nit for exactly this reason.
- **Aspect ratio:** 1:1.

> Shot on a Canon EOS R6 with a 35mm f/2 lens, Kodak Portra 400, even soft studio daylight. Three versions of the same unbranded hooded sweatshirt hanging side by side on a simple metal rail against a pale wall, reading left to right as a progression — the first in a coarser off-white calico with a looser, unresolved fit, the second the same shape with a corrected cleaner fit, the third in finished heavyweight grey fleece hanging properly. Identical garment type in all three, only the cloth and fit differ. Natural grain, soft shadows. No hangtags, **no written labels**, no logos, no people. Not a render, not CGI, not over-smoothed.

### ✅ Set B delivered & verified — all 5, 2026-08-10

Each opened individually, not trusted by filename. All 1024×1024, all serving **200 byte-exact**, and
**all 10 MD5s across Sets A and B are unique** — no byte-dupes.

| File | Verdict |
|---|---|
| `-flats.jpg` | ✅ Hoodie front and back on gridded paper, clean linework, raglan seams, kangaroo pocket, ribbed cuffs, topstitching as dashed line. |
| `-pom.jpg` | ✅ Exactly as briefed — grey tee flat, four tapes at once: chest, body length, sleeve, hem. |
| `-grading.jpg` | ✅ Three nested bodice fronts. The uneven growth reads correctly: necklines almost identical, shoulders modest, body width and length noticeably wider — which is what the caption claims. |
| `-bom.jpg` | ✅ Spool, brass zipper, drawcord with metal tips, roll of fleece, blank label, two buttons on a workbench at a raking angle. **Hard ban held** — not an overhead swatch flat-lay. |
| `-sampling.jpg` | ✅ Three hoodies: raw calico with raw edges → cleaner cream → finished grey fleece with drawcord. **All the same garment type**, which is the nit id 61 shipped with. |

**No lettering in any of the five** — the anti-garble constraint held across the whole set. KK watermark
on all five.

**One alt-text correction:** `-bom.jpg` came back with the components scattered across the bench rather
than in a single row, so the alt was reworded from "arranged in a row" to "laid out on a workbench" and
now names what is actually in frame (brass zipper, two buttons, roll of fleece).

Non-blocking nits: `-pom.jpg`'s tape numerals garble in places under close inspection — incidental tape
markings rather than labels, invisible at display size. The hoodie in `-flats.jpg` is drawn with raglan
sleeves while `-closing.jpg` and `-sampling.jpg` read as set-in shoulder; they are never presented as the
same garment, so this is cosmetic only.

---

## ✅ Delivered & verified — 2026-08-10

All five generated and saved to `public/blog/`. Each was **opened individually**, not trusted by filename.
All 1024×1024 baseline JPEG, **5 unique MD5s** (no byte-dupes), all serving 200 byte-exact from a
production `next start`. KK watermark present bottom-right on all five. No logos, no legible text, no
faces in any frame.

| File | MD5 | Verdict |
|---|---|---|
| `-hero.jpg` | `c7f567e5…` | ✅ Ring-bound spec doc open on a worn table, steel rule + chalk, cutting table and fabric rolls behind. Page text is illegible squiggle — **no garbled words**, which is the failure that blocked id 61. |
| `-section1.jpg` | `5665554c…` | ✅ Hands drawing a tape across the chest of a grey tee, no face. |
| `-macro.jpg` | `ebad9f03…` | ✅ Image is excellent — **but it is not a coverstitch hem.** See correction below. |
| `-patterns.jpg` | `65f7c079…` | ✅ Best frame in the set. Pattern paper on a rail, hard shaft of light, shadows carrying half the composition. Markings illegible. |
| `-closing.jpg` | `344cd357…` | ✅ Hoodie on an invisible form, shoulder seam / drawcord + aglet / cuff rib all reading. |

### Alt text — final, all five rewritten

Every alt was rewritten after the images landed, so each one describes the frame that actually exists,
sits in the **147–168 character** band, and carries the keyword for the section it illustrates without
stuffing. Accessibility first — each reads as a description, not a keyword list.

| Slot | Alt text | Keyword carried |
|---|---|---|
| hero | *A printed fashion tech pack open on a workroom table beside a steel rule and tailor's chalk, cutting table and fabric rolls behind it in morning light.* | fashion tech pack |
| section1 | *Taking a point of measure for a clothing tech pack: hands drawing a tape measure across the chest of an unbranded grey cotton tee laid flat on a studio table.* | clothing tech pack |
| macro | *What a tech pack's construction page specifies: macro of a flatlock seam in contrasting tan thread on grey cotton jersey, both needle rows and the interlooping visible.* | tech pack (construction) |
| patterns | *Paper garment pattern pieces on a studio rail under one hard shaft of light — the physical output of a fashion tech pack's flats and grading rules.* | fashion tech pack |
| closing | *The garment a tech pack for clothing produces: an unbranded heavyweight hoodie on an invisible form, shoulder seam, drawcord and cuff rib lit hard from the right.* | tech pack for clothing |

### Correction applied — `-macro.jpg` alt text

The prompt asked for a *twin-needle coverstitch hem*. What was generated is a **flatlock seam** in
contrasting tan thread: two parallel needle rows with visible cross-interlooping between them, lying on a
panel rather than folding a hem edge. On a post that argues for naming stitch types precisely, shipping
the wrong stitch name in the alt text of the stitch photo would have been self-defeating, so the **alt text
was corrected to match the image** rather than the image regenerated — the frame itself is strong and the
body never claims this specific photo is a coverstitch. (The body's "coverstitch hem, 1/4 inch" example
sits in Section 3 and is not attached to this image.)

### Overlap check against id 62, re-run against the real files

Pulled `no-moq-clothing-manufacturers-macro.jpg` from `origin/blog/no-moq-clothing-manufacturers` and
compared side by side. **Distinct enough:** id 62 is a tonal grey-green neckline-and-shoulder crop where
the seam blends into the fabric; id 63 is a tighter diagonal with tan thread in hard contrast against a
near-black falloff. Different thread contrast, different area of the garment, different framing.

### Non-blocking nits

- `-closing.jpg` is near-monochrome — the same nit logged against id 62's garment shot. Consistent with the
  set's treatment, so left as is.
- `-section1.jpg`: the tape measure's printed numerals don't run in a continuous sequence under close
  inspection. Invisible at article display size.
