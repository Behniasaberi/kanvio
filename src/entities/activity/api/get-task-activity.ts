"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";
import type { TaskActivity } from "../model/types";

export async function getTaskActivity(taskId: string): Promise<TaskActivity[]> {
  if (!isUuid(taskId)) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_activity")
    .select(
      "id, action, field, old_value, new_value, created_at, profiles(full_name)",
    )
    .eq("task_id", taskId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];

  return (data ?? []).map((row) => {
    const actor = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      action: row.action,
      field: row.field,
      oldValue: row.old_value,
      newValue: row.new_value,
      actorName: actor?.full_name ?? "Someone",
      createdAt: row.created_at,
    };
  });
}
