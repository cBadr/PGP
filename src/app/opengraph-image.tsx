import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at top, #1e0a3c 0%, #0a0118 60%), linear-gradient(135deg, #4c1d95 0%, #0a0118 60%)",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#f4f1ff",
          padding: 80,
          position: "relative",
        }}
      >
        {/* glowy orb behind */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(217,70,239,0.25) 35%, transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 60%)",
            filter: "blur(50px)",
            display: "flex",
          }}
        />

        {/* brand hex mark */}
        <svg width={170} height={170} viewBox="0 0 40 40" style={{ marginBottom: 28 }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="55%" stopColor="#e879f9" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M20 2.2 L35.6 11.2 L35.6 28.8 L20 37.8 L4.4 28.8 L4.4 11.2 Z"
            stroke="url(#g)"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M20 9 L29.6 14.55 L29.6 25.45 L20 31 L10.4 25.45 L10.4 14.55 Z"
            stroke="url(#g)"
            strokeWidth={0.9}
            fill="none"
            opacity={0.5}
          />
          <circle cx={20} cy={17.5} r={3} stroke="url(#g)" strokeWidth={1.8} fill="none" />
          <path d="M20 20.5 L20 26.2" stroke="url(#g)" strokeWidth={1.8} />
        </svg>

        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            background: "linear-gradient(135deg, #f4f1ff 0%, #c4b5fd 50%, #67e8f9 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            fontSize: 36,
            color: "rgba(244, 241, 255, 0.7)",
            marginTop: 18,
            display: "flex",
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "rgba(244, 241, 255, 0.45)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          generate · encrypt · sign · verify
        </div>
      </div>
    ),
    { ...size },
  );
}
