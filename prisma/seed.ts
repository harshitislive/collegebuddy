import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // SUPERADMIN user
  const superAdminPassword = await bcrypt.hash("super123", 10);
  await prisma.user.upsert({
    where: { email: "harshit@example.com" },
    update: { role: "SUPERADMIN" },
    create: {
      name: "Harshit (Super Admin)",
      email: "harshit@example.com",
      password: superAdminPassword,
      role: "SUPERADMIN",
    },
  });

  // ADMIN user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "harshit.csv@gmail.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Harshit (Admin)",
      email: "harshit.csv@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed complete: SuperAdmin & Admin created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
