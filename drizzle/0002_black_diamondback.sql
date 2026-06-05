CREATE TABLE "auto_schedule_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"work_days" jsonb DEFAULT '[1,2,3,4,5]'::jsonb,
	"work_hour_start" integer DEFAULT 9 NOT NULL,
	"work_hour_end" integer DEFAULT 17 NOT NULL,
	"high_energy_start" integer DEFAULT 9,
	"high_energy_end" integer DEFAULT 12,
	"medium_energy_start" integer DEFAULT 13,
	"medium_energy_end" integer DEFAULT 15,
	"low_energy_start" integer DEFAULT 15,
	"low_energy_end" integer DEFAULT 17,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auto_schedule_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "oauth_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_events" ADD COLUMN "outlook_event_id" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "is_auto_scheduled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "schedule_locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "schedule_score" integer;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "last_scheduled" timestamp;--> statement-breakpoint
ALTER TABLE "auto_schedule_settings" ADD CONSTRAINT "auto_schedule_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;