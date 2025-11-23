"use client";

import { Home, Target, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Target, label: "Metas", href: "/dashboard/goals" },
  { icon: BarChart3, label: "Progresso", href: "/dashboard/progress" },
  { icon: Settings, label: "Config", href: "/dashboard/settings" },
];

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "bg-surface/95 backdrop-blur-md",
        "border-t border-white/10",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all",
                "min-w-[44px] min-h-[44px]",
                isActive
                  ? "text-primary"
                  : "text-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-glow")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
