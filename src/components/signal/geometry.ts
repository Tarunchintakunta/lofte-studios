/**
 * Signal field geometry.
 *
 * The brand idea, drawn: scattered fragments of information resolve into one
 * clear editorial register. The resolved state is deliberately legible as
 * *a page of set type seen from across a room* — blocks of lines with real
 * leading, ragged last lines, headline bars, and two figures that the text
 * wraps around. That is what a content studio produces, so it is what the
 * field resolves into.
 *
 * The RESOLVED state is what this module returns and what the server renders.
 * The scatter lives in `scatter`, and GSAP animates *from* it — so a visitor
 * with no JavaScript, or with reduced motion on, lands on the finished
 * composition rather than a broken one.
 *
 * Positions come from a seeded PRNG evaluated once at module scope, so server
 * and client produce byte-identical markup and React never has to reconcile a
 * hydration mismatch.
 */

export const VIEW = { w: 560, h: 800 } as const;

const SEED = 20_260_923;

const TOP = 34;
const LEADING = 32; // line-to-line inside a block
const BLOCK_GAP = 72; // paragraph-to-paragraph
const LEFT = 30;
const RIGHT = 530;

/** Lines per block. Uneven on purpose — even blocks read as a table. */
const BLOCKS = [4, 3, 5, 3, 4];

export type Tone = "mist" | "sky" | "coral" | "paper";

export type Fragment = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: Tone;
  opacity: number;
  /** Where this fragment sits before the field resolves. */
  scatter: { x: number; y: number; rotate: number };
};

export type Node = { id: string; x: number; y: number; r: number; tone: Tone };
export type Plane = { id: string; x: number; y: number; w: number; h: number };

/** mulberry32 — small, fast, stable across engines. */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build() {
  const rand = prng(SEED);
  const between = (min: number, max: number) => min + rand() * (max - min);
  const signed = (min: number, max: number) =>
    between(min, max) * (rand() > 0.5 ? 1 : -1);
  const round = (n: number) => Number(n.toFixed(2));

  const fragments: Fragment[] = [];

  /** Precompute each block's vertical extent so figures can be placed in it. */
  const blockTops: number[] = [];
  let cursorY = TOP;
  for (const lines of BLOCKS) {
    blockTops.push(cursorY);
    cursorY += (lines - 1) * LEADING + BLOCK_GAP;
  }

  /**
   * Two figures set into the text. Blocks 1 and 3 run short beside them, so
   * the lines wrap around the image rather than colliding with it — the
   * detail that makes the composition read as a page instead of a diagram.
   */
  const planes: Plane[] = [
    {
      id: "p-1",
      x: 296,
      y: blockTops[1] - 16,
      w: 234,
      h: (BLOCKS[1] - 1) * LEADING + 32,
    },
    {
      id: "p-2",
      x: LEFT,
      y: blockTops[3] - 16,
      w: 226,
      h: (BLOCKS[3] - 1) * LEADING + 32,
    },
  ];

  /** Column bounds per block, narrowed where a figure sits. */
  const bounds = (block: number) => {
    if (block === 1) return { left: LEFT, right: planes[0].x - 22 };
    if (block === 3) return { left: planes[1].x + planes[1].w + 22, right: RIGHT };
    return { left: LEFT, right: RIGHT };
  };

  /** Blocks that open with a headline bar instead of a body line. */
  const headlineBlocks = new Set([0, 2]);
  /** Lines rendered as an emphasised signal rather than quiet information. */
  const skyLines = new Set(["2-1", "2-3"]);
  /** Exactly one coral fragment in the whole field: the active idea. */
  const coralLine = "4-1";

  BLOCKS.forEach((lines, block) => {
    const { left, right } = bounds(block);

    for (let line = 0; line < lines; line += 1) {
      const y = blockTops[block] + line * LEADING;
      const key = `${block}-${line}`;
      const isHeadline = headlineBlocks.has(block) && line === 0;
      const isLast = line === lines - 1;

      // A headline runs short and heavy; a paragraph's last line is ragged.
      const widthFactor = isHeadline
        ? between(0.52, 0.72)
        : isLast
          ? between(0.4, 0.78)
          : 1;
      const measure = (right - left) * widthFactor;

      // Word groups, not debris: a narrow column beside a figure gets fewer
      // pieces, and a short ragged last line resolves to a single solid one.
      const count = isHeadline
        ? 1
        : Math.max(1, Math.min(4, Math.floor(measure / 130) + 1));
      const gap = between(8, 14);
      const usable = measure - gap * (count - 1);
      const weights = Array.from({ length: count }, () => between(0.6, 1.5));
      const total = weights.reduce((sum, weight) => sum + weight, 0);

      let cursorX = left;
      for (let index = 0; index < count; index += 1) {
        const w = Math.max(28, (weights[index] / total) * usable);
        const isCoral = key === coralLine && index === 1;
        const tone: Tone = isCoral
          ? "coral"
          : isHeadline
            ? "paper"
            : skyLines.has(key)
              ? "sky"
              : "mist";

        fragments.push({
          id: `f-${key}-${index}`,
          x: round(cursorX),
          y: round(isHeadline ? y - 2 : y),
          w: round(w),
          h: isHeadline ? 7 : tone === "mist" ? 2 : 2.5,
          tone,
          opacity: round(
            isCoral
              ? 0.95
              : isHeadline
                ? between(0.72, 0.82)
                : tone === "sky"
                  ? between(0.68, 0.9)
                  : between(0.38, 0.62),
          ),
          scatter: {
            x: round(signed(60, 190)),
            y: round(signed(20, 68)),
            rotate: round(signed(2, 6.5)),
          },
        });
        cursorX += w + gap;
      }
    }
  });

  /** Junction points where the eye is meant to land. */
  const nodes: Node[] = [
    { id: "n-1", x: planes[0].x - 22, y: blockTops[1] + LEADING, r: 3.5, tone: "sky" },
    { id: "n-2", x: LEFT, y: blockTops[2], r: 3, tone: "sky" },
    {
      id: "n-3",
      x: planes[1].x + planes[1].w + 22,
      y: blockTops[3] + LEADING,
      r: 3,
      tone: "mist",
    },
  ];

  /** The line the resolving signal travels along, once. */
  const signalLine = fragments.filter((f) => f.id.startsWith("f-2-1-"));
  const signal = {
    y: signalLine[0].y,
    from: Math.min(...signalLine.map((f) => f.x)),
    to: Math.max(...signalLine.map((f) => f.x + f.w)),
  };

  /** True content extent, for sanity-checking against the viewBox. */
  const contentBottom = Math.max(...fragments.map((f) => f.y + f.h));

  return { fragments, planes, nodes, signal, contentBottom };
}

export const FIELD = build();
