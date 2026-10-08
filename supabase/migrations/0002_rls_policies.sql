-- =========================================================
-- 0002_rls_policies.sql
-- Who can read / write what. Rule of thumb:
-- you only see data of workspaces you are a member of.
-- =========================================================

-- ---------- helper functions ----------
create function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
  );
$$;

create function public.is_workspace_admin(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
      and user_id = (select auth.uid())
      and role in ('owner', 'admin')
  );
$$;

create function public.is_board_member(b_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.boards b
    join public.workspace_members m on m.workspace_id = b.workspace_id
    where b.id = b_id
      and m.user_id = (select auth.uid())
  );
$$;

create function public.shares_workspace_with(other_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members me
    join public.workspace_members them on them.workspace_id = me.workspace_id
    where me.user_id = (select auth.uid())
      and them.user_id = other_user
  );
$$;

-- ---------- owner becomes a member automatically ----------
create function public.handle_new_workspace()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger on_workspace_created
  after insert on public.workspaces
  for each row execute function public.handle_new_workspace();

-- ---------- profiles ----------
create policy "profiles: view self and teammates"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or public.shares_workspace_with(id));

create policy "profiles: update self"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------- workspaces ----------
create policy "workspaces: members can view"
  on public.workspaces for select
  to authenticated
  using (owner_id = (select auth.uid()) or public.is_workspace_member(id));

create policy "workspaces: users create their own"
  on public.workspaces for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "workspaces: admins can update"
  on public.workspaces for update
  to authenticated
  using (public.is_workspace_admin(id))
  with check (public.is_workspace_admin(id));

create policy "workspaces: owner can delete"
  on public.workspaces for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- ---------- workspace_members ----------
create policy "members: members can view"
  on public.workspace_members for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "members: admins can add"
  on public.workspace_members for insert
  to authenticated
  with check (public.is_workspace_admin(workspace_id));

create policy "members: admins can change roles"
  on public.workspace_members for update
  to authenticated
  using (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

create policy "members: admins remove, anyone can leave"
  on public.workspace_members for delete
  to authenticated
  using (
    public.is_workspace_admin(workspace_id)
    or user_id = (select auth.uid())
  );

-- ---------- boards ----------
create policy "boards: members can view"
  on public.boards for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

create policy "boards: members can create"
  on public.boards for insert
  to authenticated
  with check (public.is_workspace_member(workspace_id));

create policy "boards: members can update"
  on public.boards for update
  to authenticated
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "boards: admins can delete"
  on public.boards for delete
  to authenticated
  using (public.is_workspace_admin(workspace_id));

-- ---------- board_columns ----------
create policy "columns: board members full access"
  on public.board_columns for all
  to authenticated
  using (public.is_board_member(board_id))
  with check (public.is_board_member(board_id));

-- ---------- tasks ----------
create policy "tasks: members can view"
  on public.tasks for select
  to authenticated
  using (public.is_board_member(board_id));

create policy "tasks: members can create"
  on public.tasks for insert
  to authenticated
  with check (
    public.is_board_member(board_id)
    and created_by = (select auth.uid())
  );

create policy "tasks: members can update"
  on public.tasks for update
  to authenticated
  using (public.is_board_member(board_id))
  with check (public.is_board_member(board_id));

create policy "tasks: members can delete"
  on public.tasks for delete
  to authenticated
  using (public.is_board_member(board_id));
