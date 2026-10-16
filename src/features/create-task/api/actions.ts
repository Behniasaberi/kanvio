"use server";

import { getCurrentUser } from "@/entities/user/server";
import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";

type NewTask = {
  id: string; // generated in the browser, so the card can appear instantly
  title: string;
  position: number;
};

export async function createTask(
  boardId: string,
  columnId: string,
  task: NewTask,
): Promise<{ error: string | null }> {
  const title = task.title.trim();

  if (!isUuid(boardId) || !isUuid(columnId) || !isUuid(task.id)) {
    return { error: "Invalid task." };
  }
  if (title.length < 1 || title.length > 200) {
    return { error: "Title must be between 1 and 200 characters." };
  }
  if (!Number.isFinite(task.position)) {
    return { error: "Invalid position." };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert({
    id: task.id,
    board_id: boardId,
    column_id: columnId,
    title,
    position: task.position,
    created_by: user.id,
  });

  return { error: error ? "Could not create task." : null };
}
