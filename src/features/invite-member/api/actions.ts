"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/user/server";
import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";

type Result = { error: string | null };

export async function createInvite(
  workspaceId: string,
  workspaceSlug: string,
): Promise<Result> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("workspace_invites")
    .insert({ workspace_id: workspaceId, created_by: user.id });

  if (error) return { error: "Only admins can create invite links." };

  revalidatePath(`/w/${workspaceSlug}/members`);
  return { error: null };
}

export async function revokeInvite(
  inviteId: string,
  workspaceSlug: string,
): Promise<Result> {
  if (!isUuid(inviteId)) return { error: "Invalid invite." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .select("id")
    .single();

  if (error) return { error: "Could not revoke this link." };

  revalidatePath(`/w/${workspaceSlug}/members`);
  return { error: null };
}

export type AcceptInviteState = { error: string | null };

export async function acceptInvite(token: string): Promise<AcceptInviteState> {
  if (!isUuid(token)) return { error: "This invite link is not valid." };

  const supabase = await createClient();
  const { data: slug, error } = await supabase.rpc("accept_invite", {
    p_token: token,
  });

  if (error || !slug) {
    return { error: "This invite link is invalid or has expired." };
  }

  redirect(`/w/${slug}`);
}
