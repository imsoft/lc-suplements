import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv[2] ?? "weareimsoft@gmail.com";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌ Usuario no encontrado: ${email}`);
    process.exit(1);
  }

  await db.user.update({ where: { email }, data: { role: "ADMIN" } });
  console.log(`✅ ${user.name} (${email}) ahora es ADMIN`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
