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
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-[#1A1A1A]/95 backdrop-blur-md",
        "border-t border-white/5",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
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
                  ? "text-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.3)] -translate-y-1"
                  : "text-[#A1A1AA] hover:text-white hover:shadow-[0_0_10px_rgba(0,255,0,0.1)]"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && "filter drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]"
                )}
              />
              <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#00FF00] mt-1 shadow-[0_0_5px_#00FF00]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
