import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { primaryNav } from "@/lib/site";

export default function NotFound() {
  return (
    <Section surface="ink" size="none" className="pt-40 pb-(--spacing-section) md:pt-48">
      <Container>
        <p className="text-body-sm text-fg-subtle">404</p>
        <h1 className="optical-left text-display-2 mt-5 max-w-[16ch]">
          That page is not here.
        </h1>
        <p className="measure-wide text-body-lg text-fg-muted mt-7">
          It may have moved, or it may never have existed. Either way, these are the
          places worth going instead.
        </p>

        <ul className="border-rule mt-10 max-w-lg border-t">
          {primaryNav.map((item) => (
            <li key={item.href} className="border-rule border-b">
              <TextLink href={item.href} className="block py-4">
                {item.label}
              </TextLink>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
