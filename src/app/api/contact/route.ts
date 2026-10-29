export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  country: string;
  services: string;
  message?: string;
  selectedPlan?: {
    name: string;
    price: string;
    type: "retainer" | "custom";
  } | null;
};

const GENERIC_ERROR = "Couldn't send. Please email info@krazykreators.com";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Header values are written to the SMTP stream verbatim, so a CR/LF in user
// input would let a visitor inject extra headers.
function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL_RE = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]+$/;

// Accepts "Name <a@b.com>", "Name a@b.com" or a bare "a@b.com".
function parseAddress(value: string): { name?: string; email: string } {
  const email = value.match(/[^\s<>"]+@[^\s<>"]+/)?.[0] ?? "";
  const name = value.replace(email, "").replace(/[<>"]/g, "").trim();
  return name ? { name, email } : { email };
}

function createEmailHtml(data: ContactPayload): string {
  const fullName = escapeHtml(data.fullName);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const company = escapeHtml(data.company);
  const country = escapeHtml(data.country);
  const services = escapeHtml(data.services);
  const { address, message, selectedPlan } = data;
  const planSection = selectedPlan
    ? `<tr><td style="padding:8px 0; font-weight:600;">Selected Plan</td><td style="padding:8px 0;">${escapeHtml(selectedPlan.name)} (${escapeHtml(selectedPlan.type)}) - ${escapeHtml(selectedPlan.price)}</td></tr>`
    : "";
  const addressRow = address ? `<tr><td style=\"padding:8px 0; font-weight:600;\">Address</td><td style=\"padding:8px 0;\">${escapeHtml(address)}</td></tr>` : "";
  const messageBlock = message
    ? `<tr><td colspan=\"2\" style=\"padding-top:16px;\"><div style=\"font-weight:600; margin-bottom:6px;\">Message</div><div style=\"white-space:pre-wrap;\">${escapeHtml(message)}</div></td></tr>`
    : "";

  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <h2 style="margin:0 0 12px;">New Contact Form Submission</h2>
    <p style="margin:0 0 16px; color:#6b7280;">You received a new inquiry from your website contact form.</p>
    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        ${planSection}
        <tr><td style="padding:8px 0; font-weight:600;">Full Name</td><td style="padding:8px 0;">${fullName}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Email</td><td style="padding:8px 0;">${email}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Company</td><td style="padding:8px 0;">${company}</td></tr>
        ${addressRow}
        <tr><td style="padding:8px 0; font-weight:600;">Country</td><td style="padding:8px 0;">${country}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Services</td><td style="padding:8px 0;">${services}</td></tr>
        ${messageBlock}
      </tbody>
    </table>
  </div>`;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    const required: Array<keyof ContactPayload> = [
      "fullName",
      "email",
      "phone",
      "company",
      "country",
      "services",
    ];
    const missing = required.filter((k) => !String(body[k] ?? "").trim());
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Store submission (best-effort) before sending email
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error: insertError } = await supabase
          .from("contact_submissions")
          .insert({
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            company: body.company,
            address: body.address ?? null,
            country: body.country,
            services: body.services,
            message: body.message ?? null,
            selected_plan: body.selectedPlan
              ? {
                  name: body.selectedPlan.name,
                  price: body.selectedPlan.price,
                  type: body.selectedPlan.type,
                }
              : null,
          });
        if (insertError) {
          console.warn("[contact] Failed to persist submission to Supabase", insertError);
        }

        // Also store as a lead
        const { error: leadError } = await supabase
          .from("leads")
          .insert({
            full_name: body.fullName,
            email: body.email,
            phone: body.phone,
            company: body.company,
            address: body.address ?? null,
            country: body.country,
            services: body.services,
            message: body.message ?? null,
            selected_plan: body.selectedPlan
              ? {
                  name: body.selectedPlan.name,
                  price: body.selectedPlan.price,
                  type: body.selectedPlan.type,
                }
              : null,
            source: "contact_form",
          });
        if (leadError) {
          console.warn("[contact] Failed to persist lead to Supabase", leadError);
        }
      }
    } catch (persistErr) {
      console.warn("[contact] Unexpected error persisting to Supabase", persistErr);
    }

    const visitorEmail = stripLineBreaks(String(body.email));
    const email = {
      from: parseAddress(process.env.MAIL_FROM || process.env.SMTP_USER || ""),
      to: (process.env.MAIL_TO || "").split(",").map((s) => parseAddress(s).email).filter(Boolean),
      // Length check first: RFC 5321 caps addresses at 254, and it keeps the regex cheap.
      reply: visitorEmail.length <= 254 && EMAIL_RE.test(visitorEmail) ? visitorEmail : undefined,
      // Capped so the header stays well under SMTP's 998-octet line limit.
      subject: stripLineBreaks(
        `New inquiry from ${String(body.fullName).slice(0, 100)} (${String(body.company).slice(0, 100)})`
      ),
      html: createEmailHtml(body),
    };

    // `next dev` runs on plain Node, where `cloudflare:sockets` does not exist.
    // Keyed on NODE_ENV rather than runtime sniffing so a production build can
    // never silently skip the send.
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] Dev mode: email not sent", {
        from: email.from,
        to: email.to,
        reply: email.reply,
        subject: email.subject,
      });
      return NextResponse.json({ ok: true });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const username = process.env.SMTP_USER;
    const password = process.env.SMTP_PASS;
    if (!host || !username || !password || !email.from.email || email.to.length === 0) {
      console.error("[contact] SMTP is not configured", {
        SMTP_HOST: Boolean(host),
        SMTP_USER: Boolean(username),
        SMTP_PASS: Boolean(password),
        MAIL_FROM: Boolean(email.from.email),
        MAIL_TO: email.to.length,
      });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    try {
      const { WorkerMailer } = await import("worker-mailer");
      const mailer = await WorkerMailer.connect({
        host,
        port,
        secure: port === 465,
        credentials: { username, password },
        authType: ["plain", "login"],
        socketTimeoutMs: 15000,
      });
      try {
        await mailer.send(email);
      } finally {
        await mailer.close();
      }
    } catch (sendErr) {
      console.error("[contact] SMTP send error", {
        message: sendErr instanceof Error ? sendErr.message : String(sendErr),
        to: email.to,
      });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
