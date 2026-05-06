import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/user/memory - Get user's AI memory
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { aiMemory: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ memory: user.aiMemory || "" });
  } catch (error) {
    console.error("GET /api/user/memory error:", error);
    return Response.json({ error: "Failed to fetch AI memory" }, { status: 500 });
  }
}

// PATCH /api/user/memory - Update user's AI memory
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { memory } = body;

    if (typeof memory !== "string") {
      return Response.json({ error: "Invalid memory format" }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set({
        aiMemory: memory,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ aiMemory: users.aiMemory });

    if (!updated) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ memory: updated.aiMemory });
  } catch (error) {
    console.error("PATCH /api/user/memory error:", error);
    return Response.json({ error: "Failed to update AI memory" }, { status: 500 });
  }
}
