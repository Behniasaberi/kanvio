import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LayoutGrid, SquareKanban } from "lucide-react";
import { getWorkspaceBySlug } from "@/entities/workspace/server";
import { getBoards } from "@/entities/board/server";
import { CreateBoardForm } from "@/features/create-board";

export default function WorkspacePage({ params }: PageProps<"/w/[slug]">) {
  return (
    <div className="p-8">
      <Suspense
        fallback={<div className="h-7 w-48 animate-pulse rounded-md bg-surface" />}
      >
        {params.then(({ slug }) => (
          <WorkspaceHome slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function WorkspaceHome({ slug }: { slug: string }) {
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) notFound();

  const boards = await getBoards(workspace.id);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{workspace.name}</h1>
          <p className="text-sm text-fg-muted">
            {boards.length} {boards.length === 1 ? "board" : "boards"}
          </p>
        </div>
        <CreateBoardForm workspaceId={workspace.id} workspaceSlug={workspace.slug} />
      </header>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <LayoutGrid className="size-6 text-fg-subtle" />
          <p className="font-medium">No boards yet</p>
          <p className="text-sm text-fg-muted">
            Create your first board to start tracking work.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <li key={board.id}>
              <Link
                href={`/w/${workspace.slug}/b/${board.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong hover:bg-surface-hover"
              >
                <SquareKanban className="size-5 text-accent-text" />
                <span className="truncate font-medium">{board.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
