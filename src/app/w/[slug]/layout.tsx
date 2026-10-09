import { Suspense } from "react";
import {
  WorkspaceSidebar,
  WorkspaceSidebarSkeleton,
} from "@/widgets/workspace-sidebar";

export default function WorkspaceLayout({
  children,
  params,
}: LayoutProps<"/w/[slug]">) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-border bg-surface">
        <Suspense fallback={<WorkspaceSidebarSkeleton />}>
          {params.then(({ slug }) => (
            <WorkspaceSidebar slug={slug} />
          ))}
        </Suspense>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
