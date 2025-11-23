"use client";

import { Menu, User, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-md",
        "border-b border-white/10",
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-background" />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground">
            HERO
          </h1>
        </div>

        {/* User Info & Menu */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface/50 transition-colors"
            aria-label="User profile"
          >
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-white/10">
              <User className="w-4 h-4 text-secondary" />
            </div>
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-surface/50 transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
