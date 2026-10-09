"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskCard, type Task } from "@/entities/task";
import type { BoardColumn as BoardColumnType } from "@/entities/board";
import type { WorkspaceMember } from "@/entities/workspace";
import { TaskDetailsSheet } from "@/features/edit-task";
import { moveTask, positionBetween } from "@/features/move-task";
import { BoardColumn } from "./board-column";

type KanbanBoardProps = {
  boardId: string;
  initialColumns: BoardColumnType[];
  members: WorkspaceMember[];
};

export function KanbanBoard({
  boardId,
  initialColumns,
  members,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [snapshot, setSnapshot] = useState<BoardColumnType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // When the server sends fresh data (e.g. a new task), use it.
  const [prevInitial, setPrevInitial] = useState(initialColumns);
  if (initialColumns !== prevInitial) {
    setPrevInitial(initialColumns);
    setColumns(initialColumns);
  }

  const sensors = useSensors(
    // 5px of movement before a drag starts, so normal clicks still work.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // Space moves a card, Enter is kept for opening it.
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  );

  const memberNames = useMemo(
    () => new Map(members.map((member) => [member.id, member.name])),
    [members],
  );

  const openTask =
    columns.flatMap((column) => column.tasks).find((t) => t.id === openTaskId) ??
    null;
  const openTaskColumn = columns.find((c) => c.id === openTask?.columnId);

  function replaceTask(updated: Task) {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.map((t) => (t.id === updated.id ? updated : t)),
      })),
    );
  }

  function removeTask(taskId: string) {
    setOpenTaskId(null);
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.filter((t) => t.id !== taskId),
      })),
    );
  }

  function findColumnId(id: string): string | undefined {
    if (columns.some((column) => column.id === id)) return id;
    return columns.find((column) =>
      column.tasks.some((task) => task.id === id),
    )?.id;
  }

  function handleDragStart(event: DragStartEvent) {
    const task = columns
      .flatMap((column) => column.tasks)
      .find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
    setSnapshot(columns);
    setError(null);
  }

  // Moving across columns: move the card into the new column live.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const fromId = findColumnId(String(active.id));
    const toId = findColumnId(String(over.id));
    if (!fromId || !toId || fromId === toId) return;

    setColumns((prev) => {
      const from = prev.find((c) => c.id === fromId)!;
      const to = prev.find((c) => c.id === toId)!;
      const task = from.tasks.find((t) => t.id === active.id)!;

      const overIndex = to.tasks.findIndex((t) => t.id === over.id);
      const insertAt = overIndex === -1 ? to.tasks.length : overIndex;

      return prev.map((column) => {
        if (column.id === fromId) {
          return { ...column, tasks: column.tasks.filter((t) => t.id !== task.id) };
        }
        if (column.id === toId) {
          const tasks = [...column.tasks];
          tasks.splice(insertAt, 0, { ...task, columnId: toId });
          return { ...column, tasks };
        }
        return column;
      });
    });
  }

  // Drop: final order inside the column, new position, save to the server.
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over || !snapshot) {
      if (snapshot) setColumns(snapshot);
      return;
    }

    const taskId = String(active.id);
    const columnId = findColumnId(taskId);
    if (!columnId) return;

    const column = columns.find((c) => c.id === columnId)!;
    const oldIndex = column.tasks.findIndex((t) => t.id === taskId);
    const overIndex = column.tasks.findIndex((t) => t.id === over.id);
    const newIndex = overIndex === -1 ? oldIndex : overIndex;

    const original = snapshot
      .flatMap((c) => c.tasks)
      .find((t) => t.id === taskId);
    const changedColumn = original?.columnId !== columnId;
    if (!changedColumn && oldIndex === newIndex) return; // dropped in place

    // Only the moved task gets a new position, between its new neighbours.
    const ordered = arrayMove(column.tasks, oldIndex, newIndex);
    const position = positionBetween(
      ordered[newIndex - 1]?.position,
      ordered[newIndex + 1]?.position,
    );
    ordered[newIndex] = { ...ordered[newIndex], position, columnId };

    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, tasks: ordered } : c)),
    );

    const rollback = snapshot;
    startTransition(async () => {
      const result = await moveTask(taskId, columnId, position);
      if (result.error) {
        setColumns(rollback);
        setError("Couldn't move the task. Your change was undone.");
      }
    });
  }

  function handleDragCancel() {
    setActiveTask(null);
    if (snapshot) setColumns(snapshot);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {error && (
        <p
          role="alert"
          className="mx-4 mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <DndContext
        id={`board-${boardId}`}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-4">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              boardId={boardId}
              column={column}
              memberNames={memberNames}
              onOpenTask={setOpenTaskId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 cursor-grabbing shadow-xl shadow-black/50">
              <TaskCard
                task={activeTask}
                assigneeName={
                  activeTask.assigneeId
                    ? memberNames.get(activeTask.assigneeId)
                    : undefined
                }
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskDetailsSheet
        task={openTask}
        columnName={openTaskColumn?.name}
        members={members}
        onClose={() => setOpenTaskId(null)}
        onChange={replaceTask}
        onDelete={removeTask}
      />
    </div>
  );
}
