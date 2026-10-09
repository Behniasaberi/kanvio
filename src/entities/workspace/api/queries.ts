import "server-only";
import { cache } from "react";
import { createClient } from "@/shared/lib/supabase/server";
import type { Workspace, WorkspaceMember } from "../model/types";

// RLS already limits rows to workspaces the user belongs to,
// so "select all" here means "select mine".
export const getMyWorkspaces = cache(async (): Promise<Workspace[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getWorkspaceBySlug = cache(
  async (slug: string): Promise<Workspace | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspaces")
      .select("id, name, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },
);

export const getWorkspaceMembers = cache(
  async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_members")
      .select("user_id, profiles(full_name)")
      .eq("workspace_id", workspaceId);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        id: row.user_id,
        name: profile?.full_name ?? "Unnamed",
      };
    });
  },
);
