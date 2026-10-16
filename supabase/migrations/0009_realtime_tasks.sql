-- =========================================================
-- 0009_realtime_tasks.sql
-- Broadcast changes on `tasks` over Supabase Realtime.
-- RLS still applies: each subscriber only receives rows
-- they are allowed to SELECT (members of the board).
-- =========================================================

alter publication supabase_realtime add table public.tasks;
