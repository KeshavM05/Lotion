CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."embedding_source" AS ENUM('journal', 'chat', 'goal', 'task', 'memory');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "context_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source" "embedding_source" NOT NULL,
	"source_id" text,
	"content" text NOT NULL,
	"embedding" vector(1024) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "context_embeddings" ADD CONSTRAINT "context_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "context_embeddings_user_idx" ON "context_embeddings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "context_embeddings_source_idx" ON "context_embeddings" USING btree ("user_id","source");--> statement-breakpoint
CREATE INDEX "context_embeddings_vector_idx" ON "context_embeddings" USING hnsw ("embedding" vector_cosine_ops);
