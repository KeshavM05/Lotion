# Lotion — AI Life Coach

> Your AI-powered life coach. Goals, calendar, and clarity in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8)](https://tailwindcss.com/)

---

## What is Lotion?

Lotion is **not another Motion clone**. It's an AI Life Coach that brings together your goals, calendar, tasks, and journal into one connected experience. Think of it as **Quillio meets Notion**, with a calendar-first approach and AI that actually remembers your life context.

### Key Features

- **🎯 Vision Board** - Visual goal tracking with progress rings and milestones
- **📅 Calendar** - Sync with Google Calendar & Outlook, drag-to-schedule
- **✅ Smart Tasks** - Auto-scheduling based on deadlines and priorities
- **📝 Journal** - Daily reflections that feed AI understanding
- **🤖 AI Coach** - Contextual coaching per goal with persistent memory
- **⚡ Quick Capture** - `Ctrl+Shift+J` to capture thoughts instantly
- **🔍 Command Palette** - `Ctrl+K` for navigation and actions
- **📤 Full Export** - Markdown, JSON, PDF - your data is yours

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS 4.2 + Material Design 3
- **Database:** Drizzle ORM + Neon (Serverless PostgreSQL)
- **AI:** AWS Bedrock (Claude via Bedrock Runtime)
- **State:** Zustand (client-side for MVP)

**Design System:** Google Stitch + Quillio-inspired aesthetic with glassmorphism

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) Neon Database account for persistence
- (Optional) AWS Bedrock access for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/KeshavM05/Lotion.git
cd Lotion

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables (Optional)

Create a `.env.local` file for full features:

```env
# Database (for persistence)
DATABASE_URL=postgresql://...

# AWS Bedrock (for AI features)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Google Calendar (for sync)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Note:** App works without these for local development (uses client-side storage)

---

## Available Scripts

```bash
npm run dev         # Start dev server (localhost:3000)
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint

# Database (when configured)
npm run db:push     # Push schema to database
npm run db:studio   # Open Drizzle Studio (DB GUI)
```

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Main app routes
│   │   ├── dashboard/        # Overview
│   │   ├── goals/            # Vision Board
│   │   ├── calendar/         # Calendar view
│   │   ├── tasks/            # Task list
│   │   ├── journal/          # Journal timeline
│   │   ├── coach/            # AI Coach
│   │   └── memory/           # AI Memory
│   ├── api/ai/chat/          # AI chat endpoint
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/ui/            # Reusable components
├── lib/
│   ├── store.tsx             # Zustand state
│   └── utils.ts              # Utilities
└── db/
    └── schema.ts             # Drizzle schema

docs/                         # Documentation
├── VISION.md                 # Product vision
├── ARCHITECTURE.md           # Technical architecture
├── DESIGN_SYSTEM.md          # Design system
├── SCOPE.md                  # Feature scope
└── IMPLEMENTATION.md         # Implementation notes
```

---

## Design Philosophy

1. **Pixel-perfect execution** - Match designs exactly, no approximations
2. **Material Design 3** - Follow MD3 color system precisely
3. **Atmospheric depth** - Radial gradients, blooms, subtle textures
4. **Type safety** - TypeScript strict mode everywhere
5. **Modern stack** - Latest stable versions, no legacy patterns
6. **Data portability** - Full export in Markdown/JSON/PDF

---

## Roadmap

### ✅ Phase 1: MVP (Current)
- [x] Dashboard with stats and insights
- [x] Vision Board (goals + milestones + tasks)
- [x] Calendar view (week/month)
- [x] Task list with priorities
- [x] Journal timeline
- [x] AI Coach chat
- [x] Quick Capture overlay
- [x] Command Palette

### 🚧 Phase 2: Integration
- [ ] Database persistence (Neon)
- [ ] Google Calendar sync
- [ ] Outlook Calendar sync
- [ ] AI auto-scheduling
- [ ] Weekly Ritual flow

### 📋 Phase 3: Advanced
- [ ] Export system (Markdown/JSON/PDF)
- [ ] Mobile responsive design
- [ ] Collaboration features
- [ ] API for external integrations

---

## Design Credits

- **Inspired by:** [Quillio](https://quillio.io) (atmospheric dark UI)
- **Design System:** Google Material Design 3 + Google Stitch
- **Icons:** Material Symbols Outlined
- **Fonts:** Playfair Display, Space Grotesk, JetBrains Mono

---

## Contributing

This is currently a personal project, but suggestions and feedback are welcome!

---

## License

ISC

---

## Contact

For questions or feedback, open an issue on GitHub or reach out via:
- **GitHub:** [KeshavM05](https://github.com/KeshavM05)
- **Repository:** [Lotion](https://github.com/KeshavM05/Lotion)

---

**Built with ❤️ using Next.js 16, React 19, and Claude AI**
