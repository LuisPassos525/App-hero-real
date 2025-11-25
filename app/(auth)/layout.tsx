import { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0D0D0D]">
      <div className="w-full max-w-md">
        {/* Logo - Centralizada acima do Card */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="HERO Logo"
            width={64}
            height={64}
            className="w-16 h-16 mb-4"
          />
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-[#00FF00] via-[#00FF00] to-[#00DD00] bg-clip-text text-transparent mb-2">
            HERO
          </h1>
          <p className="text-[#A1A1AA] text-sm">
            Otimização Masculina através de Hábitos
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
