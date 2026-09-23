import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Form field primitives.
 *
 * Every control is wired the same way: a real `<label>` bound by `htmlFor`, an
 * error message with a stable id referenced by `aria-describedby`, and
 * `aria-invalid` on the control itself. Errors are never colour-only — they
 * carry text, sit beneath the field, and use the darkened coral, since the
 * bright one fails contrast on both fields.
 */

const control =
  "w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-body " +
  "text-fg placeholder:text-fg-subtle transition-colors duration-[--duration-fast] " +
  "focus:outline-none focus-visible:outline-none";

const controlState = (invalid: boolean) =>
  invalid
    ? "border-coral-deep focus:border-coral-deep"
    : "border-rule-strong hover:border-fg-muted focus:border-accent";

export function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label
        htmlFor={id}
        className="text-body-sm text-fg-muted flex items-baseline gap-2"
      >
        {label}
        {optional ? <span className="text-micro text-fg-subtle">optional</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-micro text-fg-subtle mt-1.5">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          className="text-body-sm text-coral-deep mt-2 flex items-start gap-2"
        >
          <span
            aria-hidden="true"
            className="bg-coral-deep mt-[0.55em] h-px w-3 shrink-0"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hasHint: boolean, hasError: boolean) {
  const ids = [hasHint ? `${id}-hint` : null, hasError ? `${id}-error` : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export const inputClass = (invalid: boolean) => cn(control, controlState(invalid));

export const textareaClass = (invalid: boolean) =>
  cn(control, controlState(invalid), "min-h-36 resize-y");

/**
 * A select with `appearance-none` loses its dropdown affordance, so the
 * chevron is drawn back on. It sits in a wrapper rather than as a background
 * image because it has to inherit the field's current colour.
 */
export function SelectShell({
  invalid,
  children,
  ...rest
}: { invalid: boolean } & ComponentPropsWithoutRef<"select">) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={cn(
          control,
          controlState(invalid),
          "cursor-pointer appearance-none pr-8",
        )}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="text-fg-subtle pointer-events-none absolute top-1/2 right-1 h-2 w-3 -translate-y-1/2"
      >
        <path
          d="M1 1.5 6 6.5 11 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * A checkbox that reads as part of the system rather than as an OS default.
 * The native input keeps every behaviour it already has — focus, Space, form
 * participation — and only its painting is replaced.
 */
export function Checkbox({
  invalid,
  className,
  ...rest
}: { invalid?: boolean } & ComponentPropsWithoutRef<"input">) {
  return (
    <span className="relative inline-flex shrink-0">
      <input
        {...rest}
        type="checkbox"
        className={cn(
          "peer h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[3px]",
          "border bg-transparent transition-colors duration-[--duration-fast]",
          invalid ? "border-coral-deep" : "border-rule-strong hover:border-fg",
          "checked:border-blue checked:bg-blue",
          className,
        )}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 12 10"
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-3 -translate-x-1/2",
          "-translate-y-1/2 text-white opacity-0 transition-opacity",
          "duration-[--duration-fast] peer-checked:opacity-100",
        )}
      >
        <path
          d="M1 5 4.5 8.5 11 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
