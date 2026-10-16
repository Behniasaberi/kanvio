"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";

type TaskComposerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (title: string) => void;
};

export function TaskComposer({
  isOpen,
  onOpenChange: setIsOpen,
  onCreate,
}: TaskComposerProps) {
  const [title, setTitle] = useState("");

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate(trimmed); // the board shows it immediately
    setTitle(""); // stay open for the next task
  }

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
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        maxLength={200}
        rows={2}
        autoFocus
        placeholder="Task title"
        aria-label="Task title"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="w-full resize-none rounded-md border border-border bg-bg p-2 text-sm outline-none placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Add
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
