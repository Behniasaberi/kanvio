"use client";

import { useActionState, useState } from "react";
import { Button, Input, Label } from "@/shared/ui";
import { createWorkspace, type CreateWorkspaceState } from "../api/actions";
import { slugify } from "../lib/slugify";

const initialState: CreateWorkspaceState = { error: null };

export function CreateWorkspaceForm() {
  const [state, formAction, isPending] = useActionState(
    createWorkspace,
    initialState,
  );
  const [name, setName] = useState("");
  const preview = slugify(name) || "workspace";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Create a workspace</h1>
        <p className="text-sm text-fg-muted">
          A workspace is where your team&apos;s boards live.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Workspace name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={50}
          autoFocus
          placeholder="Acme Inc."
          defaultValue={state.name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(state.error)}
        />
        <p className="text-xs text-fg-subtle">
          URL: kanvio.app/w/<span className="text-fg-muted">{preview}</span>
        </p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create workspace"}
      </Button>
    </form>
  );
}
