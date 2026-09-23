import { cn } from "@/lib/cn";

/**
 * A labelled stand-in for case-study media.
 *
 * Deliberately abstract. It reserves the shape and weight a real portfolio
 * still will occupy without pretending to be one — no fake screenshot, no
 * stock photograph, no invented interface. It speaks the same visual language
 * as the hero signal field: a small page of set type with one figure in it.
 *
 * The viewBox is derived from the slot's aspect ratio rather than fixed, so a
 * wide plate composes as a wide page instead of being scaled up and cropped.
 */

const RATIOS = {
  wide: { w: 640, h: 280 },
  standard: { w: 480, h: 300 },
} as const;

export type PlateRatio = keyof typeof RATIOS;

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function compose(seed: number, ratio: PlateRatio) {
  const view = RATIOS[ratio];
  const rand = prng(seed * 7919 + 13);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const round = (n: number) => Number(n.toFixed(2));

  const pad = 30;
  const left = pad;
  const right = view.w - pad;
  // Leading is derived so the block fills the plate top to bottom rather than
  // leaving a dead band at the foot.
  const rowCount = Math.max(4, Math.round((view.h - pad * 2) / 18));
  const leading = (view.h - pad * 2) / (rowCount - 1);

  // One figure, set into the flow, with the lines running short beside it.
  const figure = {
    x: round(rand() > 0.5 ? right - between(150, 210) : left),
    y: round(view.h * between(0.28, 0.38)),
    w: round(between(150, 210)),
    h: round(view.h * between(0.34, 0.46)),
  };

  const lines: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    tone: "mist" | "sky" | "paper";
    opacity: number;
  }[] = [];

  const accentRow = 2 + Math.floor(rand() * 3);

  for (let row = 0; row < rowCount; row += 1) {
    const y = pad + row * leading;
    const isHeadline = row === 0;
    const overlapsFigure = y + 6 > figure.y && y < figure.y + figure.h;

    // Wrap around the figure exactly as the hero field does.
    const bounds = overlapsFigure
      ? figure.x === left
        ? { from: figure.x + figure.w + 18, to: right }
        : { from: left, to: figure.x - 18 }
      : { from: left, to: right };

    const measure =
      (bounds.to - bounds.from) * (isHeadline ? between(0.5, 0.7) : between(0.62, 1));
    if (measure < 36) continue;

    const count = isHeadline
      ? 1
      : Math.max(1, Math.min(3, Math.floor(measure / 120) + 1));
    const gap = 10;
    const usable = measure - gap * (count - 1);
    let cursor = bounds.from;

    for (let index = 0; index < count; index += 1) {
      const w = Math.max(26, usable / count) * between(0.82, 1.18);
      if (cursor + w > bounds.to) break;
      const tone = isHeadline ? "paper" : row === accentRow ? "sky" : "mist";
      lines.push({
        id: `l-${row}-${index}`,
        x: round(cursor),
        y: round(isHeadline ? y - 2 : y),
        w: round(w),
        h: isHeadline ? 5 : tone === "sky" ? 2.5 : 2,
        tone,
        opacity: round(
          isHeadline ? 0.7 : tone === "sky" ? between(0.6, 0.8) : between(0.28, 0.5),
        ),
      });
      cursor += w + gap;
    }
  }

  return { view, figure, lines };
}

/** Roles, resolved through the current surface — see SignalField. */
const TONE: Record<string, string> = {
  mist: "var(--signal-quiet)",
  sky: "var(--signal-strong)",
  paper: "var(--signal-head)",
};

export function WorkPlate({
  seed,
  ratio = "standard",
  className,
}: {
  seed: number;
  ratio?: PlateRatio;
  className?: string;
}) {
  const { view, figure, lines } = compose(seed, ratio);

  return (
    <svg
      viewBox={`0 0 ${view.w} ${view.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn("bg-signal-plate h-full w-full", className)}
    >
      <rect
        x={figure.x}
        y={figure.y}
        width={figure.w}
        height={figure.h}
        fill="var(--signal-strong)"
        fillOpacity={0.12}
        stroke="var(--signal-quiet)"
        strokeOpacity={0.36}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {lines.map((line) => (
        <rect
          key={line.id}
          x={line.x}
          y={line.y}
          width={line.w}
          height={line.h}
          fill={TONE[line.tone]}
          fillOpacity={line.opacity}
        />
      ))}
    </svg>
  );
}
