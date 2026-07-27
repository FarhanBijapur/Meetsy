import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  matches,
  conversations,
  messages,
  communityMembers,
} from "./schema";

const TARGET_USER_ID = "23d59afe-155c-4815-b276-50dbb0101127";

async function addConversations() {
  console.log("🔍 Looking for user with ID:", TARGET_USER_ID);

  try {
    // 1. Find the target user
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, TARGET_USER_ID));

    if (!targetUser) {
      console.error("❌ User not found with ID:", TARGET_USER_ID);
      return;
    }

    console.log(`✓ Found user: ${targetUser.name} (${targetUser.email})`);

    // 2. Find communities the user is part of
    const userCommunities = await db
      .select()
      .from(communityMembers)
      .where(eq(communityMembers.userId, TARGET_USER_ID));

    if (userCommunities.length === 0) {
      console.error("❌ User is not part of any communities");
      return;
    }

    console.log(`✓ User is in ${userCommunities.length} communities`);

    // 3. Find other users in the same communities
    const otherUsersInCommunities = await db
      .select({
        userId: communityMembers.userId,
        communityId: communityMembers.communityId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(communityMembers)
      .innerJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, userCommunities[0].communityId));

    // Filter out the target user
    const potentialMatchUsers = otherUsersInCommunities.filter(
      (u) => u.userId !== TARGET_USER_ID
    );

    if (potentialMatchUsers.length < 2) {
      console.error(
        "❌ Not enough other users in communities to create matches"
      );
      return;
    }

    console.log(
      `✓ Found ${potentialMatchUsers.length} potential match users`
    );

    // 4. Create 2 matches and conversations
    const createdConversations = [];

    for (let i = 0; i < Math.min(2, potentialMatchUsers.length); i++) {
      const otherUser = potentialMatchUsers[i];

      console.log(
        `\n📝 Creating match ${i + 1} with ${otherUser.userName}...`
      );

      // Create match
      const [match] = await db
        .insert(matches)
        .values({
          user1Id: TARGET_USER_ID,
          user2Id: otherUser.userId,
          communityId: otherUser.communityId,
          status: "accepted",
        })
        .returning();

      console.log(`   ✓ Match created (ID: ${match.id})`);

      // Create conversation
      const [conversation] = await db
        .insert(conversations)
        .values({
          matchId: match.id,
          lastMessageAt: new Date(),
        })
        .returning();

      console.log(`   ✓ Conversation created (ID: ${conversation.id})`);

      // Add some initial messages
      const messageTemplates = [
        {
          senderId: otherUser.userId,
          content: `Hi ${targetUser.name}! Excited to connect and learn together!`,
        },
        {
          senderId: TARGET_USER_ID,
          content: `Hey ${otherUser.userName}! Thanks for reaching out. Looking forward to collaborating!`,
        },
        {
          senderId: otherUser.userId,
          content:
            "What are you currently working on? I'd love to hear about your learning goals.",
        },
      ];

      for (const template of messageTemplates) {
        await db.insert(messages).values({
          conversationId: conversation.id,
          senderId: template.senderId,
          content: template.content,
        });
      }

      console.log(`   ✓ Added ${messageTemplates.length} messages`);
      createdConversations.push({
        conversationId: conversation.id,
        matchId: match.id,
        withUser: otherUser.userName,
      });
    }

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("✨ SUCCESSFULLY ADDED 2 CONVERSATIONS!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("📊 SUMMARY:");
    console.log(`   User: ${targetUser.name} (${targetUser.email})`);
    console.log(`   Conversations created: ${createdConversations.length}\n`);

    createdConversations.forEach((conv, i) => {
      console.log(`   ${i + 1}. Conversation ID: ${conv.conversationId}`);
      console.log(`      Match ID: ${conv.matchId}`);
      console.log(`      With: ${conv.withUser}\n`);
    });
  } catch (error) {
    console.error("\n❌ Error adding conversations:", error);
    throw error;
  }
}

addConversations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
