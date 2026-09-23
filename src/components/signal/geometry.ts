/**
 * Signal field geometry.
 *
 * The brand idea, drawn: scattered fragments of information resolve into one
 * clear editorial register. The RESOLVED state is what this module returns and
 * what the server renders — the scatter lives in `scatter`, and GSAP animates
 * *from* it. So a visitor with no JavaScript, or with reduced motion on, sees
 * the finished composition rather than a broken one.
 *
 * Positions come from a seeded PRNG evaluated once at module scope, so the
 * server and the client produce byte-identical markup and React never has to
 * reconcile a hydration mismatch.
 */

export const VIEW = { w: 640, h: 720 } as const;

const SEED = 20_260_923;
const LANE_COUNT = 9;
const LANE_TOP = 64;
const LANE_GAP = 72;

export type Tone = "mist" | "sky" | "coral";

export type Fragment = {
  id: string;
  lane: number;
  x: number;
  y: number;
  w: number;
  tone: Tone;
  opacity: number;
  /** Where this fragment starts before the field resolves. */
  scatter: { x: number; y: number; rotate: number };
};

export type Node = { id: string; x: number; y: number; r: number; tone: Tone };
export type Plane = { id: string; x: number; y: number; w: number; h: number };

/** mulberry32 — small, fast, and stable across engines. */
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

  const fragments: Fragment[] = [];
  const laneY = (lane: number) => LANE_TOP + lane * LANE_GAP;

  /** Lanes that read as a highlighted signal rather than quiet information. */
  const skyLanes = new Set([2, 6]);
  /** Exactly one coral fragment in the whole field: the active idea. */
  const coralTarget = { lane: 4, index: 1 };

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    const y = laneY(lane);
    // A ragged left and right edge, so the resolved field reads as set type
    // rather than as a rectangle of rules.
    const start = between(48, 138);
    const end = between(470, 612);
    const count = 2 + Math.floor(rand() * 3); // 2–4 segments
    const gap = between(10, 18);
    const usable = end - start - gap * (count - 1);

    // Partition the lane into segments, each at least 40 units wide.
    const weights = Array.from({ length: count }, () => between(0.6, 1.4));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = start;

    for (let index = 0; index < count; index += 1) {
      const w = Math.max(40, (weights[index] / total) * usable);
      const isCoral = lane === coralTarget.lane && index === coralTarget.index;
      const tone: Tone = isCoral ? "coral" : skyLanes.has(lane) ? "sky" : "mist";

      fragments.push({
        id: `f-${lane}-${index}`,
        lane,
        x: Number(cursor.toFixed(2)),
        y,
        w: Number(w.toFixed(2)),
        tone,
        opacity: Number(
          (isCoral
            ? 0.92
            : tone === "sky"
              ? between(0.6, 0.86)
              : between(0.26, 0.5)
          ).toFixed(3),
        ),
        scatter: {
          x: Number(signed(70, 210).toFixed(2)),
          y: Number(signed(22, 74).toFixed(2)),
          rotate: Number(signed(2.5, 7).toFixed(2)),
        },
      });
      cursor += w + gap;
    }
  }

  /**
   * Image planes. Deliberately abstract: they hold the place a portfolio still
   * will occupy without pretending to be one. Rendered behind the lines, so the
   * information reads as sitting over the media.
   */
  const planes: Plane[] = [
    { id: "p-1", x: 330, y: laneY(1) + 14, w: 282, h: laneY(3) - laneY(1) - 28 },
    { id: "p-2", x: 56, y: laneY(5) + 14, w: 244, h: laneY(7) - laneY(5) - 28 },
  ];

  /** Junction points where two fragments meet. */
  const nodes: Node[] = [
    { id: "n-1", x: 330, y: laneY(2), r: 3.5, tone: "sky" },
    { id: "n-2", x: 176, y: laneY(4), r: 3, tone: "mist" },
    { id: "n-3", x: 468, y: laneY(6), r: 3.5, tone: "sky" },
    { id: "n-4", x: 108, y: laneY(7), r: 2.5, tone: "mist" },
  ];

  /** The lane the resolving signal travels along, once. */
  const signalLane = fragments.filter((f) => f.lane === 4);
  const signal = {
    y: laneY(4),
    from: Math.min(...signalLane.map((f) => f.x)),
    to: Math.max(...signalLane.map((f) => f.x + f.w)),
  };

  return { fragments, planes, nodes, signal };
}

export const FIELD = build();
