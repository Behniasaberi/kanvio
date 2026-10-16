import "server-only";
import { createClient } from "@/shared/lib/supabase/server";
import { isUuid } from "@/shared/lib/is-uuid";
import type { Invite, InvitePreview } from "../model/types";

// RLS returns rows only to admins of the workspace.
export async function getWorkspaceInvites(workspaceId: string): Promise<Invite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("id, token, expires_at")
    .eq("workspace_id", workspaceId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const now = Date.now();
  return (data ?? []).map((row) => ({
    id: row.id,
    token: row.token,
    expiresAt: row.expires_at,
    // Computed on the server so server and browser render the same text.
    daysLeft: Math.max(
      1,
      Math.ceil((new Date(row.expires_at).getTime() - now) / 86_400_000),
    ),
  }));
}

export async function getInvitePreview(
  token: string,
): Promise<InvitePreview | null> {
  if (!isUuid(token)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_invite", { p_token: token });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  return { workspaceName: row.workspace_name, isExpired: row.is_expired };
}
