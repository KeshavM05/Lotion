import { NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";

/**
 * Parse and validate a request body against a Zod schema.
 * Returns parsed data on success, or a 400 Response on failure.
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: Response }> {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return {
      data: null,
      error: Response.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    const issues = (result.error as ZodError).issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return {
      data: null,
      error: Response.json(
        { error: "Validation failed", details: issues },
        { status: 400 }
      ),
    };
  }

  return { data: result.data, error: null };
}
