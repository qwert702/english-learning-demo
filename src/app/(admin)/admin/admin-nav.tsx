"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/admin/articles", label: "📝 文章管理" },
  { href: "/admin/features", label: "🔧 功能管理" },
] as const;

export function AdminNav({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <nav className={mobile ? "flex gap-2" : "flex-1 p-3 space-y-1"}>
      {NAV_ITEMS.map((item) => {
        const isActive = mounted && pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              mobile
                ? `shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                : `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
