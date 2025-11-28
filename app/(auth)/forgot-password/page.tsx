"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordForm>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordForm, string>>>({});

  const handleChange = (field: keyof ForgotPasswordForm) => (
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
    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordForm, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ForgotPasswordForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Get origin for redirect URL
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      
      // Send password reset email with redirect to update-password page
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
      });

      // Always show success message for security (don't reveal if email exists)
      // Supabase doesn't return an error if email doesn't exist
      if (error) {
        console.error("Password reset error:", error);
      }

      setEmailSent(true);
      toast.success("Se o e-mail existir, um link foi enviado.", {
        style: {
          background: "#1A1A1A",
          color: "#FFFFFF",
          border: "1px solid rgba(0, 255, 0, 0.2)",
        },
      });
    } catch (error) {
      console.error("Password reset error:", error);
      // Still show success for security
      setEmailSent(true);
      toast.success("Se o e-mail existir, um link foi enviado.", {
        style: {
          background: "#1A1A1A",
          color: "#FFFFFF",
          border: "1px solid rgba(0, 255, 0, 0.2)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Show success state after email sent
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
              Se o e-mail <strong className="text-white">{formData.email}</strong> estiver cadastrado, 
              você receberá um link para redefinir sua senha.
              <br /><br />
              Verifique sua caixa de entrada e a pasta de spam.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[#00FF00] hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
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
              Recuperar Senha
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">
            Digite seu e-mail para receber um link de recuperação
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
              <p className="text-red-500 text-xs">{errors.email}</p>
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
                Enviando...
              </>
            ) : (
              "Enviar Link de Recuperação"
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
