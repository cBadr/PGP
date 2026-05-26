-- Drop the plaintext password column.
-- The bcrypt hash in `passwordHash` is the only credential storage going forward.
ALTER TABLE "User" DROP COLUMN "passwordPlain";
