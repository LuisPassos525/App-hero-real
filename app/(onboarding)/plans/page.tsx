"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Sparkles, Crown, Star } from "lucide-react";

type PlanType = "monthly" | "quarterly" | "annual";

interface Plan {
  id: PlanType;
  name: string;
  title: string;
  price: string;
  priceDescription: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
  tier: PlanType; // The plan_tier value to save in DB (uses same type for consistency)
}

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Iniciante",
    title: "Mensal",
    price: "R$ 47",
    priceDescription: "/mês",
    tier: "monthly",
    features: [
      "Acesso completo ao protocolo",
      "Treinos personalizados",
      "Acompanhamento de progresso",
      "Comunidade exclusiva",
    ],
  },
  {
    id: "quarterly",
    name: "Recomendado",
    title: "Trimestral",
    price: "R$ 37",
    priceDescription: "/mês",
    tier: "quarterly",
    features: [
      "Tudo do plano Mensal",
      "3 meses de acesso",
      "Economia de 21%",
      "Suporte prioritário",
      "Conteúdos bônus",
    ],
    badge: "Mais Popular",
    recommended: true,
  },
  {
    id: "annual",
    name: "Elite",
    title: "Anual",
    price: "R$ 27",
    priceDescription: "/mês",
    tier: "annual",
    features: [
      "Tudo do plano Trimestral",
      "12 meses de acesso",
      "Economia de 43%",
      "Mentoria exclusiva",
      "Acesso vitalício a atualizações",
      "Badge Elite no perfil",
    ],
    badge: "Maior Desconto",
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("quarterly");
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planId: PlanType, tier: string) => {
    setSelectedPlan(planId);
    setLoading(true);

    try {
      // Get the current user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        setLoading(false);
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/login");
        return;
      }

      const user = sessionData.session.user;

      // Call secure server-side API to activate plan after payment confirmation
      // This endpoint should verify payment before updating the database
      const response = await fetch("/api/activate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          tier,
          userId: user.id,
          // Optionally include payment confirmation data here
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error activating plan:", errorData);
        toast.error("Erro ao ativar plano. Tente novamente.");
        setLoading(false);
        return;
      }

      const planName = plans.find((p) => p.id === planId)?.name;
      toast.success(`Plano ${planName} ativado com sucesso!`);

      // Redirect to homepage
      router.push("/homepage");
    } catch (error) {
      console.error("Plan selection error:", error);
      toast.error("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Escolha seu Protocolo HERO
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Invista na sua transformação. Cada plano oferece acesso completo ao
            protocolo que vai revolucionar sua saúde e performance.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1A1A1A] rounded-2xl p-6 transition-all duration-300 ${
                plan.recommended
                  ? "border-2 border-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)] scale-105 md:scale-110 z-10"
                  : "border border-white/10 hover:border-white/20"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      plan.recommended
                        ? "bg-[#00FF00] text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {plan.recommended ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                  {plan.title}
                </h3>
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    plan.recommended ? "text-[#00FF00]" : "text-white"
                  }`}
                >
                  {plan.name}
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.recommended ? "text-[#00FF00]" : "text-white"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-[#A1A1AA] text-sm">
                    {plan.priceDescription}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.recommended ? "text-[#00FF00]" : "text-white/60"
                      }`}
                    />
                    <span className="text-[#A1A1AA] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan.id, plan.tier)}
                disabled={loading}
                className={`w-full py-6 rounded-xl font-bold transition-all ${
                  plan.recommended
                    ? "bg-[#00FF00] hover:bg-[#00FF00]/90 text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                {loading && selectedPlan === plan.id
                  ? "Processando..."
                  : "Selecionar Plano"}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-[#A1A1AA] text-sm">
            ✨ Garantia de 7 dias. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
}
