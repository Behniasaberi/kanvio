"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/shared/ui";
import { getTaskActivity } from "../api/get-task-activity";
import { describeActivity, timeAgo } from "../lib/format";
import type { TaskActivity } from "../model/types";

type ActivityFeedProps = {
  taskId: string;
  /** Change this number to reload the feed (e.g. after a save). */
  version: number;
};

export function ActivityFeed({ taskId, version }: ActivityFeedProps) {
  const [items, setItems] = useState<TaskActivity[] | null>(null);

  useEffect(() => {
    let ignore = false;
    getTaskActivity(taskId).then((result) => {
      if (!ignore) setItems(result);
    });
    return () => {
      ignore = true;
    };
  }, [taskId, version]);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-fg-muted">Activity</h3>

      {items === null ? (
        <div className="h-10 animate-pulse rounded-md bg-surface-hover" />
      ) : items.length === 0 ? (
        <p className="text-sm text-fg-subtle">No activity yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-sm">
              <Avatar name={item.actorName} />
              <p className="min-w-0 flex-1 text-fg-muted">
                <span className="text-fg">{item.actorName}</span>{" "}
                {describeActivity(item)}
                <time
                  dateTime={item.createdAt}
                  title={new Date(item.createdAt).toLocaleString()}
                  className="ml-1.5 text-xs text-fg-subtle"
                >
                  {timeAgo(item.createdAt)}
                </time>
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
