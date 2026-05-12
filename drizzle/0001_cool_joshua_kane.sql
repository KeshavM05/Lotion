CREATE TYPE "public"."energy_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."time_preference" AS ENUM('morning', 'afternoon', 'evening', 'anytime');--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "energy_level" "energy_level" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "time_preference" time_preference DEFAULT 'anytime';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;