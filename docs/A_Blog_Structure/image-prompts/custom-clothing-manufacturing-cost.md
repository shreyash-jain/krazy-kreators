# Image prompts — `custom-clothing-manufacturing-cost` (id 60)

Five photographic slots, five different registers. **The two teaching graphics are built natively as
inline SVG in the client component**, so there is nothing to generate for them and their numbers
cannot drift from the body.

Save the generated files to `public/blog/` with these exact names:

| # | Slot | Filename | Register |
|---|---|---|---|
| 1 | Hero | `custom-manufacturing-cost-hero.jpg` | Environmental still life |
| 2 | Section 1 | `custom-manufacturing-cost-section1.jpg` | Documentary wide |
| 3 | MOQ tiers | `custom-manufacturing-cost-garment.jpg` | Single finished garment |
| 4 | Fabric | `custom-manufacturing-cost-macro.jpg` | Macro detail |
| 5 | Closing | `custom-manufacturing-cost-closing.jpg` | Abstract / conceptual |

Shared direction across all four: one cohesive warm-neutral treatment (bone, oat, graphite, a single
warm tan accent), real-camera look, natural grain, available light, depth layering, slight handheld
imperfection. **Not a render, not CGI, not over-smoothed or AI-glossy.** No logos, no brand marks, no
identifiable faces, no readable text. Small **"KK"** watermark bottom-right on each.

Pre-flight note: the previous post (id 59) used a fabric-off-the-roll macro under raking light — the
macro below is deliberately a cutting-table lay instead, so the two sets do not resemble each other.

---

### 1. Hero — `custom-manufacturing-cost-hero.jpg` · 1:1 (1024×1024)

**Purpose:** the article's thesis in one frame — a garment price being worked out, not quoted.
**Composition:** three-quarter view across a costing desk; printed cost sheet with a column of
handwritten figures, a small calculator resting on it, a folded unbranded cotton tee sitting just
behind and slightly out of focus, a pencil abandoned mid-annotation. **Lighting:** low warm raking
light from a west-facing window, long soft shadows, one bright highlight on the calculator's edge.
**Mood:** quiet, end-of-day, unglamorous competence.

> Shot on a Canon AE-1 with a 50mm f/1.4 on Kodak Portra 400. A costing desk in a small garment
> studio at 5pm: a printed cost sheet covered in handwritten figures, a calculator resting on one
> corner, a pencil left mid-annotation, a folded plain cotton tee soft-focused behind. Warm raking
> window light, long shadows, natural grain, foreground paper edge out of focus. No faces, no logos,
> no readable words. Not a render, not CGI, not over-smoothed.

---

### 2. Section 1 — `custom-manufacturing-cost-section1.jpg` · 1:1 (1024×1024)

**Purpose:** the five-line breakdown as a real working scene.
**Composition:** documentary wide of a costing table mid-review — several cost sheets spread and
overlapping, a swatch card of plain cloth squares laid diagonally at one edge, a half-finished sample
sleeve pushed to the corner, one chair pulled back. Hands out of frame entirely.
**Lighting:** cool, even north-window daylight, no artificial fill. **Mood:** procedural, in-progress.

> Shot on a Leica M6 with a 35mm f/2 on Kodak Portra 400. Documentary wide of a garment costing table
> mid-review: overlapping printed cost sheets, a plain cloth swatch card angled at one edge, a
> half-finished unbranded sample sleeve pushed to the corner, a chair pulled back. Cool even
> north-window daylight, honest shadows, natural grain, lived-in clutter. No people, no logos, no
> readable text. Not a render, not CGI, not over-smoothed.

*(Note: the swatch card is a working prop within a wide documentary scene — this is not an overhead
flat-lay of folded fabric squares, which is hard-banned.)*

---

### 3. MOQ tiers — `custom-manufacturing-cost-garment.jpg` · 1:1 (1024×1024)

**Purpose:** the thing all these numbers are actually buying — one garment, shot like it matters.
**Composition:** a single unbranded cotton crew tee on an invisible mannequin form, turned three
quarters away, shoulders squared. Neck rib and shoulder seam catch the light; the body falls into
shadow. Nothing else in frame — no props, no surface, no second garment.
**Lighting:** one hard directional source from camera left, deep unlit falloff to near-black on the
right. **Mood:** deliberate, considered, product-as-object.

> Shot on a Hasselblad 500C/M with an 80mm f/2.8 on Kodak Portra 160. A single plain cotton crew tee
> on an invisible mannequin form, turned three quarters, shoulders squared, against a deep shadowed
> seamless backdrop. One hard directional light from camera left carves the neck rib and shoulder seam;
> the body falls into darkness on the right. Visible knit texture, natural grain, no props. No print,
> no label, no logo, no face. Not a render, not CGI, not over-smoothed.

---

### 4. Fabric macro — `custom-manufacturing-cost-macro.jpg` · 1:1 (1024×1024)

**Purpose:** where fabric consumption is actually decided — the marker over the lay.
**Composition:** extreme close-up of a cutting-table lay: roughly forty plies of pale cotton jersey
stacked and squared, a printed marker sheet pinned across the top with nested pattern outlines
running edge to edge, one chalked notch in razor-sharp focus, layers falling away into blur.
**Lighting:** hard low sidelight rakes across the stacked ply edges, picking out every layer.

> Shot on a Nikon F3 with a 105mm macro on Kodak Portra 160. Extreme close-up of a cutting-table lay:
> forty plies of pale cotton jersey stacked and squared, a printed marker sheet pinned across the top
> with nested pattern outlines edge to edge, one chalked notch tack-sharp, the stack falling into
> blur. Hard low sidelight rakes the layered edges. Visible fibre and paper texture, natural grain.
> No hands, no logos, no readable text. Not a render, not CGI, not over-smoothed.

---

### 5. Closing — `custom-manufacturing-cost-closing.jpg` · 1:1 (1024×1024)

**Purpose:** the counterexample made visual — capital at risk versus a small deliberate run.
**Composition:** a quiet stockroom at end of day. Sealed cartons stacked shoulder-high filling the
left third; a single short stack of four boxes on the right; a wide empty floor between them, long
shadows falling across it from a high window. Slightly wide, slightly low camera.
**Lighting:** one shaft of late daylight from a high window, deep shadow elsewhere. **Mood:** still,
consequential, a little uneasy.

> Shot on a Pentax 67 with a 55mm on CineStill 400D. A quiet stockroom at end of day: plain sealed
> cartons stacked shoulder-high on the left, a single short stack of four boxes on the right, wide
> empty concrete floor between them, long shadows cast by one shaft of late light from a high window.
> Slightly low wide angle, deep shadow, natural grain, dust in the beam. No people, no logos, no
> readable labels. Not a render, not CGI, not over-smoothed.

---

## Verification before merge

- Open every file (do not trust filenames) and confirm five **distinct** images — check MD5s differ.
- Confirm each returns 200 from the dev server and byte size matches disk.
- Confirm none carries readable text, a logo, or an identifiable face.
- The inline SVG infographics need no check for drift, but if the body numbers are ever edited,
  update `AMORT_ROWS` and `STACK` in `ManufacturingCostClient.tsx` to match.
