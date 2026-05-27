import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { HelpCircle, ChevronDown, ShieldCheck, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions about PGP",
  description:
    "Answers to the most common PGP questions: what PGP is, how to generate a key, RSA vs ECC, " +
    "how encryption and signing work, key expiration, the web of trust, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ · ${site.name}`,
    description: "Common questions about PGP, public-key cryptography, and how to use them safely.",
    url: `${site.url}/faq`,
  },
};

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "What is PGP?",
    a: "PGP (Pretty Good Privacy) is a public-key cryptography standard for encrypting, decrypting, signing and verifying digital messages and files. Every user has a public key (shared openly) and a matching private key (kept secret). Anyone can encrypt to your public key, but only you can decrypt with your private key.",
  },
  {
    q: "What's the difference between PGP, OpenPGP, and GPG?",
    a: "PGP was the original program by Phil Zimmermann in 1991. OpenPGP is the open standard (RFC 4880, updated by RFC 9580) describing the message format. GPG (GnuPG) is the most popular free implementation of OpenPGP. PGP·Vault uses OpenPGP.js, a JavaScript implementation that runs in the browser.",
  },
  {
    q: "How do I generate a PGP key?",
    a: "Create a free PGP·Vault account, then click 'Generate' under Keys. Pick RSA (3072-bit recommended) or ECC (curve25519 recommended), set a strong passphrase, and optionally an expiry date. The key is generated in seconds.",
  },
  {
    q: "Should I use RSA or ECC for my PGP key?",
    a: "Use ECC (curve25519) for new keys — it's faster, produces shorter signatures, and is the modern best practice. Use RSA (3072-bit minimum) only if you need maximum compatibility with very old software that doesn't support elliptic-curve OpenPGP.",
  },
  {
    q: "What is a PGP fingerprint?",
    a: "A fingerprint is a 40-character hexadecimal hash (SHA-1) of a public key. It's the canonical way to identify and verify a key — two keys with the same fingerprint are the same key. Always verify a fingerprint through a second channel before trusting a key.",
  },
  {
    q: "What does the passphrase protect?",
    a: "The passphrase encrypts your private key locally. Even if someone steals the private key file, they can't use it without the passphrase. The passphrase never leaves your device — it's used to unlock the key and then forgotten.",
  },
  {
    q: "Can PGP·Vault read my private key or passphrase?",
    a: "PGP·Vault is built to be self-hosted or deployed by a trusted operator. The operator (the admin of your instance) has full visibility into all stored keys and passphrases — this is required for support, backup, and export. Every admin action is recorded in an auditable activity log. If you don't trust the operator, self-host your own instance — the entire codebase is MIT-licensed on GitHub.",
  },
  {
    q: "What happens if I lose my passphrase?",
    a: "There is no recovery. The passphrase is the only thing that can unlock your private key. If you lose it, the key is permanently inaccessible. Always store your passphrase in a password manager, and consider generating a revocation certificate as soon as you create a key.",
  },
  {
    q: "What is a revocation certificate?",
    a: "A pre-signed statement that says 'this key is no longer valid.' If your private key is lost or compromised, you publish the revocation certificate so others stop trusting the key. Generate it right after creating a key and store it somewhere safe.",
  },
  {
    q: "What is a keyserver?",
    a: "A keyserver is a public database of PGP public keys, searchable by email or fingerprint. The most widely used one today is keys.openpgp.org. Publishing your public key to a keyserver makes it easy for others to find and encrypt messages to you.",
  },
  {
    q: "Why does my PGP key have an expiry date?",
    a: "Expiry gives the key a natural rotation. If you lose access to a key, it eventually stops being trusted automatically. You can also extend the expiry of a key you still control at any time. A 2-year expiry is a common default.",
  },
  {
    q: "Is PGP·Vault free?",
    a: "Yes, the core features — generate, import, encrypt, decrypt, sign, verify — are free with no limits. The source code is open. Account creation requires only an email address.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "FAQ", item: `${site.url}/faq` },
  ],
};

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <JsonLd data={[faqSchema, breadcrumbSchema]} />

      <header className="text-center mb-12">
        <span className="badge badge-violet"><HelpCircle size={12} /> Knowledge base</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          PGP, <span className="gradient-text">in plain language</span>
        </h1>
        <p className="text-white/60 mt-4 max-w-2xl mx-auto">
          Twelve questions that cover most of what you need to start using PGP confidently.
          If something's missing, <Link href="https://t.me/Idlexaz" className="text-violet-300 hover:text-violet-200">message me on Telegram</Link>.
        </p>
      </header>

      <section className="space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="glass-card group overflow-hidden">
            <summary className="cursor-pointer list-none p-5 flex items-start justify-between gap-3">
              <span className="flex items-start gap-3 flex-1">
                <span className="size-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <h2 className="font-semibold text-base leading-snug">{f.q}</h2>
              </span>
              <ChevronDown size={18} className="text-white/40 group-open:rotate-180 transition shrink-0 mt-1" />
            </summary>
            <div className="px-5 pb-5 pl-[64px] text-white/75 leading-relaxed text-sm">{f.a}</div>
          </details>
        ))}
      </section>

      <section className="glass-card p-8 mt-12 text-center">
        <ShieldCheck size={36} className="text-violet-300 mx-auto mb-3" />
        <h3 className="text-xl font-bold">Ready to put PGP to work?</h3>
        <p className="text-white/55 mt-2 mb-5">Create a free account and generate your first key in under a minute.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/register" className="btn-primary"><KeyRound size={15} /> Create free account</Link>
          <Link href="/login" className="btn-ghost">I have an account</Link>
        </div>
      </section>
    </div>
  );
}
