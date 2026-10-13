"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ClosedCaptioning,
  FilmSlate,
  MapPin,
  Microphone,
  PenNib,
  ChartPieSlice,
  Stack,
  Path,
  ListBullets,
  UsersThree,
  Translate,
} from "@phosphor-icons/react";

/**
 * Studio hero, ported from valletivarish/lofte. Copy lives here until the two
 * sites share one content source.
 */
const site = {
  headline: ["Side-kick for all", "content needs"],
  sub: "Copy, video, visuals, audio and localization for growing brands.",
};

const heroChips = [
  { name: "Copywriting", line: "Scripts and editing", icon: "copy" },
  { name: "Narration", line: "Voice with intent", icon: "audio" },
  { name: "Infographics", line: "Graphics and illustration", icon: "visual" },
  { name: "Video editing", line: "Post and storyboarding", icon: "video" },
  { name: "Localization", line: "Translation, transcreation", icon: "localization" },
  { name: "Subtitling", line: "Captions for every market", icon: "subtitles" },
] as const;

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const chipIcons = { copy: PenNib, audio: Microphone, visual: ChartPieSlice, video: FilmSlate, localization: Translate, subtitles: ClosedCaptioning };

// Measured from the reference composition, as % of the hero box. Left column then right column.
const chipBoxes = [
  { left: "9.6%", top: "40%", side: "l" },
  { left: "8.8%", top: "54%", side: "l" },
  { left: "4.6%", top: "72.5%", side: "l" },
  { right: "12.5%", top: "40%", side: "r" },
  { right: "5%", top: "54%", side: "r" },
  { right: "6%", top: "72.5%", side: "r" },
] as const;

// Truthful base bar: counts of Løfte's own offer and studio facts. No outcome figures.
const facts = [
  { icon: Stack, value: "04", label: "Capabilities" },
  { icon: Path, value: "06", label: "Stages, discover to delivery" },
  { icon: ListBullets, value: "21", label: "Disciplines" },
  { icon: UsersThree, value: "01", label: "Studio, no hand-offs" },
  { icon: MapPin, value: "HYD", label: "Jubilee Hills, Hyderabad" },
];

const bars = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const s = Math.sin((i + 1) * seed) * 10000;
    const r = s - Math.floor(s);
    const env = Math.sin(((i + 0.5) / n) * Math.PI);
    return { h: Math.max(10, Math.round((0.25 + r * 0.75) * env * 170)), d: (r * 1.6).toFixed(2) };
  });

// Each callout opens its capability page (Subtitling sits under Localization).
const chipTarget = { copy: "copy", audio: "audio", visual: "visual", video: "video", localization: "localization", subtitles: "localization" } as const;

export function StudioHero() {
  const root = useRef<HTMLElement>(null);
  const common = { alt: "", sizes: "(min-width: 48rem) 84vw, 100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/images/hero-editor.jpg", width: 2592, height: 1536, quality: 80 });
  const {
    props: { srcSet: tall, ...img },
  } = getImageProps({ ...common, src: "/images/hero-editor-portrait.jpg", width: 1520, height: 2688, quality: 75 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        const split = SplitText.create("[data-anim=title]", { type: "lines,chars", mask: "lines" });
        tl.from("[data-anim=photo]", { autoAlpha: 0, scale: 1.08, filter: "blur(14px)", duration: 1.8, ease: "expo.out" }, 0.1)
          .from(split.chars, { yPercent: 115, duration: 1, stagger: { each: 0.022, from: "random" }, ease: "expo.out" }, 0.2)
          .from("[data-anim=sub]", { y: 18, autoAlpha: 0, duration: 0.9 }, 0.7)
          .from("[data-anim=cta] > *", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.85)
          .from("[data-anim=arc]", { strokeDashoffset: 1, duration: 1.6, ease: "power2.inOut" }, 0.6)
          .from("[data-anim=chip]", { autoAlpha: 0, scale: 0.86, y: 14, duration: 0.8, stagger: 0.09, ease: "back.out(1.6)" }, 1.0)
          .from("[data-anim=wave] i", { scaleY: 0, duration: 0.6, stagger: { each: 0.015, from: "center" } }, 0.9)
          .from("[data-anim=fact]", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 1.15)
          // Hand back plain text once the headline has landed (no masks left in the DOM).
          .call(() => split.revert());


        // Scroll out: the photo drifts down, the headline lifts away.
        gsap.to("[data-anim=photo]", { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        // The headline is fully gone before the page reaches it; the hero dims as the curtain covers it.
        gsap.to("[data-anim=copy]", { yPercent: -14, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "40% top", scrub: true } });
        gsap.fromTo("[data-anim=dim]", { autoAlpha: 0 }, { autoAlpha: 0.7, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });

      // Ambient float on the annotated callouts (xl only), each on its own rhythm; it holds still under the pointer or focus.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 80rem)", () => {
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-anim=chip] > a").map((el, i) => {
          const t = gsap.to(el, { y: i % 2 ? 6 : -6, duration: 2.6 + (i % 3) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 + i * 0.2 });
          const hold = () => t.pause();
          const go = () => t.resume();
          el.addEventListener("pointerenter", hold);
          el.addEventListener("focus", hold);
          el.addEventListener("pointerleave", go);
          el.addEventListener("blur", go);
          return () => ["pointerenter", "pointerleave", "focus", "blur"].forEach((ev, k) => el.removeEventListener(ev, k % 2 ? go : hold));
        });
        return () => cleanups.forEach((c) => c());
      });
    },
    { scope: root },
  );

  const left = bars(34, 12.9898);
  const right = bars(28, 78.233);

  return (
    <section ref={root} className="hero on-dark flex flex-col" aria-labelledby="hero-title">
      <picture className="hero-photo">
        <source media="(min-width: 48rem)" srcSet={wide} />
        <img
          {...img}
          srcSet={tall}
          alt=""
          loading="eager"
          fetchPriority="high"
          data-anim="photo"
          className="size-full object-cover object-[50%_100%] md:object-center"
        />
      </picture>
      <div className="hero-grade" />
      <div className="hero-grain" />

      {/* Arcs through the callout column, from the reference geometry. */}
      <svg className="pointer-events-none absolute inset-0 z-[2] hidden size-full xl:block" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path data-anim="arc" pathLength={1} strokeDasharray="1" stroke="rgb(255 255 255 / 0.28)" d="M 250 900 A 520 520 0 0 1 1190 900" />
          <path data-anim="arc" pathLength={1} strokeDasharray="1" stroke="rgb(255 255 255 / 0.16)" d="M 175 900 A 600 520 0 0 1 1265 900" />
        </g>
      </svg>

      <div data-anim="wave" aria-hidden="true" className="wave pointer-events-none absolute left-[0.5%] top-[50%] z-[2] hidden h-[18%] w-[14%] items-center justify-between xl:flex">
        {left.map((b, i) => (
          <i key={i} style={{ height: b.h, ["--d" as string]: b.d }} />
        ))}
      </div>
      <div data-anim="wave" aria-hidden="true" className="wave pointer-events-none absolute right-[0.5%] top-[57%] z-[2] hidden h-[12%] w-[11%] items-center justify-between xl:flex">
        {right.map((b, i) => (
          <i key={i} style={{ height: Math.round(b.h * 0.7), ["--d" as string]: b.d }} />
        ))}
      </div>

      <div data-anim="dim" aria-hidden="true" className="pointer-events-none invisible absolute inset-0 z-20 bg-ink opacity-0" />


      <div data-anim="copy" className="gutter relative z-10 grid justify-items-center pt-32 text-center lg:pt-36">
        {/* A soft shade behind the headline keeps white type legible on the brightest part of the field. */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[rgb(70_16_4/0.32)] blur-[60px]" />
        <h1 id="hero-title" data-anim="title" className="display text-[clamp(2.6rem,0rem+7.4vw,8rem)] font-extrabold uppercase leading-[0.88]">
          {site.headline[0]} <br className="hidden sm:block" />
          {site.headline[1]}
        </h1>
        <p data-anim="sub" className="mt-5 max-w-[36rem] text-[1.1rem] font-medium leading-snug sm:text-[1.3rem]">
          {site.sub}
        </p>
        <div data-anim="cta" className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/services"
            className="group inline-flex h-14 items-center gap-5 rounded-full bg-[#141311] pl-7 pr-2 text-[0.88rem] font-semibold uppercase tracking-[0.08em] text-white no-underline shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)] transition-colors hover:bg-black"
          >
            Explore our services
            <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">
              <ArrowRight weight="bold" className="size-[1.1rem]" aria-hidden="true" />
            </span>
          </Link>
          <Link href="/contact" className="font-semibold text-white underline decoration-[1.5px] underline-offset-[0.35em] hover:decoration-[3px] xl:hidden">
            Start a project
          </Link>
        </div>
      </div>

      {/* Callouts: annotated on the photo from 80rem; a grid below that. */}
      {/* Full-bleed on xl so chips can sit on the photo; it must not swallow clicks meant for the header and CTA. */}
      <nav aria-label="What we make" className="gutter relative z-10 mt-8 xl:pointer-events-none xl:absolute xl:inset-0 xl:mt-0 xl:p-0">
        <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:contents">
          {heroChips.map((c, i) => {
            const Icon = chipIcons[c.icon];
            const box = chipBoxes[i];
            return (
              <li
                key={c.name}
                data-anim="chip"
                className="xl:pointer-events-auto xl:absolute"
                style={{ left: "left" in box ? box.left : undefined, right: "right" in box ? box.right : undefined, top: box.top }}
              >
                <Link href={`/services/${chipTarget[c.icon]}`} className="chip relative h-full xl:h-auto">
                  <Icon weight="light" className="size-6 flex-none xl:size-8" aria-hidden="true" />
                  <span className="grid leading-tight">
                    <span className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] xl:text-[0.8rem]">{c.name}</span>
                    <span className="hidden text-[0.74rem] text-white/85 sm:inline xl:text-[0.82rem]">{c.line}</span>
                  </span>
                  <span aria-hidden="true" className={`chip-dot hidden xl:block ${box.side === "l" ? "-right-[6px]" : "-left-[6px]"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Base bar: the reference's stats strip, holding facts about the offer. */}
      <div className="relative z-10 mt-auto pt-10">
        <ul
          className="gutter grid grid-cols-2 gap-x-4 gap-y-5 bg-[linear-gradient(180deg,rgb(20_6_2/0)_0%,rgb(20_6_2/0.72)_40%)] pb-6 pt-8 sm:grid-cols-3 xl:grid-cols-5 xl:gap-0 xl:pb-7"
          aria-label="Løfte Studios at a glance"
        >
          {facts.map((f, i) => (
            <li key={f.label} data-anim="fact" className={`flex items-center gap-3 last:col-span-2 sm:last:col-span-1 xl:gap-4 xl:pr-6 ${i ? "xl:border-l xl:border-white/20 xl:pl-6" : ""}`}>
              <f.icon weight="light" className="size-7 flex-none text-[#ff8a4c] xl:size-9" aria-hidden="true" />
              <span className="grid leading-tight">
                <span className="display text-[1.5rem] tabular-nums xl:text-[1.9rem]">{f.value}</span>
                <span className="text-[0.92rem] text-white/85">{f.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
