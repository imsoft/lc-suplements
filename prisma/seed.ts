import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const newCategories = [
  { name: "Ganadores", slug: "ganadores" },
  { name: "BCAA y aminoácidos", slug: "bcaa-y-aminoacidos" },
  { name: "Glutamina", slug: "glutamina" },
  { name: "Termogénicos", slug: "termogenicos" },
  { name: "Multivitamínicos", slug: "multivitaminicos" },
  { name: "Precursores", slug: "precursores" },
  { name: "Carbohidratos", slug: "carbohidratos" },
  { name: "Accesorios", slug: "accesorios" },
  { name: "Bebidas", slug: "bebidas" },
  { name: "Snacks", slug: "snacks" },
  { name: "Péptidos", slug: "peptidos" },
  { name: "Fármaco deportivo", slug: "farmaco-deportivo" },
  { name: "Hormonas", slug: "hormonas" },
];

async function main() {
  // Create the first new category so products can be reassigned to it
  const ganadores = await prisma.category.upsert({
    where: { slug: "ganadores" },
    update: {},
    create: { name: "Ganadores", slug: "ganadores" },
  });

  // Reassign all existing products to "Ganadores" before deleting old categories
  const updated = await prisma.product.updateMany({
    data: { categoryId: ganadores.id },
  });
  if (updated.count > 0) {
    console.log(`  → ${updated.count} producto(s) reasignados a "Ganadores".`);
  }

  await prisma.category.deleteMany({ where: { slug: { not: "ganadores" } } });
  console.log("✅ Categorías anteriores eliminadas.");

  for (const cat of newCategories) {
    if (cat.slug === "ganadores") continue; // already created via upsert
    await prisma.category.create({ data: cat });
    console.log(`  + ${cat.name}`);
  }

  console.log(`\n✅ ${newCategories.length} categorías creadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
