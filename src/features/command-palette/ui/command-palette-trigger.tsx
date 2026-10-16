"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "../model/store";

export function CommandPaletteTrigger() {
  const open = useCommandPalette((state) => state.open);

  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-center gap-2 rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-fg-subtle outline-none transition-colors duration-150 hover:border-border-strong hover:text-fg-muted focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search…</span>
      <kbd className="rounded border border-border px-1.5 font-sans text-[11px]">
        Ctrl K
      </kbd>
    </button>
  );
}
