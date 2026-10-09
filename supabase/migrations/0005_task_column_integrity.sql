-- =========================================================
-- 0005_task_column_integrity.sql
-- A task's column must belong to the same board as the task.
-- Stops a request from moving a task into another board's column.
-- =========================================================

create function public.check_task_column()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.board_columns
    where id = new.column_id
      and board_id = new.board_id
  ) then
    raise exception 'Column % does not belong to board %', new.column_id, new.board_id;
  end if;
  return new;
end;
$$;

create trigger tasks_check_column
  before insert or update of column_id, board_id on public.tasks
  for each row execute function public.check_task_column();
