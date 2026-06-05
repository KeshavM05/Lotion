-- Add archiving support to task_lists
ALTER TABLE task_lists ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE task_lists ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_task_lists_archived ON task_lists(user_id, archived);
