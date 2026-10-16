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
      <KanbanBoard
        boardId={board.id}
        boardName={board.name}
        initialColumns={board.columns}
        members={members}
      />
    </div>
  );
}
