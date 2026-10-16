-- =========================================================
-- 0008_task_activity.sql
-- Activity log: every change to a task is recorded by a trigger,
-- so the history is complete no matter where the change came from.
-- =========================================================

create table public.task_activity (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references public.tasks (id) on delete cascade,
  board_id    uuid not null references public.boards (id) on delete cascade,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null check (action in ('created', 'moved', 'updated')),
  field       text,
  old_value   text,
  new_value   text,
  created_at  timestamptz not null default now()
);

create index on public.task_activity (task_id, created_at desc);

alter table public.task_activity enable row level security;

create policy "activity: board members can view"
  on public.task_activity for select
  to authenticated
  using (public.is_board_member(board_id));

-- Read-only for users: only the trigger below can write history.
grant select on public.task_activity to authenticated;

create function public.log_task_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := coalesce(auth.uid(), new.created_by);
begin
  if tg_op = 'INSERT' then
    insert into public.task_activity (task_id, board_id, actor_id, action)
    values (new.id, new.board_id, v_actor, 'created');
    return new;
  end if;

  if new.column_id is distinct from old.column_id then
    insert into public.task_activity
      (task_id, board_id, actor_id, action, field, old_value, new_value)
    values (
      new.id, new.board_id, v_actor, 'moved', 'column',
      (select name from public.board_columns where id = old.column_id),
      (select name from public.board_columns where id = new.column_id)
    );
  end if;

  if new.title is distinct from old.title then
    insert into public.task_activity
      (task_id, board_id, actor_id, action, field, old_value, new_value)
    values (new.id, new.board_id, v_actor, 'updated', 'title', old.title, new.title);
  end if;

  if new.priority is distinct from old.priority then
    insert into public.task_activity
      (task_id, board_id, actor_id, action, field, old_value, new_value)
    values (new.id, new.board_id, v_actor, 'updated', 'priority', old.priority, new.priority);
  end if;

  if new.assignee_id is distinct from old.assignee_id then
    insert into public.task_activity
      (task_id, board_id, actor_id, action, field, old_value, new_value)
    values (
      new.id, new.board_id, v_actor, 'updated', 'assignee',
      (select full_name from public.profiles where id = old.assignee_id),
      (select full_name from public.profiles where id = new.assignee_id)
    );
  end if;

  if new.description is distinct from old.description then
    insert into public.task_activity
      (task_id, board_id, actor_id, action, field)
    values (new.id, new.board_id, v_actor, 'updated', 'description');
  end if;

  -- Position-only changes (reordering in a column) are not logged.
  return new;
end;
$$;

create trigger tasks_log_activity
  after insert or update on public.tasks
  for each row execute function public.log_task_activity();
