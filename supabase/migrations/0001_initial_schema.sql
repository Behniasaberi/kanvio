-- =========================================================
-- 0001_initial_schema.sql
-- Core tables for Task Board: profiles, workspaces, members,
-- boards, columns, tasks
-- =========================================================

-- ---------- profiles ----------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ---------- workspaces ----------
create table public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 50),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ---------- workspace_members ----------
create table public.workspace_members (
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  role          text not null default 'member'
                check (role in ('owner', 'admin', 'member')),
  joined_at     timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- ---------- boards ----------
create table public.boards (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 80),
  created_at    timestamptz not null default now()
);

-- ---------- board_columns ----------
create table public.board_columns (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid not null references public.boards (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  position    double precision not null,
  created_at  timestamptz not null default now()
);

-- ---------- tasks ----------
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  board_id     uuid not null references public.boards (id) on delete cascade,
  column_id    uuid not null references public.board_columns (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 200),
  description  text,
  priority     text not null default 'none'
               check (priority in ('none', 'low', 'medium', 'high', 'urgent')),
  position     double precision not null,
  assignee_id  uuid references public.profiles (id) on delete set null,
  created_by   uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- indexes ----------
create index on public.workspace_members (user_id);
create index on public.boards (workspace_id);
create index on public.board_columns (board_id, position);
create index on public.tasks (column_id, position);
create index on public.tasks (board_id);
create index on public.tasks (assignee_id);

-- ---------- updated_at trigger ----------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------- auto-create profile on signup ----------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
