"use client";

import { useRef, type Ref } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { WorkPlate } from "@/components/signal/WorkPlate";

/**
 * The room-in scroll: one aperture, scaled until you are through it.
 *
 * The section pins for a little under two viewports. A sheet of paper carrying
 * the headline has Løfte's aperture mark punched out of it; scrolling scales it
 * toward the viewer until the hole has swallowed the screen, and what was
 * behind it all along — the ink room where the work is shown — is simply where
 * you now are. Nothing fades into nothing: the destination is visible through
 * the aperture from the very first frame.
 *
 * Five decisions worth knowing about:
 *
 *  - **The scale is exponential, not linear.** `45^(p^1.4)` rather than a
 *    straight 1 → 45. A linear scale reads as a lurch — the same numeric step
 *    is a huge visual jump early and an invisible one late. Compounding it
 *    makes the approach feel like constant speed, and the `^1.4` buys the
 *    intro a moment to be read before the push begins.
 *
 *  - **The crossfade earns its place.** The sheet dissolves as the aperture
 *    passes scale 7 → 13. At 13 the hole is ~59vmin across, so it has *not*
 *    yet cleared the corners of a wide viewport — the fade is covering real
 *    paper rather than hiding a reveal that already finished.
 *
 *  - **The aperture's centre is measured, not assumed.** The hole, the rim
 *    light and the transform origin all read from the mark's own box on every
 *    ScrollTrigger refresh, so nothing depends on the headline above it
 *    breaking onto a predictable number of lines.
 *
 *  - **The room is inert until it is visible.** A link nobody can see must not
 *    be reachable by keyboard either. The gate opens and closes off the
 *    crossfade value, so scrubbing back up closes it again.
 *
 *  - **`pinType: "transform"`.** `body` carries `overflow-x: clip`, which can
 *    make the body a containing block and leave a `position: fixed` pin
 *    scrolling away. Transform pinning does not care.
 *
 * Below 768px, and under reduced motion, none of this exists: `globals.css`
 * gates the stacking on `html.js` as well, so the two layers are ordinary
 * blocks and the section reads paper-then-room, top to bottom, unpinned.
 */

/** Where the sheet ends up. Reached only after the light field has gone. */
const MAX_SCALE = 45;
/** Multiples of its own size at which the aperture starts to take the sheet… */
const FADE_FROM = 7;
/** …and at which the sheet has gone entirely. */
const FADE_TO = 13;
/**
 * Share of the pin spent flying through; the remainder holds the room still.
 * The hold is deliberate but it is the one stretch where nothing moves, so it
 * is kept short — a long one reads as the page having stopped responding.
 */
const ZOOM_SHARE = 0.84;

/**
 * A uniform-scale setter for the hot path.
 *
 * `gsap.quickSetter(el, "scale")` is the call this obviously wants and it
 * silently does nothing: `scale` is registered as an *alias* for the pair
 * `"scaleX,scaleY"`, and quickSetter resolves one property name rather than a
 * list, so the write lands nowhere and the element never moves. Setting the two
 * components is the same work and actually renders.
 */
function scaleSetter(target: Element) {
  const setX = gsap.quickSetter(target, "scaleX") as (value: number) => void;
  const setY = gsap.quickSetter(target, "scaleY") as (value: number) => void;
  return (value: number) => {
    setX(value);
    setY(value);
  };
}

export function FeatureZoom() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const rimRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<SVGSVGElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const footRef = useRef<HTMLParagraphElement | null>(null);
  const ambientRef = useRef<HTMLDivElement | null>(null);
  const gateRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        const plane = planeRef.current;
        const rim = rimRef.current;
        const light = lightRef.current;
        const mark = markRef.current;
        const head = headRef.current;
        const foot = footRef.current;
        const ambient = ambientRef.current;
        const gate = gateRef.current;
        if (!stage || !plane || !rim || !light || !mark || !head || !ambient || !gate) {
          return;
        }

        // Aperture geometry, re-read on every refresh — see the note above.
        const syncAperture = () => {
          const stageBox = stage.getBoundingClientRect();
          const markBox = mark.getBoundingClientRect();
          gsap.set([plane, rim], {
            "--aperture-x": `${markBox.left - stageBox.left + markBox.width / 2}px`,
            "--aperture-y": `${markBox.top - stageBox.top + markBox.height / 2}px`,
          });
        };

        const clamp = gsap.utils.clamp(0, 1);
        const ramp = (from: number, to: number, value: number) =>
          clamp(gsap.utils.normalize(from, to, value));

        const setPlaneScale = scaleSetter(plane);
        const setRimScale = scaleSetter(rim);
        const setMarkScale = scaleSetter(mark);
        const setHeadScale = scaleSetter(head);
        const setLight = gsap.quickSetter(light, "opacity");
        const setRim = gsap.quickSetter(rim, "opacity");
        const setAmbient = gsap.quickSetter(ambient, "opacity");
        const setMark = gsap.quickSetter(mark, "opacity");
        // The footnote belongs to the intro, so it leaves with the headline
        // rather than hanging over the room. It does not scale with it.
        const setHead = gsap.quickSetter(foot ? [head, foot] : head, "opacity");

        let reachable: boolean | null = null;
        const setReachable = (open: boolean) => {
          if (open === reachable) return;
          reachable = open;
          if (open) gate.removeAttribute("inert");
          else gate.setAttribute("inert", "");
        };

        const flight = { p: 0 };

        const apply = () => {
          const scale = Math.pow(MAX_SCALE, Math.pow(flight.p, 1.4));
          setPlaneScale(scale);
          setRimScale(scale);

          // The light field gives way to the room's own light.
          const through = ramp(FADE_FROM, FADE_TO, scale);
          setLight(1 - through);
          setAmbient(through);
          setReachable(through > 0.35);

          // Rim light: struck as the push begins, gone once it is only a blur.
          setRim(ramp(1.05, 2.2, scale) * (1 - ramp(18, 40, scale)));

          // Three beats out, in reading order: the headline goes first, then
          // the mark it was set around, then the paper itself.
          setHeadScale(1 + flight.p * 0.55);
          setHead(1 - ramp(1.5, 3.2, scale));
          setMarkScale(1 + flight.p * 2.2);
          setMark(1 - ramp(2.2, 5, scale));
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=180%",
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            // Slightly looser than the reel's: this is one continuous zoom
            // rather than a sequence of discrete states, so it can absorb a
            // little more without reading as lag.
            scrub: 0.55,
            invalidateOnRefresh: true,
            onRefresh: () => {
              syncAperture();
              apply();
            },
          },
        });

        timeline
          .to(flight, { p: 1, ease: "none", duration: ZOOM_SHARE, onUpdate: apply }, 0)
          // The room settles as the sheet clears.
          .fromTo(
            gsap.utils.toArray<HTMLElement>("[data-room-item]", stage),
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.2, stagger: 0.055 },
            0.58,
          )
          // …and then holds. An empty tween out to 1 is what reserves the last
          // fifth of the pin: without it ScrollTrigger would map the whole
          // scroll range onto the zoom and the room would never stand still.
          .to({}, { duration: 1 - ZOOM_SHARE }, ZOOM_SHARE);

        return () => {
          gate.removeAttribute("inert");
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <Section
      ref={rootRef}
      surface="paper"
      size="none"
      id="feature"
      labelledBy="feature-heading"
      className="portal-stage relative overflow-hidden py-(--spacing-section-tight)"
    >
      <div ref={stageRef} data-portal-stage className="relative h-full">
        {/* ---------------------------------------------------------------
            The light field. Document order puts it first because that is the
            order it is read in when nothing is pinned; the gated CSS lifts it
            above the room only when the zoom is live.
            --------------------------------------------------------------- */}
        <div
          ref={lightRef}
          className="portal-layer portal-layer-light surface-paper bg-surface text-fg relative pb-(--spacing-section-tight)"
        >
          {/* The sheet with the hole in it. Not rendered at all in fallback. */}
          <div ref={planeRef} data-portal-plane className="portal-plane" aria-hidden />

          {/* Deliberately not `relative`: the footnote below is positioned
              against the full-height layer, and a positioned Container would
              make `bottom` resolve inside the headline block instead. */}
          <Container className="text-center">
            <div ref={headRef} className="origin-center">
              <h2
                id="feature-heading"
                className="text-display-2 lg:text-display-1 flex flex-col items-center"
              >
                <span>The work,</span>

                {/* Løfte's aperture mark: the ø counter read as a lens. It is
                    set *inside* the headline, in the gap between its two lines,
                    so the sentence stays one accessible string and the mark
                    lands on the optical centre of the sheet at every size. */}
                <span
                  aria-hidden
                  className="flex items-center justify-center py-[3.5vmin] md:py-[5vmin]"
                >
                  <ApertureMark ref={markRef} />
                </span>

                <span>brought into focus.</span>
              </h2>
            </div>

            <p ref={footRef} className="portal-footnote text-body-sm text-fg-muted mt-10">
              Keep scrolling. The frame is the way in.
            </p>
          </Container>
        </div>

        {/* ---------------------------------------------------------------
            The room. Visible through the aperture from the first frame, so the
            zoom arrives somewhere instead of cutting to a new section.
            --------------------------------------------------------------- */}
        <div className="portal-layer portal-layer-room surface-ink bg-surface text-fg relative overflow-hidden py-(--spacing-section-tight)">
          <div
            ref={ambientRef}
            aria-hidden
            className="portal-ambient portal-fade absolute inset-0"
          />

          {/* Edge light on the aperture. It belongs to the room, not the sheet,
              so the crossfade cannot take it with it — which is what lets the
              last stretch of the scale still be felt after the paper has gone. */}
          <div ref={rimRef} data-portal-rim className="portal-rim" aria-hidden />

          <Container className="relative">
            <div
              ref={gateRef}
              className="grid items-center gap-x-12 gap-y-10 lg:grid-cols-12"
            >
              <div data-room-item className="portal-fade lg:col-span-5">
                <div className="border-rule border-t pt-6">
                  <h3 className="optical-left text-display-3">
                    Built for clarity under scrutiny.
                  </h3>
                  <p className="text-body-lg text-fg-muted mt-5 text-balance">
                    The same argument has to survive a boardroom projector, a phone on
                    mute, and a subtitle track in another language. Every version comes
                    out of one edit rather than three exports and a hope.
                  </p>
                  <div className="mt-8">
                    <ButtonLink href="/work" variant="outline">
                      See selected work
                    </ButtonLink>
                  </div>
                  <PlaceholderNote className="mt-8">
                    An abstract composition from Løfte&rsquo;s own signal system — not a
                    client project.
                  </PlaceholderNote>
                </div>
              </div>

              {/* The frame, floating: two offset plates beneath the top sheet,
                  one hairline of shifting light around it, and a translucent
                  ground so the room's ambient pools read through the glass. */}
              <div
                data-room-item
                data-feature-frame
                className="portal-fade lg:col-span-6 lg:col-start-7"
              >
                <div className="relative">
                  <span
                    aria-hidden
                    className="border-rule/60 absolute inset-0 translate-x-4 translate-y-4 border"
                  />
                  <span
                    aria-hidden
                    className="border-rule absolute inset-0 translate-x-2 translate-y-2 border"
                  />
                  {/* The plate and the button below both go to /work. They are
                      deliberately not named the same thing: two links with one
                      accessible name read as a stutter in a screen reader's
                      link list, and this one is the frame, not the call. */}
                  <Link
                    href="/work"
                    aria-label="Selected work"
                    className="media-frame portal-glass relative block"
                  >
                    <span className="block aspect-[16/10] w-full overflow-hidden">
                      <WorkPlate
                        seed={9}
                        ratio="wide"
                        className="media-zoom bg-transparent"
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}

/**
 * The aperture mark. Løfte's ø, drawn as a lens: two hairline rings, the slash
 * interrupted by the opening it crosses, and four ticks at the quarters. The
 * centre is empty on purpose — that is the hole the sheet is masked with, and
 * the room is what shows through it.
 *
 * Sized in `vmin` so it is the same share of any viewport, and `0.7` units of
 * stroke resolves to roughly one device pixel at the size it is drawn.
 */
function ApertureMark({ ref }: { ref: Ref<SVGSVGElement> }) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
      className="text-fg h-[17vmin] w-[17vmin] origin-center"
    >
      <g fill="none" stroke="currentColor" strokeWidth={0.7} strokeLinecap="round">
        <circle cx="50" cy="50" r="33" strokeOpacity={0.24} />
        <circle cx="50" cy="50" r="44" strokeOpacity={0.14} />
        {/* The ø slash, entering and leaving the opening. */}
        <path d="M73.8 33.4 L85.2 25.3" strokeOpacity={0.55} strokeWidth={1.1} />
        <path d="M26.2 66.6 L14.8 74.7" strokeOpacity={0.55} strokeWidth={1.1} />
        {/* Ticks, at the quarters. */}
        <path d="M50 4 V9" strokeOpacity={0.3} />
        <path d="M50 91 V96" strokeOpacity={0.3} />
        <path d="M4 50 H9" strokeOpacity={0.3} />
        <path d="M91 50 H96" strokeOpacity={0.3} />
      </g>
    </svg>
  );
}
