import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Løfte Studios handles information submitted through this website. This page is a placeholder pending legal review.",
  path: "/privacy",
  noIndex: true,
});

/**
 * PLACEHOLDER. This is not a privacy policy and must not be treated as one.
 *
 * It exists because the enquiry form's consent checkbox has to link somewhere,
 * and because an honest description of what the site currently does is more
 * useful to the owner's lawyer than a generic template would be. Nothing here
 * has had legal review. See LAUNCH_CHECKLIST → privacy-policy.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy."
        standfirst="What this website currently does with information, written plainly so it can be checked against a real policy."
      />

      <Section surface="paper" size="none" className="pb-(--spacing-section)">
        <Container>
          <PlaceholderNote className="mb-12">
            This is not a privacy policy and has had no legal review. It is a factual
            description of the site as built, provided so that {site.legalName} and its
            advisers can write the real thing. Replace this page before launch.
          </PlaceholderNote>

          <div className="measure-wide border-rule border-t pt-10">
            <h2 className="text-display-3 font-display">What the site collects</h2>
            <p className="text-body text-fg-muted mt-5">
              The only information this website collects is what someone chooses to type
              into the enquiry form: name, work email, company, an optional website, the
              services they are interested in, an optional budget range, timing, and a
              project summary.
            </p>

            <h2 className="text-display-3 font-display mt-12">Where it goes</h2>
            <p className="text-body text-fg-muted mt-5">
              Submissions are emailed to the studio inbox. No database stores them, and no
              customer-relationship or marketing tool is connected. Until an email
              provider and recipient are configured, submissions are not delivered
              anywhere at all — the form reports the failure rather than pretending to
              have sent.
            </p>

            <h2 className="text-display-3 font-display mt-12">Analytics and cookies</h2>
            <p className="text-body text-fg-muted mt-5">
              This site sets no cookies and loads no third-party analytics, advertising,
              or tracking scripts. There is no consent banner because there is nothing to
              consent to. If an analytics provider is added later, this page and the
              site&rsquo;s behaviour both have to change.
            </p>
            <p className="text-body text-fg-muted mt-5">
              Fonts are self-hosted, so no request is made to a font CDN when the page
              loads.
            </p>

            <h2 className="text-display-3 font-display mt-12">
              What still has to be decided
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                "How long enquiries are kept, and who can read them.",
                "The legal basis for processing, and the applicable jurisdictions.",
                "How someone asks for their data to be corrected or deleted, and where they write to.",
                "The registered business name and address to publish.",
                "Whether any analytics will be added, and on what consent basis.",
              ].map((item) => (
                <li key={item} className="text-body text-fg-muted flex gap-4">
                  <span
                    aria-hidden="true"
                    className="bg-coral-deep mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-body text-fg-muted mt-10">
              Questions in the meantime:{" "}
              <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink> — itself a
              placeholder address.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
