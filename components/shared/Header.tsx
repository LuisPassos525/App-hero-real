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
        "bg-[#0D0D0D]/80 backdrop-blur-md",
        "border-b border-white/5",
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00FF00] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            <Trophy className="w-5 h-5 text-[#0D0D0D]" />
          </div>
          <h1 className="font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF00] to-white uppercase italic drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">
            HERO
          </h1>
          <br></br>
          <p className="text-[10px] tracking-widest text-[#00FF00] uppercase font-bold">Bem vindo, Herói.</p>
        </div>

        {/* User Info & Menu */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]"
            aria-label="User profile"
          >
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/5">
              <User className="w-4 h-4 text-secondary" />
            </div>
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.1)] lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
