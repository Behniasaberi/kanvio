import { cn } from "@/shared/lib/cn";

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-8 w-full rounded-md border border-border bg-bg px-2 text-sm text-fg outline-none transition-colors duration-150 hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/25",
        className,
      )}
      {...props}
    />
  );
}
