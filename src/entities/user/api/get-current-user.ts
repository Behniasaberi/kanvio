import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import type { CurrentUser } from "../model/types";

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  return {
    id: claims.sub,
    email: claims.email ?? "",
    fullName: claims.user_metadata?.full_name ?? null,
  };
}
