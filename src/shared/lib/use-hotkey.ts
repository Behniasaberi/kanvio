"use client";

import { useEffect, useEffectEvent } from "react";

/** True when the user is typing, so single-key shortcuts must not fire. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/**
 * Run `handler` when `key` is pressed, unless the user is typing,
 * holds a modifier (Ctrl / Cmd / Alt), or a dialog is open.
 */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  enabled = true,
) {
  // Always calls the latest handler without re-subscribing every render.
  const onHotkey = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (event.key !== key && event.key.toLowerCase() !== key) return;

      event.preventDefault();
      onHotkey(event);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, enabled]);
}
