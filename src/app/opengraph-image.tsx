import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card.
 *
 * Drawn from the same parts as the hero signal field — an ink ground, a block
 * of resolved editorial rules, one sky accent — so a shared link reads as the
 * same system as the site.
 *
 * It renders in the default `next/og` sans face rather than DM Sans: loading
 * the real display font here would mean a network fetch at build time, and a
 * build that can fail offline is a worse trade than a card in a near typeface.
 * A designed social image is a launch item (LAUNCH_CHECKLIST → logo-svg).
 *
 * Satori, which rasterises this, requires an explicit `display` on every
 * element with more than one child, and treats an interpolation inside text as
 * a separate child — hence the flat divs and the pre-composed strings.
 */
export default function OpengraphImage() {
  const rules = [
    { w: 420, o: 0.5 },
    { w: 360, o: 0.38 },
    { w: 300, o: 0.3 },
    { w: 180, o: 0.22 },
  ];

  const standfirst = `Words, motion, sound, and visual systems — ${site.city}.`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f4f1e8",
        padding: 72,
        color: "#07111e",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 30 }}>
        <div style={{ display: "flex", fontWeight: 600 }}>
          <div style={{ display: "flex" }}>L</div>
          <div style={{ display: "flex", color: "#284bff" }}>ø</div>
          <div style={{ display: "flex" }}>fte</div>
        </div>
        <div style={{ display: "flex", color: "#5f666d", fontWeight: 600 }}>Studios</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              maxWidth: 720,
            }}
          >
            {site.tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 27,
              lineHeight: 1.4,
              color: "#4a5258",
              maxWidth: 640,
            }}
          >
            {standfirst}
          </div>
        </div>

        {/* The signal field, reduced to its essentials. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            paddingBottom: 14,
          }}
        >
          <div style={{ height: 8, width: 300, background: "#07111e", opacity: 0.85 }} />
          {rules.map((rule) => (
            <div
              key={rule.w}
              style={{ height: 4, width: rule.w, background: "#4a5258", opacity: rule.o }}
            />
          ))}
          <div style={{ height: 5, width: 240, background: "#284bff", opacity: 0.95 }} />
        </div>
      </div>
    </div>,
    size,
  );
}
