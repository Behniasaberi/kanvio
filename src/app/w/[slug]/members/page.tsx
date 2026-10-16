import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/entities/user/server";
import {
  getWorkspaceBySlug,
  getWorkspaceMembers,
} from "@/entities/workspace/server";
import { getWorkspaceInvites } from "@/entities/invite/server";
import { InviteLinks } from "@/features/invite-member";
import { Avatar } from "@/shared/ui";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage({
  params,
}: PageProps<"/w/[slug]/members">) {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <Suspense
        fallback={<div className="h-7 w-48 animate-pulse rounded-md bg-surface" />}
      >
        {params.then(({ slug }) => (
          <Members slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

const ROLE_LABELS = { owner: "Owner", admin: "Admin", member: "Member" };

async function Members({ slug }: { slug: string }) {
  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getWorkspaceBySlug(slug),
  ]);
  if (!workspace) notFound();

  const members = await getWorkspaceMembers(workspace.id);
  const myRole = members.find((m) => m.id === user.id)?.role;
  const isAdmin = myRole === "owner" || myRole === "admin";
  const invites = isAdmin ? await getWorkspaceInvites(workspace.id) : [];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="text-sm text-fg-muted">
          {members.length} {members.length === 1 ? "person" : "people"} in{" "}
          {workspace.name}
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar name={member.name} size="md" />
            <span className="flex-1 truncate text-sm">
              {member.name}
              {member.id === user.id && (
                <span className="text-fg-subtle"> (you)</span>
              )}
            </span>
            <span className="text-xs text-fg-muted">
              {ROLE_LABELS[member.role]}
            </span>
          </li>
        ))}
      </ul>

      {isAdmin && (
        <InviteLinks
          workspaceId={workspace.id}
          workspaceSlug={workspace.slug}
          invites={invites}
        />
      )}
    </div>
  );
}
