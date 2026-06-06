-- Create calendar_preferences table
CREATE TABLE IF NOT EXISTS "calendar_preferences" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL UNIQUE,
  "timezone" text DEFAULT 'America/Toronto' NOT NULL,
  "first_day_of_week" integer DEFAULT 0 NOT NULL,
  "default_view" text DEFAULT 'week' NOT NULL,
  "time_grid_start" integer DEFAULT 0 NOT NULL,
  "time_grid_end" integer DEFAULT 24 NOT NULL,
  "time_display_resolution" integer DEFAULT 15 NOT NULL,
  "time_dragging_resolution" integer DEFAULT 15 NOT NULL,
  "events_per_day_limit" integer DEFAULT 4 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS "calendar_preferences_user_id_idx" ON "calendar_preferences"("user_id");
