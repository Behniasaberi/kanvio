import type { BoardWithColumns } from "@/entities/board";
import { BoardColumn } from "./board-column";

export function BoardView({ board }: { board: BoardWithColumns }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center border-b border-border px-6">
        <h1 className="text-sm font-medium">{board.name}</h1>
      </header>

      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-4">
        {board.columns.map((column) => (
          <BoardColumn key={column.id} boardId={board.id} column={column} />
        ))}
      </div>
    </div>
  );
}
