import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { ForAudience } from "@/components/sections/ForAudience";
import { Statement } from "@/components/sections/Statement";
import { AiQuality } from "@/components/sections/AiQuality";
import { WhyLofte } from "@/components/sections/WhyLofte";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FeatureZoom } from "@/components/sections/FeatureZoom";
import { Method } from "@/components/sections/Method";
import { Proof } from "@/components/sections/Proof";
import { ClosingCta } from "@/components/sections/ClosingCta";

/**
 * Home, paced like a product page: one statement per screen, large centred
 * headlines, rounded tiles, and content that rises in as it arrives. The
 * order: a promise, the argument in one sentence, the six capabilities, who
 * they are for, the case for a single studio, the work, the room that work is
 * shown in, the method, what we can honestly prove, and the invitation.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AiQuality />
      <Statement />
      <Capabilities />
      <ForAudience />
      <WhyLofte />
      <SelectedWork />
      <FeatureZoom />
      <Method />
      <Proof />
      <ClosingCta />
    </>
  );
}
