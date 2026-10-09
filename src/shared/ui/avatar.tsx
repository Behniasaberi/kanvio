import { cn } from "@/shared/lib/cn";

type AvatarProps = {
  name: string;
  size?: "sm" | "md";
  className?: string;
};

export function Avatar({ name, size = "sm", className }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-surface-active font-medium text-fg-muted uppercase",
        size === "sm" ? "size-5 text-[10px]" : "size-7 text-xs",
        className,
      )}
    >
      {initials || "?"}
    </span>
  );
}
