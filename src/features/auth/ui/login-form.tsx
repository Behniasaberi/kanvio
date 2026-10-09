"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/shared/ui";
import { signIn, type AuthFormState } from "../api/actions";

const initialState: AuthFormState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Log in to Kanvio</h1>
        <p className="text-sm text-fg-muted">Welcome back.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.fields?.email}
          aria-invalid={Boolean(state.error)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.error)}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-fg-muted">
        No account?{" "}
        <Link href="/signup" className="text-accent-text hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
