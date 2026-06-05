/**
 * Consistent API error response utilities.
 *
 * All API routes should return errors in the shape:
 *   { error: string; code: string }
 */

export interface ApiErrorBody {
  error: string;
  code: string;
}

/** Well-known error codes */
export const ErrorCode = {
  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  // Resource
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_FIELDS: "MISSING_FIELDS",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DB_ERROR: "DB_ERROR",
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Build a consistent JSON error response.
 *
 * @example
 * return apiError("User not found", ErrorCode.NOT_FOUND, 404);
 */
export function apiError(
  message: string,
  code: ErrorCodeValue,
  status: number = 500
): Response {
  const body: ApiErrorBody = { error: message, code };
  return Response.json(body, { status });
}

/** Shorthand helpers */
export const unauthorizedError = (msg = "Unauthorized") =>
  apiError(msg, ErrorCode.UNAUTHORIZED, 401);

export const forbiddenError = (msg = "Forbidden") =>
  apiError(msg, ErrorCode.FORBIDDEN, 403);

export const notFoundError = (msg = "Not found") =>
  apiError(msg, ErrorCode.NOT_FOUND, 404);

export const validationError = (msg: string) =>
  apiError(msg, ErrorCode.VALIDATION_ERROR, 400);

export const missingFieldsError = (fields?: string[]) =>
  apiError(
    fields ? `Missing required fields: ${fields.join(", ")}` : "Missing required fields",
    ErrorCode.MISSING_FIELDS,
    400
  );

export const internalError = (msg = "Internal server error") =>
  apiError(msg, ErrorCode.INTERNAL_ERROR, 500);
