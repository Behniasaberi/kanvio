"use server";

import { PRIORITIES, type Priority } from "@/entities/task";
import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";

export type TaskPatch = {
  title?: string;
  description?: string | null;
  priority?: Priority;
  assigneeId?: string | null;
};

type Result = { error: string | null };

export async function updateTask(
  taskId: string,
  patch: TaskPatch,
): Promise<Result> {
  if (!isUuid(taskId)) return { error: "Invalid task." };

  const row: Record<string, string | null> = {};

  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (title.length < 1 || title.length > 200) {
      return { error: "Title must be between 1 and 200 characters." };
    }
    row.title = title;
  }
  if (patch.description !== undefined) {
    const description = patch.description?.trim() ?? "";
    if (description.length > 5000) {
      return { error: "Description is too long." };
    }
    row.description = description || null;
  }
  if (patch.priority !== undefined) {
    if (!PRIORITIES.includes(patch.priority)) {
      return { error: "Invalid priority." };
    }
    row.priority = patch.priority;
  }
  if (patch.assigneeId !== undefined) {
    if (patch.assigneeId !== null && !isUuid(patch.assigneeId)) {
      return { error: "Invalid assignee." };
    }
    row.assignee_id = patch.assigneeId;
  }

  if (Object.keys(row).length === 0) return { error: null };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update(row)
    .eq("id", taskId)
    .select("id")
    .single();

  return { error: error ? "Could not save changes." : null };
}

export async function deleteTask(taskId: string): Promise<Result> {
  if (!isUuid(taskId)) return { error: "Invalid task." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .select("id")
    .single();

  return { error: error ? "Could not delete task." : null };
}
