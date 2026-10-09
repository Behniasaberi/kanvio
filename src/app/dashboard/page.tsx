import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/entities/user";
import { SignOutButton } from "@/features/auth";

export const metadata: Metadata = { title: "Dashboard · Task Board" };

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
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
        <p className="text-sm text-zinc-400">{user.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
