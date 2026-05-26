/**
 * Centralized site-wide constants used by metadata, OG images, JSON-LD and
 * the sitemap. Update once, propagate everywhere.
 */
export const site = {
  name: "PGP·Vault",
  shortName: "PGP Vault",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pgp-swart.vercel.app",
  description:
    "Generate, manage, encrypt, decrypt, sign and verify with PGP — directly in your browser. A modern open-source PGP toolkit.",
  tagline: "PGP without the headache.",
  keywords: [
    "PGP", "GPG", "OpenPGP",
    "PGP online", "PGP generator", "PGP encrypt", "PGP decrypt",
    "PGP key generator", "PGP sign", "PGP verify",
    "public key cryptography", "end-to-end encryption",
    "RSA key", "ECC key", "curve25519",
    "encrypt message online", "decrypt message online",
  ],
  author: {
    name: "PGP·Vault",
    telegram: "https://t.me/Idlexaz",
    github: "https://github.com/cBadr/PGP",
  },
  twitterHandle: "@Idlexaz",
  themeColor: "#0a0118",
  ogImage: "/opengraph-image",
} as const;
