"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
  message?: string;
  fields?: { email: string; fullName?: string };
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readText(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", fields: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password.", fields: { email } };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = readText(formData, "fullName");
  const email = readText(formData, "email");
  const password = String(formData.get("password") ?? "");
  const fields = { email, fullName };

  if (!fullName || !email || !password) {
    return { error: "All fields are required.", fields };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", fields };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: error.message, fields };
  }

  // Email confirmation is on: no session until the user clicks the link.
  if (!data.session) {
    return {
      error: null,
      message: "Check your email to confirm your account.",
      fields,
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
