"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/entities/user/server";
import { createClient } from "@/shared/lib/supabase/server";

export type CreateTaskState = { error: string | null };

const POSITION_GAP = 1000;

export async function createTask(
  boardId: string,
  columnId: string,
  _prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const value = formData.get("title");
  const title = typeof value === "string" ? value.trim() : "";

  if (title.length < 1 || title.length > 200) {
    return { error: "Title must be between 1 and 200 characters." };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();

  // New tasks go to the bottom: last position + gap.
  const { data: last } = await supabase
    .from("tasks")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = (last?.position ?? 0) + POSITION_GAP;

  const { error } = await supabase.from("tasks").insert({
    board_id: boardId,
    column_id: columnId,
    title,
    position,
    created_by: user.id,
  });

  if (error) {
    return { error: "Could not create task. Try again." };
  }

  refresh();
  return { error: null };
}
