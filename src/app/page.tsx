import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { ForAudienceReel } from "@/components/sections/ForAudienceReel";
import { WhyLofte } from "@/components/sections/WhyLofte";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FeatureZoom } from "@/components/sections/FeatureZoom";
import { Method } from "@/components/sections/Method";
import { Proof } from "@/components/sections/Proof";
import { ClosingCta } from "@/components/sections/ClosingCta";

/**
 * Home, in the order set by SITE_AND_CONTENT.md. Each section earns its place:
 * a promise, the six capabilities, who they are for, the argument for a single
 * studio, the work, the room that work is shown in, the method, what we can
 * honestly prove, and the invitation.
 *
 * The two ink sections — the "For" reel and the room at the end of the zoom —
 * are the only dark fields on the page and are deliberately kept three
 * sections apart, so each reads as a change of register rather than a theme.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <ForAudienceReel />
      <WhyLofte />
      <SelectedWork />
      <FeatureZoom />
      <Method />
      <Proof />
      <ClosingCta />
    </>
  );
}
