import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const accounts = [
  { email: "admin@pgpvault.dev", password: "admin1234", name: "Admin User",   role: "admin" },
  { email: "user@pgpvault.dev",  password: "user1234",  name: "Regular User", role: "user"  },
];

async function main() {
  for (const a of accounts) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.user.upsert({
      where: { email: a.email },
      update: { passwordHash, passwordPlain: a.password, role: a.role, name: a.name },
      create: { email: a.email, passwordHash, passwordPlain: a.password, role: a.role, name: a.name },
    });
    console.log(`✓ ${a.role.padEnd(5)}  ${a.email}  /  ${a.password}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().then(() => process.exit(1));
  });
