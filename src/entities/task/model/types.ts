export const PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<Priority, string> = {
  none: "No priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  position: number;
  columnId: string;
  assigneeId: string | null;
};
