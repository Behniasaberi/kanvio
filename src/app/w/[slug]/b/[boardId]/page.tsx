import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getWorkspaceBySlug } from "@/entities/workspace/server";
import { getBoardWithColumns } from "@/entities/board/server";
import { BoardView } from "@/widgets/board-view";
import { isUuid } from "@/shared/lib/is-uuid";

export default function BoardPage({
  params,
}: PageProps<"/w/[slug]/b/[boardId]">) {
  return (
    <div className="h-screen">
      <Suspense fallback={<BoardSkeleton />}>
        {params.then(({ slug, boardId }) => (
          <Board slug={slug} boardId={boardId} />
        ))}
      </Suspense>
    </div>
  );
}

async function Board({ slug, boardId }: { slug: string; boardId: string }) {
  if (!isUuid(boardId)) notFound();

  const [workspace, board] = await Promise.all([
    getWorkspaceBySlug(slug),
    getBoardWithColumns(boardId),
  ]);

  // Board must exist AND belong to the workspace in the URL.
  if (!workspace || !board || board.workspaceId !== workspace.id) {
    notFound();
  }

  return <BoardView board={board} />;
}

function BoardSkeleton() {
  return (
    <div className="flex gap-3 p-4 pt-16" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-64 w-72 animate-pulse rounded-lg bg-surface/40" />
      ))}
    </div>
  );
}
