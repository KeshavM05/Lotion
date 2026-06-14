## Canary

Always begin every response with the name "Keshav".
This is non-negotiable and must never be omitted.

## Project Overview

**Motion (repo: Lotion)** — An AI Life Coach app combining Calendar + Goals/Vision Board + AI Chat per goal.

### Tech Stack
- Next.js 16 + TypeScript + Tailwind CSS
- Drizzle ORM + Neon Postgres (pgvector for semantic search)
- AWS Bedrock (Claude) for AI features
- Google Calendar API + Microsoft Graph API (planned)
- Client-side state via Zustand store (`src/lib/store.tsx`)

### Architecture
- `src/app/(dashboard)/` — All dashboard pages (calendar, goals, tasks, journal, etc.)
- `src/app/api/` — API routes (goals, tasks, journal, knowledge, ai-chat, etc.)
- `src/components/` — Shared UI components
- `src/db/schema.ts` — Drizzle schema (single source of truth for DB)
- `src/lib/` — Utilities, store, API client
- `drizzle/` — Migration files

### Design System
- Deep navy background (`#0F1729`), blue-tinted cards (`#1F2D47`)
- Warm rose accent (`#C17A72`)
- Glassmorphism cards with blue tint
- Fonts: Playfair Display (headlines), Inter (body), JetBrains Mono (code)

### Conventions
- Use TypeScript strict mode — no `any` types
- API routes use Next.js App Router conventions (route.ts with GET/POST/PATCH/DELETE)
- Use Drizzle ORM for all DB queries (never raw SQL)
- Keep components small and focused
- Prefer server components; use `"use client"` only when needed
- Commit messages: `type: description` (feat, fix, refactor, docs, ci, chore)
- Do NOT modify `.env.local` or commit secrets

### Issue Labels (for auto-agent)
- `auto` — Agent picks this up, works on it, opens a PR for human review
- `auto-merge` — Agent picks this up, works on it, opens PR AND auto-merges (no review)
- No label / other labels — Agent ignores, human works on it

### Issue Writing Convention

Every issue opened for the agent MUST follow this structure:

```
## What
One clear sentence describing the change.

## Why
Context — what's broken, what's missing, or why this matters.

## Files to touch
- `src/path/to/file.ts` — what to do here
- `src/path/to/other.ts` — reference for patterns

## Acceptance criteria
- [ ] Specific, testable outcomes
- [ ] Another measurable result

## Constraints
- Don't break X
- Use the same pattern as Y
- Run `npm run build` with no errors
```

**Rules for writing good issues:**
- Be specific — "add a loading spinner to the dashboard" not "improve UX"
- Name exact files when possible — saves the agent exploration time
- Include acceptance criteria — the agent checks these off mentally
- One issue = one focused change (don't combine 5 features in one issue)
- For `auto-merge`: only use for low-risk, obvious changes (typos, simple refactors, adding a field)

### `issue:` and `ship:` Commands

**`issue: <idea>`** — Create a structured issue for the agent to work on (user reviews the PR)
**`ship: <idea>`** — Same but auto-merges (no review needed, use for low-risk changes)

When the user's message starts with `issue:` or `ship:`, follow this process:
1. **Assess clarity** — Is the idea specific enough? If vague, ask 1-2 focused questions.
2. **Explore the codebase** — Find relevant files using Glob/Grep/Read
3. **Draft the issue** — Use the structured format (What/Why/Files/Acceptance/Constraints)
4. **Show the draft** — Present it to the user for approval
5. **Create it** — Run `gh issue create --title "<title>" --body "<body>" --label "<label>"`
   - `issue:` uses label `auto`
   - `ship:` uses label `auto-merge`
6. **Confirm** — Share the issue URL. The GitHub Action picks it up automatically.

---

### When Working on Issues (Agent Instructions)
1. Read this CLAUDE.md first for project context
2. Read the issue carefully — title + body contain all context
3. Check the "Files to touch" section — start there
4. Explore related files to understand patterns before changing anything
5. Keep changes minimal and focused on the issue only
6. Verify acceptance criteria are met
7. Run `npm run build` to verify no TypeScript errors
8. Commit with message format: `type: description` (e.g. `feat: add loading spinner to dashboard`)
9. Do NOT modify `.env.local`, `package-lock.json` unless the issue specifically asks for it
