-- Drop the plaintext password column.
-- The bcrypt hash in `passwordHash` is the only credential storage going forward.
-- IF EXISTS makes this safe to re-run on databases that have already migrated.
ALTER TABLE "User" DROP COLUMN IF EXISTS "passwordPlain";
