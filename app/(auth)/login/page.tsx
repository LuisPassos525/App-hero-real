"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes to handle successful login
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.refresh();
        router.push("/homepage");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // The onAuthStateChange listener will handle the redirect
      // Keep loading state until redirect happens
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/20 transition-all">
      <h2 className="text-2xl font-heading font-semibold bg-gradient-to-r from-[#00FF00] to-[#00DD00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,0,0.3)] mb-6">
        Entrar
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-[#A1A1AA] mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#00FF00]/50 transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-[#A1A1AA] mb-2">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#00FF00]/50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00FF00] text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#A1A1AA]">
        Não tem uma conta?{" "}
        <Link href="/signup" className="text-[#00FF00] hover:underline">
          Criar Conta
        </Link>
      </p>
    </div>
  );
}
