"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  CircleDot,
  LayoutGrid,
  Plus,
  SquareKanban,
  Users,
} from "lucide-react";
import { WorkspaceAvatar, type Workspace } from "@/entities/workspace";
import type { Board } from "@/entities/board";
import { useHotkey } from "@/shared/lib/use-hotkey";
import { useCommandPalette } from "../model/store";
import { searchTasks, type TaskSearchResult } from "../api/actions";

type CommandPaletteProps = {
  workspace: Workspace;
  workspaces: Workspace[];
  boards: Board[];
};

const itemClass =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-fg-muted data-[selected=true]:bg-surface-hover data-[selected=true]:text-fg";
const groupClass =
  "px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fg-subtle";

export function CommandPalette({
  workspace,
  workspaces,
  boards,
}: CommandPaletteProps) {
  const router = useRouter();
  const { isOpen, open, close, toggle } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<TaskSearchResult[]>([]);

  // ⌘K on Mac, Ctrl+K on Windows / Linux.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  // "/" also opens search (ignored while typing in a field).
  useHotkey("/", open);

  // Search tasks on the server, 200ms after the user stops typing.
  useEffect(() => {
    if (query.trim().length < 2) return;

    let ignore = false;
    const timer = setTimeout(async () => {
      const results = await searchTasks(workspace.id, query);
      if (!ignore) setTasks(results);
    }, 200);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, workspace.id]);

  const visibleTasks = query.trim().length < 2 ? [] : tasks;

  function run(action: () => void) {
    close();
    setQuery("");
    action();
  }

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
          setQuery("");
        }
      }}
      label="Command menu"
      overlayClassName="fixed inset-0 z-40 bg-black/50"
      contentClassName="fixed top-[15vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-surface shadow-2xl shadow-black/50"
    >
      <Command.Input
        value={query}
        onValueChange={setQuery}
        placeholder="Search boards, tasks or type a command…"
        className="h-12 w-full border-b border-border bg-transparent px-4 text-sm outline-none placeholder:text-fg-subtle"
      />

      <Command.List className="max-h-80 overflow-y-auto p-1">
        <Command.Empty className="px-4 py-8 text-center text-sm text-fg-subtle">
          No results.
        </Command.Empty>

        {visibleTasks.length > 0 && (
          <Command.Group heading="Tasks" className={groupClass}>
            {visibleTasks.map((task) => (
              <Command.Item
                key={task.id}
                value={`task ${task.title} ${task.id}`}
                onSelect={() =>
                  run(() =>
                    router.push(
                      `/w/${workspace.slug}/b/${task.boardId}?task=${task.id}`,
                    ),
                  )
                }
                className={itemClass}
              >
                <CircleDot className="size-4" />
                <span className="truncate">{task.title}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {boards.length > 0 && (
          <Command.Group heading="Boards" className={groupClass}>
            {boards.map((board) => (
              <Command.Item
                key={board.id}
                value={`board ${board.name}`}
                onSelect={() =>
                  run(() => router.push(`/w/${workspace.slug}/b/${board.id}`))
                }
                className={itemClass}
              >
                <SquareKanban className="size-4" />
                <span className="truncate">{board.name}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Navigation" className={groupClass}>
          <Command.Item
            value="go to all boards"
            onSelect={() => run(() => router.push(`/w/${workspace.slug}`))}
            className={itemClass}
          >
            <LayoutGrid className="size-4" />
            All boards
          </Command.Item>
          <Command.Item
            value="go to members invite"
            onSelect={() =>
              run(() => router.push(`/w/${workspace.slug}/members`))
            }
            className={itemClass}
          >
            <Users className="size-4" />
            Members
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Workspaces" className={groupClass}>
          {workspaces
            .filter((w) => w.id !== workspace.id)
            .map((w) => (
              <Command.Item
                key={w.id}
                value={`switch workspace ${w.name}`}
                onSelect={() => run(() => router.push(`/w/${w.slug}`))}
                className={itemClass}
              >
                <WorkspaceAvatar name={w.name} />
                <span className="truncate">Switch to {w.name}</span>
              </Command.Item>
            ))}
          <Command.Item
            value="create new workspace"
            onSelect={() => run(() => router.push("/workspaces/new"))}
            className={itemClass}
          >
            <Plus className="size-4" />
            Create workspace
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-xs text-fg-subtle">
        <span>
          <kbd className="font-sans">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="font-sans">↵</kbd> open
        </span>
        <span>
          <kbd className="font-sans">esc</kbd> close
        </span>
      </div>
    </Command.Dialog>
  );
}
