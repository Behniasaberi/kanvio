"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@/shared/ui";
import { createBoard, type CreateBoardState } from "../api/actions";

const initialState: CreateBoardState = { error: null };

type CreateBoardFormProps = {
  workspaceId: string;
  workspaceSlug: string;
};

export function CreateBoardForm({
  workspaceId,
  workspaceSlug,
}: CreateBoardFormProps) {
  const createBoardInWorkspace = createBoard.bind(
    null,
    workspaceId,
    workspaceSlug,
  );
  const [state, formAction, isPending] = useActionState(
    createBoardInWorkspace,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          name="name"
          required
          maxLength={80}
          placeholder="New board name, e.g. Product Roadmap"
          aria-label="Board name"
          aria-invalid={Boolean(state.error)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={isPending}>
          <Plus className="size-4" />
          {isPending ? "Creating…" : "New board"}
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
