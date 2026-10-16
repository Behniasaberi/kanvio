"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { BoardColumn as BoardColumnType } from "@/entities/board";
import { TaskComposer } from "@/features/create-task";
import { SortableTaskCard } from "@/features/move-task";
import { cn } from "@/shared/lib/cn";

type BoardColumnProps = {
  column: BoardColumnType;
  memberNames: Map<string, string>;
  onOpenTask: (taskId: string) => void;
  isComposerOpen: boolean;
  onComposerOpenChange: (isOpen: boolean) => void;
  onCreateTask: (columnId: string, title: string) => void;
  pendingIds: Set<string>;
};

export function BoardColumn({
  column,
  memberNames,
  onOpenTask,
  isComposerOpen,
  onComposerOpenChange,
  onCreateTask,
  pendingIds,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  return (
    <section
      aria-label={column.name}
      className={cn(
        "flex max-h-full w-72 shrink-0 flex-col gap-2 rounded-lg bg-surface/40 p-2 transition-colors duration-150",
        isOver && "bg-surface-hover/60",
      )}
    >
      <header className="flex items-center gap-2 px-1 py-1">
        <h2 className="text-sm font-medium">{column.name}</h2>
        <span className="text-xs text-fg-subtle">{column.tasks.length}</span>
      </header>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex min-h-10 flex-col gap-2 overflow-y-auto"
        >
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              assigneeName={
                task.assigneeId ? memberNames.get(task.assigneeId) : undefined
              }
              isPending={pendingIds.has(task.id)}
              onOpen={onOpenTask}
            />
          ))}
        </div>
      </SortableContext>

      <TaskComposer
        isOpen={isComposerOpen}
        onOpenChange={onComposerOpenChange}
        onCreate={(title) => onCreateTask(column.id, title)}
      />
    </section>
  );
}
