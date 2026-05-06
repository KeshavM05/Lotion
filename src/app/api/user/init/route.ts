import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/user/init - Initialize or get user
// For MVP: Creates a test user if one doesn't exist for the given ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name } = body;

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      // Create new user
      [user] = await db
        .insert(users)
        .values({
          id: userId,
          supabaseId: `temp_${userId}`, // Temporary until Supabase is integrated
          email: email || `user_${userId.slice(0, 8)}@lotion.app`,
          name: name || "Test User",
          aiMemory: "",
        })
        .returning();
    }

    return Response.json(user);
  } catch (error) {
    console.error("POST /api/user/init error:", error);
    return Response.json({ error: "Failed to initialize user" }, { status: 500 });
  }
}
