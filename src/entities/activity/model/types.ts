export type TaskActivity = {
  id: string;
  action: "created" | "moved" | "updated";
  field: "column" | "title" | "priority" | "assignee" | "description" | null;
  oldValue: string | null;
  newValue: string | null;
  actorName: string;
  createdAt: string;
};
