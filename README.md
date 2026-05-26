# 🔐 PGP Vault — Educational SaaS

A beautiful, opinionated SaaS for learning PGP: generate keys, import existing ones, encrypt / decrypt / sign / verify — with a transparent admin console showing **everything** for training purposes.

Built with **Next.js 16 · React 19 · Prisma 7 · PostgreSQL · OpenPGP.js · Tailwind 4**.

> ⚠️ **This is a training build.** All data (passwords, passphrases, private keys) is stored as **plain text** in the database and exposed in the admin panel. Do **not** use it for real-world keys.

---

## ✨ Features

- 👤 Email + password auth (Auth.js v5, JWT sessions)
- 🔑 Generate RSA (2048/3072/4096) or ECC (curve25519, p256, p384, p521) keys
- 📥 Import any ASCII-armored key (public, optionally private + passphrase)
- 🔒 Encrypt a message to one or many recipients
- 🔓 Decrypt with a stored private key + passphrase
- ✍️ Sign / ✅ Verify cleartext messages
- 🔁 **Toggle Server-side ↔ Client-side** processing on every operation page
- 📜 Per-user activity log
- 🛠 Dedicated admin console: all users (with plain passwords), all keys (public + private + passphrase), global activity log
- 🎨 Custom 3D CSS vault centerpiece, animated mesh background, glass UI

---

## 🚀 Deploy to Vercel (recommended)

### 1 · Get a free Postgres database

Sign up at one of:
- **[Neon](https://neon.tech)** *(recommended — serverless, generous free tier)*
- **[Vercel Postgres](https://vercel.com/storage/postgres)** *(one-click from the Vercel dashboard)*
- **[Supabase](https://supabase.com)**

Copy the connection string. It looks like:
```
postgresql://user:password@host/dbname?sslmode=require
```

### 2 · Push this repo to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin git@github.com:YOUR_USER/pgp-vault.git
git push -u origin main
```

### 3 · Import the repo on Vercel

1. Open [vercel.com/new](https://vercel.com/new), pick your GitHub repo.
2. Framework preset is auto-detected as **Next.js**.
3. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL`     | your Neon / Postgres URL |
   | `AUTH_SECRET`      | a long random string — generate with `npx auth secret` |
   | `AUTH_TRUST_HOST`  | `true` |

4. Click **Deploy**.

That's it. The build command `prisma migrate deploy && next build` will create your tables automatically on the first deploy, and on every subsequent migration.

---

## 💻 Local development

### Prerequisites
- Node 20+
- A Postgres database (free Neon DB works perfectly for local dev too)

### Setup

```bash
# 1. install deps (postinstall will run `prisma generate`)
npm install

# 2. create your local env file
cp .env.example .env
# then edit .env and paste your DATABASE_URL + a random AUTH_SECRET

# 3. apply schema to your database
npm run db:migrate -- --name init

# 4. (optional) seed two demo accounts
#    admin@pgpvault.dev / admin1234
#    user@pgpvault.dev  / user1234
npm run seed

# 5. run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The **first registered user automatically becomes admin** — if you skip the seed step, just register and you'll get the admin role.

---

## 🧰 Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev`        | Next.js dev server |
| `npm run build`      | Applies pending migrations + builds for production |
| `npm run start`      | Runs the production build |
| `npm run db:migrate` | Create a new migration & apply locally |
| `npm run db:deploy`  | Apply pending migrations (used in CI / Vercel) |
| `npm run db:studio`  | Open Prisma Studio to inspect data |
| `npm run seed`       | Insert / update the two demo accounts |

---

## 📂 Project structure

```
src/
├── auth.ts                       # Auth.js v5 (Credentials provider)
├── lib/
│   ├── prisma.ts                 # Prisma client (pg adapter)
│   ├── pgp.ts                    # OpenPGP wrapper (generate/encrypt/decrypt/sign/verify)
│   └── activity.ts               # Activity log helper
├── components/
│   ├── Logo.tsx                  # Brand mark + wordmark
│   ├── Vault3D.tsx               # 3D CSS centerpiece (cube + orbits)
│   ├── AnimatedBackground.tsx    # Mesh gradient bg
│   ├── NavLink.tsx               # Active-aware Link
│   ├── CopyBlock.tsx
│   ├── ModeToggle.tsx
│   ├── EncryptForm.tsx · DecryptForm.tsx
│   └── SignForm.tsx    · VerifyForm.tsx
└── app/
    ├── layout.tsx                # Root layout (bg + fonts)
    ├── globals.css               # Design system + 3D + glass + animations
    ├── (marketing)/              # Public area: landing, login, register
    ├── (app)/                    # User area: dashboard, keys, encrypt, decrypt, sign, verify
    ├── admin/                    # Admin area: overview, users, keys, activity
    └── api/
        ├── auth/[...nextauth]/
        ├── encrypt · decrypt · sign · verify
        └── log/                  # Client-side activity logging
```

---

## 🛡 Security model

This is intentionally **insecure by design** for educational reasons:

- Passwords are bcrypt-hashed **and** stored in a `passwordPlain` column so the admin can show them.
- Private keys and passphrases live in plain text in the database.
- The admin console exposes everything; there is no audit on admin reads.

**Do not deploy this with any real PGP key you care about.** If you want to harden it for production:

1. Drop the `passwordPlain` column.
2. Encrypt private keys at rest with a master key derived from each user's password (zero-knowledge).
3. Move PGP operations to the client only.
4. Add rate-limiting (Upstash Redis) + CSRF on the API routes.
5. Add 2FA, email verification, and login throttling.

---

## 📜 License

[MIT](./LICENSE)
