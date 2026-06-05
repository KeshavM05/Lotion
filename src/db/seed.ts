/**
 * Development seed script.
 *
 * Inserts a sample user, goals, milestones, task lists, tasks, journal entries,
 * chat messages, and auto-schedule settings so developers have realistic data to
 * work with immediately after running `db:reset`.
 *
 * Run with:
 *   npx tsx src/db/seed.ts
 * or via the package.json script:
 *   npm run db:seed
 *
 * NOTE: This script talks directly to the database — make sure DATABASE_URL is
 * set in your .env.local (or environment) before running.
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// ---------------------------------------------------------------------------
// Bootstrap a dedicated client so the seed can be run standalone without
// importing the Next.js app's env-validation module.
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  console.error("Copy .env.example to .env.local and fill in your values.");
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱 Starting database seed…");

  // ------------------------------------------------------------------
  // 1. User
  // ------------------------------------------------------------------
  console.log("  → Inserting seed user…");
  const [user] = await db
    .insert(schema.users)
    .values({
      supabaseId: "seed-supabase-id-keshav",
      email: "keshav@example.com",
      name: "Keshav Mehndiratta",
      avatarUrl: null,
      aiMemory:
        "Keshav is an ambitious builder and founder with many parallel life goals. He values data portability, AI autonomy, and clarity over complexity. He is currently focused on launching Lotion — an AI life coach app.",
    })
    .onConflictDoNothing()
    .returning();

  if (!user) {
    // Already seeded — fetch the existing record so FK inserts still work.
    const existing = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, "keshav@example.com"),
    });
    if (!existing) throw new Error("Could not find or create seed user.");
    console.log("  ℹ  Seed user already exists, skipping inserts.");
    await client.end();
    return;
  }

  const userId = user.id;

  // ------------------------------------------------------------------
  // 2. Auto-schedule settings
  // ------------------------------------------------------------------
  console.log("  → Inserting auto-schedule settings…");
  await db.insert(schema.autoScheduleSettings).values({
    userId,
    workDays: [1, 2, 3, 4, 5],
    workHourStart: 9,
    workHourEnd: 18,
    highEnergyStart: 9,
    highEnergyEnd: 12,
    mediumEnergyStart: 13,
    mediumEnergyEnd: 16,
    lowEnergyStart: 16,
    lowEnergyEnd: 18,
  });

  // ------------------------------------------------------------------
  // 3. Goals
  // ------------------------------------------------------------------
  console.log("  → Inserting goals…");

  const [goalLotion] = await db
    .insert(schema.goals)
    .values({
      userId,
      title: "Launch Lotion v1.0",
      description:
        "Ship the first public release of the AI Life Coach app — calendar sync, goal tracking, AI chat per goal, and export system.",
      category: "business",
      priority: "critical",
      targetDate: new Date("2026-09-01"),
      color: "#C17A72",
      status: "active",
    })
    .returning();

  const [goalFitness] = await db
    .insert(schema.goals)
    .values({
      userId,
      title: "Run a half-marathon",
      description:
        "Train consistently and complete a half-marathon (21 km) within the year.",
      category: "health",
      priority: "high",
      targetDate: new Date("2026-11-15"),
      color: "#4CAF82",
      status: "active",
    })
    .returning();

  const [goalReading] = await db
    .insert(schema.goals)
    .values({
      userId,
      title: "Read 24 books this year",
      description:
        "Finish two books per month across strategy, philosophy, biographies, and technical topics.",
      category: "personal",
      priority: "medium",
      targetDate: new Date("2026-12-31"),
      color: "#5B8DD9",
      status: "active",
    })
    .returning();

  // ------------------------------------------------------------------
  // 4. Milestones
  // ------------------------------------------------------------------
  console.log("  → Inserting milestones…");

  const [ms1] = await db
    .insert(schema.milestones)
    .values({
      goalId: goalLotion.id,
      title: "Complete DB schema & migrations",
      description: "All tables, enums, and relations defined and migrated.",
      targetDate: new Date("2026-06-15"),
      completed: true,
      completedAt: new Date("2026-06-04"),
      order: 1,
    })
    .returning();

  const [ms2] = await db
    .insert(schema.milestones)
    .values({
      goalId: goalLotion.id,
      title: "Wire up API routes to database",
      description: "Replace in-memory stores with real Neon Postgres queries.",
      targetDate: new Date("2026-07-01"),
      completed: false,
      order: 2,
    })
    .returning();

  await db.insert(schema.milestones).values({
    goalId: goalLotion.id,
    title: "Launch private beta",
    description: "Invite 10 testers and collect feedback.",
    targetDate: new Date("2026-08-01"),
    completed: false,
    order: 3,
  });

  await db.insert(schema.milestones).values({
    goalId: goalFitness.id,
    title: "Run 5 km without stopping",
    targetDate: new Date("2026-07-01"),
    completed: false,
    order: 1,
  });

  await db.insert(schema.milestones).values({
    goalId: goalFitness.id,
    title: "Complete a 10 km race",
    targetDate: new Date("2026-09-01"),
    completed: false,
    order: 2,
  });

  // ------------------------------------------------------------------
  // 5. Task Lists
  // ------------------------------------------------------------------
  console.log("  → Inserting task lists…");

  const [listDev] = await db
    .insert(schema.taskLists)
    .values({
      userId,
      name: "Development",
      color: "#C17A72",
      icon: "code",
      order: 1,
    })
    .returning();

  const [listPersonal] = await db
    .insert(schema.taskLists)
    .values({
      userId,
      name: "Personal",
      color: "#4CAF82",
      icon: "user",
      order: 2,
    })
    .returning();

  // ------------------------------------------------------------------
  // 6. Tasks
  // ------------------------------------------------------------------
  console.log("  → Inserting tasks…");

  await db.insert(schema.tasks).values([
    {
      userId,
      listId: listDev.id,
      goalId: goalLotion.id,
      milestoneId: ms2.id,
      title: "Replace in-memory goal store with DB queries",
      description:
        "Update /api/goals to use drizzle-orm instead of the client-side store.",
      status: "todo",
      priority: "critical",
      durationMinutes: 90,
      deadline: new Date("2026-06-20"),
      energyLevel: "high",
      timePreference: "morning",
      tags: ["backend", "database"],
    },
    {
      userId,
      listId: listDev.id,
      goalId: goalLotion.id,
      milestoneId: ms2.id,
      title: "Replace in-memory task store with DB queries",
      status: "todo",
      priority: "high",
      durationMinutes: 60,
      deadline: new Date("2026-06-22"),
      energyLevel: "high",
      timePreference: "morning",
      tags: ["backend", "database"],
    },
    {
      userId,
      listId: listDev.id,
      goalId: goalLotion.id,
      milestoneId: ms1.id,
      title: "Write seed script and .env.example",
      description: "GitHub issue #43 — infra work.",
      status: "in_progress",
      priority: "high",
      durationMinutes: 45,
      completed: false,
      energyLevel: "medium",
      timePreference: "anytime",
      tags: ["infra", "devex"],
    },
    {
      userId,
      listId: listPersonal.id,
      goalId: goalFitness.id,
      title: "Morning run — 3 km easy pace",
      status: "todo",
      priority: "medium",
      durationMinutes: 30,
      energyLevel: "medium",
      timePreference: "morning",
      tags: ["fitness", "running"],
    },
    {
      userId,
      listId: listPersonal.id,
      goalId: goalReading.id,
      title: "Finish 'The Almanack of Naval Ravikant'",
      status: "in_progress",
      priority: "low",
      durationMinutes: 60,
      energyLevel: "low",
      timePreference: "evening",
      tags: ["reading", "philosophy"],
    },
    {
      userId,
      listId: listDev.id,
      goalId: goalLotion.id,
      title: "Set up Supabase auth in Next.js middleware",
      status: "todo",
      priority: "high",
      durationMinutes: 120,
      deadline: new Date("2026-07-05"),
      energyLevel: "high",
      timePreference: "morning",
      tags: ["auth", "backend"],
    },
  ]);

  // ------------------------------------------------------------------
  // 7. Journal entries
  // ------------------------------------------------------------------
  console.log("  → Inserting journal entries…");

  await db.insert(schema.journalEntries).values([
    {
      userId,
      content:
        "Huge progress today — finished the DB schema, wrote all the migrations, and got the seed script done. The data model feels solid. Next focus: wire up the API routes so the app actually persists data.",
      mood: "great",
      linkedGoalIds: [goalLotion.id],
      createdAt: new Date("2026-06-04T21:00:00Z"),
      updatedAt: new Date("2026-06-04T21:00:00Z"),
    },
    {
      userId,
      content:
        "Went for a 2.5 km jog in the morning. Legs are still getting used to it but the consistency is what matters right now. Target: 5 km by end of June.",
      mood: "good",
      linkedGoalIds: [goalFitness.id],
      createdAt: new Date("2026-06-03T08:30:00Z"),
      updatedAt: new Date("2026-06-03T08:30:00Z"),
    },
    {
      userId,
      content:
        "Read 40 pages of Naval's almanack. The section on specific knowledge really resonated — building Lotion is exactly this kind of thing for me. Clarity > complexity, always.",
      mood: "good",
      linkedGoalIds: [goalReading.id, goalLotion.id],
      createdAt: new Date("2026-06-02T22:00:00Z"),
      updatedAt: new Date("2026-06-02T22:00:00Z"),
    },
  ]);

  // ------------------------------------------------------------------
  // 8. Chat messages (goal-scoped AI coaching conversations)
  // ------------------------------------------------------------------
  console.log("  → Inserting chat messages…");

  await db.insert(schema.chatMessages).values([
    {
      userId,
      goalId: goalLotion.id,
      role: "user",
      content:
        "I feel like I'm spending too much time on infra instead of building features. Am I over-engineering?",
      createdAt: new Date("2026-06-04T15:00:00Z"),
    },
    {
      userId,
      goalId: goalLotion.id,
      role: "assistant",
      content:
        "It's a fair concern, but look at what you've actually shipped: a typed schema, migrations, seed data, and a validated env config. That's not over-engineering — that's a foundation that will save you hours of debugging later. The key question is: can you now ship a feature end-to-end? If yes, the infra work was exactly right. Set a rule for yourself: no more infra PRs until you've wired up at least one API route to the real database.",
      createdAt: new Date("2026-06-04T15:01:00Z"),
    },
    {
      userId,
      goalId: goalFitness.id,
      role: "user",
      content: "I keep skipping my morning runs when I have a lot of dev work scheduled.",
      createdAt: new Date("2026-06-03T09:00:00Z"),
    },
    {
      userId,
      goalId: goalFitness.id,
      role: "assistant",
      content:
        "This is a classic identity-vs-schedule conflict. The run isn't competing with the dev work — it's actually protecting it. 30 minutes of movement in the morning improves focus for the next 4-6 hours. Try this: schedule the run as a non-negotiable calendar block at 7 AM, before you even open your laptop. Make it shorter (2 km) on busy days so the barrier to starting is near zero.",
      createdAt: new Date("2026-06-03T09:01:00Z"),
    },
  ]);

  // ------------------------------------------------------------------
  // Done
  // ------------------------------------------------------------------
  console.log("\n✅ Seed complete!");
  console.log(`   User:    ${user.email} (id: ${userId})`);
  console.log(`   Goals:   3`);
  console.log(`   Tasks:   6`);
  console.log(`   Journal: 3 entries`);
  console.log(`   Chat:    4 messages`);

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
