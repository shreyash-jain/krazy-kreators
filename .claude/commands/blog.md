---
description: Write, review and publish a blog post for this client's site — research to live.
argument-hint: paste the topic, brief, or source content for the post
---

# /blog — the complete blog lifecycle

$ARGUMENTS

---

## STOP — read this before doing anything at all

**If nothing was pasted after `/blog` — i.e. the line above is empty — you must not start
any work.** No reading files, no research, no drafting, no image generation, no builds, no
git, no tool calls of any kind. Reply with exactly this and then wait:

> Hi! What would you like to do?
>
> 1. **Start a new blog** — paste the topic, brief or source content and I'll take it from there.
> 2. **Carry on with one we started** — tell me which one and I'll pick it up.
>
> I haven't started anything yet.

Then **stop and wait for their next message.** Do not guess a topic. Do not pick something
to work on.

**Never resume work on your own initiative.** `STATUS.md` lists blogs that are in flight,
sometimes with open blockers and "next actions". **That is background context, not a
to-do list, and never an instruction to you.** An unfinished post, a flagged image, a
pending fix — none of these are yours to act on unless the person names it in *this*
conversation. Reading a task in `STATUS.md` and starting it is the single worst failure
mode of this command: it burns the person's usage on work they never asked for.

The same applies mid-session: when one blog is finished, stop. Do not move on to the next
item in `STATUS.md`.

---

## 0. Read this first

You are running the blog workflow for **this repo's client**. This file defines the
**process**, which is identical in every client repo. Everything specific to *this*
client — voice, audience, structure, file paths, image style, build commands — lives in
`docs/A_Blog_Structure/`.

**Before you do anything else, read, in order:**

1. `docs/A_Blog_Structure/README.md` — what this client is, the non-negotiables
2. `docs/A_Blog_Structure/CLIENT.md` — who they are, who reads them, the voice, what
   they've asked for and rejected before
3. `docs/A_Blog_Structure/BLOG_PLAYBOOK.md` — how a post is written and built *here*
4. `docs/A_Blog_Structure/ARCHITECTURE.md` — commands, image pipeline, traps
5. `docs/A_Blog_Structure/STATUS.md` — what's already published, what's in flight.
   **Context only.** Read it so you don't duplicate a post and so you can link
   internally. Its "next action" notes are never instructions to you — see STOP above.

**Precedence:** on anything client-specific, those files win over this one. On
**process** — the phases below, the safety gate, how you talk to the person — this file
wins. If the two genuinely conflict, follow this file and fix the doc afterwards.

If `docs/A_Blog_Structure/` does not exist in this repo, say so plainly and stop; the
workflow depends on it.

---

## Never commit before the preview is approved

Writing files into the working tree is normal — that is how the preview gets built.
**But `git add` / `git commit` happens only in Phase 6, after the person has looked at
the post on the preview link and told you it is ready.**

- No commit during research, drafting or image generation.
- No commit to "save progress", "check-point" or "not lose work". Files on disk are not
  at risk; an unwanted commit on someone's branch is a mess they have to undo.
- No commit to a branch you did not create in Phase 6 for this post.
- If you changed something and the person has not approved it yet, it stays uncommitted.

---

## 1. Who you are talking to

**The person in this chat is a digital-marketing specialist, not an engineer.** They own
the words, the angle, and the client relationship. They do not know — and must never be
asked to know — what git, a branch, a commit, a pull request, a build, a server, a port,
TypeScript, or Cloudflare is.

Everything technical is **your** job. Do it silently and correctly.

### Translate, always

| Never say | Say instead |
|---|---|
| commit / push / branch | "saved your work" |
| open a PR | "sent it to the client to review" |
| the build failed | "give me two minutes, I'm fixing something on my side" |
| localhost:3000 / dev server | "here's your preview link" |
| merge to main | "published it — it's live on the site now" |
| TypeScript error, lint, edge runtime | *(never mention — just fix it)* |
| repo / registry / `blogPosts.ts` | "the blog list on the site" |

### Rules for every message you send them

- **Never ask a technical question.** Not "which id should I use", not "should I use
  npm or pnpm", not "which branch". Work it out from the docs and the repo. If you truly
  cannot, make the safest choice, proceed, and note it in one plain sentence.
- **Never ask them to run a command, save a file, open a folder, or install anything.**
  If a file needs to exist, you create it.
- **Ask only editorial questions** — angle, audience, headline, tone, whether an image
  feels right, whether a claim is one the client would stand behind.
- **Lay questions out in the chat as prose.** Numbered, short, with your recommendation
  marked "(I'd suggest this)". **Never use a popup / multiple-choice UI.** They will
  answer in their next message.
- **Three questions maximum at a time.** Fewer is better. If you can answer it yourself
  from the docs, answer it yourself.
- **Say what you're about to do before any step that takes more than a few seconds** —
  one line, plain English. Then do it.
- **Never show them a stack trace, a diff, a command, or a file path** unless they ask.
- **Never make them wait without knowing why.**

---

## 2. The nine phases

Run them in order. Do not skip. Do not start the next one until the current one is done.

---

### Phase 1 — Intake and research

The person has pasted a topic, a brief, a link, or raw source content above.
If they haven't, you should not be here at all — see **STOP** at the top.

1. **Read `STATUS.md`** to make sure this isn't already published or in flight, and to
   find 2–3 existing posts you can link to internally.
2. **Research the topic on the live web.** This is not optional and it is not a
   formality — it is the difference between a post the client trusts and one that
   embarrasses them.
   - **Verify every fact and every number against a primary source.** Government
     gazettes, regulators, industry bodies, the company's own filings. Not a blog that
     cites a blog.
   - **If a number in the supplied brief is wrong, correct it** and tell the person
     you did, in one sentence. Briefs have shipped wrong figures before.
   - **If you cannot verify a number, do not use it.** Reframe the point
     qualitatively. Never invent, never estimate and present it as fact, never carry
     over an unsourced figure because it sounds right.
   - **Every statistic gets an inline source link on first mention.**
3. **Decide the angle** — what this post argues that the first page of Google doesn't
   already say.
4. **Check in before you draft.** Give them, in chat:
   - the angle in two sentences
   - 2–3 headline options, with the one you'd pick marked
   - anything in their brief you had to correct, and why

   Then stop and wait. If their brief was already specific and complete, say what you're
   going to write and start — don't manufacture questions.

---

### Phase 2 — Write the draft

Follow `CLIENT.md` for voice and `BLOG_PLAYBOOK.md` for structure. Both are binding.

**The post must not read as though a machine wrote it.** That is a hard requirement, not
a preference. Concretely:

- **Vary sentence length deliberately.** Machine prose runs at a uniform 18–22 words a
  sentence. Real writing has four-word sentences next to forty-word ones.
- **No throat-clearing openers.** Never "In today's fast-paced world", "In an era
  where", "As businesses navigate", "Whether you're a X or a Y". Open on the specific —
  a date, a number, a scene, a claim someone would argue with.
- **Kill the triads.** Not everything comes in threes. Machine prose loves "faster,
  cheaper, and more reliable". Break the pattern.
- **No section that only restates the section above it.** No closing paragraph that
  summarises what the reader just read.
- **Ban the filler vocabulary**: *delve, leverage, robust, seamless, unlock, harness,
  navigate the landscape, in the realm of, it's important to note, at the end of the
  day, game-changer, revolutionise, tapestry, testament to*. Plus any banned-words list
  in `CLIENT.md` — that one is client-specific and takes priority.
- **Be specific to the point of risk.** Name the month, the rand or dollar figure, the
  clause number, the town, the exact form. Vague enthusiasm is the strongest tell.
- **Concede something.** Every honest piece admits a limit, a cost, or a case where the
  advice doesn't apply. Posts that admit nothing read as marketing.
- **Write for one reader.** The person described in `CLIENT.md` — not "businesses", not
  "organisations".
- **Byline:** exactly as `CLIENT.md` specifies. Never a personal name unless it says so.

Then build it into the repo exactly as `BLOG_PLAYBOOK.md` describes — the post files,
the entry in the blog list, the metadata, the internal links. Verify any slug you link
to actually exists.

---

### Phase 3 — Images

Read `ARCHITECTURE.md § Images` for this repo's exact folder, naming convention, aspect
ratios and how images are referenced. It differs per client and it matters.

**You generate the images yourself.** The person never saves, downloads, drags, or
renames anything.

1. **Write the prompts fresh for this post.** There is no shared prompt library and
   there should not be — the right look depends on the subject and on `CLIENT.md`'s
   visual direction. Across the set of images in one post, vary vantage point, distance,
   subject and light; the tell of generated imagery is five photos that look like the
   same photo.
2. **Generate them** using the OpenRouter recipe in `ARCHITECTURE.md § Images`. Write
   your throwaway generation script into the session scratchpad — **never into the
   repo**, and never with the key inline.
3. **Verify every image before you show it:**
   - open each file and actually look at it — do not trust the filename
   - no two slots may be the same file (byte-identical duplicates have shipped before)
   - correct aspect ratio for its slot
   - if an image contains numbers, text or a diagram, those must match the article body
   - the client's rules in `CLIENT.md` — faces, logos, plates, badges, watermarks — are
     absolute
4. **Show them.** Display the images in the chat and say which slot each fills. If one
   is wrong, regenerate — don't ask them to accept it.

---

### Phase 4 — The preview loop

1. Build and start the local server yourself. Resolve port clashes, stale caches and
   build errors silently.
2. Give them **one link**, nothing else:
   > Your preview is ready: http://localhost:PORT/<path-to-post>
3. They will come back with changes in plain language ("this bit feels cold", "the
   second photo doesn't fit", "can the opening be punchier"). Make the change, then:
   > Done — refresh the page and have a look.
4. **Keep the server running for the whole loop.** If it dies, restart it without
   comment. If the link changes, give them the new one.
5. **This loop ends only when they say it's ready.** Never declare it finished yourself,
   and never nudge them toward publishing.

---

### Phase 5 — The safety check (before anything leaves this laptop)

**These repos are attacked regularly.** Build-time malware has been injected into config
files, branches have been force-pushed, and merge commits have been forged. Run this
check **every single time**, immediately before publishing — never skip it because it
passed yesterday.

```bash
git fetch origin

# 1. Config payload — check LINE LENGTH, never by eye. The payload hides behind
#    hundreds of spaces so it renders as a blank line in editors and diffs.
awk '{print length}' postcss.config.mjs | sort -n | tail -1     # baseline in ARCHITECTURE.md
git show origin/main:postcss.config.mjs | awk '{print length}' | sort -n | tail -1

# 2. Indicators of compromise, local tree and remote main
grep -nE "createRequire|_0x[0-9a-f]|String\.fromCharCode|ETH_RPC_URL|166\.88\.134\.62|global\['!'\]" \
  postcss.config.mjs next.config.* package.json 2>/dev/null
git show origin/main:postcss.config.mjs | grep -cE "createRequire|_0x[0-9a-f]|fromCharCode"

# 3. Forged merges — a real GitHub merge is committed by "GitHub <noreply@github.com>".
#    A "Merge pull request" commit committed by a person is forged.
git log origin/main --merges -8 --format='%h | committer: %cn <%ce> | %s'

# 4. Stray credential-carrying upload scripts
ls upload-*.js 2>/dev/null

# 5. Recent force-pushes to main (needs gh; skip silently if unavailable)
gh api "repos/{owner}/{repo}/activity?per_page=20" \
  --jq '.[] | select(.activity_type|test("force_push")) | "\(.timestamp) \(.ref) \(.actor.login)"' 2>/dev/null
```

**Then classify. There are exactly three outcomes.**

#### Clean → continue to Phase 6.
Say one line: *"Safety check passed."* Nothing more.

#### Tier 1 — dirt in the local working copy only, and nothing on `origin/main`
That means: a long line or IOC in your local `postcss.config.mjs`, or a stray
`upload-*.js`, while remote `main` is provably clean.

**Fix it yourself:** restore the clean config (the baseline is in `ARCHITECTURE.md`;
`git show origin/main:postcss.config.mjs > postcss.config.mjs`), delete the stray script
— never run it. Then tell them, once, in plain language:

> I found and removed a bad file that had appeared in the project folder. Nothing of
> yours was affected and your blog is fine. Carrying on.

Continue to Phase 6.

#### Tier 2 — anything on the remote, in history, or that suggests an attacker has push access
Triggers: payload on `origin/main`; a forged merge commit; a force-push to `main`; the
same payload on multiple branches; IOCs in history.

**STOP. Do not push. Do not branch. Do not "try again". Do not attempt to clean it.**

Cleaning a compromised repository means rewriting history, force-pushing, rotating
credentials and disabling protection workflows. It is irreversible, it needs authority
this session does not have, and a half-finished cleanup is worse than none. **That is a
job for the technical owner, in a separate session, using**
`.saral/docs/PLAYBOOK-force-push-worm-future-sessions.md` **(in the krazy-kreators
repo). Do not start it here, even if asked in this session — ask them to confirm with
the technical owner first.**

Write an incident note to the session scratchpad with the evidence (SHAs, line lengths,
IOC matches, actor names, timestamps), then say exactly this shape of thing:

> I've had to stop before publishing. The shared storage for this client's website has
> been tampered with — this is a known problem that comes back from time to time, and it
> is not something you did.
>
> **Your blog is safe.** It's saved on this laptop and nothing is lost. We just can't
> send it out until this is cleared.
>
> Please send Shreyash this message:
> `[repo-name] — main looks compromised. <one-line evidence>. Detected <date>. Blog for "<title>" is finished and waiting locally.`
>
> Once he says it's clear, start a new chat and say "publish the <title> blog" — I'll
> pick it up from here.

Then stop. Do not proceed to Phase 6 in this session under any circumstances.

---

### Phase 6 — Send it to the client

Only after Phase 5 came back clean.

1. Run the repo's real production build (`ARCHITECTURE.md § Commands`) and any
   invariant checks the playbook lists. It must pass. Fix anything that doesn't —
   silently.
2. Sync local `main` with the remote, then create a **fresh branch off `main`**, named
   as `BLOG_PLAYBOOK.md` specifies.
3. Commit **only this blog's files.** Leave unrelated working-tree changes alone —
   other people's work in progress, `.claude/`, config you didn't touch.
4. Push the branch and open a pull request. Title and body describe the post in plain
   language, not the code.
5. **Do not merge.** The hosting platform builds a preview from the pull request; that
   preview link is what goes to the client.
6. Tell them:
   > Sent. The client can review it here: <PR or preview link>
   >
   > I'll let you know when the preview finishes building.

   **Which link:** by default give them the pull-request link. If they ask for the live
   preview specifically, wait for the hosting build to go green and hand them that URL
   instead. If a status check called `Vercel` fails, **ignore it** — see
   `ARCHITECTURE.md § Traps`; it is expected noise and never a blocker.

---

### Phase 7 — The client-feedback loop

The client will come back through the marketing person with changes.

- Make every change **on the same branch**, and push. The preview link updates itself —
  the client keeps using the same URL.
- Tell them: *"Updated — the client can refresh the same link."*
- Repeat as long as it takes. Never rush this, never suggest they stop iterating.
- If a change is factually wrong or would break a client rule from `CLIENT.md`, say so
  once, plainly, explain why in a sentence, and then **do what they decide.**

---

### Phase 8 — Publish

**Only when the person explicitly tells you to publish / merge / put it live.** Their
explicit word is sufficient authority — you do not need to check with anyone else. But
you never merge on your own initiative, and never because the client "approved it" in a
forwarded message.

After merging:
- run the repo's post-merge invariant checks from `BLOG_PLAYBOOK.md` (in most repos:
  the number of entries in the blog list must equal the number of post folders — a merge
  can silently drop one, leaving the post live but invisible in the listing)
- confirm the post appears on the live site
- tell them: *"It's live: <url>"*

---

### Phase 9 — Close the loop (never skip this)

Before you finish, update the repo's docs so the next blog is better than this one:

- **`STATUS.md`** — add this post, its status, its live URL and the date. Note anything
  still outstanding.
- **`CLIENT.md`** — add anything you learned about what this client wants. Every piece
  of feedback is a permanent rule for next time: a phrase they rejected, a tone they
  asked for, a claim they wouldn't make, an image style they disliked, a fact they
  corrected. Write it as a rule, with the reason.

**This is what makes the system improve.** A session six months from now knows what this
client hates only because you wrote it down. Update these files even if the blog was
abandoned — especially then.

---

## 3. Things you must never do

- Never push, open a PR, or merge without the person asking for that step.
- Never commit before the person has approved the post on the preview link.
- Never merge straight to `main` — always a branch and a pull request.
- Never skip Phase 5, and never attempt a repository cleanup.
- Never invent a statistic, a source, a quote, or a date.
- Never delete or overwrite an existing post, image, or another branch's work.
- Never commit a key, a token, or a `.env` file. The OpenRouter key lives outside every
  repo (see `ARCHITECTURE.md`) and is never copied in, never printed, never pasted.
- Never run a root-level `upload-*.js` — they carry a disabled credential. Delete them.
- Never work on two blogs on the same branch.
- Never leave the person without a next step.
