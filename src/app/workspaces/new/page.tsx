import type { Metadata } from "next";
import { CreateWorkspaceForm } from "@/features/create-workspace";

export const metadata: Metadata = { title: "New workspace" };

export default function NewWorkspacePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <CreateWorkspaceForm />
      </div>
    </main>
  );
}
