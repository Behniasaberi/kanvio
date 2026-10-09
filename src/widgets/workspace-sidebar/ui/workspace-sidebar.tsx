import { notFound } from "next/navigation";
import { LayoutGrid, SquareKanban } from "lucide-react";
import { getCurrentUser } from "@/entities/user/server";
import {
  getMyWorkspaces,
  getWorkspaceBySlug,
} from "@/entities/workspace/server";
import { getBoards } from "@/entities/board/server";
import { SignOutButton } from "@/features/auth";
import { WorkspaceSwitcher } from "@/features/switch-workspace";
import { SidebarNavLink } from "./sidebar-nav-link";

export async function WorkspaceSidebar({ slug }: { slug: string }) {
  const [user, workspaces, current] = await Promise.all([
    getCurrentUser(),
    getMyWorkspaces(),
    getWorkspaceBySlug(slug),
  ]);

  if (!current) notFound();

  const boards = await getBoards(current.id);

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <WorkspaceSwitcher current={current} workspaces={workspaces} />

      <nav className="flex flex-col gap-0.5">
        <SidebarNavLink
          href={`/w/${current.slug}`}
          icon={<LayoutGrid className="size-4" />}
        >
          All boards
        </SidebarNavLink>
      </nav>

      {boards.length > 0 && (
        <nav aria-label="Boards" className="flex flex-col gap-0.5">
          <p className="px-2 pb-1 text-xs font-medium text-fg-subtle">Boards</p>
          {boards.map((board) => (
            <SidebarNavLink
              key={board.id}
              href={`/w/${current.slug}/b/${board.id}`}
              icon={<SquareKanban className="size-4" />}
            >
              <span className="truncate">{board.name}</span>
            </SidebarNavLink>
          ))}
        </nav>
      )}

      <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-fg">
            {user.fullName ?? user.email}
          </p>
          <p className="truncate text-xs text-fg-subtle">{user.email}</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}

export function WorkspaceSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-3" aria-hidden>
      <div className="h-8 animate-pulse rounded-md bg-surface-hover" />
      <div className="h-7 w-2/3 animate-pulse rounded-md bg-surface-hover" />
    </div>
  );
}
