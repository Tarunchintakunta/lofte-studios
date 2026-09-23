"use server";

import { headers } from "next/headers";
import { enquirySchema, type FieldName, type FormState } from "@/lib/contact-schema";
import { capabilities } from "@/content/capabilities";
import { site } from "@/lib/site";

/**
 * In-memory rate limiter.
 *
 * Deliberately simple, and deliberately documented as insufficient: it is
 * per-instance, so it resets on deploy and does not coordinate across regions
 * or serverless invocations. It stops the obvious case — one client hammering
 * one instance — and the swap point for a shared store (Upstash, Redis, a
 * Vercel KV namespace) is this module alone.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

async function clientKey(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

function serviceNames(slugs: string[]): string {
  return slugs
    .map((slug) => capabilities.find((c) => c.slug === slug)?.name ?? slug)
    .join(", ");
}

function buildEmail(data: Record<string, unknown>): { subject: string; text: string } {
  const d = data as Record<string, string | string[]>;
  return {
    subject: `Project enquiry — ${d.company} (${d.name})`,
    text: [
      `Name:      ${d.name}`,
      `Email:     ${d.email}`,
      `Company:   ${d.company}`,
      `Website:   ${d.website || "—"}`,
      `Services:  ${serviceNames(d.services as string[])}`,
      `Budget:    ${d.budget || "not given"}`,
      `Timing:    ${d.timing}`,
      "",
      "Summary",
      "-------",
      String(d.summary),
    ].join("\n"),
  };
}

/**
 * Handle an enquiry.
 *
 * Mail is only ever sent when all three of RESEND_API_KEY, CONTACT_TO_EMAIL and
 * CONTACT_FROM_EMAIL are present. A stray key on its own cannot start real
 * delivery. Without them the submission is validated and logged, and the reply
 * says so rather than claiming an email went out.
 */
export async function submitEnquiry(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    website: formData.get("website"),
    services: formData.getAll("services"),
    budget: formData.get("budget"),
    timing: formData.get("timing"),
    summary: formData.get("summary"),
    consent: formData.get("consent"),
    reference: formData.get("reference"),
  };

  // Echoed back so a rejected form never loses what someone typed.
  const values: Record<string, string | string[]> = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    company: String(raw.company ?? ""),
    website: String(raw.website ?? ""),
    services: (raw.services as string[]).map(String),
    budget: String(raw.budget ?? ""),
    timing: String(raw.timing ?? ""),
    summary: String(raw.summary ?? ""),
    consent: raw.consent ? "on" : "",
  };

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return {
      status: "error",
      errors,
      message: "Some details need another look.",
      values,
    };
  }

  // A filled honeypot is a bot. Answer as though it worked and drop it.
  if (parsed.data.reference) {
    return { status: "success" };
  }

  if (await rateLimited(await clientKey())) {
    return {
      status: "error",
      message: `That is a lot of enquiries in a short time. Give it a minute, or email ${site.email} directly.`,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const { subject, text } = buildEmail(parsed.data);

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV === "production") {
      // Never tell a visitor the form succeeded when nothing was delivered.
      console.error("[contact] Email delivery is not configured. Enquiry NOT delivered.");
      return {
        status: "error",
        message: `Something went wrong on our end and your message was not sent. Please email ${site.email} directly — we are sorry about that.`,
        values,
      };
    }

    console.info(`[contact] Delivery not configured — logging instead.\n${text}`);
    return {
      status: "logged",
      message:
        "Validated, but not delivered: no email provider is configured in this environment.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: parsed.data.email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      console.error(`[contact] Resend responded ${response.status}`);
      return {
        status: "error",
        message: `We could not send that just now. Please email ${site.email} directly.`,
        values,
      };
    }
  } catch (error) {
    console.error("[contact] Delivery failed", error);
    return {
      status: "error",
      message: `We could not send that just now. Please email ${site.email} directly.`,
      values,
    };
  }

  return { status: "success" };
}
