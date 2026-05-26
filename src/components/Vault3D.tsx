/**
 * The Vault — a CSS 3D scene centerpiece.
 *
 * A floating glass cube whose six faces show distinct crypto sigils
 * drawn as inline SVG (no emoji). Surrounded by three orbiting rings
 * with light particles and floating fingerprint tags.
 */

type Face = "front" | "back" | "right" | "left" | "top" | "bottom";

export function Vault3D({ size = 560 }: { size?: number }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="vault-stage">
        {/* Outer glow halo */}
        <div className="vault-halo" />

        {/* Orbits */}
        <div className="orbit-ring r3">
          <Particle angle={0}   radius={260} color="#f0abfc" />
          <Particle angle={120} radius={260} color="#c4b5fd" />
          <Particle angle={240} radius={260} color="#67e8f9" />
        </div>
        <div className="orbit-ring r2">
          <Particle angle={60}  radius={210} color="#67e8f9" />
          <Particle angle={200} radius={210} color="#a78bfa" />
        </div>
        <div className="orbit-ring r1">
          <Particle angle={30}  radius={160} color="#ffffff" />
          <Particle angle={180} radius={160} color="#f0abfc" />
          <Particle angle={300} radius={160} color="#67e8f9" />
        </div>

        {/* Floating tags */}
        <span className="float-tag" style={{ top: "8%",  left: "10%",  animationDelay: "0s"   }}>RSA-4096</span>
        <span className="float-tag" style={{ top: "14%", right: "8%",  animationDelay: "1.2s" }}>0xA1B2C3D4</span>
        <span className="float-tag" style={{ bottom: "12%", left: "6%",  animationDelay: "0.6s" }}>curve25519</span>
        <span className="float-tag" style={{ bottom: "8%",  right: "12%", animationDelay: "2s"   }}>SHA-256</span>
        <span className="float-tag" style={{ top: "48%", left: "0%",  animationDelay: "1.7s" }}>OpenPGP</span>
        <span className="float-tag" style={{ top: "52%", right: "0%", animationDelay: "0.3s" }}>ASCII Armor</span>

        {/* Cube */}
        <div className="vault-cube">
          <CubeFace face="front"  variant="violet"><GlyphKey /></CubeFace>
          <CubeFace face="back"   variant="cyan"><GlyphLock /></CubeFace>
          <CubeFace face="right"  variant="emerald"><GlyphShield /></CubeFace>
          <CubeFace face="left"   variant="rose"><GlyphSignature /></CubeFace>
          <CubeFace face="top"    variant="amber"><GlyphCert /></CubeFace>
          <CubeFace face="bottom" variant="fuchsia"><GlyphUnlock /></CubeFace>
        </div>
      </div>
    </div>
  );
}

/* ---------- Compact 3D mark (kept for occasional decorative use) ---------- */
export function MiniVault() {
  return (
    <div className="mini-vault">
      <div className="mini-vault-cube">
        <div className="mini-vault-face f"><GlyphKey size={26} /></div>
        <div className="mini-vault-face b"><GlyphLock size={26} /></div>
        <div className="mini-vault-face r"><GlyphShield size={26} /></div>
        <div className="mini-vault-face l"><GlyphSignature size={26} /></div>
        <div className="mini-vault-face t"><GlyphCert size={26} /></div>
        <div className="mini-vault-face bo"><GlyphUnlock size={26} /></div>
      </div>
    </div>
  );
}

/* ---------- internals ---------- */

function CubeFace({
  face, variant, children,
}: {
  face: Face;
  variant: "violet" | "cyan" | "emerald" | "rose" | "amber" | "fuchsia";
  children: React.ReactNode;
}) {
  return (
    <div className={`vault-face vault-face--${variant} ${face}`}>
      <span className="vault-face__glyph">{children}</span>
      <span className="vault-face__sheen" />
      <span className="vault-face__grid" />
      <span className="vault-face__corners">
        <i /><i /><i /><i />
      </span>
    </div>
  );
}

function Particle({ angle, radius, color }: { angle: number; radius: number; color: string }) {
  const transform = `rotateZ(${angle}deg) translateX(${radius}px)`;
  return (
    <span
      className="orbit-particle"
      style={{
        transform,
        background: `radial-gradient(circle, #fff 0%, ${color} 55%, transparent 100%)`,
        boxShadow: `0 0 14px ${color}, 0 0 28px ${color}55`,
      }}
    />
  );
}

/* ---------- glyphs: inline SVG, scale to face size ---------- */

const G = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function GlyphKey({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <circle cx="16" cy="24" r="8" />
      <path d="M24 24 L42 24" />
      <path d="M36 24 L36 30" />
      <path d="M30 24 L30 32" />
      <circle cx="16" cy="24" r="2.4" fill="currentColor" />
    </svg>
  );
}
function GlyphLock({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <rect x="11" y="22" width="26" height="18" rx="3" />
      <path d="M16 22 V16 a8 8 0 0 1 16 0 V22" />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" />
      <path d="M24 32.5 V35.5" />
    </svg>
  );
}
function GlyphShield({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <path d="M24 6 L38 12 V24 c0 9 -6 14 -14 18 c-8 -4 -14 -9 -14 -18 V12 Z" />
      <path d="M18 23 L22 27 L30 19" />
    </svg>
  );
}
function GlyphSignature({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <path d="M8 32 c4 -6 7 -10 10 -10 c2 0 3 4 5 4 c2 0 3 -8 6 -8 c2 0 3 6 5 6 c2 0 3 -2 6 -2" />
      <path d="M8 38 L40 38" />
    </svg>
  );
}
function GlyphCert({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <rect x="9" y="8" width="30" height="22" rx="2" />
      <path d="M14 16 H34" />
      <path d="M14 21 H28" />
      <circle cx="24" cy="34" r="6" />
      <path d="M21 38 L19 44 L24 41 L29 44 L27 38" />
    </svg>
  );
}
function GlyphUnlock({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} {...G}>
      <rect x="11" y="22" width="26" height="18" rx="3" />
      <path d="M16 22 V16 a8 8 0 0 1 16 0" />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" />
      <path d="M24 32.5 V35.5" />
    </svg>
  );
}
