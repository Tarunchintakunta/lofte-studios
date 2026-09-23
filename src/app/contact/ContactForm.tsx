"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import {
  Checkbox,
  FieldShell,
  SelectShell,
  describedBy,
  inputClass,
  textareaClass,
} from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { capabilities } from "@/content/capabilities";
import {
  BUDGET_OPTIONS,
  TIMING_OPTIONS,
  initialFormState,
  type FormState,
} from "@/lib/contact-schema";
import { site } from "@/lib/site";
import { submitEnquiry } from "./actions";

function str(values: FormState["values"], key: string) {
  const value = values?.[key];
  return typeof value === "string" ? value : "";
}

function list(values: FormState["values"], key: string) {
  const value = values?.[key];
  return Array.isArray(value) ? value : [];
}

/**
 * The enquiry form.
 *
 * Validation is the server's job — this component only renders what the action
 * sends back. That means the form works with JavaScript disabled (a plain POST
 * to a Server Action), and it means a determined submitter cannot skip the
 * rules by editing the DOM.
 *
 * On a rejected submission, focus moves to the summary so a screen reader
 * announces the failure, the summary is a live region, and every invalid
 * control carries `aria-invalid` plus a described-by error message.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initialFormState);
  const id = useId();
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const field = (name: string) => `${id}-${name}`;
  const errorFor = (name: keyof NonNullable<FormState["errors"]>) => state.errors?.[name];

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success" || state.status === "logged") {
      successRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success" || state.status === "logged") {
    return (
      <div
        ref={successRef}
        data-testid="form-success"
        tabIndex={-1}
        className="border-accent border-t pt-8 focus-visible:outline-none"
      >
        <h2 className="text-display-3 font-display">Thank you — that reached us.</h2>
        <p className="measure text-body text-fg-muted mt-5">
          A person will read it and reply. We have not set an expectation about how
          quickly, because we would rather not promise a response time we cannot keep to
          every week.
        </p>
        {state.status === "logged" ? (
          <p className="text-micro text-fg-subtle border-coral-deep/70 mt-6 border-l-2 pl-3.5">
            Development note, not shown in production: {state.message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} noValidate className="border-rule border-t pt-8">
      {/* Live region: announced when the server rejects a submission. */}
      <div
        ref={summaryRef}
        data-testid="form-status"
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={cn(
          "focus-visible:outline-none",
          state.status === "error" ? "border-coral-deep mb-8 border-l-2 pl-4" : "sr-only",
        )}
      >
        {state.status === "error" ? (
          <>
            <p className="text-body font-medium">
              {state.message ?? "Something needs another look."}
            </p>
            {state.errors && Object.keys(state.errors).length > 0 ? (
              <p className="text-body-sm text-fg-muted mt-1">
                {Object.keys(state.errors).length} field
                {Object.keys(state.errors).length === 1 ? "" : "s"} below need attention.
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        <FieldShell id={field("name")} label="Your name" error={errorFor("name")}>
          <input
            id={field("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={str(state.values, "name")}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={describedBy(
              field("name"),
              false,
              Boolean(errorFor("name")),
            )}
            className={inputClass(Boolean(errorFor("name")))}
          />
        </FieldShell>

        <FieldShell id={field("email")} label="Work email" error={errorFor("email")}>
          <input
            id={field("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={str(state.values, "email")}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={describedBy(
              field("email"),
              false,
              Boolean(errorFor("email")),
            )}
            className={inputClass(Boolean(errorFor("email")))}
          />
        </FieldShell>

        <FieldShell id={field("company")} label="Company" error={errorFor("company")}>
          <input
            id={field("company")}
            name="company"
            type="text"
            autoComplete="organization"
            required
            defaultValue={str(state.values, "company")}
            aria-invalid={Boolean(errorFor("company"))}
            aria-describedby={describedBy(
              field("company"),
              false,
              Boolean(errorFor("company")),
            )}
            className={inputClass(Boolean(errorFor("company")))}
          />
        </FieldShell>

        <FieldShell
          id={field("website")}
          label="Website"
          optional
          error={errorFor("website")}
        >
          <input
            id={field("website")}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="lofte.example"
            defaultValue={str(state.values, "website")}
            aria-invalid={Boolean(errorFor("website"))}
            aria-describedby={describedBy(
              field("website"),
              false,
              Boolean(errorFor("website")),
            )}
            className={inputClass(Boolean(errorFor("website")))}
          />
        </FieldShell>
      </div>

      {/* Checkbox group: a fieldset so the legend is announced with each box. */}
      <fieldset className="mt-12">
        <legend className="text-body-sm text-fg-muted">
          What do you need help with?
        </legend>
        <p className="text-micro text-fg-subtle mt-1.5">Choose as many as apply.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {capabilities.map((capability) => {
            const checkboxId = field(`service-${capability.slug}`);
            return (
              <div key={capability.slug}>
                <input
                  id={checkboxId}
                  type="checkbox"
                  name="services"
                  value={capability.slug}
                  defaultChecked={list(state.values, "services").includes(
                    capability.slug,
                  )}
                  className="peer sr-only"
                />
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "rounded-capsule border-rule-strong text-body-sm block cursor-pointer",
                    "border px-4 py-2 transition-colors duration-[--duration-fast]",
                    "hover:border-fg",
                    "peer-checked:border-blue peer-checked:bg-blue peer-checked:text-white",
                    "peer-focus-visible:outline-focus peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3",
                  )}
                >
                  {capability.name}
                </label>
              </div>
            );
          })}
        </div>
        {errorFor("services") ? (
          <p className="text-body-sm text-coral-deep mt-3">{errorFor("services")}</p>
        ) : null}
      </fieldset>

      <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        <FieldShell
          id={field("budget")}
          label="Approximate budget"
          optional
          error={errorFor("budget")}
        >
          <SelectShell
            invalid={Boolean(errorFor("budget"))}
            id={field("budget")}
            name="budget"
            defaultValue={str(state.values, "budget")}
            aria-invalid={Boolean(errorFor("budget"))}
          >
            <option value="">Prefer not to say</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectShell>
        </FieldShell>

        <FieldShell
          id={field("timing")}
          label="When do you need it?"
          error={errorFor("timing")}
        >
          <SelectShell
            invalid={Boolean(errorFor("timing"))}
            id={field("timing")}
            name="timing"
            required
            defaultValue={str(state.values, "timing")}
            aria-invalid={Boolean(errorFor("timing"))}
            aria-describedby={describedBy(
              field("timing"),
              false,
              Boolean(errorFor("timing")),
            )}
          >
            <option value="">Choose one</option>
            {TIMING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectShell>
        </FieldShell>
      </div>

      <FieldShell
        id={field("summary")}
        label="What are you trying to get across?"
        hint="Who needs to understand it, and what happens if they do. A couple of sentences is plenty."
        error={errorFor("summary")}
        className="mt-12"
      >
        <textarea
          id={field("summary")}
          name="summary"
          required
          rows={6}
          defaultValue={str(state.values, "summary")}
          aria-invalid={Boolean(errorFor("summary"))}
          aria-describedby={describedBy(
            field("summary"),
            true,
            Boolean(errorFor("summary")),
          )}
          className={textareaClass(Boolean(errorFor("summary")))}
        />
      </FieldShell>

      {/* Honeypot: off-screen, not hidden, so assistive tech skips it too. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={field("reference")}>Reference</label>
        <input
          id={field("reference")}
          name="reference"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-10">
        <div className="flex items-start gap-3">
          <Checkbox
            id={field("consent")}
            name="consent"
            invalid={Boolean(errorFor("consent"))}
            defaultChecked={str(state.values, "consent") === "on"}
            aria-invalid={Boolean(errorFor("consent"))}
            aria-describedby={describedBy(
              field("consent"),
              false,
              Boolean(errorFor("consent")),
            )}
            className="mt-0.5"
          />
          <label htmlFor={field("consent")} className="text-body-sm text-fg-muted">
            I agree that Løfte Studios may hold these details in order to reply to this
            enquiry. See our <TextLink href="/privacy">privacy note</TextLink>.
          </label>
        </div>
        {errorFor("consent") ? (
          <p
            id={`${field("consent")}-error`}
            className="text-body-sm text-coral-deep mt-2"
          >
            {errorFor("consent")}
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
        <p className="text-micro text-fg-subtle">
          Or email <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
        </p>
      </div>
    </form>
  );
}
