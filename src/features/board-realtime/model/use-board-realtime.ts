"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { mapTaskRow, type Task, type TaskRow } from "@/entities/task";
import { createClient } from "@/shared/lib/supabase/client";

export type RealtimeStatus = "connecting" | "live" | "offline";

type Handlers = {
  onTaskChange: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
};

/**
 * Listen to task changes on one board.
 * Every change made by anyone (including us) arrives here.
 */
export function useBoardRealtime(boardId: string, handlers: Handlers) {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");
  const onChange = useEffectEvent(handlers.onTaskChange);
  const onDelete = useEffectEvent(handlers.onTaskDelete);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`board:${boardId}`)
      .on<TaskRow>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => onChange(mapTaskRow(payload.new)),
      )
      .on<TaskRow>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => onChange(mapTaskRow(payload.new)),
      )
      // Deletes can't be filtered by board, but only carry the id;
      // removing an id that isn't on this board is a no-op.
      .on<TaskRow>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.old.id) onDelete(payload.old.id);
        },
      )
      .subscribe((state) => {
        if (state === "SUBSCRIBED") setStatus("live");
        if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") setStatus("offline");
        if (state === "CLOSED") setStatus("offline");
      });

    return () => {
      // Leave the channel when the board closes (avoids leaking sockets).
      supabase.removeChannel(channel);
    };
  }, [boardId]);

  return status;
}
