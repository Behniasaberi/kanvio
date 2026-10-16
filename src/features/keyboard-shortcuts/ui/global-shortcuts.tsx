"use client";

import { useHotkey } from "@/shared/lib/use-hotkey";
import { useShortcutsHelp } from "../model/store";
import { ShortcutsDialog } from "./shortcuts-dialog";

/** "?" opens the shortcuts guide on every workspace page. */
export function GlobalShortcuts() {
  const setHelpOpen = useShortcutsHelp((state) => state.setOpen);
  useHotkey("?", () => setHelpOpen(true));

  return <ShortcutsDialog />;
}
