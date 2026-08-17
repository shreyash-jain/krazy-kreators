"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X, Download } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "clothing-production-timeline";

const HERO_IMAGE = "/blog/production-timeline-hero.jpg";
const SECTION1_IMAGE = "/blog/production-timeline-section1.jpg";
const SAMPLING_IMAGE = "/blog/production-timeline-sampling.jpg";
const MACRO_IMAGE = "/blog/production-timeline-macro.jpg";
const CLOSING_IMAGE = "/blog/production-timeline-closing.jpg";

const TOC = [
    { id: "four-months", label: "Four months is real — here’s the catch" },
    { id: "map", label: "The whole timeline on one screen" },
    { id: "phase-1", label: "Phase 1 — Design: weeks 1–4" },
    { id: "phase-2", label: "Phase 2 — Sampling & sourcing: weeks 5–11" },
    { id: "phase-3", label: "Phase 3 — Bulk production: weeks 12–17" },
    { id: "phase-4", label: "Phase 4 — QC & dispatch: weeks 18–23" },
    { id: "blackouts", label: "Three dates that move everyone’s calendar" },
    { id: "backwards", label: "Count backwards from the shelf" },
    { id: "slips", label: "Where the weeks actually disappear" },
    { id: "faster", label: "What genuinely makes it faster" },
    { id: "wrong", label: "When four months is the wrong number" },
    { id: "the-move", label: "What we’d do in your shoes" },
    { id: "faq", label: "Common questions" },
];

const ACCENT = "#CBB49A";

/* Phase palette — used by every graphic so colour means the same thing throughout */
const P1 = "#2D2A2E"; // Design
const P2 = "#8C7A5E"; // Sampling & sourcing
const P3 = ACCENT; //     Bulk production
const P4 = "#D8CBB6"; // QC & dispatch

type Faq = { q: string; a: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
};

/* ------------------------------------------------------------------ */
/* Infographic 01 — the master schedule                                */
/* Chart area x = 200 → 660 spans 23 weeks, so 1 week = exactly 20px.  */
/* Every bar x/width below is (200 + startWeek*20) and (weeks*20).     */
/* ------------------------------------------------------------------ */
const SCHEDULE = [
    { label: "Range plan and line sheet", x: 200, w: 40, dur: "2 wks", fill: P1, phase: "Design" },
    { label: "Sketches and tech packs", x: 240, w: 40, dur: "2 wks", fill: P1, phase: "Design" },
    { label: "Fabric sourcing, lab dips", x: 280, w: 60, dur: "3 wks", fill: P2, phase: "Sampling" },
    { label: "Pattern and first sample", x: 340, w: 40, dur: "2 wks", fill: P2, phase: "Sampling" },
    { label: "Fit rounds, PP sign-off", x: 380, w: 40, dur: "2 wks", fill: P2, phase: "Sampling" },
    { label: "Bulk fabric knit and dye", x: 420, w: 40, dur: "2 wks", fill: P3, phase: "Production" },
    { label: "Cut, sew, finish", x: 460, w: 80, dur: "4 wks", fill: P3, phase: "Production" },
    { label: "Final QC and packing", x: 540, w: 20, dur: "1 wk", fill: P4, phase: "Dispatch" },
    { label: "Ocean freight", x: 560, w: 80, dur: "4 wks", fill: P4, phase: "Dispatch" },
    { label: "Customs and inland delivery", x: 640, w: 20, dur: "1 wk", fill: P4, phase: "Dispatch" },
];

const WEEK_TICKS = [
    { wk: 0, x: 200 },
    { wk: 4, x: 280 },
    { wk: 8, x: 360 },
    { wk: 12, x: 440 },
    { wk: 16, x: 520 },
    { wk: 20, x: 600 },
    { wk: 23, x: 660 },
];

const PHASE_LEGEND = [
    { name: "1 · Design", weeks: "wks 1–4", fill: P1 },
    { name: "2 · Sampling & sourcing", weeks: "wks 5–11", fill: P2 },
    { name: "3 · Bulk production", weeks: "wks 12–17", fill: P3 },
    { name: "4 · QC & dispatch", weeks: "wks 18–23", fill: P4 },
];

function ScheduleGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                A 23-week collection, week by week
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                A small first collection on ocean freight. The four colour bands are the four phases; the stages inside
                them are what actually fills the calendar.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 386"
                    role="img"
                    aria-label="Gantt chart of a 23-week clothing production timeline. Range plan and line sheet, weeks 1 to 2. Sketches and tech packs, weeks 3 to 4. Fabric sourcing and lab dips, weeks 5 to 7. Pattern and first sample, weeks 8 to 9. Fit rounds and pre-production sign-off, weeks 10 to 11. Bulk fabric knitting and dyeing, weeks 12 to 13. Cut, sew and finish, weeks 14 to 17. Final quality check and packing, week 18. Ocean freight, weeks 19 to 22. Customs and inland delivery, week 23."
                    className="w-full h-auto min-w-[660px]"
                >
                    <title>The clothing production timeline, stage by stage across 23 weeks</title>

                    {WEEK_TICKS.map((t) => (
                        <line key={t.wk} x1={t.x} y1="34" x2={t.x} y2="344" stroke="#E4DFD6" strokeWidth="1" />
                    ))}

                    {SCHEDULE.map((row, i) => {
                        const y = 46 + i * 30;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y + 15} fontSize="12.5" fill="#4A484A">
                                    {row.label}
                                </text>
                                <rect
                                    x={row.x}
                                    y={y}
                                    width={row.w}
                                    height="21"
                                    rx="3"
                                    fill={row.fill}
                                    stroke="#F8F7F4"
                                    strokeWidth="1"
                                />
                                <text x={row.x + row.w + 7} y={y + 15} fontSize="11.5" fill="#8C7A5E" fontWeight="700">
                                    {row.dur}
                                </text>
                            </g>
                        );
                    })}

                    <line x1="200" y1="348" x2="660" y2="348" stroke="#D9D3C8" strokeWidth="2" />
                    {WEEK_TICKS.map((t) => (
                        <text key={t.wk} x={t.x} y="366" fontSize="11.5" fill="#666666" textAnchor="middle">
                            wk {t.wk}
                        </text>
                    ))}
                    <text x="0" y="366" fontSize="11.5" fill="#666666">
                        you decide
                    </text>
                    <text x="660" y="382" fontSize="11.5" fill="#2D2A2E" fontWeight="700" textAnchor="end">
                        stock in your warehouse
                    </text>
                </svg>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
                {PHASE_LEGEND.map((p) => (
                    <div key={p.name} className="flex items-start gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-sm flex-shrink-0 mt-1 border border-black/10"
                            style={{ backgroundColor: p.fill }}
                        />
                        <span className="text-sm text-[#4A484A] leading-snug">
                            <span className="block font-semibold text-[#2D2A2E]">{p.name}</span>
                            {p.weeks}
                        </span>
                    </div>
                ))}
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Look at where the bars sit. Eleven of the twenty-three weeks pass before a single garment of your run is
                cut. Sewing &mdash; the part everyone pictures when they say &ldquo;manufacturing&rdquo; &mdash; is four
                weeks in the middle.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 02 — the three lanes                                    */
/* Bars start at x = 200, scale 15px per week (29 wks → 435px → 635).  */
/* ------------------------------------------------------------------ */
const LANES = [
    {
        name: "Fast lane",
        note: "one simple style, air freight",
        total: "16 weeks",
        months: "≈ 3.7 months",
        y: 46,
        segs: [
            { x: 200, w: 120, fill: P1 },
            { x: 320, w: 90, fill: P3 },
            { x: 410, w: 30, fill: P4 },
        ],
        end: 440,
        label: "16 wks",
    },
    {
        name: "Realistic",
        note: "small collection, ocean freight",
        total: "23 weeks",
        months: "≈ 5.3 months",
        y: 118,
        segs: [
            { x: 200, w: 165, fill: P1 },
            { x: 365, w: 105, fill: P3 },
            { x: 470, w: 75, fill: P4 },
        ],
        end: 545,
        label: "23 wks",
    },
    {
        name: "First-timer",
        note: "learning the process while running it",
        total: "29 weeks",
        months: "≈ 6.7 months",
        y: 190,
        segs: [
            { x: 200, w: 210, fill: P1 },
            { x: 410, w: 135, fill: P3 },
            { x: 545, w: 90, fill: P4 },
        ],
        end: 635,
        label: "29 wks",
    },
];

const LANE_KEY = [
    { name: "Before anything is cut", detail: "planning, tech packs, fabric, sampling", fill: P1 },
    { name: "Making it", detail: "bulk fabric, cut, sew, QC, packing", fill: P3 },
    { name: "Moving it", detail: "freight, customs, inland delivery", fill: P4 },
];

function LanesGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The same collection, three speeds
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Nothing changes about the factory across these three rows. What changes is how quickly decisions get
                made and how the goods travel.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 262"
                    role="img"
                    aria-label="Three timelines compared. Fast lane, one simple style on air freight: 8 weeks before anything is cut, 6 weeks making it, 2 weeks moving it, 16 weeks total. Realistic, a small collection on ocean freight: 11 weeks before cutting, 7 weeks making, 5 weeks moving, 23 weeks total. First-timer learning the process: 14 weeks before cutting, 9 weeks making, 6 weeks moving, 29 weeks total."
                    className="w-full h-auto min-w-[640px]"
                >
                    <title>Fast, realistic and first-timer clothing production timelines compared</title>

                    {LANES.map((lane) => (
                        <g key={lane.name}>
                            <text x="0" y={lane.y + 18} fontSize="16" fontWeight="800" fill="#2D2A2E">
                                {lane.name}
                            </text>
                            <text x="0" y={lane.y + 37} fontSize="12" fill="#666666">
                                {lane.note}
                            </text>
                            <text x="0" y={lane.y + 56} fontSize="12.5" fontWeight="700" fill="#8C7A5E">
                                {lane.months}
                            </text>
                            {lane.segs.map((s) => (
                                <rect
                                    key={s.x}
                                    x={s.x}
                                    y={lane.y}
                                    width={s.w}
                                    height="42"
                                    fill={s.fill}
                                    stroke="#F8F7F4"
                                    strokeWidth="1.5"
                                />
                            ))}
                            <text x={lane.end + 10} y={lane.y + 27} fontSize="15" fontWeight="800" fill="#2D2A2E">
                                {lane.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <ul className="mt-5 grid sm:grid-cols-3 gap-x-6 gap-y-3">
                {LANE_KEY.map((k) => (
                    <li key={k.name} className="flex items-start gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-sm flex-shrink-0 mt-1 border border-black/10"
                            style={{ backgroundColor: k.fill }}
                        />
                        <span className="text-sm text-[#4A484A] leading-snug">
                            <span className="block font-semibold text-[#2D2A2E]">{k.name}</span>
                            {k.detail}
                        </span>
                    </li>
                ))}
            </ul>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                The dark band grows fastest as you move down the chart. Between the fast lane and the first-timer, six
                of the thirteen extra weeks are added before a single metre of cloth is cut &mdash; and none of them
                are the factory&rsquo;s.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 03 — the backward planner                               */
/* Strip x = 60 → 660 spans 21 Sep 2026 → 1 Mar 2027 (161 days),       */
/* so 1 day = 3.7267px. Every x below is 60 + (dayOffset * 3.7267).    */
/* ------------------------------------------------------------------ */
const MONTH_MARKS = [
    { label: "Oct", x: 97 },
    { label: "Nov", x: 213 },
    { label: "Dec", x: 325 },
    { label: "Jan", x: 440 },
    { label: "Feb", x: 556 },
];

const PLAN_BANDS = [
    { label: "Design + sampling", sub: "11 weeks", x: 60, w: 287, fill: P1, text: "#FFFFFF" },
    { label: "Production", sub: "7 weeks", x: 347, w: 183, fill: P3, text: "#2D2A2E" },
    { label: "Freight + customs", sub: "5 weeks", x: 530, w: 130, fill: P4, text: "#2D2A2E" },
];

function BackwardPlannerGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 03</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                A 1 March drop is a 21 September decision
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The 23-week schedule laid over a real calendar &mdash; and over the one window in it you do not
                control.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 268"
                    role="img"
                    aria-label="A 23-week schedule mapped onto a calendar from 21 September 2026 to 1 March 2027. Design and sampling run from late September to early December. Production runs from early December to 25 January. Freight and customs run from 25 January to 1 March. A shaded blackout band covering 25 January to 20 February marks the Lunar New Year shutdown across Asian factories, with Lunar New Year itself on 6 February 2027. Production finishes in the same week the blackout begins, leaving no buffer."
                    className="w-full h-auto min-w-[660px]"
                >
                    <title>The 23-week schedule mapped onto the calendar, with the Lunar New Year blackout</title>

                    {/* Lunar New Year blackout band */}
                    <rect x="530" y="34" width="97" height="132" fill="#B4453A" fillOpacity="0.12" />
                    <line x1="530" y1="34" x2="530" y2="166" stroke="#B4453A" strokeWidth="1.5" strokeDasharray="4 3" />
                    <line x1="627" y1="34" x2="627" y2="166" stroke="#B4453A" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="578" y="28" fontSize="12" fontWeight="800" fill="#B4453A" textAnchor="middle">
                        factory blackout
                    </text>

                    {/* Month gridlines */}
                    {MONTH_MARKS.map((m) => (
                        <g key={m.label}>
                            <line x1={m.x} y1="40" x2={m.x} y2="180" stroke="#D9D3C8" strokeWidth="1" />
                            <text x={m.x + 5} y="196" fontSize="12" fill="#666666">
                                {m.label}
                            </text>
                        </g>
                    ))}

                    {/* Phase bands */}
                    {PLAN_BANDS.map((b) => (
                        <g key={b.label}>
                            <rect x={b.x} y="66" width={b.w} height="52" fill={b.fill} stroke="#F8F7F4" strokeWidth="1.5" />
                            <text
                                x={b.x + b.w / 2}
                                y="92"
                                fontSize="13.5"
                                fontWeight="700"
                                fill={b.text}
                                textAnchor="middle"
                            >
                                {b.label}
                            </text>
                            <text
                                x={b.x + b.w / 2}
                                y="110"
                                fontSize="12"
                                fill={b.text}
                                fillOpacity="0.8"
                                textAnchor="middle"
                            >
                                {b.sub}
                            </text>
                        </g>
                    ))}

                    {/* Baseline + endpoints */}
                    <line x1="60" y1="180" x2="660" y2="180" stroke="#2D2A2E" strokeWidth="2" />
                    <circle cx="60" cy="180" r="5" fill="#2D2A2E" />
                    <circle cx="660" cy="180" r="5" fill="#2D2A2E" />
                    <text x="60" y="220" fontSize="13" fontWeight="800" fill="#2D2A2E">
                        21 Sep 2026
                    </text>
                    <text x="60" y="238" fontSize="12" fill="#666666">
                        you commit
                    </text>
                    <text x="660" y="220" fontSize="13" fontWeight="800" fill="#2D2A2E" textAnchor="end">
                        1 Mar 2027
                    </text>
                    <text x="660" y="238" fontSize="12" fill="#666666" textAnchor="end">
                        on the shelf
                    </text>

                    {/* Lunar New Year marker */}
                    <line x1="574" y1="118" x2="574" y2="152" stroke="#B4453A" strokeWidth="2" />
                    <circle cx="574" cy="152" r="4" fill="#B4453A" />
                    <text x="574" y="262" fontSize="12" fontWeight="700" fill="#B4453A" textAnchor="middle">
                        Lunar New Year · 6 Feb 2027
                    </text>
                    <line x1="574" y1="152" x2="574" y2="248" stroke="#B4453A" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Notice where production ends: the same week the blackout starts. On paper it clears. Slip two weeks in
                October and the sewing lands inside the shutdown &mdash; where a two-week delay becomes a six-week one,
                because the factory does not come back to full strength until March.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 04 — where the weeks disappear                          */
/* Bars start at x = 310, scale 60px per week (4 wks → 240px → 550).   */
/* ------------------------------------------------------------------ */
const SLIPS = [
    { cause: "Tech pack has gaps, so samples", cause2: "come back wrong", w: 180, add: "+3 wks", fill: P1 },
    { cause: "Fabric chosen late, or a lab dip", cause2: "comes back off-colour", w: 180, add: "+3 wks", fill: P2 },
    { cause: "“Just one more fit sample”", cause2: "", w: 120, add: "+2 wks", fill: P3 },
    { cause: "An approval sitting unread", cause2: "in your inbox", w: 120, add: "+2 wks", fill: P3 },
    { cause: "Production lands on a factory", cause2: "holiday shutdown", w: 240, add: "+4 wks", fill: "#B4453A" },
];

function SlipGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 04</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The five ways a schedule quietly grows
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                These are the planning allowances we hold against each risk, not measured industry averages. Treat them
                as the buffer to build in, not a forecast.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 274"
                    role="img"
                    aria-label="Chart of five causes of schedule slippage and the weeks each typically adds. A tech pack with gaps, so samples come back wrong: three weeks. Fabric chosen late or a lab dip that comes back off-colour: three weeks. One more fit sample: two weeks. An approval sitting unread in your inbox: two weeks. Production landing on a factory holiday shutdown: four weeks."
                    className="w-full h-auto min-w-[640px]"
                >
                    <title>Five common causes of clothing production delay and the weeks each adds</title>

                    {[0, 1, 2, 3, 4].map((n) => (
                        <line
                            key={n}
                            x1={310 + n * 60}
                            y1="32"
                            x2={310 + n * 60}
                            y2="240"
                            stroke="#E4DFD6"
                            strokeWidth="1"
                        />
                    ))}

                    {SLIPS.map((s, i) => {
                        const y = 44 + i * 40;
                        return (
                            <g key={s.cause}>
                                <text x="0" y={s.cause2 ? y + 11 : y + 19} fontSize="13" fill="#4A484A">
                                    {s.cause}
                                </text>
                                {s.cause2 && (
                                    <text x="0" y={y + 27} fontSize="13" fill="#4A484A">
                                        {s.cause2}
                                    </text>
                                )}
                                <rect x="310" y={y} width={s.w} height="26" rx="3" fill={s.fill} />
                                <text x={310 + s.w + 10} y={y + 18} fontSize="14" fontWeight="800" fill="#2D2A2E">
                                    {s.add}
                                </text>
                            </g>
                        );
                    })}

                    <line x1="310" y1="248" x2="550" y2="248" stroke="#D9D3C8" strokeWidth="2" />
                    {[0, 1, 2, 3, 4].map((n) => (
                        <text key={n} x={310 + n * 60} y="266" fontSize="11.5" fill="#666666" textAnchor="middle">
                            {n === 0 ? "0" : `${n} wk${n > 1 ? "s" : ""}`}
                        </text>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Four of these five start on your side of the table, and every one of them is cheaper to prevent in week
                two than to absorb in week fifteen.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 05 — first run vs reorder                               */
/* Bars start at x = 180, scale 19px per week (23 wks → 437px → 617).  */
/* ------------------------------------------------------------------ */
const REORDER_ROWS = [
    {
        name: "First run",
        note: "nothing exists yet",
        y: 50,
        total: "23 wks",
        end: 617,
        segs: [
            { x: 180, w: 209, fill: P1 },
            { x: 389, w: 133, fill: P3 },
            { x: 522, w: 95, fill: P4 },
        ],
    },
    {
        name: "Reorder",
        note: "same style, second time",
        y: 160,
        total: "12 wks",
        end: 408,
        segs: [
            { x: 180, w: 133, fill: P3 },
            { x: 313, w: 95, fill: P4 },
        ],
    },
];

function ReorderGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 05</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The second time is half the wait
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The same style ordered again, once the pattern and the fabric spec already exist.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 250"
                    role="img"
                    aria-label="Two bars comparing a first production run with a reorder of the same style. The first run takes 23 weeks: 11 weeks of development, 7 weeks making, 5 weeks moving. A reorder takes 12 weeks, made up only of the 7 weeks making and 5 weeks moving, because the 11 development weeks are not repeated."
                    className="w-full h-auto min-w-[620px]"
                >
                    <title>A first production run of 23 weeks against a 12-week reorder</title>

                    {REORDER_ROWS.map((row) => (
                        <g key={row.name}>
                            <text x="0" y={row.y + 20} fontSize="16" fontWeight="800" fill="#2D2A2E">
                                {row.name}
                            </text>
                            <text x="0" y={row.y + 39} fontSize="12" fill="#666666">
                                {row.note}
                            </text>
                            {row.segs.map((s) => (
                                <rect
                                    key={s.x}
                                    x={s.x}
                                    y={row.y}
                                    width={s.w}
                                    height="44"
                                    fill={s.fill}
                                    stroke="#F8F7F4"
                                    strokeWidth="1.5"
                                />
                            ))}
                            <text x={row.end + 10} y={row.y + 28} fontSize="15" fontWeight="800" fill="#2D2A2E">
                                {row.total}
                            </text>
                        </g>
                    ))}

                    {/* bracket under the development block of the first run */}
                    <path d="M180 104 L180 116 L389 116 L389 104" fill="none" stroke="#8C7A5E" strokeWidth="1.5" />
                    <text x="284" y="138" fontSize="13" fontWeight="700" fill="#8C7A5E" textAnchor="middle">
                        the 11 weeks a reorder skips
                    </text>
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Development is a one-time cost in time as well as money. Drop to about ten weeks if the mill still holds
                your cloth &mdash; which is the real argument for finishing one style properly instead of starting three.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 06 — what your reply speed costs                        */
/* Bars start at x = 210, scale 30px per week (14 wks → 420px → 630).  */
/* Totals reconcile with Infographic 02: development is 8 wks fast,    */
/* 14 wks slow — the same 6-week spread the six gates below produce.   */
/* ------------------------------------------------------------------ */
const GATES = [
    "Tech pack",
    "Lab dips",
    "First sample",
    "Fit round 1",
    "Fit round 2",
    "PP sample",
];

function ApprovalGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 06</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Six times someone waits on you
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Development has six approval gates. Sit on each for a week and you have added six weeks without anyone
                working slower.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 296"
                    role="img"
                    aria-label="Two bars showing how reply speed changes development time. Answering the same day keeps development at 8 weeks. Taking about a week at each of the six approval gates stretches development to 14 weeks. The six gates are the tech pack, lab dips, first sample, fit round one, fit round two and the pre-production sample."
                    className="w-full h-auto min-w-[640px]"
                >
                    <title>Development time at same-day approvals versus week-long approvals</title>

                    <text x="0" y="66" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        You answer
                    </text>
                    <text x="0" y="84" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        the same day
                    </text>
                    <rect x="210" y="46" width="240" height="40" fill={P1} />
                    <text x="460" y="72" fontSize="15" fontWeight="800" fill="#2D2A2E">
                        8 wks
                    </text>

                    <text x="0" y="136" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        You answer
                    </text>
                    <text x="0" y="154" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        within a week
                    </text>
                    <rect x="210" y="116" width="240" height="40" fill={P1} />
                    <rect x="450" y="116" width="180" height="40" fill="#B4453A" fillOpacity="0.55" />
                    <text x="640" y="142" fontSize="15" fontWeight="800" fill="#2D2A2E">
                        14 wks
                    </text>
                    <text x="540" y="142" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                        + 6 weeks
                    </text>

                    {GATES.map((g, i) => (
                        <g key={g}>
                            <rect
                                x={i * 115}
                                y="200"
                                width="107"
                                height="38"
                                rx="19"
                                fill="#FFFFFF"
                                stroke="#D9D3C8"
                                strokeWidth="1.5"
                            />
                            <text
                                x={i * 115 + 53}
                                y="224"
                                fontSize="11.5"
                                fontWeight="700"
                                fill="#4A484A"
                                textAnchor="middle"
                            >
                                {g}
                            </text>
                        </g>
                    ))}
                    <text x="345" y="268" fontSize="13" fill="#8C7A5E" fontWeight="700" textAnchor="middle">
                        six gates &middot; about a week each &middot; none of it is the factory
                    </text>
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                This is the entire gap between the fast lane and the first-timer lane in the chart further up. Nobody
                sews slower in the second row &mdash; the schedule simply spends six weeks in an inbox.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 07 — air against ocean                                  */
/* Bars start at x = 180, scale 12px per day (40 days → 480px → 660).  */
/* Ranges are the Freightos door-to-door figures quoted in the body.   */
/* ------------------------------------------------------------------ */
const DAY_TICKS = [
    { d: 0, x: 180 },
    { d: 10, x: 300 },
    { d: 20, x: 420 },
    { d: 30, x: 540 },
    { d: 40, x: 660 },
];

function FreightGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 07</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The only stage money can actually shorten
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Door-to-door transit, India to the US. The paler end of each bar is the slow end of the range.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 246"
                    role="img"
                    aria-label="Two bars comparing freight transit from India to the US. Air freight takes 8 to 10 days door to door. Ocean freight takes 30 to 40 days door to door, roughly three to four weeks longer."
                    className="w-full h-auto min-w-[620px]"
                >
                    <title>Air freight at 8 to 10 days against ocean freight at 30 to 40 days</title>

                    {DAY_TICKS.map((t) => (
                        <line key={t.d} x1={t.x} y1="34" x2={t.x} y2="182" stroke="#E4DFD6" strokeWidth="1" />
                    ))}

                    <text x="0" y="66" fontSize="15" fontWeight="800" fill="#2D2A2E">
                        Air freight
                    </text>
                    <text x="0" y="85" fontSize="13" fontWeight="700" fill="#8C7A5E">
                        8&ndash;10 days
                    </text>
                    <rect x="180" y="46" width="96" height="40" fill={P2} />
                    <rect x="276" y="46" width="24" height="40" fill={P2} fillOpacity="0.4" />

                    <text x="0" y="146" fontSize="15" fontWeight="800" fill="#2D2A2E">
                        Ocean freight
                    </text>
                    <text x="0" y="165" fontSize="13" fontWeight="700" fill="#8C7A5E">
                        30&ndash;40 days
                    </text>
                    <rect x="180" y="126" width="360" height="40" fill={P4} />
                    <rect x="540" y="126" width="120" height="40" fill={P4} fillOpacity="0.45" />

                    <line x1="180" y1="182" x2="660" y2="182" stroke="#D9D3C8" strokeWidth="2" />
                    {DAY_TICKS.map((t) => (
                        <text key={t.d} x={t.x} y="200" fontSize="11.5" fill="#666666" textAnchor="middle">
                            {t.d === 0 ? "factory door" : `${t.d} days`}
                        </text>
                    ))}
                    <text x="420" y="230" fontSize="13" fontWeight="700" fill="#8C7A5E" textAnchor="middle">
                        about three weeks of calendar, bought with cash
                    </text>
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Worth knowing before you panic-book it: three weeks is the most money can buy you here, and it is the
                dearest of the four things that genuinely speed a schedule up. Deciding a fabric on time is free.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function ProductionTimelineClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("four-months");
    const [showStickyMobileCta, setShowStickyMobileCta] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [commentCount, setCommentCount] = useState(initialComments.length);
    const [comments, setComments] = useState<Array<{ id: string; name: string; email: string; comment: string; date: string; avatar: string; likes: number }>>(() =>
        initialComments.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            comment: c.comment,
            date: new Date(c.created_at).toLocaleString(),
            avatar: (c.name || "?").charAt(0).toUpperCase(),
            likes: c.likes ?? 0,
        }))
    );
    const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [magnetEmail, setMagnetEmail] = useState("");
    const [magnetSubmitted, setMagnetSubmitted] = useState(false);
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const asideRef = useRef<HTMLElement | null>(null);
    const tocBoxRef = useRef<HTMLDivElement | null>(null);
    const articleRef = useRef<HTMLElement | null>(null);
    const [railState, setRailState] = useState<"above" | "pinned" | "below">("above");
    const [tocGeometry, setTocGeometry] = useState<{ left: number; width: number }>({ left: 0, width: 220 });
    const [tocNaturalHeight, setTocNaturalHeight] = useState(0);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            const top = window.scrollY;
            setScrolled(top > 100);
            const height = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(height > 0 ? Math.min(100, (top / height) * 100) : 0);

            for (let i = TOC.length - 1; i >= 0; i--) {
                const el = document.getElementById(TOC[i].id);
                if (el && el.getBoundingClientRect().top <= 140) {
                    setActiveSection(TOC[i].id);
                    break;
                }
            }

            // JS-driven sticky rail with 3 states (CSS sticky breaks because globals.css forces overflow-x: hidden on html/body)
            const aside = asideRef.current;
            const article = articleRef.current;
            const tocBox = tocBoxRef.current;
            if (aside && article) {
                const asideRect = aside.getBoundingClientRect();
                const articleRect = article.getBoundingClientRect();
                const naturalH = tocNaturalHeight || tocBox?.offsetHeight || 600;
                let next: "above" | "pinned" | "below" = "above";
                if (asideRect.top < 112) {
                    next = articleRect.bottom > 112 + naturalH + 32 ? "pinned" : "below";
                }
                setRailState(next);
                setTocGeometry({ left: asideRect.left, width: asideRect.width });
                if (next === "above" && tocBox) {
                    setTocNaturalHeight(tocBox.offsetHeight);
                }
            }
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLike = async () => {
        const action = isLiked ? "unlike" : "like";
        try {
            const newCountValue = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCountValue);
            setIsLiked(!isLiked);
            setLikeCount(newCountValue);
        } catch (error) {
            console.error(`Failed to ${action} blog ${BLOG_ID}`, error);
            showToast("Failed to update like. Please try again.", "error");
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("Link copied to clipboard!", "success");
        } catch {
            showToast("Failed to copy link", "error");
        }
    };

    const handleComment = () => {
        const commentsSection = document.querySelector("[data-comments-section]");
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? "unlike" : "like";
            const newCountValue = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCountValue } : c));
            setLikedComments((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) newSet.delete(commentId);
                else newSet.add(commentId);
                return newSet;
            });
        } catch (error) {
            console.error("Failed to update comment like", error);
            showToast("Failed to update comment like", "error");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
            alert("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const created = await addComment({ blogId: BLOG_ID, name: newComment.name.trim(), email: newComment.email.trim(), comment: newComment.comment.trim() });
            const newCommentData = {
                id: created.id,
                name: created.name,
                email: "",
                comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || "?").charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments((prev) => [newCommentData, ...prev]);
            setCommentCount((prev) => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMagnetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!magnetEmail.trim()) return;
        setMagnetSubmitted(true);
        showToast("Production calendar on the way to your inbox.", "success");
    };

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
                <div
                    className="h-full bg-[#CBB49A] transition-[width] duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <Navbar invertTabs={!scrolled} />

            {/* Hero */}
            <section className="relative min-h-[640px] lg:min-h-[72vh] flex items-center justify-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
                <Image
                    src={HERO_IMAGE}
                    alt="A long paper production calendar pinned across a studio wall, ruled into columns headed Wk 35 through Wk 46 and marked up in pencil with sample, fitting, production run, shipment and a circled deadline. A hand reaches in from the left to mark one of the squares. A tunic-top flat sketch with fabric swatches is taped up beside it, scissors and studio tools hang along the wall, and a folded olive garment rests on a shelf at the right."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">11 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 15, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        From Sketch to Store: A Real<br className="hidden lg:block" /> Clothing Production Timeline
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Four months is the honest answer &mdash; and about half of it passes before a single garment is
                        cut. Here is where every week actually goes.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

                    {/* Interaction bar */}
                    <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-4">
                            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
                                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                            </button>
                            <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                <MessageCircle className="w-4 h-4" />
                                {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                            </button>
                            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Byline */}
                    <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-10 border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">&middot; Production &amp; Sourcing</span></p>
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; August 15, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; A first collection takes <strong>16 to 29 weeks</strong> from sketch to delivered stock. Around <strong>23 weeks</strong> is the honest middle for a small range shipped by sea.</li>
                            <li>&bull; Roughly <strong>half the calendar</strong> passes before your fabric is cut. Sewing is about four weeks; planning, tech packs, fabric and sampling are eleven.</li>
                            <li>&bull; Count <strong>backwards from the shelf date</strong>, never forwards from today. A 1 March 2027 drop is a 21 September 2026 decision.</li>
                            <li>&bull; What separates a fast schedule from a slow one is mostly <strong>how quickly you approve things</strong> &mdash; not how fast the factory sews.</li>
                        </ul>
                    </div>

                    {/* Mobile jump pills */}
                    <div className="lg:hidden mb-10 -mx-4 px-4 overflow-x-auto">
                        <div className="flex gap-2 min-w-max pb-2">
                            {TOC.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => scrollToId(t.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${activeSection === t.id ? "bg-[#CBB49A] text-white border-[#CBB49A]" : "bg-white text-[#4A484A] border-gray-200"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Two-column: pinned rail + article */}
                    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

                        {/* Desktop JS-pinned rail — 3-state (above / pinned / below) */}
                        <aside ref={asideRef} className="hidden lg:block relative">
                            <div
                                ref={tocBoxRef}
                                style={
                                    railState === "pinned"
                                        ? { position: "fixed", top: 112, left: tocGeometry.left, width: tocGeometry.width, zIndex: 20, maxHeight: "calc(100vh - 132px)", overflowY: "auto" }
                                        : railState === "below"
                                            ? { position: "absolute", bottom: 0, left: 0, width: "100%" }
                                            : undefined
                                }
                            >
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">On this page</p>
                                <ul className="space-y-3">
                                    {TOC.map((t) => (
                                        <li key={t.id}>
                                            <button
                                                onClick={() => scrollToId(t.id)}
                                                className={`text-left text-sm leading-snug transition-colors ${activeSection === t.id ? "text-[#2D2A2E] font-semibold border-l-2 border-[#CBB49A] pl-3" : "text-[#666666] hover:text-[#2D2A2E] pl-3 border-l-2 border-transparent"}`}
                                            >
                                                {t.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">You might also like</p>
                                    <div className="space-y-4">
                                        <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack, and why you can&rsquo;t manufacture without one</p>
                                        </Link>
                                        <Link href="/blogs/private-label-vs-custom-manufacturing" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Private label vs custom clothing manufacturing</p>
                                        </Link>
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Custom clothing manufacturing cost at every MOQ tier</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                The sketches are done. You can picture the whole first drop. So you ask the only question that matters: how long until I can sell it?
                            </p>

                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                About four months if everything goes right. Closer to six the first time. That gap is rarely the factory being slow. It is the weeks lost waiting for someone to say yes.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Here is the whole clothing production timeline, stage by stage. Real week counts, and the parts nobody warns you about.
                            </p>

                            {/* H2 1 */}
                            <section id="four-months" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Four months is real &mdash; here&rsquo;s the catch
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Four months is a real number. It is what a small, focused collection takes when nothing sits waiting. Our own <Link href="/" className="underline text-[#CBB49A] hover:text-[#b7a078]">four-step process runs on that schedule</Link> &mdash; design, sampling and sourcing, bulk production, then quality check and dispatch.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The catch is hiding in those three words. Nothing sits waiting means you answer a fit question the day it lands, not the following Tuesday. It means you picked the fabric in week five, not week nine.
                                </p>

                                <LanesGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three lanes, same factory. Thirteen weeks separate the top row from the bottom. Almost all of that is you deciding.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Factories are rarely the slow part. Inboxes are.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="map" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The whole timeline on one screen
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A large industrial cutting room with brick walls and high factory windows. Pale cloth is spread in dozens of flat layers down a long wooden table, with marker paper pinned over the top showing the pattern pieces drawn out in blue. A cutting head sits parked at the far end of the table, racks of fabric rolls are stacked floor to ceiling along the right-hand wall, and offcuts litter the worn wooden floor."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the middle lane &mdash; 23 weeks, a small collection, shipped by sea. Every stage below gets its own section.
                                </p>

                                <ScheduleGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Look at it once and the shape changes. Most founders think manufacturing means sewing. Sewing is four weeks out of twenty-three. For a shorter version of this map, see <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="underline text-[#CBB49A] hover:text-[#b7a078]">the lead-time timeline from concept to doorstep</Link>.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="phase-1" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Phase 1 &mdash; Design: weeks 1 to 4
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two weeks on the range plan: how many styles, in which colours and sizes, at what price. Then two weeks turning each one into a <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> &mdash; the spec sheet a factory builds from, with flat sketches, measurements, stitch types, trims and label placement.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the cheapest phase, and it decides everything after it. A vague tech pack does not save you two weeks now. It costs you three later, when the samples come back nearly right.
                                </p>

                                <div className="not-prose rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 mb-2">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Signs phase 1 isn&rsquo;t finished</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; You still say &ldquo;something like this&rdquo; when you describe a style.</li>
                                        <li>&bull; Sizes are named but not measured, in inches, point to point.</li>
                                        <li>&bull; Nobody has decided which trims and labels go where.</li>
                                        <li>&bull; The colour exists as a screenshot, not a reference code.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 4 */}
                            <section id="phase-2" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Phase 2 &mdash; Sampling &amp; sourcing: weeks 5 to 11
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SAMPLING_IMAGE}
                                        alt="Three versions of the same linen shirt hanging in a row on a metal rail against a bare plaster wall. The left one is covered in chalked fit corrections and pinned along the sleeve and body; the middle one carries fewer marks, mostly balance lines across the chest; the right one is nearly clean with a single note about final placement. A cloth tape measure hangs over the rail between them and hard window light throws their shadows across the wall."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Seven weeks, and the hardest to manage. Two jobs run side by side here, and either one can stall the other.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Fabric first, weeks 5 to 7.</strong> You <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="underline text-[#CBB49A] hover:text-[#b7a078]">choose the cloth</Link>, then approve lab dips &mdash; small swatches dyed to your exact colour. A lab dip comes back, you reject it, they dye it again. That back-and-forth is why fabric, not the factory, usually sets the pace.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Then the garment, weeks 8 to 11.</strong> A pattern maker drafts your shape and the sample room sews a first prototype. Two or three fit rounds follow, each one a week: try it on, mark it up, send it back. Getting the fit right here is also where <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="underline text-[#CBB49A] hover:text-[#b7a078]">grading across your size range</Link> is settled.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Phase 2 ends with a pre-production sample: one approved garment the factory keeps on the table as the reference for the entire run. Nothing should start without it.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="phase-3" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Phase 3 &mdash; Bulk production: weeks 12 to 17
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the surprise: the first two weeks of &ldquo;production&rdquo; have no sewing in them at all. Your fabric does not exist yet. The mill has to knit and dye it in bulk quantity, and <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">a heavier weight</Link> takes longer to finish than a light one.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then four weeks of cut, sew and finish. The cloth is spread in layers, cut, bundled by size, sewn down a line, then washed, pressed and trimmed.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the one phase you genuinely cannot rush, and it is the phase founders push hardest on. A mill will not knit faster. A sewing line that doubles its speed drops its quality, and you find out eight weeks later when the returns arrive.
                                </p>

                                <div className="not-prose rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">What to ask for in week 14</p>
                                    <p className="text-[#2D2A2E] text-base sm:text-lg leading-snug">
                                        A photo of the first sewn piece off the line, before the rest of the run follows it. If something drifted from the approved sample, this is the last cheap moment to catch it.
                                    </p>
                                </div>
                            </section>

                            {/* H2 6 */}
                            <section id="phase-4" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Phase 4 &mdash; Quality check &amp; dispatch: weeks 18 to 23
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Close-up looking down into an open cardboard carton of finished stock. Folded navy garments sealed in clear polybags stand packed in rows; the nearest one carries a plain white size sticker printed with the letter L. The corrugated edge of the box is sharp across the foreground and the rest of the stack falls away into shallow focus."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One week for inspection and packing: garments checked against the approved sample, then folded, tagged, bagged and boxed. After that the goods still have to travel, and travel eats more of the calendar than most people expect.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ocean freight from India to the US runs <a href="https://www.freightos.com/shipping-routes/shipping-from-india-to-the-united-states/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">30 to 40 days door to door</a>; air freight is 8 to 10 days and costs many times more. Four weeks on a ship is the single easiest week-block to forget.
                                </p>

                                <FreightGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then customs. Entry paperwork has to be filed <a href="https://www.cbp.gov/sites/default/files/assets/documents/2020-Feb/icp073_3_0.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">within 15 calendar days of the shipment arriving</a>, duty gets paid, and only then does the truck move. Cotton knit tops enter at <a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16.5% under heading 6109.10.00</a>, and since CBP&rsquo;s <a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">indefinite suspension of the $800 de minimis exemption</a> in June 2026, no route in arrives duty-free.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    One paperwork error &mdash; a mismatched description, a missing fibre content &mdash; and the box sits at the port while it gets corrected. The parcel-level version of this is worked through in <Link href="/blogs/de-minimis-hangover-2026-parcel-costs" className="underline text-[#CBB49A] hover:text-[#b7a078]">the de minimis hangover</Link>.
                                </p>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Backward Production Calendar</h4>
                                        <p className="text-[#4A484A] leading-snug">Put in your drop date and it counts the ten stages back to the day you have to commit &mdash; with the approval deadlines you own marked in red, and the 2027 factory blackouts already blocked out. Spreadsheet + PDF.</p>
                                    </div>
                                </div>
                                {!magnetSubmitted ? (
                                    <form onSubmit={handleMagnetSubmit} className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            required
                                            value={magnetEmail}
                                            onChange={(e) => setMagnetEmail(e.target.value)}
                                            placeholder="Your work email"
                                            className="flex-1 px-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#CBB49A] outline-none text-[#2D2A2E]"
                                        />
                                        <button type="submit" className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors flex items-center justify-center gap-2">
                                            Send me the calendar
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Production calendar on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 7 */}
                            <section id="blackouts" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Three dates that move everyone&rsquo;s calendar
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Your schedule does not run in a vacuum. Three fixed points in the year bend it, and none of them are negotiable.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Lunar New Year.</strong> It falls on <a href="https://www.sekologistics.com/en/resource-hub/knowledge-hub/lunar-new-year-complete-supply-chain-planning-guide-for-asia-sourcing/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">6 February in 2027</a>, and it is not a day off. Factories across China and Vietnam wind down from late January, reopen through late February at roughly a third of their workforce, and only reach full strength around 6 to 20 March.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Diwali.</strong> In India, 8 November 2026. Units close for a run of days around it rather than a single holiday, and the weeks either side are the busiest of the year.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Peak freight season.</strong> Roughly August to October, every brand on earth is shipping for the same quarter &mdash; the National Retail Federation expected US November-December spending to <a href="https://nrf.com/media-center/press-releases/nrf-expects-holiday-sales-to-surpass-1-trillion-for-the-first-time-in-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">pass $1 trillion for the first time</a> in 2025. Space gets tight, rates climb, and sailings slip.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    You cannot move these dates. All you can choose is which side of them your production lands on &mdash; and you make that choice months earlier than feels natural.
                                </p>
                            </section>

                            {/* H2 8 */}
                            <section id="backwards" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Count backwards from the shelf
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Almost every blown launch date comes from counting forwards. You start today, add up the stages, and land wherever you land &mdash; usually three weeks after the season you were aiming at.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Do it the other way. Fix the date stock must be in the warehouse, subtract 23 weeks, and that is your commit date. Then subtract two more for photography and listings, because goods in a box are not goods on sale.
                                </p>

                                <BackwardPlannerGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is the whole trick. It also tells you something hard to hear but useful: if the date you want is less than 23 weeks away, you are not planning a timeline any more. You are picking which corner to cut. The same sum for a Q4 launch is laid out in <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="underline text-[#CBB49A] hover:text-[#b7a078]">the holiday production window</Link>.
                                </p>
                            </section>

                            {/* H2 9 */}
                            <section id="slips" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Where the weeks actually disappear
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Schedules rarely break all at once. They slip a few days at a time, and by the time you notice, a month has gone.
                                </p>

                                <SlipGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The last bar is the dangerous one. It does not cost you a few days at a time &mdash; it drops off a cliff. Miss a factory shutdown by three days and you do not lose three days. You lose the shutdown, then the slow restart, then the queue of everyone else who also missed it.
                                </p>
                            </section>

                            {/* H2 10 */}
                            <section id="faster" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What genuinely makes it faster
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Four things actually shorten a clothing production timeline. Everything else is just pressure on a stage that cannot take any.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start with the one nobody bills you for. Development has six moments where work stops until you answer.
                                </p>

                                <ApprovalGraphic />

                                <div className="not-prose grid sm:grid-cols-2 gap-5 mb-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Actually works</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; A complete tech pack before sampling starts &mdash; two rounds instead of five.</li>
                                            <li>&bull; Choosing fabric in week five, not week nine.</li>
                                            <li>&bull; A 24-hour rule on your own approvals.</li>
                                            <li>&bull; Fewer styles. Three done properly beat eight half-specified.</li>
                                            <li>&bull; Air freight on the first run, sea on the repeat.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Doesn&rsquo;t</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Asking the mill to knit faster. It cannot.</li>
                                            <li>&bull; Skipping the pre-production sample to save a week.</li>
                                            <li>&bull; Adding styles late because one felt missing.</li>
                                            <li>&bull; Splitting one order across two factories to halve it.</li>
                                            <li>&bull; Changing a colour after the bulk fabric is dyed.</li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Notice that four of the five things that work cost nothing. The only one that costs money &mdash; air freight &mdash; buys the least time. Buying speed at the end always costs more than deciding early costs you; the per-unit version of that trade is broken down in <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">costs at every MOQ tier</Link>.
                                </p>
                            </section>

                            {/* H2 11 — counterexample */}
                            <section id="wrong" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When four months is the wrong number
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A warehouse loading bay at dusk with the roller door raised halfway. A single wooden pallet stacked with sealed, unmarked cardboard cartons stands alone in the middle of the empty concrete bay, lit by the cold blue evening light coming through the open door. The rest of the space, and the yard beyond, falls away into shadow."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Everything above assumes you are building garments from your own patterns. Plenty of brands are not, and their timeline is a different thing altogether.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Printing your artwork on an existing blank takes three to five weeks, because the eleven-week development half already happened in someone else&rsquo;s factory. That trade &mdash; speed against owning the garment &mdash; is the whole of <Link href="/blogs/private-label-vs-custom-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">private label versus custom manufacturing</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The other direction is real too. A reorder of a style you have already made is not 23 weeks, because the pattern exists, the fabric is specified and the factory has your sample on the shelf.
                                </p>

                                <ReorderGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The first time is the expensive one, in weeks as much as in cash. That is exactly why finishing one style properly is worth more than starting three.
                                </p>
                            </section>

                            {/* H2 12 — closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Pick the date you want to be selling, count 23 weeks back, and look at what that date says. If it has already passed, do not compress the schedule &mdash; move the drop, or cut the range to the one style you are most sure of. So: what is your date, and what does 23 weeks before it land on?
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common questions
                                </h2>
                                <div className="not-prose space-y-4">
                                    {faqs.map((f) => (
                                        <div key={f.q} className="rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5">
                                            <h3 className="font-bold text-[#2D2A2E] mb-2 leading-snug text-lg">{f.q}</h3>
                                            <p className="text-[#4A484A] leading-snug">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">What Is a Tech Pack, and Why You Can&rsquo;t Manufacture Without One</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The single document that decides whether your sampling phase takes five weeks or eleven.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build the calendar for your drop date</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about your clothing production timeline &mdash; what your collection realistically takes, which stages you can compress, and what date you need to commit by.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/private-label-vs-custom-manufacturing",
                                            title: "Private Label vs Custom Manufacturing",
                                            dek: "The choice that decides whether your timeline is five weeks or twenty-three.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/fabric-sourcing-101-choose-right-material",
                                            title: "Fabric Sourcing 101",
                                            dek: "The stage that quietly sets the pace for everything downstream of it.",
                                            read: "6 min read",
                                        },
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The eight-step build order, from niche to first production run.",
                                            read: "15 min read",
                                        },
                                    ].map((card) => (
                                        <Link key={card.href} href={card.href} className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#CBB49A] transition-colors">
                                            <div className="p-6">
                                                <p className="text-xs font-medium text-[#666666] mb-2">{card.read}</p>
                                                <h4 className="text-lg font-bold text-[#2D2A2E] leading-snug mb-2 group-hover:underline">{card.title}</h4>
                                                <p className="text-sm text-[#666666] leading-relaxed">{card.dek}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mt-16 pt-12 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <MessageSquare className="w-6 h-6 text-[#CBB49A]" />
                                    <h3 className="text-2xl font-bold text-[#2D2A2E]">Comments</h3>
                                </div>

                                <div className="space-y-6 mt-8" data-comments-section>
                                    <form onSubmit={handleSubmitComment} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h4 className="text-lg font-semibold text-[#2D2A2E] mb-4">Leave a Comment</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={newComment.name}
                                                onChange={handleInputChange}
                                                placeholder="Your Name"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={newComment.email}
                                                onChange={handleInputChange}
                                                placeholder="Your Email"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all"
                                            />
                                        </div>
                                        <textarea
                                            name="comment"
                                            value={newComment.comment}
                                            onChange={handleInputChange}
                                            placeholder="Share your thoughts..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all mb-4 resize-none"
                                        />
                                        <div className="flex items-center justify-between">
                                            {showSuccessMessage && (
                                                <span className="text-green-600 text-sm font-medium animate-fade-in">
                                                    Comment posted successfully!
                                                </span>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="ml-auto px-6 py-2.5 bg-[#CBB49A] text-white font-medium rounded-full hover:bg-[#b7a078] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Post Comment
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                    {comments.length > 0 ? (
                                        <>
                                            {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                                                <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                                                            {comment.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="hidden sm:flex items-center gap-3 mb-3">
                                                                <h5 className="font-semibold text-[#2D2A2E] text-lg">{comment.name}</h5>
                                                                <span className="text-sm text-[#666666]">&bull;</span>
                                                                <span className="text-sm text-[#666666]">{comment.date}</span>
                                                            </div>
                                                            <div className="bg-[#F8F7F4] rounded-lg p-3 sm:p-4">
                                                                <p className="text-[#2D2A2E] leading-relaxed text-sm sm:text-base break-words mb-3">
                                                                    {comment.comment}
                                                                </p>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        onClick={() => handleCommentLike(comment.id)}
                                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${likedComments.has(comment.id)
                                                                            ? "bg-[#CBB49A]/10 text-[#CBB49A]"
                                                                            : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"
                                                                            }`}
                                                                    >
                                                                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? "fill-[#CBB49A]" : ""}`} />
                                                                        {comment.likes} {comment.likes === 1 ? "Like" : "Likes"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {comments.length > 3 && (
                                                <button
                                                    onClick={() => setShowAllComments(!showAllComments)}
                                                    className="w-full py-3 text-center text-[#CBB49A] font-medium hover:bg-[#F8F7F4] rounded-lg transition-colors border border-[#CBB49A]/20"
                                                >
                                                    {showAllComments ? "Show Less Comments" : `Show All ${comments.length} Comments`}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-[#2D2A2E] mb-2">No comments yet</h3>
                                            <p className="text-[#666666]">Be the first to share your thoughts!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </article>
                    </div>
                </div>
            </section>

            <Footer />
            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />

            {/* Mobile sticky bottom CTA */}
            {showStickyMobileCta && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2D2A2E] text-white px-4 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Build the calendar for your drop date <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
