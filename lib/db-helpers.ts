import { db } from "@/db";
import { communityMembers, learningGoals, matches, users } from "@/db/schema";
import { eq, and, sql, inArray, ne, desc } from "drizzle-orm";

export const getGoalsByUserAndCommunity = async (
  userId: string,
  communityId: string
) => {
  const currentUserLearningGoals = await db
    .select()
    .from(learningGoals)
    .where(
      and(
        eq(learningGoals.userId, userId),
        eq(learningGoals.communityId, communityId)
      )
    );

  return currentUserLearningGoals;
};

export const getMembersInCommunity = async (
  communityId: string,
  excludeUserId?: string
) => {
  const conditions = [eq(communityMembers.communityId, communityId)];
  if (excludeUserId) {
    conditions.push(ne(users.id, excludeUserId));
  }

  return db
    .select({ member: communityMembers, user: users })
    .from(communityMembers)
    .innerJoin(users, eq(communityMembers.userId, users.id))
    .where(and(...conditions));
};

export const getUserMatchesInCommunity = async (
  userId: string,
  communityId: string
) => {
  return db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.communityId, communityId),
        sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`
      )
    );
};

/**
 * Batch fetch users by their IDs
 * Returns a Map of userId -> user for efficient lookup
 */
export async function getUsersByIds(
  userIds: string[]
): Promise<Map<string, typeof users.$inferSelect>> {
  if (userIds.length === 0) return new Map();

  const usersArray = await db
    .select()
    .from(users)
    .where(inArray(users.id, userIds));

  const usersMap = new Map<string, typeof users.$inferSelect>();
  for (const user of usersArray) {
    usersMap.set(user.id, user);
  }

  return usersMap;
}

/**
 * Get all matches for a user across all communities
 * Optionally filter by status
 */
export async function getUserMatches(
  userId: string,
  status?: "pending" | "accepted" | "rejected"
) {
  const conditions = [
    sql`(${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId})`,
  ];

  if (status) {
    conditions.push(eq(matches.status, status));
  }

  return db
    .select()
    .from(matches)
    .where(and(...conditions))
    .orderBy(desc(matches.createdAt));
}

export const getPartnerUserId = (
  match: typeof matches.$inferSelect,
  userId: string
) => {
  return match.user1Id === userId ? match.user2Id : match.user1Id;
};

export const getGoalsByUsersAndCommunity = async (
  userIds: string[],
  communityId: string
) => {
  if (userIds.length === 0) return new Map();

  const allGoals = await db
    .select()
    .from(learningGoals)
    .where(
      and(
        inArray(learningGoals.userId, userIds),
        eq(learningGoals.communityId, communityId)
      )
    );

  const goalsMap = new Map<string, (typeof learningGoals.$inferSelect)[]>();

  for (const goal of allGoals) {
    if (!goalsMap.has(goal.userId)) {
      goalsMap.set(goal.userId, []);
    }
    goalsMap.get(goal.userId)?.push(goal);
  }

  return goalsMap;
};

export const createMatch = async (
  user1Id: string,
  user2Id: string,
  communityId: string
) => {
  const [match] = await db
    .insert(matches)
    .values({
      user1Id,
      user2Id,
      communityId,
      status: "pending",
    })
    .returning();

  return match;
};

export const findMatchesByUserId = async (
  userId: string,
  communityId: string
) => {
  const members = await getMembersInCommunity(communityId, userId);

  const existingMatches = await getUserMatchesInCommunity(userId, communityId);

  const existingMatchUserIds = new Set(
    existingMatches.map((m) => getPartnerUserId(m, userId))
  );

  const availableMatches = [];

  for (const member of members) {
    if (existingMatchUserIds.has(member.user.id)) continue;

    availableMatches.push({
      userId: member.user.id,
    });
  }

  return availableMatches;
};
