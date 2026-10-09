"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/user/server";
import { createClient } from "@/shared/lib/supabase/server";
import { randomSuffix, slugify } from "../lib/slugify";

export type CreateWorkspaceState = {
  error: string | null;
  name?: string;
};

const UNIQUE_VIOLATION = "23505";
const MAX_ATTEMPTS = 3;

export async function createWorkspace(
  _prevState: CreateWorkspaceState,
  formData: FormData,
): Promise<CreateWorkspaceState> {
  const value = formData.get("name");
  const name = typeof value === "string" ? value.trim() : "";

  if (name.length < 1 || name.length > 50) {
    return { error: "Name must be between 1 and 50 characters.", name };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();

  const base = slugify(name) || "workspace";
  let slug = base;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const { error } = await supabase
      .from("workspaces")
      .insert({ name, slug, owner_id: user.id });

    if (!error) {
      redirect(`/w/${slug}`);
    }
    if (error.code !== UNIQUE_VIOLATION) {
      return { error: "Could not create workspace. Try again.", name };
    }

    // Slug is taken: try "acme-x7k2" instead.
    slug = `${base}-${randomSuffix()}`;
  }

  return { error: "Could not find a free URL. Try another name.", name };
}
