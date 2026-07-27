# Meetsy - A community learning platform where learners find compatible study partners and achieve their goals together!

Get complete access to Meetsy, an AI-powered learning platform that connects you with the perfect learning partners based on your goals, interests, and learning style in one intelligent matching system.

## ⚡ Features

### 🛠️ Core Technologies:

- 🚀 Next.js 16 App Router for server-side rendering, routing, and API endpoints with Server Components
- ⚛️ React 19 for building interactive user interfaces with reusable components
- 🔑 Clerk for secure authentication with Passkeys, Github, and Google Sign-in
- 🎨 ShadcN UI for accessible, customizable React components with Radix UI primitives
- 💾 PostgreSQL for reliable database storage of users, communities, goals, and conversations
- 🗄️ Drizzle ORM for type-safe database queries and migrations
- 📜 TypeScript for static typing and enhanced development experience
- 💅 TailwindCSS 4 for utility-first, responsive styling
- ✅ Zod for schema validation and form handling
- 🤖 OpenAI GPT-4o-mini for AI-powered matching and conversation summaries
- ⚡ Hono for lightweight, fast API endpoints
- 🔄 TanStack React Query for efficient server state management

### 💫 Application Features:

- 🤝 AI-powered semantic matching that understands learning goals beyond keywords
- 🎯 Community-based learning with goal tracking and progress management
- 💬 Real-time chat with learning partners in dedicated conversations
- 📊 AI-generated conversation summaries with action items and next steps
- 🔒 Secure authentication and protected routes
- 👨‍💼 Subscription tier management (FREE and PRO plans)
- 📱 Responsive design optimized for mobile and desktop
- 🔔 Real-time toast notifications for updates and actions
- 🌓 Dark/light theme support
- ✨ Smooth animations with Motion (Framer Motion)
- 🚀 Production-ready deployment
- 📈 Performance optimizations with batch queries and caching
- 🔍 Intelligent duplicate prevention and match optimization
- 🏷️ Tag-based goal categorization and filtering

## 🚀 Getting Started

To get started with this project:

1. Fork the repo
2. Copy the `.env.example` variables into a separate `.env.local` file
3. Create the required credentials:
   - Clerk authentication keys
   - PostgreSQL database connection string
   - OpenAI API key

## 🔨 How to Fork and Clone

1. Click the "Fork" button in the top right corner of this repository to create your own copy
2. Clone your forked repository to your local machine
3. Install dependencies with `bun install`
4. Set up your environment variables in `.env.local`
5. Run database migrations with `bun db:push`
6. Seed the database with `bun db:seed`
7. Run the development server with `bun dev`

## 📦 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/meetsy

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# OpenAI for AI Features
OPENAI_API_KEY=sk-...
```

## 🗄️ Database Setup

### Prerequisites

- PostgreSQL database (local or hosted like NeonDB)
- [Bun](https://bun.sh) installed

### Setup Steps

1. Push the database schema:

```bash
bun db:push
```

2. (Optional but Recommended) Seed the database with test data:

```bash
bun db:seed
```

This creates:

- **5 FREE users** (demonstrating tier limits: 1 community, 1 goal each)
- **12 PRO users** (including test accounts with unlimited access)
- **6 diverse communities**:
  - Modern Full Stack Next.js Course
  - Developer to Leader
  - Ankita's Youtube Community
  - Python for Data Science
  - AI & Machine Learning
  - Cloud & DevOps
- **Learning goals** for each community
- **Sample matches** between users (both accepted and pending)
- **Conversations** with messages
- **AI-generated conversation summaries**

3. Open Drizzle Studio to explore your database:

```bash
bun db:studio
```

## 💻 Development Commands

```bash
# Application
bun dev          # Start development server (http://localhost:3000)
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint

# Database Management
bun db:generate  # Generate migrations from schema changes
bun db:push      # Push schema directly to database
bun db:studio    # Open Drizzle Studio GUI
bun db:seed      # Seed database with test data
```

## 🏗️ Architecture

The application follows a modern full-stack architecture:

1. **Frontend**: Server-first with Next.js App Router, client components only where needed
2. **API Layer**: Hono framework ([app/api/[[...route]]/route.ts](app/api/[[...route]]/route.ts)) for lightweight, fast API
3. **Database**: PostgreSQL with Drizzle ORM ([db/schema.ts](db/schema.ts)) for type-safe queries
4. **Authentication**: Clerk handles all auth, session management, and user synchronization
5. **AI Services**: Vercel AI SDK with OpenAI GPT-4o-mini for matching and summaries
6. **State Management**: React Query for server state, React hooks for local state

### API Routes Structure

- `/api/communities/*` - Community management and discovery
- `/api/matches/*` - AI-powered and manual matching system
- `/api/conversations/*` - Chat, messaging, and AI summaries
- `/api/user/*` - User profile and subscription management

All routes use Clerk authentication middleware and Hono error handling.

## 🤖 AI Features

### Semantic Matching

The AI matching system uses GPT-4o-mini to analyze learning goals and find compatible partners:

- Understands goals beyond keyword matching (e.g., "React basics" matches with "React Hooks deep dive")
- Evaluates topic similarity, complementary skills, and learning styles
- Creates up to 3 curated matches per request
- Filters out existing matches to prevent duplicates

### Conversation Summaries

AI-generated insights from chat conversations include:

- **Summary**: 2-3 sentence overview of the discussion
- **Key Points**: Important topics and insights shared
- **Action Items**: Concrete tasks to follow up on
- **Next Steps**: Recommendations for future learning

Located in: [lib/ai.ts](lib/ai.ts)

## 💎 Subscription Tiers

### Free Tier

- 1 community
- 1 learning goal
- 3 active matches
- Unlimited conversations and messages

### Pro Tier

- Unlimited communities
- Unlimited learning goals
- Unlimited active matches
- Unlimited conversations and messages
- Priority AI matching

## 🙏 Acknowledgements

- [Clerk](https://go.clerk.com/X2swX9H) for authentication and for kindly sponsoring this build

- [PostgreSQL](https://www.postgresql.org?ref=kulkarniankita) for the database
- [Drizzle ORM](https://orm.drizzle.team?ref=kulkarniankita) for type-safe database operations
- [OpenAI](https://openai.com?ref=kulkarniankita) for AI-powered features
- [Zod](https://zod.dev/?ref=kulkarniankita) for TypeScript runtime validations
- [ShadcN UI](https://ui.shadcn.com/?ref=kulkarniankita) for components
- [Next.js](https://nextjs.org?ref=kulkarniankita) for the amazing framework
- [Hono](https://hono.dev?ref=kulkarniankita) for the lightweight API framework
- [TanStack Query](https://tanstack.com/query?ref=kulkarniankita) for data fetching

## 🛠️ Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Verify user permissions for database operations

### Clerk Authentication Issues

- Verify all Clerk environment variables are set correctly
- Ensure your Clerk account is properly configured
- User sync happens automatically through Clerk middleware

### AI Features Not Working

- Verify OPENAI_API_KEY is valid and has credits
- Check API rate limits if getting 429 errors
- Review console logs for detailed error messages

### Build/Runtime Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && bun install`
- Ensure you have Bun installed (this project uses Bun as the runtime)
- Check environment variables are properly set in `.env.local`

## 🚀 Future Enhancements

- [ ] Real-time messaging with WebSockets or Server-Sent Events
- [ ] Video call integration for learning sessions
- [ ] Calendar integration for scheduled learning sessions
- [ ] Progress tracking and analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Community recommendation system based on interests
- [ ] Gamification (badges, streaks, achievements)
- [ ] Public profile pages
- [ ] Payment integration for Pro tier subscriptions
- [ ] Email notifications for new matches and messages

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
