"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback?next=/quiz",
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Check for duplicate email (user exists but no identity created)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("Este email já está cadastrado. Faça login ou recupere sua senha.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <h2 className="text-2xl font-heading font-semibold bg-gradient-to-r from-[#00FF00] to-[#00DD00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,0,0.3)] mb-6">
          Verifique seu Email
        </h2>
        <p className="text-[#A1A1AA] text-sm mb-4">
          Enviamos um link de confirmação para <strong className="text-white">{email}</strong>.
        </p>
        <p className="text-[#A1A1AA] text-sm">
          Clique no link para ativar sua conta e começar a usar o HERO.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/20 transition-all">
      <h2 className="text-2xl font-heading font-semibold bg-gradient-to-r from-[#00FF00] to-[#00DD00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,0,0.3)] mb-6">
        Criar Conta
      </h2>

      <form onSubmit={handleSignup} className="space-y-4">
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-[#A1A1AA] mb-2">
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#A1A1AA]">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-[#00FF00] hover:underline">
          Fazer Login
        </Link>
      </p>
    </div>
  );
}
