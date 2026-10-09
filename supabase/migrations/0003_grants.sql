-- =========================================================
-- 0003_grants.sql
-- Table-level permissions for logged-in users.
-- New Supabase projects don't expose new tables to the API
-- automatically, so we grant access explicitly.
-- RLS policies (0002) still decide WHICH rows they can touch.
-- =========================================================

grant usage on schema public to authenticated;

grant select, update                 on public.profiles          to authenticated;
grant select, insert, update, delete on public.workspaces        to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.boards            to authenticated;
grant select, insert, update, delete on public.board_columns     to authenticated;
grant select, insert, update, delete on public.tasks             to authenticated;

-- Policies call these helpers, so the role must be allowed to run them.
grant execute on function public.is_workspace_member(uuid)   to authenticated;
grant execute on function public.is_workspace_admin(uuid)    to authenticated;
grant execute on function public.is_board_member(uuid)       to authenticated;
grant execute on function public.shares_workspace_with(uuid) to authenticated;
