"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthFormState } from "../api/actions";

const initialState: AuthFormState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Log in to Task Board</h1>
        <p className="text-sm text-zinc-400">Welcome back.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.fields?.email}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:border-zinc-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-zinc-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:border-zinc-600"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-9 rounded-md bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:opacity-50"
      >
        {isPending ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-zinc-400">
        No account?{" "}
        <Link href="/signup" className="text-zinc-100 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
