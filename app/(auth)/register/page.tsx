"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});

  const handleChange = (field: keyof RegisterForm) => (
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
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterForm, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        // Handle duplicate email error explicitly
        if (error.message.includes("already registered") || 
            error.message.includes("User already registered") ||
            error.message.includes("already exists")) {
          toast.error("Este e-mail já está em uso.", {
            style: {
              background: "#DC2626",
              color: "#FFFFFF",
            },
          });
          return;
        }
        
        toast.error(error.message, {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
          },
        });
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        // If session exists, user is logged in automatically (no email confirmation required)
        if (data.session) {
          toast.success("Conta criada com sucesso!");
          // Force refresh to update server-side cookies before redirect
          router.refresh();
          router.push("/quiz");
        } else {
          // Email confirmation required - show verification state
          setEmailSent(true);
          toast.success("Verifique seu e-mail para confirmar a conta.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro ao criar conta. Tente novamente.", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Show email verification state
  if (emailSent) {
    return (
      <div className="w-full">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-[#00FF00] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Verifique seu E-mail
            </h2>
            <p className="text-[#A1A1AA] mb-6">
              Enviamos um link de confirmação para <strong className="text-white">{formData.email}</strong>.
              <br />
              Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
            <Link
              href="/login"
              className="text-[#00FF00] hover:underline font-medium"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Premium Card with Glass Effect */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Criar Conta
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">
            Comece sua jornada de transformação
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00]"
              placeholder="Seu nome completo"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

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
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00]"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00]"
              placeholder="Digite a senha novamente"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
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
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-[#A1A1AA] text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#00FF00] hover:underline font-medium"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
