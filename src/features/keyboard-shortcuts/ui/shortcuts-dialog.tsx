"use client";

import { Dialog, DialogContent, DialogTitle } from "@/shared/ui";
import { SHORTCUTS } from "../model/shortcuts";
import { useShortcutsHelp } from "../model/store";

export function ShortcutsDialog() {
  const { isOpen, setOpen } = useShortcutsHelp();
  const groups = [...new Set(SHORTCUTS.map((s) => s.group))];

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="mb-4 text-base font-semibold">
          Keyboard shortcuts
        </DialogTitle>

        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-fg-subtle">{group}</h3>
              <ul className="flex flex-col gap-1.5">
                {SHORTCUTS.filter((s) => s.group === group).map((shortcut) => (
                  <li
                    key={shortcut.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-fg-muted">{shortcut.label}</span>
                    <span className="flex gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="min-w-6 rounded border border-border bg-bg px-1.5 py-0.5 text-center font-sans text-xs text-fg"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
