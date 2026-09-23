import Link from "next/link";
import { cn } from "@/lib/cn";
import { cta, footerNav, site } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";
import { TextLink } from "@/components/ui/TextLink";
import { ButtonLink } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-ink bg-ink-sunken text-fg">
      <div className="container-page py-(--spacing-section-tight)">
        <div className="border-rule grid gap-x-8 gap-y-12 border-t pt-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-block rounded-sm"
              aria-label="Løfte Studios — home"
            >
              <Logo className="text-[1.25rem]" />
            </Link>
            <p className="measure text-body-sm text-fg-muted mt-5">
              A creative-production and digital-storytelling partner in {site.city}.
              Words, motion, sound, and visual systems under one roof.
            </p>
            <div className="mt-7">
              <ButtonLink href={cta.primary.href} variant="outline">
                {cta.primary.label}
              </ButtonLink>
            </div>
          </div>

          {/*
            Nav groups and contact share one sub-grid. A 12-column layout at
            tablet width left roughly 14px per column and pushed the email
            address past the viewport, so the editorial split waits for `lg`.
          */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-micro text-fg-subtle font-sans font-semibold">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-body-sm text-fg-muted transition-colors",
                          "hover:text-fg duration-[--duration-fast]",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="text-micro text-fg-subtle font-sans font-semibold">
                Contact
              </h2>
              <ul className="text-body-sm mt-4 flex flex-col gap-2.5">
                <li>
                  {/* No spaces to break at: let it wrap rather than overflow. */}
                  <TextLink href={`mailto:${site.email}`} className="break-words">
                    {site.email}
                  </TextLink>
                </li>
                {site.phone ? (
                  <li>
                    <TextLink href={`tel:${site.phone.replace(/\s+/g, "")}`}>
                      {site.phone}
                    </TextLink>
                  </li>
                ) : null}
                <li className="text-fg-muted">
                  {site.city}, {site.country}
                </li>
              </ul>
              <p className="text-micro text-fg-subtle mt-4">
                Placeholder address — replace before launch.
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-rule mt-12 flex flex-col gap-3 border-t pt-6",
            "text-micro text-fg-subtle sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>
            Built for {site.name}. Placeholder content is labelled throughout and listed
            in the launch checklist.
          </p>
        </div>
      </div>
    </footer>
  );
}
