"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { createTask, type CreateTaskState } from "../api/actions";

const initialState: CreateTaskState = { error: null };

type TaskComposerProps = {
  boardId: string;
  columnId: string;
};

export function TaskComposer({ boardId, columnId }: TaskComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createTask.bind(null, boardId, columnId),
    initialState,
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg-subtle transition-colors duration-150 hover:bg-surface-hover hover:text-fg"
      >
        <Plus className="size-4" />
        Add task
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <textarea
        name="title"
        required
        maxLength={200}
        rows={2}
        autoFocus
        placeholder="Task title"
        aria-label="Task title"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="w-full resize-none rounded-md border border-border bg-bg p-2 text-sm outline-none placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
      {state.error && (
        <p role="alert" className="text-xs text-danger">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
