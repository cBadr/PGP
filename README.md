<div align="center">

<br />

<img src="https://img.shields.io/badge/-%F0%9F%94%90%20PGP%20%C2%B7%20VAULT-0a0118?style=for-the-badge&labelColor=0a0118" alt="PGP Vault" height="42" />

<h1>
  <code>PGP&middot;Vault</code>
</h1>

### A beautiful, opinionated SaaS for learning PGP in the open.

Generate keys · encrypt · decrypt · sign · verify — with a transparent admin console that exposes **everything** so you can actually see what's happening under the hood.

<br />

<a href="https://pgp-swart.vercel.app/">
  <img src="https://img.shields.io/badge/%E2%96%B6%20LIVE%20DEMO-pgp--swart.vercel.app-8b5cf6?style=for-the-badge&logoColor=white&labelColor=4c1d95" alt="Live Demo" />
</a>
&nbsp;
<a href="https://t.me/2idlexaz">
  <img src="https://img.shields.io/badge/Talk%20to%20the%20dev-%402idlexaz-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs" />
<img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-7-2d3748?style=flat-square&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/OpenPGP.js-6-e4b740?style=flat-square&logo=openpgp&logoColor=black" />
<img src="https://img.shields.io/badge/Auth.js-v5-22c55e?style=flat-square" />
<img src="https://img.shields.io/badge/license-MIT-violet?style=flat-square" />

</div>

---

> [!WARNING]
> **This is an _intentionally transparent_ training build.** All data — passwords, passphrases, private keys — is stored as **plain text** in the database and exposed in the admin console. Use it to learn PGP, not to protect anything real.

---

## 📑 Table of Contents

- [🎯 Why this exists](#-why-this-exists)
- [✨ Features](#-features)
- [🎨 The 3D Vault](#-the-3d-vault)
- [🧱 Tech Stack](#-tech-stack)
- [🚀 Deploy to Vercel](#-deploy-to-vercel)
- [💻 Local Development](#-local-development)
- [🧰 Scripts](#-scripts)
- [📂 Project Structure](#-project-structure)
- [🔐 Security Model](#-security-model)
- [🛠 Roadmap](#-roadmap)
- [💬 Get in Touch](#-get-in-touch)
- [📜 License](#-license)

---

## 🎯 Why this exists

People who use PGP daily share the same pain: **too many keys, too many fingerprints, too many places to manage them.** This project is an experiment in giving every user one beautiful console to:

- 🗝️ keep their keys in one place
- 📨 encrypt messages to anyone in seconds (saved or pasted recipients)
- 🔍 see exactly what the server, the client, and the admin see

It's built as a **fully open training playground** — every operation is visible, every passphrase is recoverable, every action is logged.

> [!TIP]
> 🌐 **Try the live demo:** [pgp-swart.vercel.app](https://pgp-swart.vercel.app/) — register a free account and explore both the user dashboard and the admin console (first user is auto-promoted to admin).

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 For users

- **Email + password auth** with JWT sessions
- **Generate keys**: RSA (2048 / 3072 / 4096) or ECC (curve25519, p256, p384, p521)
- **Import keys** by pasting any ASCII-armored block
- **Edit metadata** — name, email, stored passphrase
- **Encrypt** to one or many recipients
  - pick from your saved keyring
  - **or paste raw public keys** for ad-hoc recipients
- **Decrypt / sign / verify** — passphrase auto-filled from the stored key
- **Masked passphrase** in the UI with show/hide toggle
- **Activity log** of everything you did

</td>
<td width="50%" valign="top">

### 👑 For admins

- Dedicated **admin console** with sidebar nav at `/admin`
- See **all users** with their plain-text passwords
- See **all keys** (public + private + passphrase) in the system
- **Edit or delete** any user's key
- Browse the **global audit log** (latest 200 events)
- Switch back to user view at any time

</td>
</tr>
<tr>
<td valign="top">

### 🔁 Two processing modes

Every crypto operation has a toggle:

- 🖥️ **Server-side** — runs inside an API route
- 🌐 **Client-side** — runs in the browser via `openpgp` dynamic import

Same UI, two execution paths, both logged with their mode in the activity log so you can _compare_ how each works.

</td>
<td valign="top">

### 🎨 Polished UI

- Custom **3D CSS vault** centerpiece (no libraries)
- Animated mesh-gradient background
- Glass morphism cards everywhere
- Hexagonal SVG brand mark with aurora glow
- Distinct visual identity per area: marketing / user / admin

</td>
</tr>
</table>

---

## 🎨 The 3D Vault

The signature visual element is a pure-CSS 3D scene rendered without a single library:

```
        ╭───────────────────────╮
        │      .  ✦   ·    .    │
        │   ╭──────────╮        │
        │   │   🛡️/key │  ← rotating cube
        │   │    SVG   │        │   (6 PGP glyphs on 6 faces)
        │   ╰──────────╯        │
        │   ◯──◯──◯ ← 3 orbits  │
        │      ✦                │
        ╰───────────────────────╯
```

- **Rotating cube** with 6 SVG sigils (key · lock · shield · signature · cert · unlock)
- **3 dashed orbit rings** at different angles, each carrying glowing particles
- **Floating fingerprint tags** drifting in the background (`RSA-4096`, `curve25519`, `SHA-256`, `0xA1B2C3D4`, …)
- **Animated halo** pulsing behind the cube
- **Animated sheen** sweeping across each face every 7s

---

## 🧱 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router, RSC + Server Actions) | Full-stack from one file tree |
| **UI**        | React 19 · Tailwind CSS 4                       | Modern + minimal |
| **Icons**     | lucide-react                                    | Crisp line icons |
| **3D**        | Pure CSS `transform-style: preserve-3d`         | Zero JS overhead |
| **Auth**      | Auth.js v5 (Credentials, JWT sessions)          | Lean + flexible |
| **ORM**       | Prisma 7 + `@prisma/adapter-pg`                 | Type-safe queries |
| **DB**        | PostgreSQL (Supabase / Neon / Vercel Postgres)  | Serverless-friendly |
| **Crypto**    | OpenPGP.js 6                                    | Battle-tested PGP impl |
| **Hosting**   | Vercel                                          | Zero-config deploy |

---

## 🚀 Deploy to Vercel

### 1️⃣ Get a free Postgres database

Pick one — any will work:

| Provider | URL | Notes |
|----------|-----|-------|
| 🟢 **Supabase** | [supabase.com](https://supabase.com) | Use the **Session pooler** URL (port 5432) |
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add these three environment variables (✅ enable **All Environments** for each, do **not** wrap the values in quotes):

| Key | Value |
|-----|-------|
| `DATABASE_URL`    | your Postgres connection string |
| `AUTH_SECRET`     | generate one: `npx auth secret`  *(or any 48-byte random string)* |
| `AUTH_TRUST_HOST` | `true` |

Click **Deploy** — the build runs `prisma generate && prisma migrate deploy && next build`, so your schema is provisioned automatically.

> ✅ The first user who registers on your deployment is auto-promoted to **admin**.

---

## 💻 Local Development

### Prerequisites
- **Node 20+**
- **PostgreSQL** — easiest is a free Supabase / Neon DB (also valid for local)

### Setup

```bash
# 1 — install dependencies
npm install

# 2 — create your local env file
cp .env.example .env
# then edit .env and fill in DATABASE_URL + AUTH_SECRET

# 3 — apply the schema to your database
npx prisma migrate dev --name init

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
│   └── activity.ts               Activity log helper
├── components/
│   ├── Logo.tsx                  Hex-shield brand mark + wordmark
│   ├── Vault3D.tsx               3D CSS centerpiece — cube + orbits + SVG glyphs
│   ├── AnimatedBackground.tsx    Mesh gradient bg
│   ├── PassphraseField.tsx       Masked passphrase w/ reveal toggle
│   ├── CopyBlock.tsx
│   ├── ModeToggle.tsx            Server ↔ Client toggle
│   ├── NavLink.tsx               Active-aware <Link>
│   ├── EncryptForm.tsx · DecryptForm.tsx
│   └── SignForm.tsx    · VerifyForm.tsx
└── app/
    ├── layout.tsx                Root layout (bg + fonts)
    ├── globals.css               Design system + 3D + glass + animations
    ├── (marketing)/              Public area — landing, login, register
    ├── (app)/                    User area — dashboard, keys, encrypt, decrypt, sign, verify
    ├── admin/                    Admin area — overview, users, keys, activity
    └── api/
        ├── auth/[...nextauth]/
        ├── encrypt · decrypt · sign · verify
        └── log/                  Client-side activity logging endpoint
```

---

## 🔐 Security Model

This app is **insecure on purpose** so it can be a teaching tool:

| What | Why it's exposed |
|------|------------------|
| `passwordPlain` column alongside the bcrypt hash | Admin can read every password in the console |
| Private keys + passphrases in plain text | So you can inspect, copy, debug |
| Full activity log visible to admin without consent | Education over privacy |

### To harden for real-world use

1. **Drop `passwordPlain`.** Keep only the bcrypt hash.
2. **Encrypt private keys at rest** using a key derived from the user's password (PBKDF2 / Argon2 → AES-GCM). The server never sees the plaintext key.
3. **Move crypto operations client-side only** — server never holds the unencrypted private key in memory.
4. **Add rate-limiting** on auth and crypto routes (Upstash Redis).
5. **2FA** (TOTP), email verification, login throttling, CSRF on mutations.
6. **Audit logs** for admin reads (so admin actions are themselves auditable).

---

## 🛠 Roadmap

- [x] Multi-user keyring
- [x] Generate / import / edit / delete keys
- [x] Encrypt (saved + pasted recipients)
- [x] Decrypt / sign / verify (server + client)
- [x] Admin console
- [ ] File encryption (drag & drop)
- [ ] Public key sharing page (`/u/<username>`)
- [ ] Keyserver sync (`keys.openpgp.org`)
- [ ] Two-factor authentication
- [ ] Teams + shared vaults
- [ ] Browser extension (Gmail integration)

---

## 💬 Get in Touch

<div align="center">

Questions, bug reports, feature ideas, contracts — say hi 👋

<a href="https://t.me/2idlexaz">
  <img src="https://img.shields.io/badge/Telegram-%402idlexaz-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram @2idlexaz" />
</a>
<br /><br />

<sub>Or open an <a href="https://github.com/cBadr/PGP/issues">issue</a> on GitHub.</sub>

</div>

---

## 📜 License

[MIT](./LICENSE) — do whatever, just don't blame me.

<div align="center">

<br />

<sub>Built with caffeine, curiosity, and a lot of `transform: rotate3d()`.</sub>

<br />

<a href="https://pgp-swart.vercel.app/">🔗 pgp-swart.vercel.app</a> · <a href="https://t.me/2idlexaz">💬 @2idlexaz</a>

</div>
