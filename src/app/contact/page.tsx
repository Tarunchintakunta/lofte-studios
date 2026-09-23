import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata = pageMetadata({
  title: "Start a project",
  description:
    "Tell Løfte Studios what you are trying to get across and who needs to understand it. We will tell you what we would make and what we would leave alone.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Start a project."
        standfirst="Tell us what you are trying to get across and who needs to understand it. We will come back with what we would make, and what we would leave alone."
      />

      <Section surface="ink" size="none" className="pb-(--spacing-section)">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border-rule border-t pt-8">
                <h2 className="text-heading-1 font-display">What happens next</h2>
                <ol className="mt-6 flex flex-col gap-5">
                  {[
                    "A person reads it. Not a form router, and not an automated qualifier.",
                    "If we are a fit, we come back with questions — usually about the audience rather than the budget.",
                    "If we are not a fit, we say so, and point you at someone who is.",
                  ].map((step) => (
                    <li key={step} className="text-body-sm text-fg-muted flex gap-4">
                      <span
                        aria-hidden="true"
                        className="bg-accent mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full"
                      />
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="border-rule mt-10 border-t pt-6">
                  <h3 className="text-micro text-fg-subtle font-sans font-semibold">
                    Prefer email
                  </h3>
                  <p className="text-body-sm mt-3">
                    <TextLink href={`mailto:${site.email}`} className="break-words">
                      {site.email}
                    </TextLink>
                  </p>
                  <p className="text-body-sm text-fg-muted mt-2">
                    {site.city}, {site.country}
                  </p>
                </div>

                <PlaceholderNote className="mt-8">
                  The address above is a placeholder, and no email provider is configured
                  yet — submissions are validated and logged rather than delivered. See
                  the launch checklist.
                </PlaceholderNote>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
