import type { Priority, Task } from "../model/types";

export type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  position: number;
  column_id: string;
  assignee_id: string | null;
};

/** Database row (snake_case) → app type (camelCase). */
export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    position: row.position,
    columnId: row.column_id,
    assigneeId: row.assignee_id,
  };
}
