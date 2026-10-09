import { CircleAlert, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import type { Priority } from "../model/types";

const LABELS: Record<Priority, string> = {
  none: "No priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === "none") return null;

  const className = "size-4 shrink-0";
  const label = LABELS[priority];

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
