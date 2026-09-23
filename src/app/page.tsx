import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { WhyLofte } from "@/components/sections/WhyLofte";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FeatureZoom } from "@/components/sections/FeatureZoom";
import { Method } from "@/components/sections/Method";
import { Proof } from "@/components/sections/Proof";
import { ClosingCta } from "@/components/sections/ClosingCta";

/**
 * Home, in the order set by SITE_AND_CONTENT.md. Each section earns its place:
 * a promise, the six capabilities, the argument for a single studio, the work,
 * one piece in focus, the method, what we can honestly prove, and the invitation.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <WhyLofte />
      <SelectedWork />
      <FeatureZoom />
      <Method />
      <Proof />
      <ClosingCta />
    </>
  );
}
