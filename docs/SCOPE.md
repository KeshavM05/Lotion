# Motion — Feature Scope & MVP

---

## Phase 1: MVP (Build Now)

The foundation. Calendar + Goals + AI Chat per goal.

### 1.1 Calendar
- **Week view** with hour grid (already built)
- **Google Calendar sync** (OAuth + Google Calendar API)
- **Outlook Calendar sync** (Microsoft Graph API)
- Events render from both local + synced calendars
- Create/edit/delete events with drag interactions
- AI-scheduled task blocks appear on calendar with distinct styling

### 1.2 Goals & Vision Board
- **Goal cards** — each goal is a first-class entity
  - Title, description, target date, category
  - Categories: Career, Business, Finance, Personal, Health, Creative
  - Priority level + progress tracking
  - Color/icon customization
- **Milestones** — each goal breaks into milestones
  - Milestones break into actionable tasks
  - Progress rolls up: tasks -> milestones -> goals
- **Vision board view** — visual grid of all goals with progress rings
- **Goal detail view** — timeline, milestones, tasks, and **chat tab**

### 1.3 AI Chat (Per Goal)
- Each goal has its own **chat thread** with the AI coach
- AI has context: the goal, its milestones, tasks, journal entries, calendar
- Ask for advice, brainstorm, break down next steps
- AI can **create tasks and milestones** directly from chat
- AI can **suggest calendar blocks** for deep work
- **Full chat export** — Markdown, JSON, or PDF
- Chat history persists and is searchable

### 1.4 AI Memory System
- AI maintains a **memory document** per user
- Memory is structured: goals, preferences, patterns, insights
- User can **view and edit** the memory doc
- Memory updates after journal entries, goal changes, chat sessions
- Memory informs all AI interactions across the app

### 1.5 Data Export
- Export anything: goals, tasks, journal entries, chats, calendar
- Formats: Markdown, JSON, CSV, PDF
- Bulk export / backup option

---

## Phase 2: Journal + Coaching

### 2.1 Daily Journal
- Rich text editor for daily entries
- AI reads entries and extracts:
  - Mood / energy signals
  - Blockers and frustrations
  - Wins and progress
  - Ideas and insights
- Journal entries link to relevant goals automatically

### 2.2 AI Daily Coaching
- Morning: "Here's your plan for today" based on goals + calendar + mood
- Evening: "How did today go?" — reflection prompt
- AI adjusts tomorrow's schedule based on journal feedback
- Proactive nudges: "You haven't worked on [goal] in 5 days"

### 2.3 Weekly Review
- AI generates a weekly summary:
  - What you accomplished
  - What slipped
  - Mood trends
  - Suggested focus for next week
- Quillio-style: "brain dumps into one crystal clear weekly plan"

---

## Phase 3: Intelligence Layer

### 3.1 Smart Scheduling Engine
- Auto-schedule tasks into free calendar slots
- Respect working hours, energy levels, preferences
- Priority: deadline-driven > high-priority > goal-aligned
- Re-optimize when things change (meetings moved, tasks take longer)

### 3.2 Goal Analytics
- Progress over time charts
- Time spent per goal category
- Streak tracking (journaling, task completion)
- Predicted completion dates based on current pace

### 3.3 Connections & Insights
- AI surfaces connections between goals
- "Your journal entry about burnout might affect your YC deadline"
- Pattern recognition across weeks/months of data

---

## Phase 4: Polish & Integrations

### 4.1 Calendar Integrations
- Google Calendar (read/write)
- Outlook/Microsoft 365 (read/write)
- Apple Calendar (read)

### 4.2 Additional Integrations
- Notion import
- Todoist import
- Google Tasks import

### 4.3 Mobile PWA
- Responsive design works on mobile
- Quick journal entry from phone
- Calendar view on mobile

### 4.4 Keyboard-First UX
- Global command palette (Cmd+K)
- Quick capture (journal entry from anywhere)
- Vim-style navigation optional

---

## Out of Scope (For Now)
- Team/collaboration features
- Meeting notetaker
- Gantt charts
- Video conferencing integration
- Native mobile apps (PWA first)
