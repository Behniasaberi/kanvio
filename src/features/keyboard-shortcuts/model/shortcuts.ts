export const SHORTCUTS = [
  { group: "General", keys: ["Ctrl", "K"], label: "Open command menu" },
  { group: "General", keys: ["/"], label: "Search" },
  { group: "General", keys: ["?"], label: "Show keyboard shortcuts" },
  { group: "Board", keys: ["C"], label: "Create task" },
  { group: "Board", keys: ["←", "↑", "↓", "→"], label: "Move between tasks" },
  { group: "Board", keys: ["Enter"], label: "Open task" },
  { group: "Board", keys: ["Space"], label: "Pick up / drop task" },
  { group: "Board", keys: ["Esc"], label: "Close panel or cancel" },
] as const;
