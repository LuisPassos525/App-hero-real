"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react";

// Validation schema for password
const updatePasswordSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<UpdatePasswordForm>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePasswordForm, string>>>({});

  // Check if user has a valid session (from magic link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session - user accessed URL directly without clicking email link
        toast.error("Sessão inválida. Solicite um novo link de recuperação.", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
          },
        });
        router.push("/forgot-password");
        return;
      }
      
      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  const handleChange = (field: keyof UpdatePasswordForm) => (
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
    const result = updatePasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UpdatePasswordForm, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof UpdatePasswordForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        console.error("Password update error:", error);
        
        // Handle specific error messages
        let errorMessage = "Erro ao atualizar senha. Tente novamente.";
        if (error.message.includes("weak")) {
          errorMessage = "Senha muito fraca. Use uma senha mais forte.";
        } else if (error.message.includes("same")) {
          errorMessage = "A nova senha deve ser diferente da anterior.";
        }
        
        toast.error(errorMessage, {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
          },
        });
        return;
      }

      // Success!
      setSuccess(true);
      toast.success("Senha atualizada com sucesso!", {
        style: {
          background: "#1A1A1A",
          color: "#FFFFFF",
          border: "1px solid rgba(0, 255, 0, 0.2)",
        },
      });

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push("/homepage");
      }, 2000);
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Erro ao atualizar senha. Tente novamente.", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="w-full">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#00FF00] animate-spin mb-4" />
            <p className="text-[#A1A1AA]">Verificando sessão...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="w-full">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-[#00FF00] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Senha Atualizada!
            </h2>
            <p className="text-[#A1A1AA] mb-6">
              Sua senha foi atualizada com sucesso.
              <br />
              Você será redirecionado em instantes...
            </p>
            <Loader2 className="w-6 h-6 text-[#00FF00] animate-spin mx-auto" />
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
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-[#00FF00]" />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Redefinir Senha
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">
            Digite sua nova senha abaixo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00] pr-10"
                placeholder="Mínimo 6 caracteres"
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
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className="bg-[#0D0D0D] border-white/10 text-white focus:border-[#00FF00] focus:ring-[#00FF00] pr-10"
                placeholder="Digite novamente"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
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
                Salvando...
              </>
            ) : (
              "Salvar Nova Senha"
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
