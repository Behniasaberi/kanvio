"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui";
import { acceptInvite, type AcceptInviteState } from "../api/actions";

const initialState: AcceptInviteState = { error: null };

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    acceptInvite.bind(null, token),
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Button type="submit" disabled={isPending}>
        {isPending ? "Joining…" : "Join workspace"}
      </Button>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
