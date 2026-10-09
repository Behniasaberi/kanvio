"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthFormState } from "../api/actions";

const initialState: AuthFormState = { error: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Almost there</h1>
        <p className="text-sm text-zinc-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-zinc-400">Start organizing your team&apos;s work.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-sm text-zinc-300">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          defaultValue={state.fields?.fullName}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:border-zinc-600"
        />
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
          autoComplete="new-password"
          minLength={8}
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
        {isPending ? "Creating account…" : "Sign up"}
      </button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-100 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
