# Lotion Setup Guide

Complete setup instructions for running Lotion locally and deploying to production.

## Prerequisites

- Node.js 18+ installed
- A Neon Postgres database (free tier available at [neon.tech](https://neon.tech))
- AWS account with Bedrock access (for AI features)
- (Optional) Google Cloud project for Calendar OAuth

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd lotion
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Neon Postgres - REQUIRED
DATABASE_URL=postgresql://user:password@host.region.neon.tech/dbname?sslmode=require

# AWS Bedrock - REQUIRED for AI features
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Google Calendar OAuth - OPTIONAL
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/google/callback

# Supabase - OPTIONAL (for future auth)
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Neon Postgres Database

1. **Create a Neon project** at [neon.tech](https://neon.tech)
2. **Copy the connection string** from your dashboard
3. **Paste it into `.env.local`** as `DATABASE_URL`

### 4. Push Database Schema

Run the following command to create all tables:

```bash
npm run db:push
```

This will:
- Create all tables (users, goals, milestones, tasks, calendar_events, chat_messages, journal_entries)
- Set up all enum types
- Configure foreign keys and relationships

**Verify it worked:**

```bash
npm run db:studio
```

This opens Drizzle Studio at `https://local.drizzle.studio` where you can browse your database.

### 5. Configure AWS Bedrock (for AI features)

1. **Enable Claude in Bedrock**:
   - Go to AWS Console → Bedrock → Model access
   - Request access to `Claude 4 Sonnet` (us.anthropic.claude-sonnet-4-20250514-v1:0)
   - Wait for approval (usually instant)

2. **Create IAM User**:
   ```bash
   # Create a user with Bedrock invoke permissions
   aws iam create-user --user-name lotion-bedrock

   # Attach the policy
   aws iam attach-user-policy \
     --user-name lotion-bedrock \
     --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

   # Create access key
   aws iam create-access-key --user-name lotion-bedrock
   ```

3. **Add credentials to `.env.local`**

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### View/Edit Data

```bash
npm run db:studio
```

Opens Drizzle Studio for visual database management.

### Generate Migration

If you modify `src/db/schema.ts`:

```bash
npm run db:generate
```

This creates a SQL migration file in `drizzle/`.

### Apply Migrations

```bash
npm run db:migrate
```

Or for development, push schema directly:

```bash
npm run db:push
```

### Reset Database (CAUTION)

To start fresh (deletes all data):

```sql
-- Run this in Neon SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then push schema again: `npm run db:push`

## Optional: Google Calendar Integration

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google Calendar API**

### 2. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/calendar/google/callback`
   - Production: `https://yourdomain.com/api/calendar/google/callback`
5. Copy **Client ID** and **Client Secret**
6. Add them to `.env.local`

### 3. Test OAuth Flow

1. Run the app: `npm run dev`
2. Click "Connect Google Calendar" in the app
3. Complete OAuth flow
4. Calendar events should now sync

## Optional: Supabase Auth (Future)

Currently using temporary localStorage-based user IDs. To integrate Supabase:

1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add to `.env.local`
4. Uncomment Supabase auth code in the app

## Architecture Overview

```
lotion/
├── src/
│   ├── app/
│   │   ├── (dashboard)/         # Main app routes
│   │   │   ├── dashboard/
│   │   │   ├── goals/
│   │   │   ├── calendar/
│   │   │   ├── tasks/
│   │   │   ├── journal/
│   │   │   ├── coach/
│   │   │   └── memory/
│   │   └── api/                 # Backend API routes
│   │       ├── goals/
│   │       ├── tasks/
│   │       ├── milestones/
│   │       ├── journal/
│   │       ├── events/
│   │       ├── ai/chat/
│   │       └── user/
│   ├── db/
│   │   ├── schema.ts            # Drizzle schema
│   │   └── index.ts             # DB connection
│   ├── lib/
│   │   ├── store.tsx            # Zustand state (client-side)
│   │   ├── api-client.ts        # API wrapper functions
│   │   └── use-ai-chat.ts       # AI chat hook
│   └── components/
│       └── ui/                  # Reusable components
├── drizzle.config.ts
├── .env.local
└── package.json
```

## Current State: MVP (Client-Side Only)

**What works now:**
- ✅ All UI pages are fully designed and functional
- ✅ Client-side state management with Zustand
- ✅ All interactions work (create goals, tasks, journal, etc.)
- ✅ AI chat interface (not connected to backend yet)
- ✅ Calendar view and event management

**What's being wired up:**
- 🚧 Database schema is ready
- 🚧 API routes are built
- 🚧 API client library is ready
- ⏳ Next: Update Zustand store to use API
- ⏳ Next: Connect AI chat to Bedrock
- ⏳ Next: Google Calendar sync

## Troubleshooting

### Database Connection Error

```
Error: getaddrinfo ENOTFOUND
```

- Check `DATABASE_URL` in `.env.local`
- Verify your Neon database is active (may need to wake from sleep)
- Test connection: `psql $DATABASE_URL`

### AWS Bedrock Permission Denied

```
Error: User is not authorized to perform: bedrock:InvokeModel
```

- Verify AWS credentials in `.env.local`
- Check IAM user has Bedrock permissions
- Confirm Claude model access is approved in Bedrock console

### Drizzle Kit Errors

```
Error: drizzle-kit: command not found
```

- Install devDependencies: `npm install`
- Run `npm run db:push` instead of direct `drizzle-kit` command

## Next Steps

1. ✅ Database schema finalized
2. ✅ API routes created
3. ✅ API client library ready
4. ⏳ Update Zustand store to persist to database
5. ⏳ Wire up AI chat with Bedrock
6. ⏳ Integrate Google Calendar sync
7. ⏳ Add Supabase authentication
8. ⏳ Deploy to Vercel

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/your-repo/issues)
- Review [Next.js docs](https://nextjs.org/docs)
- Check [Drizzle docs](https://orm.drizzle.team)
- Review [AWS Bedrock docs](https://docs.aws.amazon.com/bedrock/)
