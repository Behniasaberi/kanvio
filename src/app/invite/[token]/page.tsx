import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getInvitePreview } from "@/entities/invite/server";
import { AcceptInviteForm } from "@/features/invite-member";

export const metadata: Metadata = { title: "Join workspace" };

export default function InvitePage({ params }: PageProps<"/invite/[token]">) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <Suspense fallback={<p className="text-sm text-fg-subtle">Loading…</p>}>
          {params.then(({ token }) => (
            <Invite token={token} />
          ))}
        </Suspense>
      </div>
    </main>
  );
}

async function Invite({ token }: { token: string }) {
  const invite = await getInvitePreview(token);

  if (!invite || invite.isExpired) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Invite not valid</h1>
        <p className="text-sm text-fg-muted">
          This link is invalid or has expired. Ask an admin for a new one.
        </p>
        <Link href="/dashboard" className="text-sm text-accent-text hover:underline">
          Go to your workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-fg-muted">You&apos;ve been invited to join</p>
        <h1 className="text-xl font-semibold">{invite.workspaceName}</h1>
      </div>
      <AcceptInviteForm token={token} />
    </div>
  );
}
