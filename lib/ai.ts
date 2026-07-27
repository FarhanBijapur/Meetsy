import { db } from "@/db";
import { conversationSummaries, learningGoals, messages } from "@/db/schema";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { desc, eq } from "drizzle-orm";
import {
  createMatch,
  getGoalsByUserAndCommunity,
  getGoalsByUsersAndCommunity,
  getMembersInCommunity,
  getPartnerUserId,
  getUserMatchesInCommunity,
  getUsersByIds,
} from "./db-helpers";
import { getOrCreateUserByClerkId } from "./user-utils";

const getMatchingModel = () =>
  google(process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-flash-latest");
export const aiMatchUsers = async (
  user: NonNullable<Awaited<ReturnType<typeof getOrCreateUserByClerkId>>>,
  communityId: string
) => {
  try {
    //get current user's learning goals based on the community id
    const currentUserGoals = await getGoalsByUserAndCommunity(
      user.id,
      communityId
    );
    //get all the other members in the same community and their learning goals
    const members = await getMembersInCommunity(communityId, user.id);

    const existingMatches = await getUserMatchesInCommunity(
      user.id,
      communityId
    );

    const existingMatchUserIds = new Set(
      existingMatches.map((m) => getPartnerUserId(m, user.id))
    );

    const potentialMemberIds = members
      .filter((m) => !existingMatchUserIds.has(m.user.id))
      .map((m) => m.user.id);

    const goalsMap = await getGoalsByUsersAndCommunity(
      potentialMemberIds,
      communityId
    );

    const potentialPartners = [];
    const memberWithoutGoals = [];

    for (const member of members) {
      if (existingMatchUserIds.has(member.user.id)) continue;

      const memberGoals = goalsMap.get(member.user.id) || [];

      if (memberGoals.length > 0) {
        potentialPartners.push({
          userId: member.user.id,
          username: member.user.name,
          goals: memberGoals.map((g: typeof learningGoals.$inferSelect) => ({
            title: g.title,
            description: g.description || "",
          })),
        });
      } else {
        memberWithoutGoals.push(member.user.name);
      }
    }

    console.log("Current user goals:", currentUserGoals);
    console.log("Total members:", members.length);
    console.log("Potential partners:", potentialPartners.length);
    console.log("Members without goals:", memberWithoutGoals);

    if (potentialPartners.length === 0) {
      return {
        matched: 0,
        matches: [],
        message: "No potential partners found with learning goals",
      };
    }

    // Use AI to analyze and match
    const prompt = `You are an AI matching assistant for a learning platform. Your job is to match learners with compatible learning partners.

Current User: ${user.name}
Their Learning Goals:
${currentUserGoals.map((g) => `- ${g.title}: ${g.description}`).join("\n")}

Potential Partners:
${potentialPartners
  .map(
    (p, idx) => `
${idx + 1}. ${p.username}
   Goals:
   ${p.goals
     .map(
       (g: typeof learningGoals.$inferSelect) =>
         `   - ${g.title}: ${g.description}`
     )
     .join("\n")}
`
  )
  .join("\n")}

Task: Analyze the learning goals and identify the TOP 3 most compatible learning partners for ${
      user.name
    }.

IMPORTANT MATCHING CRITERIA:
1. Use SEMANTIC SIMILARITY - goals don't need exact title matches. For example:
   - "Learn the basics of React" matches with "React Hooks deep dive" (both about React)
   - "Next.js - App Router - Build and Ship an app" matches with "Next.js App Router" (both about Next.js App Router)
   - "JavaScript fundamentals" matches with "JavaScript ES6+ features" (both about JavaScript)

2. Look at BOTH title and description to understand what the person wants to learn

3. Consider:
   - Overlapping or complementary learning goals (even if worded differently)
   - Similar skill levels or learning paths
   - Potential for mutual learning and knowledge sharing
   - Common interests and learning styles

4. Be INCLUSIVE - if there's any reasonable connection between learning goals, include them as a potential match

Return ONLY a JSON array of partner indices (1-based) in order of compatibility. Return between 1-3 matches maximum.
Example: [2, 5, 1] means partner #2 is the best match, then #5, then #1.

Only return an empty array [] if there are truly NO partners with any related learning interests.`;

    const { text } = await generateText({
      model: getMatchingModel(),
      prompt,
    });
    console.log("Raw AI response:", text);

    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*\n/, "").replace(/\n```\s*$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*\n/, "").replace(/\n```\s*$/, "");
    }

    console.log("Cleaned AI response:", jsonText);

    let matchIndices: number[] = [];

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        console.warn("Invalid JSON format returned by AI");
        matchIndices = [];
      } else {
        matchIndices = parsed.filter(Number.isInteger);
      }
    } catch (error) {
      console.warn("Invalid JSON format returned by AI", error);
      const arrayMatch = jsonText.match(/\[[\d,\s]+\]/);
      if (arrayMatch) {
        matchIndices = JSON.parse(arrayMatch[0]).filter(Number.isInteger);
        console.log("Extracted array from response:", matchIndices);
      } else {
        console.warn("No valid match indices found in AI response");
        throw new Error("AI returned invalid response");
      }
    }

    //create a new match record in the database

    const createdMatches = [];

    for (const idx of [...new Set(matchIndices)]) {
      const partnerIndex = idx - 1;
      if (partnerIndex >= 0 && partnerIndex < potentialPartners.length) {
        const partner = potentialPartners[partnerIndex];
        const match = await createMatch(user.id, partner.userId, communityId);
        createdMatches.push({
          ...match,
          partnerName: partner.username,
        });
      }
    }

    console.log("Created matches:", createdMatches, createdMatches.length);

    return {
      matched: createdMatches.length,
      matches: createdMatches,
    };
  } catch (error) {
    console.error("Error matching users", error);
    return {
      matched: 0,
      matches: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const generateAISummaries = async (
  conversationId: string,
  conversationMessages: (typeof messages.$inferSelect)[]
) => {
  //get user details from the conversation
  const userIds = [...new Set(conversationMessages.map((m) => m.senderId))];
  const usersMap = await getUsersByIds(userIds);

  const formattedMessages = conversationMessages.map((m) => {
    const user = usersMap.get(m.senderId);
    return `${user?.name}: ${m.content}`;
  });

  const conversationText = formattedMessages.join("\n");

  //prompt for the AI to generate a summary of the conversation
  const prompt = `You are an AI assistant that summarizes learning conversations between matched learning partners.

Analyze the following conversation and provide:
1. A concise summary of what was discussed
2. Key points and insights shared
3. Action items mentioned in the conversation
4. Next steps for the learning partners

Conversation:
${conversationText}

Please format your response as JSON with this structure:
{
  "summary": "A 2-3 sentence overview",
  "keyPoints": ["point 1", "point 2", ...],
  "actionItems": ["action item 1", "action item 2", ...],
  "nextSteps": ["step 1", "step 2", ...]
}`;
  //invoke AI
  try {
    const { text } = await generateText({
      model: getMatchingModel(),
      prompt,
    });

    //format and parse the json
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*\n/, "").replace(/\n```\s*$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*\n/, "").replace(/\n```\s*$/, "");
    }

    const parsed = JSON.parse(jsonText);

    const [summary] = await db
      .insert(conversationSummaries)
      .values({
        conversationId,
        summary: parsed.summary || "",
        actionItems: parsed.actionItems || [],
        keyPoints: parsed.keyPoints || [],
        nextSteps: parsed.nextSteps || [],
      })
      .returning();

    return summary;
  } catch (error) {
    console.error("Error generating AI summary", error);
    throw new Error("Error generating AI summary");
  }
  //format and parse the json
  //save the summary to the database
};

export const getLatestConversationSummary = async (conversationId: string) => {
  //get the latest summary from the database
  const [summary] = await db
    .select()
    .from(conversationSummaries)
    .where(eq(conversationSummaries.conversationId, conversationId))
    .orderBy(desc(conversationSummaries.generatedAt))
    .limit(1);

  return summary || null;
};
