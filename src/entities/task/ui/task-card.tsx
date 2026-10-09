import type { Task } from "../model/types";
import { PriorityIcon } from "./priority-icon";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="flex items-start gap-2 rounded-md border border-border bg-surface p-3 text-sm transition-colors duration-150 hover:border-border-strong">
      <PriorityIcon priority={task.priority} />
      <p className="min-w-0 flex-1 break-words">{task.title}</p>
    </article>
  );
}
