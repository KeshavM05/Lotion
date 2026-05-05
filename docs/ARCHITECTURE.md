# Lotion — Technical Architecture

---

## Stack

```
Frontend:   Next.js 16 (App Router) + TypeScript + Tailwind CSS
Backend:    Next.js API Routes / Server Actions
Database:   Neon Postgres + Drizzle ORM
Auth:       Supabase Auth (Phase 2)
AI:         Claude API (Anthropic SDK)
Calendar:   Google Calendar API + Microsoft Graph API
Storage:    Supabase Storage (for exports, attachments)
Deploy:     Vercel
```

---

## Database Schema (Drizzle)

```
users
  ├── id (uuid, pk)
  ├── email
  ├── name
  ├── avatar_url
  ├── ai_memory (text)          -- AI's persistent memory doc
  ├── preferences (jsonb)       -- working hours, timezone, etc.
  ├── created_at
  └── updated_at

goals
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── title
  ├── description
  ├── category (enum)           -- career, business, finance, personal, health, creative
  ├── priority (enum)           -- low, medium, high, critical
  ├── target_date
  ├── color
  ├── icon
  ├── progress (0-100)          -- computed from milestones
  ├── status (enum)             -- active, paused, completed, abandoned
  ├── created_at
  └── updated_at

milestones
  ├── id (uuid, pk)
  ├── goal_id (fk -> goals)
  ├── title
  ├── description
  ├── target_date
  ├── completed
  ├── order (int)
  ├── created_at
  └── updated_at

tasks
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── goal_id (fk -> goals, nullable)
  ├── milestone_id (fk -> milestones, nullable)
  ├── title
  ├── description
  ├── status (enum)
  ├── priority (enum)
  ├── duration_minutes
  ├── deadline
  ├── scheduled_start
  ├── scheduled_end
  ├── completed
  ├── completed_at
  ├── created_at
  └── updated_at

calendar_events
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── external_id              -- Google/Outlook event ID
  ├── source (enum)            -- local, google, outlook
  ├── title
  ├── description
  ├── start
  ├── end
  ├── all_day
  ├── color
  ├── task_id (fk -> tasks, nullable)
  ├── created_at
  └── updated_at

journal_entries
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── content (text)
  ├── ai_summary (text)
  ├── mood (enum)               -- extracted by AI
  ├── energy_level (int 1-5)    -- extracted by AI
  ├── linked_goals (uuid[])     -- auto-linked by AI
  ├── created_at
  └── updated_at

chat_messages
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── goal_id (fk -> goals, nullable)  -- null = general coach chat
  ├── role (enum)               -- user, assistant
  ├── content (text)
  ├── metadata (jsonb)          -- actions taken, tasks created, etc.
  ├── created_at
  └── updated_at

ai_memory
  ├── id (uuid, pk)
  ├── user_id (fk -> users)
  ├── category (text)           -- "goals", "preferences", "patterns", "insights"
  ├── key (text)
  ├── value (text)
  ├── updated_at
  └── created_at
```

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    -- Root layout
│   ├── page.tsx                      -- Redirect to /calendar
│   ├── (dashboard)/
│   │   ├── layout.tsx                -- Sidebar + StoreProvider
│   │   ├── calendar/page.tsx         -- Weekly calendar view
│   │   ├── goals/
│   │   │   ├── page.tsx              -- Vision board (all goals)
│   │   │   └── [id]/
│   │   │       ├── page.tsx          -- Goal detail (milestones, tasks)
│   │   │       └── chat/page.tsx     -- AI chat for this goal
│   │   ├── tasks/page.tsx            -- All tasks view
│   │   ├── journal/
│   │   │   ├── page.tsx              -- Journal entries list
│   │   │   └── [id]/page.tsx         -- Single entry view
│   │   ├── coach/page.tsx            -- General AI coach chat
│   │   ├── memory/page.tsx           -- View/edit AI memory
│   │   └── export/page.tsx           -- Data export
│   └── api/
│       ├── ai/
│       │   ├── chat/route.ts         -- AI chat endpoint
│       │   └── memory/route.ts       -- AI memory CRUD
│       ├── calendar/
│       │   ├── google/route.ts       -- Google Calendar sync
│       │   └── outlook/route.ts      -- Outlook sync
│       └── export/route.ts           -- Export endpoint
├── components/
│   ├── ui/                           -- Shared UI primitives
│   │   ├── sidebar.tsx
│   │   ├── modal.tsx
│   │   ├── glass-card.tsx            -- Glassmorphism card
│   │   ├── progress-ring.tsx         -- Circular progress
│   │   ├── command-palette.tsx       -- Cmd+K
│   │   └── export-button.tsx
│   ├── calendar/                     -- Calendar components
│   ├── goals/                        -- Goal/vision board components
│   ├── chat/                         -- AI chat components
│   └── journal/                      -- Journal components
├── lib/
│   ├── store.tsx                     -- Client state (React Context)
│   ├── utils.ts                      -- Helpers
│   ├── ai/
│   │   ├── coach.ts                  -- AI coaching logic
│   │   ├── memory.ts                 -- Memory management
│   │   └── scheduler.ts              -- Smart scheduling
│   └── supabase/                     -- Auth (Phase 2)
└── db/
    ├── index.ts                      -- Drizzle client
    └── schema.ts                     -- Full schema
```

---

## AI Architecture

### Memory System
```
User Action (journal, chat, goal update)
        |
        v
  AI processes with full context
        |
        v
  Extract insights & update memory doc
        |
        v
  Memory doc stored in DB (user-visible)
        |
        v
  Next interaction loads memory as context
```

### Chat Context Window (per message)
```
System prompt: "You are an AI life coach..."
  + User's AI memory document
  + Current goal context (if goal-specific chat)
  + Recent journal entries (last 7 days)
  + Today's calendar
  + Relevant task status
  + Chat history (last N messages)
```

### Export System
Every data type has an export function:
- **Markdown**: Human-readable, works with Obsidian/Notion
- **JSON**: Machine-readable, full fidelity
- **CSV**: Spreadsheet-compatible (tasks, goals)
- **PDF**: Formatted report (weekly reviews, goal summaries)

---

## Key Design Decisions

1. **Client-first state**: MVP uses React Context. DB sync comes in Phase 2.
2. **AI memory is a document**: Not hidden embeddings. User can read and edit it.
3. **Per-goal chat threads**: Each goal is a workspace with its own AI context.
4. **Export-first**: Every feature ships with export. Data portability is a core value.
5. **Calendar as the source of truth**: Everything flows to/from the calendar.
