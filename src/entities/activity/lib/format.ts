import type { TaskActivity } from "../model/types";

const PRIORITY_NAMES: Record<string, string> = {
  none: "no priority",
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
};

/** "moved this from Todo to Done" */
export function describeActivity(activity: TaskActivity): string {
  const { action, field, oldValue, newValue } = activity;

  if (action === "created") return "created this task";
  if (action === "moved") return `moved this from ${oldValue} to ${newValue}`;

  switch (field) {
    case "title":
      return `renamed this to "${newValue}"`;
    case "priority":
      return `set priority to ${PRIORITY_NAMES[newValue ?? "none"]}`;
    case "assignee":
      return newValue ? `assigned this to ${newValue}` : "removed the assignee";
    case "description":
      return "updated the description";
    default:
      return "updated this task";
  }
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "2 hours ago", "just now" */
export function timeAgo(isoDate: string, now = Date.now()): string {
  const seconds = Math.round((new Date(isoDate).getTime() - now) / 1000);
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return format.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}
