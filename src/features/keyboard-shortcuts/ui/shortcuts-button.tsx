"use client";

import { Keyboard } from "lucide-react";
import { useShortcutsHelp } from "../model/store";

export function ShortcutsButton() {
  const setOpen = useShortcutsHelp((state) => state.setOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts (?)"
      className="rounded-md p-1.5 text-fg-subtle outline-none transition-colors duration-150 hover:bg-surface-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <Keyboard className="size-4" />
    </button>
  );
}
