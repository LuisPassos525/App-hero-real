import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
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
