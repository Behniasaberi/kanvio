"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Trash2 } from "lucide-react";
import type { Invite } from "@/entities/invite";
import { Button } from "@/shared/ui";
import { createInvite, revokeInvite } from "../api/actions";

type InviteLinksProps = {
  workspaceId: string;
  workspaceSlug: string;
  invites: Invite[];
};

export function InviteLinks({
  workspaceId,
  workspaceSlug,
  invites,
}: InviteLinksProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createInvite(workspaceId, workspaceSlug);
      if (result.error) setError(result.error);
    });
  }

  function handleRevoke(inviteId: string) {
    setError(null);
    startTransition(async () => {
      const result = await revokeInvite(inviteId, workspaceSlug);
      if (result.error) setError(result.error);
    });
  }

  async function handleCopy(invite: Invite) {
    const url = `${window.location.origin}/invite/${invite.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">Invite links</h2>
          <p className="text-sm text-fg-muted">
            Anyone with a link can join as a member. Links expire after 7 days.
          </p>
        </div>
        <Button size="sm" onClick={handleCreate} disabled={isPending}>
          <Link2 className="size-4" />
          New link
        </Button>
      </div>

      {invites.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {invites.map((invite) => (
            <li key={invite.id} className="flex items-center gap-3 px-4 py-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg-muted">
                /invite/{invite.token}
              </code>
              <span className="shrink-0 text-xs text-fg-subtle">
                {invite.daysLeft === 1 ? "1 day left" : `${invite.daysLeft} days left`}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCopy(invite)}
                aria-label="Copy invite link"
              >
                {copiedId === invite.id ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copiedId === invite.id ? "Copied" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRevoke(invite.id)}
                disabled={isPending}
                aria-label="Revoke invite link"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
