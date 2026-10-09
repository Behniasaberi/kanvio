"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export type CreateBoardState = { error: string | null };

export async function createBoard(
  workspaceId: string,
  workspaceSlug: string,
  _prevState: CreateBoardState,
  formData: FormData,
): Promise<CreateBoardState> {
  const value = formData.get("name");
  const name = typeof value === "string" ? value.trim() : "";

  if (name.length < 1 || name.length > 80) {
    return { error: "Name must be between 1 and 80 characters." };
  }

  const supabase = await createClient();
  const { data: boardId, error } = await supabase.rpc("create_board", {
    p_workspace_id: workspaceId,
    p_name: name,
  });

  if (error || !boardId) {
    return { error: "Could not create board. Try again." };
  }

  // The sidebar lists boards, so refresh the whole workspace layout.
  revalidatePath(`/w/${workspaceSlug}`, "layout");
  redirect(`/w/${workspaceSlug}/b/${boardId}`);
}
