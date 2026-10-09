import { cn } from "@/shared/lib/cn";

type WorkspaceAvatarProps = {
  name: string;
  className?: string;
};

export function WorkspaceAvatar({ name, className }: WorkspaceAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-sm bg-accent/20 text-xs font-semibold text-accent-text uppercase",
        className,
      )}
    >
      {name.trim().charAt(0) || "?"}
    </span>
  );
}
