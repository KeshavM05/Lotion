-- Migration: add indexes for frequently queried columns
-- Issue #48: DB connection pooling and indexes

-- tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks (goal_id);

-- goals indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals (user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals (status);

-- journal_entries indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries (created_at);

-- calendar_events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events (user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events (start);

-- chat_messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_goal_id ON chat_messages (goal_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages (user_id);
