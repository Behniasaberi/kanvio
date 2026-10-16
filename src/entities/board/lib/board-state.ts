import type { Task } from "@/entities/task";
import type { BoardColumn } from "../model/types";

/**
 * Insert or update a task, placing it in the right column at the right
 * position. Pure: returns new arrays, never mutates the input.
 */
export function upsertTask(columns: BoardColumn[], task: Task): BoardColumn[] {
  return columns.map((column) => {
    const others = column.tasks.filter((t) => t.id !== task.id);
    if (column.id !== task.columnId) {
      return others.length === column.tasks.length
        ? column
        : { ...column, tasks: others };
    }
    const tasks = [...others, task].sort((a, b) => a.position - b.position);
    return { ...column, tasks };
  });
}

/** Remove a task from whichever column holds it. */
export function removeTask(columns: BoardColumn[], taskId: string): BoardColumn[] {
  return columns.map((column) =>
    column.tasks.some((t) => t.id === taskId)
      ? { ...column, tasks: column.tasks.filter((t) => t.id !== taskId) }
      : column,
  );
}
