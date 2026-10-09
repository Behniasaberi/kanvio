import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/entities/user";
import { SignOutButton } from "@/features/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <Suspense fallback={<p className="text-sm text-fg-subtle">Loading…</p>}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">
          Welcome, {user.fullName ?? user.email}
        </h1>
        <p className="text-sm text-fg-muted">{user.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
