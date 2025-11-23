"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
        {/* Logo & Title Section */}
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="HERO Logo" 
              width={40} 
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Title and Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF00] to-white/80">
                HERO
              </span>
            </h1>
            <p className="text-[10px] font-medium text-[#A1A1AA] tracking-wide">
              Bem-vindo, Herói
            </p>
          </div>
        </div>

        {/* User Avatar Only */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-all hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]"
          aria-label="User profile"
        >
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/5">
            <User className="w-4 h-4 text-[#A1A1AA]" />
          </div>
        </Link>
      </div>
    </header>
  );
}
