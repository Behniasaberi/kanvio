import type { BoardWithColumns } from "@/entities/board";
import type { WorkspaceMember } from "@/entities/workspace";
import { KanbanBoard } from "./kanban-board";

type BoardViewProps = {
  board: BoardWithColumns;
  members: WorkspaceMember[];
};

export function BoardView({ board, members }: BoardViewProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center border-b border-border px-6">
        <h1 className="text-sm font-medium">{board.name}</h1>
      </header>

      <KanbanBoard
        boardId={board.id}
        initialColumns={board.columns}
        members={members}
      />
    </div>
  );
}
