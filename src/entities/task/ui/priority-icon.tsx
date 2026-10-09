import { CircleAlert, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { PRIORITY_LABELS, type Priority } from "../model/types";

export function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === "none") return null;

  const className = "size-4 shrink-0";
  const label = PRIORITY_LABELS[priority];

  switch (priority) {
    case "urgent":
      return <CircleAlert className={`${className} text-danger`} aria-label={label} />;
    case "high":
      return <SignalHigh className={`${className} text-fg-muted`} aria-label={label} />;
    case "medium":
      return <SignalMedium className={`${className} text-fg-muted`} aria-label={label} />;
    case "low":
      return <SignalLow className={`${className} text-fg-subtle`} aria-label={label} />;
  }
}
