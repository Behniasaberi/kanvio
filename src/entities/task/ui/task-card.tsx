import { AlignLeft } from "lucide-react";
import { Avatar } from "@/shared/ui";
import type { Task } from "../model/types";
import { PriorityIcon } from "./priority-icon";

type TaskCardProps = {
  task: Task;
  assigneeName?: string;
};

export function TaskCard({ task, assigneeName }: TaskCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3 text-sm transition-colors duration-150 hover:border-border-strong">
      <div className="flex items-start gap-2">
        <PriorityIcon priority={task.priority} />
        <p className="min-w-0 flex-1 break-words">{task.title}</p>
      </div>

      {(task.description || assigneeName) && (
        <div className="flex items-center gap-2 text-fg-subtle">
          {task.description && (
            <AlignLeft className="size-3.5" aria-label="Has description" />
          )}
          {assigneeName && <Avatar name={assigneeName} className="ml-auto" />}
        </div>
      )}
    </article>
  );
}
