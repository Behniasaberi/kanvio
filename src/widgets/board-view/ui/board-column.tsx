import { TaskCard } from "@/entities/task";
import type { BoardColumn as BoardColumnType } from "@/entities/board";
import { TaskComposer } from "@/features/create-task";

type BoardColumnProps = {
  boardId: string;
  column: BoardColumnType;
};

export function BoardColumn({ boardId, column }: BoardColumnProps) {
  return (
    <section
      aria-label={column.name}
      className="flex max-h-full w-72 shrink-0 flex-col gap-2 rounded-lg bg-surface/40 p-2"
    >
      <header className="flex items-center gap-2 px-1 py-1">
        <h2 className="text-sm font-medium">{column.name}</h2>
        <span className="text-xs text-fg-subtle">{column.tasks.length}</span>
      </header>

      <div className="flex min-h-0 flex-col gap-2 overflow-y-auto">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <TaskComposer boardId={boardId} columnId={column.id} />
    </section>
  );
}
