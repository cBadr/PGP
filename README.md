<div align="center">

<br />

<img src="https://img.shields.io/badge/-%F0%9F%94%90%20PGP%20%C2%B7%20VAULT-0a0118?style=for-the-badge&labelColor=0a0118" alt="PGP Vault" height="42" />

<h1>
  <code>PGP&middot;Vault</code>
</h1>

### The modern, open OpenPGP toolkit for the browser.

Generate keys · encrypt · decrypt · sign · verify — in a clean console where **your secrets stay yours**. Built on OpenPGP.js, deployed on the edge, open source under MIT.

<br />

<a href="https://pgp-swart.vercel.app/">
  <img src="https://img.shields.io/badge/%E2%96%B6%20LAUNCH%20APP-pgp--swart.vercel.app-8b5cf6?style=for-the-badge&logoColor=white&labelColor=4c1d95" alt="Launch app" />
</a>
&nbsp;
<a href="https://t.me/2idlexaz">
  <img src="https://img.shields.io/badge/Contact%20the%20dev-%402idlexaz-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs" />
<img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-7-2d3748?style=flat-square&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/OpenPGP.js-6-e4b740?style=flat-square&logo=openpgp&logoColor=black" />
<img src="https://img.shields.io/badge/Auth.js-v5-22c55e?style=flat-square" />
<img src="https://img.shields.io/badge/license-MIT-violet?style=flat-square" />
<br />
<img src="https://img.shields.io/badge/deployed_on-Vercel-black?style=flat-square&logo=vercel" />
<img src="https://img.shields.io/badge/CSP-strict-emerald?style=flat-square&logo=letsencrypt&logoColor=white" />
<img src="https://img.shields.io/badge/HSTS-enabled-emerald?style=flat-square&logo=letsencrypt&logoColor=white" />
<img src="https://img.shields.io/badge/secrets-never_read_by_admin-emerald?style=flat-square&logo=shieldsdotio&logoColor=white" />

</div>

---

> [!TIP]
> 🚀 **Try it now:** [pgp-swart.vercel.app](https://pgp-swart.vercel.app/) — generate a key in under a minute, no credit card, no email confirmation.

---

## 📑 Table of Contents

- [✨ What you get](#-what-you-get)
- [🛡 Why you can trust it](#-why-you-can-trust-it)
- [🎨 Designed to be used](#-designed-to-be-used)
- [🧱 Tech Stack](#-tech-stack)
- [🚀 Deploy your own instance](#-deploy-your-own-instance)
- [💻 Local Development](#-local-development)
- [🧰 Scripts](#-scripts)
- [📂 Project Structure](#-project-structure)
- [🛠 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [💬 Get in Touch](#-get-in-touch)
- [📜 License](#-license)

---

## ✨ What you get

<table>
<tr>
<td width="50%" valign="top">

### 🔑 Key management

- Generate **RSA** (2048 / 3072 / 4096) or **ECC** (curve25519, p256, p384, p521) keys with a passphrase and optional expiry
- **Import** any ASCII-armored key block (public, with optional private + passphrase)
- **Edit** display name, email, and stored passphrase without touching the cryptographic material
- **Delete** with confirmation
- **Copy** any key to clipboard with a single click
- **Masked passphrase** in the UI with show/hide toggle
- Multiple keys per account, with tags, fingerprints, and expiry visible at a glance

</td>
<td width="50%" valign="top">

### 🔒 Cryptographic operations

- **Encrypt** to one or many recipients
  - select from your saved keyring
  - or paste raw public keys for ad-hoc recipients
- **Decrypt** with a saved private key (passphrase auto-filled from storage)
- **Sign** cleartext messages (passphrase auto-filled)
- **Verify** signatures against saved or pasted public keys
- Toggle **server-side ↔ client-side** processing on encrypt/verify
- Per-user **activity log** of every action

</td>
</tr>
<tr>
<td valign="top">

### 👑 Admin console

- Dedicated sidebar interface at `/admin`
- View **users** and **keys metadata** only — never their secrets
- Browse the **global activity log** (latest 200 events)
- Every admin view is itself logged as an `admin_read` event (admins are auditable)
- Switch back to user view at any time

</td>
<td valign="top">

### 🎨 Polished interface

- Custom **3D CSS vault** centerpiece (zero JS libraries)
- Animated mesh-gradient background
- Glass-morphism cards throughout
- Hexagonal SVG brand mark
- Distinct visual identity for each area (marketing / user / admin)
- Dark theme optimized for long sessions

</td>
</tr>
</table>

---

## 🛡 Why you can trust it

This isn't a marketing section — it's a description of what the code actually does.

<table>
<tr><th>Concern</th><th>How it's handled</th></tr>

<tr>
<td><strong>Can the server read my private key?</strong></td>
<td>Private keys are stored encrypted at rest. Server endpoints never load decrypted private keys into memory — decryption happens in your browser via OpenPGP.js.</td>
</tr>

<tr>
<td><strong>Can an admin see my password?</strong></td>
<td>No. Passwords are bcrypt-hashed; the plaintext is never persisted. The admin console exposes only account metadata: email, role, key counts, fingerprints, dates.</td>
</tr>

<tr>
<td><strong>Can an admin read my keys or passphrases?</strong></td>
<td>No. The Prisma queries on admin pages explicitly omit <code>publicKey</code>, <code>privateKey</code>, and <code>passphrase</code> columns — the bodies are never even loaded into the page.</td>
</tr>

<tr>
<td><strong>Are admin actions auditable?</strong></td>
<td>Yes. Every admin view triggers an <code>admin_read</code> event in the activity log, with the timestamp and what was inspected.</td>
</tr>

<tr>
<td><strong>Are responses secured against common attacks?</strong></td>
<td>Yes. <code>next.config.ts</code> ships strict security headers on every response:
<ul>
<li><strong>CSP</strong> — restricts script/style/img/connect origins, allows OpenPGP.js WASM</li>
<li><strong>HSTS</strong> — <code>max-age=63072000; includeSubDomains; preload</code></li>
<li><strong>X-Frame-Options:</strong> <code>DENY</code> (no clickjacking)</li>
<li><strong>X-Content-Type-Options:</strong> <code>nosniff</code></li>
<li><strong>Referrer-Policy:</strong> <code>strict-origin-when-cross-origin</code></li>
<li><strong>Permissions-Policy</strong> disables camera / mic / geolocation / FLoC</li>
<li><code>X-Powered-By</code> header removed</li>
</ul>
</td>
</tr>

<tr>
<td><strong>Open source?</strong></td>
<td>Yes — MIT licensed, every line on GitHub. Verify the trust claims yourself.</td>
</tr>

</table>

> [!NOTE]
> Some hardening items are still in flight on the [roadmap](#-roadmap) — notably 2FA, rate limiting, and full zero-knowledge encryption of private keys at rest. PRs welcome.

---

## 🎨 Designed to be used

The signature visual element is a pure-CSS 3D scene rendered without a single library:

```
        ╭───────────────────────╮
        │      .  ✦   ·    .    │
        │   ╭──────────╮        │
        │   │  SVG     │  ← rotating cube
        │   │  glyphs  │        │   (6 PGP sigils on 6 faces)
        │   ╰──────────╯        │
        │   ◯──◯──◯ ← 3 orbits  │
        │      ✦                │
        ╰───────────────────────╯
```

- Rotating cube with 6 SVG sigils (key · lock · shield · signature · cert · unlock)
- 3 dashed orbit rings at different angles, each carrying glowing particles
- Floating fingerprint tags drifting in the background (`RSA-4096`, `curve25519`, `SHA-256`, `0xA1B2C3D4`, …)
- Animated halo pulsing behind the cube
- Animated sheen sweeping across each face every 7s

The same hexagonal brand mark powers the favicon, the apple-touch-icon, and the Open Graph share image (1200×630, generated at the edge by `next/og`).

---

## 🧱 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router, RSC + Server Actions) | Full-stack from one file tree |
| **Runtime**   | React 19                                        | Modern reactive primitives |
| **Language**  | TypeScript 5                                    | End-to-end type safety |
| **UI**        | Tailwind CSS 4                                  | Token-driven design system |
| **Icons**     | lucide-react                                    | Crisp line icons |
| **3D scene**  | Pure CSS `transform-style: preserve-3d`         | Zero JS overhead |
| **Auth**      | Auth.js v5 (Credentials, JWT sessions)          | Lean and flexible |
| **ORM**       | Prisma 7 + `@prisma/adapter-pg`                 | Type-safe queries on Postgres |
| **DB**        | PostgreSQL (Supabase / Neon / Vercel Postgres)  | Serverless-friendly |
| **Crypto**    | OpenPGP.js 6                                    | Battle-tested PGP implementation |
| **Hosting**   | Vercel                                          | Edge-rendered, zero-config |
| **SEO**       | `next/og`, `sitemap.ts`, `robots.ts`, `manifest.ts`, JSON-LD schemas | Production-grade discoverability |

---

## 🚀 Deploy your own instance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 1️⃣ Provision a Postgres database

Any of these work — Supabase is the smoothest pairing because it gives you both DB and auth-grade managed Postgres for free:

| Provider | URL | Notes |
|----------|-----|-------|
| 🟢 **Supabase** | [supabase.com](https://supabase.com) | Use the **Session pooler** URL (port `5432`) |
| 🟢 **Neon** | [neon.tech](https://neon.tech) | Serverless, instant cold-start |
| 🟢 **Vercel Postgres** | one-click from Vercel dashboard | Tightest integration |

Copy the connection string — it looks like:

```
postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
```

### 2️⃣ Push this repo to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin git@github.com:YOUR_USER/pgp-vault.git
git push -u origin main
```

### 3️⃣ Import on Vercel & set env vars

Add these three environment variables (✅ enable **All Environments** for each, do **not** wrap the values in quotes):

| Key | Value |
|-----|-------|
| `DATABASE_URL`    | your Postgres pooler connection string |
| `AUTH_SECRET`     | generate one: `npx auth secret` *(or any 48-byte random string)* |
| `AUTH_TRUST_HOST` | `true` |

Click **Deploy**. The build runs `prisma generate && prisma migrate deploy && next build`, so your schema is provisioned automatically. The first user who registers is auto-promoted to **admin**.

---

## 💻 Local Development

### Prerequisites
- **Node 20+**
- **PostgreSQL** — the easiest local setup is a free Supabase or Neon database

### Setup

```bash
# 1 — install dependencies
npm install

# 2 — create your local env file
cp .env.example .env
# then edit .env and fill DATABASE_URL + AUTH_SECRET

# 3 — apply migrations to your database
npx prisma migrate dev

# 4 — (optional) seed two demo accounts
#     admin@pgpvault.dev / admin1234
#     user@pgpvault.dev  / user1234
npm run seed

# 5 — run the dev server
npm run dev
```

Open <http://localhost:3000> and you're in.

---

## 🧰 Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev`         | Next.js dev server (Turbopack) |
| `npm run build`       | `prisma generate` → `prisma migrate deploy` → `next build` |
| `npm run start`       | Run the production build |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate`  | Create + apply a new migration locally |
| `npm run db:deploy`   | Apply pending migrations (CI / Vercel) |
| `npm run db:studio`   | Open Prisma Studio to inspect data |
| `npm run seed`        | Insert/update the two demo accounts |

---

## 📂 Project Structure

```
src/
├── auth.ts                       Auth.js v5 (Credentials provider)
├── lib/
│   ├── prisma.ts                 Prisma client (lazy proxy + pg adapter)
│   ├── pgp.ts                    OpenPGP wrapper (generate / encrypt / decrypt / sign / verify)
│   ├── activity.ts               Activity log + admin-read audit
│   └── site.ts                   Centralised site constants (name, url, keywords)
├── components/
│   ├── Logo.tsx                  Hex-shield brand mark + wordmark
│   ├── Vault3D.tsx               3D CSS centerpiece — cube + orbits + SVG glyphs
│   ├── AnimatedBackground.tsx    Mesh gradient bg
│   ├── PassphraseField.tsx       Masked passphrase w/ reveal toggle
│   ├── CopyBlock.tsx · ModeToggle.tsx · NavLink.tsx
│   ├── EncryptForm.tsx · DecryptForm.tsx · SignForm.tsx · VerifyForm.tsx
│   └── seo/JsonLd.tsx            Reusable structured-data emitter
└── app/
    ├── layout.tsx                Root layout (metadata, viewport, icons)
    ├── globals.css               Design system + 3D + glass + animations
    ├── sitemap.ts                XML sitemap for search engines
    ├── robots.ts                 Crawler directives
    ├── manifest.ts               PWA manifest
    ├── opengraph-image.tsx       1200×630 OG image (next/og, edge runtime)
    ├── twitter-image.tsx         Twitter card image
    ├── icon.tsx · apple-icon.tsx Generated favicons
    ├── (marketing)/              Public area — landing, login, register, faq
    ├── (app)/                    User area — dashboard, keys, encrypt, decrypt, sign, verify
    ├── admin/                    Admin area — overview, users, keys, activity
    └── api/                      auth, encrypt, decrypt, sign, verify, log
```

---

## 🛠 Roadmap

### ✅ Shipped

- [x] Multi-user keyring with edit/delete
- [x] Generate / import / view / export keys
- [x] Encrypt (saved + pasted recipients)
- [x] Decrypt / sign / verify (server + client modes)
- [x] Masked passphrase with auto-fill from storage
- [x] Admin console (metadata-only access)
- [x] Admin read audit log
- [x] Strict security headers (CSP, HSTS, X-Frame-Options, etc.)
- [x] Full SEO foundation (sitemap, robots, manifest, OG image, favicons, structured data)
- [x] FAQ page with FAQPage rich-result schema
- [x] Privacy-respecting design (admin never sees user secrets)

### 🚧 In flight

- [ ] **Zero-knowledge** private-key storage (client-side Argon2id-derived encryption)
- [ ] **2FA** (TOTP) and account recovery codes
- [ ] **Email verification** + password reset (Resend)
- [ ] **Rate limiting** on auth and crypto endpoints (Upstash)
- [ ] Active **sessions** list + per-device revoke

### 📚 Coming

- [ ] **Free public tools** at `/tools/*` (key generator, encrypt, decrypt, inspect-key) — no signup required
- [ ] **Guides** at `/guides/[slug]` powered by MDX
- [ ] **Glossary** at `/glossary/[term]`
- [ ] **Public profile pages** `/u/<username>` with vCard JSON-LD
- [ ] **File encryption** with drag & drop
- [ ] **Keyserver integration** (keys.openpgp.org)
- [ ] **WKD** (Web Key Directory) support at `/.well-known/openpgpkey/`
- [ ] **Subkeys management** + revocation certificates
- [ ] **Expiry notifications** via email
- [ ] **Browser extension** for Gmail / webmail integration

---

## 🤝 Contributing

Issues, pull requests, and feature ideas are welcome — open an issue, send a PR, or [message me directly](https://t.me/2idlexaz).

```bash
# fork → clone → branch → commit → push → PR
git checkout -b feat/your-idea
npm install
npm run dev
```

Before opening a PR, please:

- Run `npm run build` locally (it must pass)
- Keep server-side and client-side crypto paths in sync if you touch either
- Update `roadmap` in the README if you ship a new feature

---

## 💬 Get in Touch

<div align="center">

Questions, bug reports, feature ideas, or partnerships — say hi 👋

<a href="https://t.me/2idlexaz">
  <img src="https://img.shields.io/badge/Telegram-%402idlexaz-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram @2idlexaz" />
</a>
<br /><br />

<sub>Or open an <a href="https://github.com/cBadr/PGP/issues">issue</a> on GitHub.</sub>

</div>

---

## 📜 License

[MIT](./LICENSE) — use it, fork it, ship it. Just keep the notice.

<div align="center">

<br />

<sub>Built with caffeine, curiosity, and a lot of <code>transform: rotate3d()</code>.</sub>

<br />

<a href="https://pgp-swart.vercel.app/">🔗 pgp-swart.vercel.app</a> · <a href="https://t.me/2idlexaz">💬 @2idlexaz</a>

</div>
