import { NextResponse } from "next/server";
import { Resend } from "resend";

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

function createEmailHtml(data: ContactPayload): string {
  const { fullName, email, phone, company, address, country, services, message, selectedPlan } = data;
  const planSection = selectedPlan
    ? `<tr><td style="padding:8px 0; font-weight:600;">Selected Plan</td><td style="padding:8px 0;">${selectedPlan.name} (${selectedPlan.type}) - ${selectedPlan.price}</td></tr>`
    : "";
  const addressRow = address ? `<tr><td style=\"padding:8px 0; font-weight:600;\">Address</td><td style=\"padding:8px 0;\">${address}</td></tr>` : "";
  const messageBlock = message
    ? `<tr><td colspan=\"2\" style=\"padding-top:16px;\"><div style=\"font-weight:600; margin-bottom:6px;\">Message</div><div style=\"white-space:pre-wrap;\">${message}</div></td></tr>`
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

    const apiKey = process.env.RESEND_TOKEN;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_TOKEN is not configured on the server." },
        { status: 500 }
      );
    }

    const recipients = [
      process.env.CONTACT_RECIPIENT1,
      process.env.CONTACT_RECIPIENT2,
      process.env.CONTACT_RECIPIENT3,
    ].filter((v): v is string => !!v && v.trim().length > 0);

    // Backward compatibility: allow single CONTACT_RECIPIENT if 1..3 are not set
    if (recipients.length === 0 && process.env.CONTACT_RECIPIENT) {
      recipients.push(process.env.CONTACT_RECIPIENT);
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients configured. Set CONTACT_RECIPIENT1/2/3 or CONTACT_RECIPIENT." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const html = createEmailHtml(body);

    const { error } = await resend.emails.send({
      from: "Krazy Kreators <onboarding@resend.dev>",
      to: recipients,
      replyTo: body.email,
      subject: `New inquiry from ${body.fullName} (${body.company})`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


