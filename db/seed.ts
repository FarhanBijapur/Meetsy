import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import {
  users,
  communities,
  communityMembers,
  learningGoals,
  matches,
  conversations,
  messages,
  conversationSummaries,
} from "./schema";

type UserRow = typeof users.$inferSelect;
type CommunityRow = typeof communities.$inferSelect;
type LearningGoalWithCommunity = typeof learningGoals.$inferSelect & {
  communityName: string;
};

// FREE USERS (1 community, 1 goal each - demonstrating limits)
const freeUsers = [
  {
    clerkId: "free_001",
    email: "free1@email.com",
    name: "Free User One",
    subscriptionTier: "free",
  },
  {
    clerkId: "free_002",
    email: "free2@email.com",
    name: "Free User Two",
    subscriptionTier: "free",
  },
  {
    clerkId: "free_003",
    email: "free3@email.com",
    name: "Free User Three",
    subscriptionTier: "free",
  },
  {
    clerkId: "free_004",
    email: "free4@email.com",
    name: "Free User Four",
    subscriptionTier: "free",
  },
  {
    clerkId: "free_005",
    email: "free5@email.com",
    name: "Free User Five",
    subscriptionTier: "free",
  },
];

// PRO USERS (multiple communities, multiple goals - unlimited access)
const proUsers = [
  {
    clerkId: "pro_001_temp",
    email: "itskulkarniankita@gmail.com",
    name: "Ankita Kulkarni",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_002_temp",
    email: "kulkarni.ankita09@gmail.com",
    name: "Ankita K",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_003",
    email: "emma.chen@email.com",
    name: "Emma Chen (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_004",
    email: "marcus.johnson@email.com",
    name: "Marcus Johnson (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_005",
    email: "sofia.rodriguez@email.com",
    name: "Sofia Rodriguez (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_006",
    email: "david.kim@email.com",
    name: "David Kim (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_007",
    email: "james.wilson@email.com",
    name: "James Wilson (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_008",
    email: "aisha.patel@email.com",
    name: "Aisha Patel (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_009",
    email: "lucas.martinez@email.com",
    name: "Lucas Martinez (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_010",
    email: "maya.anderson@email.com",
    name: "Maya Anderson (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_011",
    email: "alex.taylor@email.com",
    name: "Alex Taylor (Pro)",
    subscriptionTier: "pro",
  },
  {
    clerkId: "pro_012",
    email: "nina.silva@email.com",
    name: "Nina Silva (Pro)",
    subscriptionTier: "pro",
  },
];

// Diverse communities
const communitiesData = [
  {
    name: "Modern Full Stack Next.js Course",
    description:
      "Build production-ready full-stack applications with Next.js, React, TypeScript, and modern tools",
  },
  {
    name: "Developer to Leader",
    description:
      "Transition from senior developer to tech lead and engineering manager",
  },
  {
    name: "Ankita's Youtube Community",
    description:
      "Community for Ankita's YouTube channel followers - learn web development, coding tips, and career advice",
  },
  {
    name: "Python for Data Science",
    description: "Master Python, pandas, NumPy, and machine learning basics",
  },
  {
    name: "AI & Machine Learning",
    description:
      "Deep learning, neural networks, and practical AI applications",
  },
  {
    name: "Cloud & DevOps",
    description: "AWS, Azure, Docker, Kubernetes, and CI/CD pipelines",
  },
];

// Learning goals by community
const learningGoalsData = {
  "Modern Full Stack Next.js Course": [
    {
      title: "Next.js App Router & Server Components",
      description:
        "Master the Next.js 14+ App Router and React Server Components",
    },
    {
      title: "Database integration with Drizzle ORM",
      description: "Build type-safe database schemas and queries",
    },
    {
      title: "Authentication with Clerk",
      description: "Implement secure user authentication and authorization",
    },
    {
      title: "TypeScript best practices",
      description: "Write type-safe, maintainable full-stack applications",
    },
    {
      title: "Deployment & CI/CD",
      description: "Deploy to Vercel and set up automated pipelines",
    },
  ],
  "Developer to Leader": [
    {
      title: "Technical leadership skills",
      description: "Learn to guide technical decisions and mentor developers",
    },
    {
      title: "Code review best practices",
      description: "Conduct effective code reviews that improve team quality",
    },
    {
      title: "Team communication",
      description: "Master stakeholder communication and conflict resolution",
    },
    {
      title: "Project planning & estimation",
      description: "Break down projects and estimate timelines accurately",
    },
    {
      title: "Building engineering culture",
      description:
        "Foster a culture of learning, collaboration, and excellence",
    },
  ],
  "Ankita's Youtube Community": [
    {
      title: "Modern web development fundamentals",
      description: "Master HTML, CSS, JavaScript, and modern frameworks",
    },
    {
      title: "Building real-world projects",
      description: "Create portfolio projects that demonstrate your skills",
    },
    {
      title: "Career growth & job hunting",
      description: "Navigate job search, interviews, and career advancement",
    },
    {
      title: "Content creation tips",
      description: "Learn from Ankita's experience creating tech content",
    },
  ],
  "Python for Data Science": [
    {
      title: "Pandas data manipulation",
      description:
        "Work with DataFrames, filtering, grouping, and merging datasets",
    },
    {
      title: "NumPy arrays and operations",
      description: "Perform efficient numerical computations with NumPy",
    },
    {
      title: "Data visualization with Matplotlib",
      description: "Create compelling charts and visualizations",
    },
    {
      title: "Introduction to scikit-learn",
      description:
        "Build basic machine learning models for classification and regression",
    },
  ],
  "AI & Machine Learning": [
    {
      title: "Neural networks from scratch",
      description: "Understand backpropagation and gradient descent",
    },
    {
      title: "TensorFlow and Keras",
      description: "Build deep learning models with popular frameworks",
    },
    {
      title: "Natural Language Processing",
      description: "Process and analyze text data with NLP techniques",
    },
    {
      title: "Computer Vision basics",
      description: "Work with image recognition and classification",
    },
  ],
  "Cloud & DevOps": [
    {
      title: "Docker containerization",
      description: "Create and manage Docker containers for applications",
    },
    {
      title: "Kubernetes orchestration",
      description: "Deploy and scale applications with Kubernetes",
    },
    {
      title: "AWS services overview",
      description: "Work with EC2, S3, Lambda, and other AWS services",
    },
    {
      title: "CI/CD with GitHub Actions",
      description: "Automate testing and deployment pipelines",
    },
  ],
};

// FREE USER ASSIGNMENTS (1 community, 1 goal each)
const freeUserAssignments = {
  "Free User One": {
    community: "Modern Full Stack Next.js Course",
    goal: "Next.js App Router & Server Components",
  },
  "Free User Two": {
    community: "Ankita's Youtube Community",
    goal: "Modern web development fundamentals",
  },
  "Free User Three": {
    community: "Ankita's Youtube Community",
    goal: "Building real-world projects",
  },
  "Free User Four": {
    community: "Developer to Leader",
    goal: "Technical leadership skills",
  },
  "Free User Five": {
    community: "AI & Machine Learning",
    goal: "Neural networks from scratch",
  },
};

// PRO USER ASSIGNMENTS (multiple communities and goals)
const proUserCommunityAssignments = {
  "Ankita Kulkarni": [
    "Modern Full Stack Next.js Course",
    "Ankita's Youtube Community",
    "Developer to Leader",
  ],
  "Ankita K": [
    "Modern Full Stack Next.js Course",
    "Ankita's Youtube Community",
    "AI & Machine Learning",
  ],
  "Emma Chen (Pro)": [
    "Modern Full Stack Next.js Course",
    "Ankita's Youtube Community",
    "AI & Machine Learning",
  ],
  "Marcus Johnson (Pro)": [
    "Modern Full Stack Next.js Course",
    "Developer to Leader",
    "Cloud & DevOps",
  ],
  "Sofia Rodriguez (Pro)": [
    "Modern Full Stack Next.js Course",
    "Developer to Leader",
    "Ankita's Youtube Community",
  ],
  "David Kim (Pro)": [
    "Python for Data Science",
    "AI & Machine Learning",
    "Modern Full Stack Next.js Course",
  ],
  "James Wilson (Pro)": [
    "Cloud & DevOps",
    "Developer to Leader",
    "Modern Full Stack Next.js Course",
  ],
  "Aisha Patel (Pro)": [
    "Modern Full Stack Next.js Course",
    "Ankita's Youtube Community",
    "Developer to Leader",
  ],
  "Lucas Martinez (Pro)": [
    "Cloud & DevOps",
    "Python for Data Science",
    "AI & Machine Learning",
  ],
  "Maya Anderson (Pro)": [
    "AI & Machine Learning",
    "Ankita's Youtube Community",
    "Modern Full Stack Next.js Course",
  ],
  "Alex Taylor (Pro)": [
    "Cloud & DevOps",
    "Python for Data Science",
    "AI & Machine Learning",
  ],
  "Nina Silva (Pro)": [
    "Modern Full Stack Next.js Course",
    "Ankita's Youtube Community",
    "Developer to Leader",
  ],
};

const proUserGoalAssignments = {
  "Ankita Kulkarni": {
    "Modern Full Stack Next.js Course": [
      "Next.js App Router & Server Components",
      "Database integration with Drizzle ORM",
      "Authentication with Clerk",
    ],
    "Ankita's Youtube Community": [
      "Modern web development fundamentals",
      "Building real-world projects",
      "Content creation tips",
    ],
    "Developer to Leader": [
      "Technical leadership skills",
      "Team communication",
    ],
  },
  "Ankita K": {
    "Modern Full Stack Next.js Course": [
      "TypeScript best practices",
      "Deployment & CI/CD",
    ],
    "Ankita's Youtube Community": [
      "Building real-world projects",
      "Career growth & job hunting",
    ],
    "AI & Machine Learning": [
      "Neural networks from scratch",
      "TensorFlow and Keras",
    ],
  },
  "Emma Chen (Pro)": {
    "Modern Full Stack Next.js Course": [
      "Next.js App Router & Server Components",
      "Database integration with Drizzle ORM",
      "TypeScript best practices",
    ],
    "AI & Machine Learning": [
      "Neural networks from scratch",
      "TensorFlow and Keras",
    ],
  },
  "Marcus Johnson (Pro)": {
    "Modern Full Stack Next.js Course": [
      "Authentication with Clerk",
      "TypeScript best practices",
    ],
    "Developer to Leader": [
      "Technical leadership skills",
      "Code review best practices",
    ],
    "Cloud & DevOps": ["Docker containerization", "CI/CD with GitHub Actions"],
  },
  "Sofia Rodriguez (Pro)": {
    "Modern Full Stack Next.js Course": [
      "Next.js App Router & Server Components",
      "Deployment & CI/CD",
    ],
    "Developer to Leader": [
      "Team communication",
      "Building engineering culture",
    ],
    "Ankita's Youtube Community": [
      "Modern web development fundamentals",
      "Career growth & job hunting",
    ],
  },
  "David Kim (Pro)": {
    "Python for Data Science": [
      "Pandas data manipulation",
      "Data visualization with Matplotlib",
      "Introduction to scikit-learn",
    ],
    "AI & Machine Learning": [
      "Neural networks from scratch",
      "Natural Language Processing",
    ],
  },
  "James Wilson (Pro)": {
    "Cloud & DevOps": [
      "AWS services overview",
      "Kubernetes orchestration",
      "CI/CD with GitHub Actions",
    ],
    "Developer to Leader": [
      "Technical leadership skills",
      "Project planning & estimation",
    ],
  },
  "Aisha Patel (Pro)": {
    "Modern Full Stack Next.js Course": [
      "Database integration with Drizzle ORM",
      "Authentication with Clerk",
    ],
    "Ankita's Youtube Community": [
      "Building real-world projects",
      "Content creation tips",
    ],
    "Developer to Leader": ["Code review best practices", "Team communication"],
  },
  "Lucas Martinez (Pro)": {
    "Cloud & DevOps": [
      "Docker containerization",
      "Kubernetes orchestration",
      "AWS services overview",
    ],
    "Python for Data Science": [
      "NumPy arrays and operations",
      "Pandas data manipulation",
    ],
  },
  "Maya Anderson (Pro)": {
    "AI & Machine Learning": ["Computer Vision basics", "TensorFlow and Keras"],
    "Ankita's Youtube Community": [
      "Modern web development fundamentals",
      "Building real-world projects",
    ],
  },
  "Alex Taylor (Pro)": {
    "Cloud & DevOps": ["AWS services overview", "Docker containerization"],
    "Python for Data Science": ["Pandas data manipulation"],
  },
  "Nina Silva (Pro)": {
    "Modern Full Stack Next.js Course": [
      "Next.js App Router & Server Components",
      "Authentication with Clerk",
      "TypeScript best practices",
    ],
    "Ankita's Youtube Community": [
      "Building real-world projects",
      "Career growth & job hunting",
    ],
    "Developer to Leader": ["Technical leadership skills"],
  },
};

async function comprehensiveSeed() {
  console.log("🌱 Starting comprehensive database seed...\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("SEED DATA STRUCTURE:");
  console.log("• 5 FREE USERS (1 community, 1 goal each)");
  console.log("• 10 PRO USERS (multiple communities, multiple goals)");
  console.log("═══════════════════════════════════════════════════════\n");

  try {
    // 0. Clear existing data
    console.log("🗑️  Clearing existing database data...");
    await db.delete(conversationSummaries);
    await db.delete(messages);
    await db.delete(conversations);
    await db.delete(matches);
    await db.delete(learningGoals);
    await db.delete(communityMembers);
    await db.delete(communities);
    await db.delete(users);
    console.log("   ✓ Database cleared\n");
    // 1. Create FREE users
    console.log("👥 Creating FREE USERS (demonstrating tier limits)...");
    const createdFreeUsers: UserRow[] = [];
    for (const user of freeUsers) {
      const [created] = await db.insert(users).values(user).returning();
      createdFreeUsers.push(created);
      console.log(`   ✓ ${user.name} (FREE - 1 community, 1 goal)`);
    }

    // 2. Create PRO users
    console.log("\n👥 Creating PRO USERS (unlimited access)...");
    const createdProUsers: UserRow[] = [];
    for (const user of proUsers) {
      const [created] = await db.insert(users).values(user).returning();
      createdProUsers.push(created);
      console.log(`   ✓ ${user.name} (PRO - unlimited)`);
    }

    const allUsers = [...createdFreeUsers, ...createdProUsers];

    // 3. Create communities
    console.log("\n🏘️  Creating communities...");
    const createdCommunities: CommunityRow[] = [];
    for (const community of communitiesData) {
      const [created] = await db
        .insert(communities)
        .values({
          ...community,
          createdById: createdProUsers[0].id, // Emma creates all communities
        })
        .returning();
      createdCommunities.push(created);
      console.log(`   ✓ ${community.name}`);
    }

    // 4. Add FREE users to communities (1 community each)
console.log("\n🔗 Adding FREE USERS to communities (1 each)...");
for (const [userName, assignment] of Object.entries(freeUserAssignments)) {
  const user = allUsers.find((u) => u.name === userName);
  const community = createdCommunities.find(
    (c) => c.name === assignment.community
  );

  if (!user || !community) {
    console.warn(`Skipping ${userName}`);
    continue;
  }

  await db.insert(communityMembers).values({
    userId: user.id,
    communityId: community.id,
  });

  console.log(`   ✓ ${userName} → ${assignment.community}`);
}

  // 5. Add PRO users to communities (multiple each)
console.log("\n🔗 Adding PRO USERS to communities (multiple each)...");
for (const [userName, communityNames] of Object.entries(
  proUserCommunityAssignments
)) {
  const user = allUsers.find((u) => u.name === userName);

  if (!user) {
    console.warn(`Skipping ${userName}`);
    continue;
  }

  for (const communityName of communityNames) {
    const community = createdCommunities.find(
      (c) => c.name === communityName
    );

    if (!community) continue;

    await db.insert(communityMembers).values({
      userId: user.id,
      communityId: community.id,
    });
  }

  console.log(`   ✓ ${userName} → ${communityNames.length} communities`);
}

    // 6. Create template learning goals for each community
    console.log("\n📚 Creating template learning goals...");
    const createdGoals: LearningGoalWithCommunity[] = [];
    for (const [communityName, goals] of Object.entries(learningGoalsData)) {
      const community = createdCommunities.find(
  (c) => c.name === communityName
);

if (!community) {
  console.warn(`Skipping community ${communityName}`);
  continue;
}

for (const goal of goals) {
        const [created] = await db
          .insert(learningGoals)
          .values({
            userId: createdProUsers[0].id, // Template goals
            communityId: community.id,
            ...goal,
            tags: [],
          })
          .returning();
        createdGoals.push({ ...created, communityName });
      }
      console.log(`   ✓ ${goals.length} goals for ${communityName}`);
    }

    // 7. Assign goals to FREE users (1 goal each)
    console.log("\n🎯 Assigning goals to FREE USERS (1 goal each)...");
    for (const [userName, assignment] of Object.entries(freeUserAssignments)) {
      const user = allUsers.find((u) => u.name === userName);
      const community = createdCommunities.find(
        (c) => c.name === assignment.community
      );
      const templateGoal = createdGoals.find(
        (g) =>
          g.title === assignment.goal &&
          g.communityName === assignment.community
      );
      if (!user || !community || !templateGoal) {
  console.warn(`Skipping ${userName}`);
  continue;
}

      await db.insert(learningGoals).values({
        userId: user.id,
        communityId: community.id,
        title: templateGoal.title,
        description: templateGoal.description,
        tags: templateGoal.tags || [],
      });
      console.log(`   ✓ ${userName} → "${assignment.goal}"`);
    }

    // 8. Assign goals to PRO users (multiple goals each)
    console.log("\n🎯 Assigning goals to PRO USERS (multiple goals each)...");
    for (const [userName, communities] of Object.entries(
      proUserGoalAssignments
    )) {
      const user = allUsers.find((u) => u.name === userName);
      if (!user) {
  continue;
}
      let totalGoals = 0;

      for (const [communityName, goalTitles] of Object.entries(communities)) {
        const community = createdCommunities.find(
          (c) => c.name === communityName
        );
        if (!community) {
  continue;
}

        for (const goalTitle of goalTitles) {
          const templateGoal = createdGoals.find(
            (g) => g.title === goalTitle && g.communityName === communityName
          );

          if (templateGoal ) {
            await db.insert(learningGoals).values({
              userId: user.id,
              communityId: community.id,
              title: templateGoal.title,
              description: templateGoal.description,
              tags: templateGoal.tags || [],
            });
            totalGoals++;
          }
        }
      }
      console.log(`   ✓ ${userName} → ${totalGoals} goals`);
    }

    // 9. Create matches (mostly between PRO users)
    console.log("\n💫 Creating matches...");
    const matchPairs = [
      // PRO to PRO matches
      [
        "Emma Chen (Pro)",
        "Marcus Johnson (Pro)",
        "Modern Full Stack Next.js Course",
      ],
      [
        "Sofia Rodriguez (Pro)",
        "Aisha Patel (Pro)",
        "Ankita's Youtube Community",
      ],
      ["David Kim (Pro)", "Maya Anderson (Pro)", "AI & Machine Learning"],
      ["James Wilson (Pro)", "Lucas Martinez (Pro)", "Cloud & DevOps"],
      ["Emma Chen (Pro)", "David Kim (Pro)", "AI & Machine Learning"],
      ["Marcus Johnson (Pro)", "James Wilson (Pro)", "Cloud & DevOps"],
      ["Nina Silva (Pro)", "Sofia Rodriguez (Pro)", "Developer to Leader"],
      ["Alex Taylor (Pro)", "Lucas Martinez (Pro)", "Cloud & DevOps"],
      ["Ankita Kulkarni", "Ankita K", "Ankita's Youtube Community"],

      // FREE to PRO matches (showing FREE users can match within limits)
      ["Free User One", "Emma Chen (Pro)", "Modern Full Stack Next.js Course"],
      ["Free User Two", "David Kim (Pro)", "Python for Data Science"],
      ["Free User Four", "Marcus Johnson (Pro)", "Developer to Leader"],
    ];

    const createdMatches: Array<{
      id: string;
      user1Id: string;
      user2Id: string;
      communityId: string;
      status: string;
      user1Name: string;
      user2Name: string;
    }> = [];
    for (const [name1, name2, communityName] of matchPairs) {
      const user1 = allUsers.find((u) => u.name === name1);
      const user2 = allUsers.find((u) => u.name === name2);
      const community = createdCommunities.find(
        (c) => c.name === communityName
      );

      if (user1 && user2 && community) {
        const status = Math.random() > 0.3 ? "accepted" : "pending";
        const [match] = await db
          .insert(matches)
          .values({
            user1Id: user1.id,
            user2Id: user2.id,
            communityId: community.id,
            status,
          })
          .returning();
        createdMatches.push({ ...match, user1Name: name1, user2Name: name2 });
        console.log(`   ✓ ${name1} ↔ ${name2} (${status})`);
      }
    }

    // 10. Create conversations for accepted matches
    console.log("\n💬 Creating conversations for accepted matches...");
    const acceptedMatches = createdMatches.filter(
      (m) => m.status === "accepted"
    );
    const createdConversations: Array<{
      id: string;
      matchId: string;
      match: (typeof createdMatches)[0];
    }> = [];

    for (const match of acceptedMatches) {
      const [conversation] = await db
        .insert(conversations)
        .values({
          matchId: match.id,
          lastMessageAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Random time in last 7 days
        })
        .returning();
      createdConversations.push({ ...conversation, match });
      console.log(
        `   ✓ Conversation for ${match.user1Name} ↔ ${match.user2Name}`
      );
    }

    // 11. Create messages for conversations
    console.log("\n📝 Creating messages for conversations...");
    const messageTemplates = [
      {
        sender: "user1",
        content:
          "Hey! Excited to connect and learn together. What are you currently working on?",
      },
      {
        sender: "user2",
        content:
          "Hi! I'm focusing on building a full-stack app with Next.js. How about you?",
      },
      {
        sender: "user1",
        content:
          "That's awesome! I'm working on similar projects. Would love to share what I've learned about server components.",
      },
      {
        sender: "user2",
        content:
          "That would be great! I'm still wrapping my head around the App Router. Any tips?",
      },
      {
        sender: "user1",
        content:
          "Definitely! Let me share some resources and we can set up a call to discuss.",
      },
      { sender: "user2", content: "Perfect! Looking forward to it." },
    ];

    let totalMessages = 0;
    for (const conv of createdConversations) {
      const messageCount = Math.floor(Math.random() * 4) + 3; // 3-6 messages per conversation
      const user1 = allUsers.find((u) => u.id === conv.match.user1Id);
      const user2 = allUsers.find((u) => u.id === conv.match.user2Id);

      for (let i = 0; i < messageCount && i < messageTemplates.length; i++) {
        const template = messageTemplates[i];
        const senderId = template.sender === "user1" ? user1!.id : user2!.id;

        await db.insert(messages).values({
          conversationId: conv.id,
          senderId,
          content: template.content,
          createdAt: new Date(
            Date.now() - (messageCount - i) * 2 * 60 * 60 * 1000
          ), // Messages spread over time
        });
        totalMessages++;
      }
    }
    console.log(
      `   ✓ Created ${totalMessages} messages across ${createdConversations.length} conversations`
    );

    // 12. Create conversation summaries for active conversations
    console.log("\n📊 Creating conversation summaries...");
    const conversationsWithManyMessages = createdConversations.slice(
      0,
      Math.ceil(createdConversations.length / 2)
    ); // Half of conversations get summaries

    for (const conv of conversationsWithManyMessages) {
      await db.insert(conversationSummaries).values({
        conversationId: conv.id,
        summary:
          "Both users discussed their learning goals and shared resources about modern web development. They found common interests in Next.js and TypeScript.",
        actionItems: [
          "Schedule a follow-up call to discuss server components",
          "Share recommended resources and documentation",
          "Work through a coding challenge together",
        ],
        keyPoints: [
          "Both are learning Next.js App Router",
          "Interested in building full-stack applications",
          "Want to collaborate on projects",
        ],
        nextSteps: [
          "Set up a video call for next week",
          "Create a shared GitHub repository",
          "Define a small project to work on together",
        ],
      });
    }
    console.log(
      `   ✓ Created ${conversationsWithManyMessages.length} conversation summaries`
    );

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("📊 SUMMARY:");
    console.log(
      `   • ${createdFreeUsers.length} FREE USERS (1 community, 1 goal each)`
    );
    console.log(
      `   • ${createdProUsers.length} PRO USERS (multiple communities & goals)`
    );
    console.log(`   • ${createdCommunities.length} communities`);
    console.log(`   • ${matchPairs.length} matches`);
    console.log(`   • ${createdConversations.length} conversations`);
    console.log(`   • ${totalMessages} messages`);
    console.log(
      `   • ${conversationsWithManyMessages.length} conversation summaries`
    );
    console.log("\n💡 YOUR ACCOUNTS (PRO):");
    console.log("   • itskulkarniankita@gmail.com");
    console.log("   • kulkarni.ankita09@gmail.com");
    console.log("\n💡 OTHER TEST ACCOUNTS:");
    console.log("   • free1@email.com (FREE)");
    console.log("   • emma.chen@email.com (PRO)\n");
    console.log("🏘️  COMMUNITIES:");
    console.log("   • Modern Full Stack Next.js Course");
    console.log("   • Developer to Leader");
    console.log("   • Ankita's Youtube Community");
    console.log("   • Python for Data Science");
    console.log("   • AI & Machine Learning");
    console.log("   • Cloud & DevOps\n");
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    throw error;
  }
}

comprehensiveSeed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
