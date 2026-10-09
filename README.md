# Kanvio

A Linear-inspired team task manager: workspaces, kanban boards and real-time collaboration.

> 🚧 Work in progress. Built in public, phase by phase.

## Tech stack

- **Next.js 16** (App Router, Server Actions, Cache Components) + **TypeScript**
- **Tailwind CSS v4** with a custom dark design system
- **Supabase**: Postgres, Auth, Row Level Security
- **Feature-Sliced Design** folder structure

## Roadmap

**Phase 1 (MVP)**
- [x] Email/password authentication
- [x] Database schema with Row Level Security
- [x] Dark design system (tokens + base components)
- [ ] Multi-workspace
- [ ] Kanban board with drag & drop

**Phase 2:** command palette (⌘K), optimistic UI, keyboard shortcuts, activity log
**Phase 3:** real-time sync, multiple views (board / list / calendar), tests
**Phase 4:** offline-first, AI task assistant, analytics, presence indicators

## Getting started

1. Clone and install:
   ```bash
   pnpm install
   ```
2. Create a Supabase project and add `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
3. Run the SQL files in `supabase/migrations/` in order, in the Supabase SQL Editor.
4. Start the dev server:
   ```bash
   pnpm dev
   ```

## Project structure

```
src/
├── app/        # routes only
├── features/   # user actions (auth, ...)
├── entities/   # business entities (user, ...)
└── shared/     # ui kit, config, supabase clients
```
