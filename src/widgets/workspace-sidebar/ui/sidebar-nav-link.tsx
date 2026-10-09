"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";

type SidebarNavLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export function SidebarNavLink({ href, icon, children }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
        isActive
          ? "bg-surface-active text-fg"
          : "text-fg-muted hover:bg-surface-hover hover:text-fg",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
