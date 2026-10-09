-- =========================================================
-- 0006_task_assignee_integrity.sql
-- A task can only be assigned to a member of its workspace.
-- =========================================================

create function public.check_task_assignee()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.assignee_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.boards b
    join public.workspace_members m on m.workspace_id = b.workspace_id
    where b.id = new.board_id
      and m.user_id = new.assignee_id
  ) then
    raise exception 'Assignee is not a member of this workspace';
  end if;

  return new;
end;
$$;

create trigger tasks_check_assignee
  before insert or update of assignee_id, board_id on public.tasks
  for each row execute function public.check_task_assignee();
