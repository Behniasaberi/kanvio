// Client-safe public API. Server queries live in ./server.
export { upsertTask, removeTask } from "./lib/board-state";
export type { Board, BoardColumn, BoardWithColumns } from "./model/types";
