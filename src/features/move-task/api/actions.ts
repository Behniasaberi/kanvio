"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";

export async function moveTask(
  taskId: string,
  columnId: string,
  position: number,
): Promise<{ error: string | null }> {
  if (!isUuid(taskId) || !isUuid(columnId) || !Number.isFinite(position)) {
    return { error: "Invalid move." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ column_id: columnId, position })
    .eq("id", taskId)
    .select("id")
    .single();

  // .single() also errors when RLS hid the row (0 rows updated).
  if (error) {
    return { error: "Could not move task." };
  }
  return { error: null };
}
