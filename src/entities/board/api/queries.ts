import "server-only";
import { cache } from "react";
import { createClient } from "@/shared/lib/supabase/server";
import type { Task } from "@/entities/task";
import type { Board, BoardWithColumns } from "../model/types";

export const getBoards = cache(async (workspaceId: string): Promise<Board[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("id, name, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    workspaceId: row.workspace_id,
  }));
});

export const getBoardWithColumns = cache(
  async (boardId: string): Promise<BoardWithColumns | null> => {
    const supabase = await createClient();

    const [boardRes, columnsRes, tasksRes] = await Promise.all([
      supabase
        .from("boards")
        .select("id, name, workspace_id")
        .eq("id", boardId)
        .maybeSingle(),
      supabase
        .from("board_columns")
        .select("id, name, position")
        .eq("board_id", boardId)
        .order("position", { ascending: true }),
      supabase
        .from("tasks")
        .select("id, title, description, priority, position, column_id, assignee_id")
        .eq("board_id", boardId)
        .order("position", { ascending: true }),
    ]);

    if (boardRes.error) throw new Error(boardRes.error.message);
    if (columnsRes.error) throw new Error(columnsRes.error.message);
    if (tasksRes.error) throw new Error(tasksRes.error.message);
    if (!boardRes.data) return null;

    const tasks: Task[] = (tasksRes.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      position: row.position,
      columnId: row.column_id,
      assigneeId: row.assignee_id,
    }));

    return {
      id: boardRes.data.id,
      name: boardRes.data.name,
      workspaceId: boardRes.data.workspace_id,
      columns: (columnsRes.data ?? []).map((column) => ({
        id: column.id,
        name: column.name,
        position: column.position,
        tasks: tasks.filter((task) => task.columnId === column.id),
      })),
    };
  },
);
