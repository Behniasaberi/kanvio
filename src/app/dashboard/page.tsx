import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/entities/user/server";
import { getMyWorkspaces } from "@/entities/workspace/server";

// Entry point after login: send the user to their first workspace,
// or to onboarding if they don't have one yet.
export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceRedirect />
    </Suspense>
  );
}

async function WorkspaceRedirect(): Promise<never> {
  await getCurrentUser();
  const workspaces = await getMyWorkspaces();

  if (workspaces.length === 0) {
    redirect("/workspaces/new");
  }
  redirect(`/w/${workspaces[0].slug}`);
}
