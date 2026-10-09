"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  PriorityIcon,
  type Priority,
  type Task,
} from "@/entities/task";
import type { WorkspaceMember } from "@/entities/workspace";
import {
  Button,
  Label,
  Select,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/ui";
import { deleteTask, updateTask, type TaskPatch } from "../api/actions";

type TaskDetailsSheetProps = {
  task: Task | null;
  columnName?: string;
  members: WorkspaceMember[];
  onClose: () => void;
  onChange: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export function TaskDetailsSheet({
  task,
  columnName,
  members,
  onClose,
  onChange,
  onDelete,
}: TaskDetailsSheetProps) {
  return (
    <Sheet open={task !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {task && (
          // key: reset the form when a different task is opened.
          <TaskDetailsForm
            key={task.id}
            task={task}
            columnName={columnName}
            members={members}
            onChange={onChange}
            onDelete={onDelete}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

type TaskDetailsFormProps = Omit<TaskDetailsSheetProps, "task" | "onClose"> & {
  task: Task;
};

function TaskDetailsForm({
  task,
  columnName,
  members,
  onChange,
  onDelete,
}: TaskDetailsFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [, startSave] = useTransition();

  // Optimistic save: update the board now, undo if the server says no.
  function save(patch: TaskPatch, next: Task) {
    const previous = task;
    onChange(next);
    setError(null);
    startSave(async () => {
      const result = await updateTask(task.id, patch);
      if (result.error) {
        onChange(previous);
        setError(result.error);
      }
    });
  }

  function saveTitle() {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(task.title);
      return;
    }
    if (trimmed !== task.title) {
      save({ title: trimmed }, { ...task, title: trimmed });
    }
  }

  function saveDescription() {
    const next = description.trim() || null;
    if (next !== task.description) {
      save({ description: next }, { ...task, description: next });
    }
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    startDelete(async () => {
      const result = await deleteTask(task.id);
      if (result.error) {
        setError(result.error);
        setConfirmDelete(false);
      } else {
        onDelete(task.id);
      }
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1 border-b border-border p-5 pr-12">
        <SheetDescription className="text-xs text-fg-subtle">
          {columnName ?? "Task"}
        </SheetDescription>
        <SheetTitle asChild>
          <textarea
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              }
            }}
            rows={2}
            maxLength={200}
            aria-label="Task title"
            className="w-full resize-none rounded-md bg-transparent text-lg font-semibold outline-none focus:bg-bg focus:ring-2 focus:ring-accent/25"
          />
        </SheetTitle>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div className="grid grid-cols-[96px_1fr] items-center gap-3">
          <Label htmlFor="task-priority">Priority</Label>
          <div className="flex items-center gap-2">
            <PriorityIcon priority={task.priority} />
            <Select
              id="task-priority"
              value={task.priority}
              onChange={(event) => {
                const priority = event.target.value as Priority;
                save({ priority }, { ...task, priority });
              }}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </Select>
          </div>

          <Label htmlFor="task-assignee">Assignee</Label>
          <Select
            id="task-assignee"
            value={task.assigneeId ?? ""}
            onChange={(event) => {
              const assigneeId = event.target.value || null;
              save({ assigneeId }, { ...task, assigneeId });
            }}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-description">Description</Label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={saveDescription}
            rows={8}
            maxLength={5000}
            placeholder="Add more detail…"
            className="w-full resize-y rounded-md border border-border bg-bg p-3 text-sm outline-none placeholder:text-fg-subtle hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border p-4">
        <p className="text-xs text-fg-subtle">Changes save automatically</p>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="size-4" />
          {isDeleting ? "Deleting…" : confirmDelete ? "Click again to delete" : "Delete"}
        </Button>
      </div>
    </div>
  );
}
