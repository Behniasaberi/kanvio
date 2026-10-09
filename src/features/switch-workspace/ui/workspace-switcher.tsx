"use client";

import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { WorkspaceAvatar, type Workspace } from "@/entities/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";

type WorkspaceSwitcherProps = {
  current: Workspace;
  workspaces: Workspace[];
};

export function WorkspaceSwitcher({
  current,
  workspaces,
}: WorkspaceSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-fg outline-none transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent/50 data-[state=open]:bg-surface-hover">
        <WorkspaceAvatar name={current.name} />
        <span className="flex-1 truncate text-left">{current.name}</span>
        <ChevronsUpDown className="size-4 text-fg-subtle" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem key={workspace.id} asChild>
            <Link href={`/w/${workspace.slug}`}>
              <WorkspaceAvatar name={workspace.name} />
              <span className="flex-1 truncate">{workspace.name}</span>
              {workspace.id === current.id && (
                <Check className="size-4 text-accent-text" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/workspaces/new">
            <Plus className="size-4" />
            Create workspace
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
