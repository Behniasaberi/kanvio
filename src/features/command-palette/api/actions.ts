"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";

export type TaskSearchResult = {
  id: string;
  title: string;
  boardId: string;
};

/** Escape LIKE wildcards so "50%" searches for the text "50%". */
function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function searchTasks(
  workspaceId: string,
  query: string,
): Promise<TaskSearchResult[]> {
  const q = query.trim();
  if (!isUuid(workspaceId) || q.length < 2 || q.length > 100) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, board_id, boards!inner(workspace_id)")
    .eq("boards.workspace_id", workspaceId)
    .ilike("title", `%${escapeLike(q)}%`)
    .order("updated_at", { ascending: false })
    .limit(8);

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    boardId: row.board_id,
  }));
}
