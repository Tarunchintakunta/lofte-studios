import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { methodSteps } from "@/content/method";
import { site } from "@/lib/site";

/**
 * Hero: a warm, dark studio scene with one heavy headline, and the six
 * capabilities called out across it with leader lines — then the method
 * running along the foot as a strip.
 *
 * The scene is a photograph at `public/hero.webp` (a clean studio desk shot,
 * no text baked in). The callout dots are placed for that composition. Until
 * the file exists the warm glow carries the section on its own.
 */

const HERO_IMAGE = "/hero.webp";
// ponytail: checked at render time; becomes a CMS field when Sanity is wired.
const hasHeroImage = existsSync(path.join(process.cwd(), "public", HERO_IMAGE));

/**
 * All coordinates are percentages of the scene. `box` is the callout's
 * top-left (or top-right when `right`), `from` is where its leader leaves the
 * box, `to` is the dot on the object it names.
 */
type Callout = {
  name: string;
  tag: string;
  box: { x: number; y: number; right?: boolean };
  from: [number, number];
  to: [number, number];
};

const callouts: Callout[] = [
  {
    name: "Strategy",
    tag: "Plans, timelines, outcomes",
    box: { x: 3, y: 14, right: true },
    from: [93.5, 22.5],
    to: [96.5, 29],
  },
  {
    name: "Video",
    tag: "Edit, motion, content",
    box: { x: 6, y: 36 },
    from: [14, 43.5],
    to: [20, 50],
  },
  {
    name: "Localization",
    tag: "Subtitles, dubbing, adaptation",
    box: { x: 4, y: 45, right: true },
    from: [87, 52.5],
    to: [83, 58],
  },
  {
    name: "Audio",
    tag: "Voice, music, mix",
    box: { x: 9, y: 66, right: true },
    from: [85, 73.5],
    to: [80, 80],
  },
  {
    name: "Copy",
    tag: "Words, scripts, messaging",
    box: { x: 4, y: 64 },
    from: [12, 71.5],
    to: [15, 79],
  },
  {
    name: "Visual",
    tag: "Design, brand, colour",
    box: { x: 40, y: 72 },
    from: [45, 79.5],
    to: [41, 87],
  },
];

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-ink-sunken relative isolate overflow-hidden text-white"
    >
      <div className="relative min-h-[100svh] lg:min-h-[max(calc(100svh-4.5rem),46rem)]">
        {hasHeroImage ? (
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        ) : null}

        {/* Warm lamp light pooling low in the frame, and a vignette that keeps
            the headline and callouts legible over any photograph. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 75%, color-mix(in oklab, var(--color-coral) 38%, transparent), transparent 70%)," +
              "radial-gradient(40% 40% at 90% 85%, color-mix(in oklab, var(--color-sky) 30%, transparent), transparent 70%)," +
              "linear-gradient(to bottom, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.15) 45%, rgb(0 0 0 / 0.35))",
          }}
        />

        {/* Leader lines, drawn once across the whole scene. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {callouts.map((c) => (
            <line
              key={c.name}
              x1={c.from[0]}
              y1={c.from[1]}
              x2={c.to[0]}
              y2={c.to[1]}
              stroke="white"
              strokeOpacity={0.85}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="container-page relative flex flex-col items-center pt-36 pb-16 text-center md:pt-40 lg:pb-0">
          <h1
            id="hero-heading"
            className="font-display text-[clamp(3rem,8.6vw,8.5rem)] leading-[0.88] font-extrabold tracking-[-0.035em] uppercase"
          >
            One idea. <br />
            Every format.
          </h1>

          <p className="text-body-lg mt-7 max-w-[46ch] text-white/90">
            Copy, video, design, audio, localization and strategy for brands. One studio
            in {site.city}, from brief to delivery.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="group rounded-capsule bg-ink hover:bg-ink-raised inline-flex items-center gap-4 border border-white/10 py-2 pr-2 pl-6 text-sm font-bold tracking-wider uppercase transition-colors duration-[--duration-base]"
            >
              Start a project
              <span
                aria-hidden="true"
                className="text-ink grid size-10 place-items-center rounded-full bg-white transition-transform duration-[--duration-base] group-hover:translate-x-0.5"
              >
                <Arrow className="size-4" />
              </span>
            </Link>
            <Link
              href="/services"
              className="text-body-lg rounded-sm underline decoration-1 underline-offset-[6px] hover:decoration-2"
            >
              Explore the services
            </Link>
          </div>

          {/* Below lg the callouts fold into a simple grid. */}
          <ul
            aria-label="What we make"
            className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-2.5 text-left sm:grid-cols-3 lg:hidden"
          >
            {callouts.map((c) => (
              <li
                key={c.name}
                data-hero-node
                className="rounded-xl border border-white/60 bg-black/50 px-3.5 py-2.5"
              >
                <span className="block text-sm font-bold tracking-wide uppercase">
                  {c.name}
                </span>
                <span className="block text-[0.8rem] text-white/85">{c.tag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* From lg: the callouts sit on the scene with their dots. */}
        <ul aria-hidden="true" className="hidden lg:contents">
          {callouts.map((c) => (
            <li key={c.name}>
              <span
                className="absolute rounded-xl border-[1.5px] border-white/85 bg-black/55 px-5 py-3 text-left"
                style={{
                  top: `${c.box.y}%`,
                  ...(c.box.right ? { right: `${c.box.x}%` } : { left: `${c.box.x}%` }),
                }}
              >
                <span className="block text-base font-bold tracking-wide uppercase">
                  {c.name}
                </span>
                <span className="block text-sm text-white/90">{c.tag}</span>
              </span>
              <span
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgb(255_255_255/0.2)]"
                style={{ left: `${c.to[0]}%`, top: `${c.to[1]}%` }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* The method, as a strip along the foot of the hero. */}
      <nav aria-label="The Løfte method" className="bg-ink border-t border-white/10">
        <ol className="container-page grid grid-cols-2 gap-x-6 gap-y-3 py-5 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:py-6">
          {methodSteps.map((step, i) => (
            <li
              key={step.index}
              className="flex items-center gap-6 lg:flex-1 lg:last:flex-none"
            >
              <Link
                href="/approach"
                className="text-sm font-bold tracking-wider whitespace-nowrap uppercase hover:text-[--color-sky]"
              >
                <span className="text-white/60">
                  {String(step.index).padStart(2, "0")}
                </span>{" "}
                {step.name}
              </Link>
              {i < methodSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-white/25 lg:block"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
