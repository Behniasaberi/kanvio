"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Input, Label } from "@/shared/ui";
import { signUp, type AuthFormState } from "../api/actions";

const initialState: AuthFormState = { error: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Almost there</h1>
        <p className="text-sm text-fg-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-fg-muted">
          Start organizing your team&apos;s work.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          defaultValue={state.fields?.fullName}
        />
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
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-fg-subtle">At least 8 characters.</p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-text hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
