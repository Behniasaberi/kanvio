-- =========================================================
-- 0004_create_board.sql
-- Create a board + its default columns in ONE transaction.
-- Runs as the calling user (security invoker), so RLS applies.
-- =========================================================

create function public.create_board(p_workspace_id uuid, p_name text)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  new_board_id uuid;
begin
  insert into public.boards (workspace_id, name)
  values (p_workspace_id, p_name)
  returning id into new_board_id;

  insert into public.board_columns (board_id, name, position)
  values
    (new_board_id, 'Todo',        1000),
    (new_board_id, 'In Progress', 2000),
    (new_board_id, 'Done',        3000);

  return new_board_id;
end;
$$;

revoke execute on function public.create_board(uuid, text) from public, anon;
grant  execute on function public.create_board(uuid, text) to authenticated;
