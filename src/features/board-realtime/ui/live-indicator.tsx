import { cn } from "@/shared/lib/cn";
import type { RealtimeStatus } from "../model/use-board-realtime";

const LABELS: Record<RealtimeStatus, string> = {
  connecting: "Connecting…",
  live: "Live",
  offline: "Offline",
};

export function LiveIndicator({ status }: { status: RealtimeStatus }) {
  return (
    <span
      role="status"
      title={
        status === "live"
          ? "Changes from your team appear instantly"
          : "Real-time updates are not connected"
      }
      className="flex items-center gap-1.5 text-xs text-fg-subtle"
    >
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          status === "live" && "bg-success",
          status === "connecting" && "animate-pulse bg-fg-subtle",
          status === "offline" && "bg-danger",
        )}
      />
      {LABELS[status]}
    </span>
  );
}
