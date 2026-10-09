export const PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  position: number;
  columnId: string;
};
