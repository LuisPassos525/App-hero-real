"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha não pode estar vazia"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Don't redirect on error, show toast instead
        let errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        
        // Provide more specific error messages
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Usuário não encontrado. Crie uma conta primeiro.";
        }
        
        toast.error(errorMessage, {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
          },
        });
        return;
      }

      if (data.user) {
        toast.success("Login realizado com sucesso!");
        // Redirect to homepage on success
        router.push("/homepage");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error 
        ? `Erro ao fazer login: ${error.message}` 
        : "Erro ao fazer login. Verifique sua conexão e tente novamente.";
      
      toast.error(errorMessage, {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Premium Card with Glass Effect */}
        <div className="bg-[#1A1A1A] border border-[#00FF00]/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,0,0.15)] backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="HERO Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
                Entrar
              </span>
            </h1>
            <p className="text-[#A1A1AA] text-sm">
              Acesse sua conta e continue sua jornada
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00]"
                placeholder="seu@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-danger text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00] pr-10"
                  placeholder="Digite sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-xs">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-bold py-6 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar na Plataforma"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-[#A1A1AA] text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-[#00FF00] hover:underline font-medium"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
