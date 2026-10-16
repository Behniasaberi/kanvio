import { Suspense } from "react";
import { getBoards } from "@/entities/board/server";
import {
  getMyWorkspaces,
  getWorkspaceBySlug,
} from "@/entities/workspace/server";
import { CommandPalette } from "@/features/command-palette";
import { GlobalShortcuts } from "@/features/keyboard-shortcuts";
import {
  WorkspaceSidebar,
  WorkspaceSidebarSkeleton,
} from "@/widgets/workspace-sidebar";

export default function WorkspaceLayout({
  children,
  params,
}: LayoutProps<"/w/[slug]">) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-border bg-surface">
        <Suspense fallback={<WorkspaceSidebarSkeleton />}>
          {params.then(({ slug }) => (
            <WorkspaceSidebar slug={slug} />
          ))}
        </Suspense>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>

      <GlobalShortcuts />

      <Suspense fallback={null}>
        {params.then(({ slug }) => (
          <WorkspaceCommandPalette slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

// Same queries as the sidebar: React cache() makes them one DB call each.
async function WorkspaceCommandPalette({ slug }: { slug: string }) {
  const [workspaces, workspace] = await Promise.all([
    getMyWorkspaces(),
    getWorkspaceBySlug(slug),
  ]);
  if (!workspace) return null;

  const boards = await getBoards(workspace.id);

  return (
    <CommandPalette
      workspace={workspace}
      workspaces={workspaces}
      boards={boards}
    />
  );
}
