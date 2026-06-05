ALTER TABLE "task_lists" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "task_lists" ADD COLUMN "archived_at" timestamp;