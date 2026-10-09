"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard, type Task } from "@/entities/task";
import { cn } from "@/shared/lib/cn";

type SortableTaskCardProps = {
  task: Task;
  assigneeName?: string;
  onOpen: (taskId: string) => void;
};

export function SortableTaskCard({
  task,
  assigneeName,
  onOpen,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task" } });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        "cursor-grab touch-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
      {...attributes}
      {...listeners}
      aria-label={`${task.title}. Press Enter to open, Space to move.`}
      onClick={() => onOpen(task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onOpen(task.id);
          return;
        }
        listeners?.onKeyDown?.(event);
      }}
    >
      <TaskCard task={task} assigneeName={assigneeName} />
    </div>
  );
}
