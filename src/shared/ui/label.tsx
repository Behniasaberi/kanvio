import { cn } from "@/shared/lib/cn";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-fg-muted", className)}
      {...props}
    />
  );
}
