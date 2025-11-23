import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0D0D0D]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-[#00FF00] via-[#00FF00] to-[#00DD00] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,0,0.5)] mb-2">
            HERO
          </h1>
          <p className="text-secondary text-sm">
            Otimização Masculina através de Hábitos
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
