import { z } from "zod";
import { capabilities } from "@/content/capabilities";

const capabilitySlugs = capabilities.map((c) => c.slug) as [string, ...string[]];

export const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under ₹2L",
  "₹2L – ₹6L",
  "₹6L – ₹15L",
  "Over ₹15L",
] as const;

export const TIMING_OPTIONS = [
  "As soon as possible",
  "Within a month",
  "This quarter",
  "Later this year",
  "Just exploring",
] as const;

/**
 * The enquiry schema. This runs on the server — the client form reuses it only
 * to keep field names honest, never as the authority. Anything that reaches
 * the action is parsed here before it is used for anything.
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(120, "That name is longer than we can store."),

  email: z
    .string()
    .trim()
    .min(1, "We need an email address to reply to.")
    .max(200, "That address is longer than we can store.")
    .pipe(z.email("That does not look like an email address.")),

  company: z
    .string()
    .trim()
    .min(1, "Please tell us who you work for.")
    .max(160, "That company name is longer than we can store."),

  website: z
    .string()
    .trim()
    .max(200, "That URL is longer than we can store.")
    .optional()
    .or(z.literal("")),

  services: z
    .array(z.enum(capabilitySlugs))
    .min(1, "Pick at least one thing you need help with."),

  budget: z.enum(BUDGET_OPTIONS).optional().or(z.literal("")),

  timing: z.enum(TIMING_OPTIONS, {
    message: "Let us know roughly when you need this.",
  }),

  summary: z
    .string()
    .trim()
    .min(20, "A couple of sentences is enough — we just need the gist.")
    .max(4000, "That is longer than the form can take. Email us the full brief instead."),

  consent: z.literal("on", {
    message: "We need your agreement before we can hold your details.",
  }),

  /**
   * Honeypot. A real person never sees this field, so anything in it is a bot.
   * Named innocuously because the obvious names are on every scraper's list.
   */
  reference: z.string().max(0).optional().or(z.literal("")),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export type FieldName = keyof Enquiry;

export type FormState = {
  status: "idle" | "success" | "logged" | "error";
  /** Per-field messages, keyed by field name. */
  errors?: Partial<Record<FieldName, string>>;
  /** A single message covering the whole form. */
  message?: string;
  /** Echoed back so a rejected form does not lose what was typed. */
  values?: Record<string, string | string[]>;
};

export const initialFormState: FormState = { status: "idle" };
