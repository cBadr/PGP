import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e0a3c 0%, #0a0118 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={52} height={52} viewBox="0 0 40 40">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="55%" stopColor="#e879f9" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M20 2.2 L35.6 11.2 L35.6 28.8 L20 37.8 L4.4 28.8 L4.4 11.2 Z"
            stroke="url(#g)" strokeWidth={2.5} fill="none"
          />
          <circle cx={20} cy={17.5} r={3} stroke="url(#g)" strokeWidth={2} fill="none" />
          <path d="M20 20.5 L20 26.2" stroke="url(#g)" strokeWidth={2} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
