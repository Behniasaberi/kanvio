import type { Task } from "@/entities/task";

export type Board = {
  id: string;
  name: string;
  workspaceId: string;
};

export type BoardColumn = {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
};

export type BoardWithColumns = Board & {
  columns: BoardColumn[];
};
