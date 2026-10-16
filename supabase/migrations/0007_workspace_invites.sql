-- =========================================================
-- 0007_workspace_invites.sql
-- Invite links: an admin creates a link, anyone with the link
-- (and an account) can join the workspace as a member.
-- =========================================================

create table public.workspace_invites (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  token         uuid not null unique default gen_random_uuid(),
  created_by    uuid not null references public.profiles (id) on delete cascade,
  expires_at    timestamptz not null default now() + interval '7 days',
  created_at    timestamptz not null default now()
);

create index on public.workspace_invites (workspace_id);

alter table public.workspace_invites enable row level security;

create policy "invites: admins can view"
  on public.workspace_invites for select
  to authenticated
  using (public.is_workspace_admin(workspace_id));

create policy "invites: admins can create"
  on public.workspace_invites for insert
  to authenticated
  with check (
    public.is_workspace_admin(workspace_id)
    and created_by = (select auth.uid())
  );

create policy "invites: admins can revoke"
  on public.workspace_invites for delete
  to authenticated
  using (public.is_workspace_admin(workspace_id));

grant select, insert, delete on public.workspace_invites to authenticated;

-- ---------- preview: who invited me? (before joining) ----------
-- The visitor is not a member yet, so RLS would hide everything.
-- This function reveals only the workspace name for a valid token.
create function public.get_invite(p_token uuid)
returns table (workspace_name text, is_expired boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select w.name, i.expires_at < now()
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.token = p_token;
$$;

-- ---------- accept: join the workspace ----------
create function public.accept_invite(p_token uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user         uuid := auth.uid();
  v_workspace_id uuid;
  v_slug         text;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  select i.workspace_id, w.slug
    into v_workspace_id, v_slug
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.token = p_token
    and i.expires_at > now();

  if v_workspace_id is null then
    raise exception 'Invite is invalid or expired';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, v_user, 'member')
  on conflict (workspace_id, user_id) do nothing;

  return v_slug;
end;
$$;

revoke execute on function public.get_invite(uuid)    from public, anon;
revoke execute on function public.accept_invite(uuid) from public, anon;
grant  execute on function public.get_invite(uuid)    to authenticated;
grant  execute on function public.accept_invite(uuid) to authenticated;
