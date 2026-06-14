# Lotion Backlog

This document is a snapshot of initial tickets derived from the project scope and vision. These should be transferred to GitHub Issues for active tracking.

---

### Ticket 1: Calendar Sync Integration
- **Type**: `type: feature`
- **Priority**: `priority: P1`
- **Area**: `area: calendar`
- **Description**: Users need to sync their external calendars so Lotion can act as the central source of truth.
- **Acceptance Criteria**:
  - [ ] Implement Google Calendar OAuth flow
  - [ ] Implement Microsoft Graph API for Outlook
  - [ ] Implement two-way sync (read/write)
  - [ ] Ensure calendar events render accurately alongside local tasks

### Ticket 2: Database Persistence for Zustand Store
- **Type**: `type: feature`
- **Priority**: `priority: P1`
- **Area**: `area: infrastructure`
- **Description**: The app currently uses a mix of in-memory Zustand and a scaffolded database. Migrate all local Zustand state mutators to use the API endpoints for full database persistence.
- **Acceptance Criteria**:
  - [ ] Connect Neon database
  - [ ] Update `loadInitialData` to fetch all entities
  - [ ] Refactor Zustand mutators to use API client with optimistic updates
  - [ ] Verify creation, update, and deletion persists across page reloads

### Ticket 3: AI Memory System Implementation
- **Type**: `type: feature`
- **Priority**: `priority: P2`
- **Area**: `area: ai-coach`
- **Description**: The AI needs persistent context about the user's goals, preferences, and patterns across sessions.
- **Acceptance Criteria**:
  - [ ] Create structured memory document schema in DB
  - [ ] Build editable UI for users to view/modify their AI memory
  - [ ] Inject memory document into system prompts for Bedrock/Claude calls
  - [ ] Auto-update memory document based on chat insights

### Ticket 4: Per-Goal Contextual Chat
- **Type**: `type: feature`
- **Priority**: `priority: P2`
- **Area**: `area: goals`
- **Description**: Each goal needs a dedicated chat thread where the AI has specific context about that goal's milestones and progress.
- **Acceptance Criteria**:
  - [ ] Render a chat UI inside the Goal Detail view
  - [ ] Isolate chat histories per `goal_id`
  - [ ] Provide AI with specific goal context in prompt
  - [ ] Enable AI to create milestones/tasks directly from chat via tool calling

### Ticket 5: Daily Journal & Coaching Hooks
- **Type**: `type: feature`
- **Priority**: `priority: P2`
- **Area**: `area: journal`
- **Description**: A rich-text daily journal that the AI can read to provide morning planning and evening reflection prompts.
- **Acceptance Criteria**:
  - [ ] Build rich-text editor for journal
  - [ ] Build morning/evening automated coaching nudges
  - [ ] AI extraction of mood, blockers, and wins

### Ticket 6: Data Export System
- **Type**: `type: feature`
- **Priority**: `priority: P3`
- **Area**: `area: settings`
- **Description**: Ensure the user has full ownership of their data by providing comprehensive export tools.
- **Acceptance Criteria**:
  - [ ] Markdown export for goals and journal entries
  - [ ] JSON export for full data dump
  - [ ] UI button in settings to trigger exports

### Ticket 8: Knowledge Base (AI Second Brain)
- **Type**: `type: feature`
- **Priority**: `priority: P2`
- **Area**: `area: knowledge-base`
- **Description**: An AI-powered second brain that ingests raw sources and incrementally builds a persistent, compounding wiki. Sources go in, structured knowledge comes out.
- **Acceptance Criteria**:
  - [x] DB schema for knowledge_sources, wiki_pages, wiki_log
  - [x] Store state and CRUD actions for KB entities
  - [x] Knowledge Base page with sources/wiki/log tabs
  - [x] Add Source modal with type selection and content input
  - [x] Query bar for asking questions against the wiki
  - [ ] Wire AI ingest: call Bedrock to process source into wiki pages
  - [ ] Wire AI query: call Bedrock to synthesize answers from wiki
  - [ ] Wire AI lint/health check: detect contradictions, orphans, gaps
  - [ ] Wiki page editor for manual corrections
  - [ ] Graph view of wiki page connections
  - [ ] Integration with AI Coach context

### Ticket 9: Personal Stats Dashboard
- **Type**: `type: feature`
- **Priority**: `priority: P2`
- **Area**: `area: dashboard`
- **Description**: Enhanced dashboard with personal productivity metrics, streaks, progress tracking, and deadline awareness.
- **Acceptance Criteria**:
  - [x] Daily stats cards (tasks done today, journal streak, goal progress, events)
  - [x] Weekly task completion progress bar
  - [x] Overdue task alerts
  - [x] Upcoming deadline timeline
  - [ ] Historical trend charts (tasks/week, mood over time)
  - [ ] AI morning briefing card based on stats
  - [ ] Customizable widget layout

### Ticket 7: Remove Duplicate / Unused Code
- **Type**: `type: refactor`
- **Priority**: `priority: P3`
- **Area**: `area: infrastructure`
- **Description**: The codebase contains outdated documentation (e.g. `motionFeatures.md` vs `docs/SCOPE.md`) and potentially orphaned files from earlier prototypes.
- **Acceptance Criteria**:
  - [ ] Audit and remove obsolete markdown files
  - [ ] Clean up redundant functions in Next.js pages
