import { cn } from "@/shared/lib/cn";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg transition-colors duration-150 outline-none placeholder:text-fg-subtle hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/25 aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
