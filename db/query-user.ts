import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { users } from "./schema";

async function queryUsers() {
  try {
    console.log("🔍 Querying all users...\n");

    const allUsers = await db.select().from(users);

    console.log(`Found ${allUsers.length} users:\n`);

    allUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Tier: ${user.subscriptionTier}\n`);
    });
  } catch (error) {
    console.error("❌ Error querying users:", error);
    throw error;
  }
}

queryUsers()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
