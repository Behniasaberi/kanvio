import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LayoutGrid } from "lucide-react";
import { getWorkspaceBySlug } from "@/entities/workspace/server";

export default function WorkspacePage({ params }: PageProps<"/w/[slug]">) {
  return (
    <div className="p-8">
      <Suspense
        fallback={<div className="h-7 w-48 animate-pulse rounded-md bg-surface" />}
      >
        {params.then(({ slug }) => (
          <WorkspaceHome slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function WorkspaceHome({ slug }: { slug: string }) {
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">{workspace.name}</h1>
        <p className="text-sm text-fg-muted">Boards</p>
      </header>

      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <LayoutGrid className="size-6 text-fg-subtle" />
        <p className="font-medium">No boards yet</p>
        <p className="text-sm text-fg-muted">
          Boards you create in this workspace will show up here.
        </p>
      </div>
    </div>
  );
}
