import { prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting batch password migration...");

  try {
    // Fetch all users from the database
    const users = await prismaClient.user.findMany();
    console.log(`Found ${users.length} total user records in database.`);

    let migratedCount = 0;

    for (const user of users) {
      const isAlreadyHashed =
        user.password.startsWith("$2a$") || user.password.startsWith("$2b$");

      if (!isAlreadyHashed) {
        console.log(`Migrating plaintext password for user: ${user.email}`);

        // Explicitly generate salt and hash the plaintext password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Update the password in database
        await prismaClient.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        migratedCount++;
      }
    }

    console.log(`🎉 Batch migration complete! Migrated ${migratedCount} plaintext password records.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
    process.exit(1);
  }
}

main();
