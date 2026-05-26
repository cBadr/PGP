import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * CSP intentionally allows:
 *   - 'unsafe-inline' on style (Tailwind 4 + inline styles on the 3D scene)
 *   - 'unsafe-eval' / 'wasm-unsafe-eval' on script (openpgp.js uses WASM)
 *   - data: + blob: img (for generated favicons/OG and openpgp output)
 *   - https://keys.openpgp.org for keyserver fetches (planned)
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.shields.io",
  "font-src 'self' data:",
  "connect-src 'self' https://keys.openpgp.org https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
