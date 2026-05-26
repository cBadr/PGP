/**
 * PGP Vault — primary brand mark.
 *
 * Concept: a hexagonal vault door with a keyhole and a stylized inner
 * fingerprint ridge, drawn as a single SVG so it scales and prints
 * crisply at every size. Subtle aurora glow on hover.
 */
import Link from "next/link";

export function LogoMark({
  size = 36,
  glow = true,
  className = "",
}: {
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  const gid = `pv-grad-${size}`;
  const gid2 = `pv-grad2-${size}`;
  const fid = `pv-glow-${size}`;

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-mark ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={gid2} x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {glow && (
          <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${fid})` : undefined}>
        {/* outer hexagonal vault door */}
        <path
          d="M20 2.2 L35.6 11.2 L35.6 28.8 L20 37.8 L4.4 28.8 L4.4 11.2 Z"
          stroke={`url(#${gid})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* inner highlight fill */}
        <path
          d="M20 2.2 L35.6 11.2 L35.6 28.8 L20 37.8 L4.4 28.8 L4.4 11.2 Z"
          fill={`url(#${gid2})`}
        />
        {/* inner hex */}
        <path
          d="M20 9 L29.6 14.55 L29.6 25.45 L20 31 L10.4 25.45 L10.4 14.55 Z"
          stroke={`url(#${gid})`}
          strokeWidth="0.9"
          opacity="0.5"
          strokeLinejoin="round"
        />
        {/* keyhole circle */}
        <circle cx="20" cy="17.5" r="3" stroke={`url(#${gid})`} strokeWidth="1.8" />
        {/* keyhole stem */}
        <path d="M20 20.5 L20 26.2" stroke={`url(#${gid})`} strokeWidth="1.8" strokeLinecap="round" />
        {/* corner dots */}
        <circle cx="20" cy="2.2"  r="1.1" fill={`url(#${gid})`} />
        <circle cx="35.6" cy="11.2" r="0.9" fill={`url(#${gid})`} opacity="0.7" />
        <circle cx="35.6" cy="28.8" r="0.9" fill={`url(#${gid})`} opacity="0.7" />
        <circle cx="20" cy="37.8" r="1.1" fill={`url(#${gid})`} />
        <circle cx="4.4"  cy="28.8" r="0.9" fill={`url(#${gid})`} opacity="0.7" />
        <circle cx="4.4"  cy="11.2" r="0.9" fill={`url(#${gid})`} opacity="0.7" />
      </g>
    </svg>
  );
}

/** Full logo: mark + wordmark, intended for nav headers. */
export function Logo({
  href = "/",
  size = 34,
  subtitle,
}: {
  href?: string;
  size?: number;
  subtitle?: string;
}) {
  return (
    <Link href={href} className="logo-link group inline-flex items-center gap-2.5">
      <span className="relative">
        <LogoMark size={size} />
        <span className="absolute inset-0 rounded-full blur-xl bg-violet-500/30 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="logo-wordmark">PGP·Vault</span>
        {subtitle && (
          <span className="text-[9px] uppercase tracking-[0.22em] text-white/40 mt-1">{subtitle}</span>
        )}
      </span>
    </Link>
  );
}
