"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Minus } from "lucide-react";

// Quiz data types
type QuizData = {
  // Step 1: Basic Info
  name: string;
  age: number;
  height: number;
  weight: number;
  
  // Step 2: Critical Biomarkers
  morningErection: string;
  bodyComposition: string;
  
  // Step 3: Constitution & Sleep
  sleepDuration: string;
  screenUsage: string;
  
  // Step 4: Nutrition
  fatSource: string;
  waterContainer: string;
  
  // Step 5: Training & Mind
  exerciseFocus: string;
  dailyFeeling: string;
};

const TOTAL_STEPS = 5;
const INITIAL_USER_LEVEL = 1;

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    name: "",
    age: 25,
    height: 170,
    weight: 70,
    morningErection: "",
    bodyComposition: "",
    sleepDuration: "",
    screenUsage: "",
    fatSource: "",
    waterContainer: "",
    exerciseFocus: "",
    dailyFeeling: "",
  });

  const updateField = <K extends keyof QuizData>(field: K, value: QuizData[K]) => {
    setQuizData({ ...quizData, [field]: value });
  };

  const incrementNumber = (field: "age" | "height" | "weight", step: number) => {
    setQuizData({ ...quizData, [field]: Math.max(0, quizData[field] + step) });
  };

  const calculateVitalityScore = (): number => {
    let score = 0;

    // Morning erection frequency
    if (quizData.morningErection === "daily") score += 20;
    else if (quizData.morningErection === "sometimes") score += 10;

    // Body composition
    if (quizData.bodyComposition === "defined") score += 15;
    else if (quizData.bodyComposition === "athletic") score += 10;

    // Sleep duration
    if (quizData.sleepDuration === "optimal") score += 15;
    else if (quizData.sleepDuration === "good") score += 10;

    // Screen usage
    if (quizData.screenUsage === "no_screen") score += 10;
    else if (quizData.screenUsage === "blue_filter") score += 5;

    // Fat source
    if (quizData.fatSource === "healthy") score += 15;
    else if (quizData.fatSource === "avoid") score += 5;

    // Water container
    if (quizData.waterContainer === "glass") score += 10;

    // Exercise focus
    if (quizData.exerciseFocus === "weights") score += 15;
    else if (quizData.exerciseFocus === "cardio") score += 5;

    // Daily feeling
    if (quizData.dailyFeeling === "energized") score += 15;
    else if (quizData.dailyFeeling === "normal") score += 10;

    return score;
  };

  const generateFlags = (): string[] => {
    const flags: string[] = [];

    if (quizData.morningErection === "rarely") flags.push("critical_alert");
    if (quizData.bodyComposition === "overweight") flags.push("max_risk");
    if (quizData.bodyComposition === "skinny_fat") flags.push("high_metabolic");
    if (quizData.waterContainer === "plastic") flags.push("toxin_alert");
    if (quizData.dailyFeeling === "exhausted") flags.push("sympathetic_dominance");

    return flags;
  };

  const generateBadges = (): string[] => {
    const badges: string[] = [];

    if (quizData.screenUsage === "no_screen") badges.push("Monk Start");
    if (quizData.fatSource === "healthy") badges.push("Nutrition Pro");
    if (quizData.exerciseFocus === "weights") badges.push("Iron Warrior");

    return badges;
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Session validation: Check if session exists
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Erro de sessão. Por favor, faça login novamente.");
        router.push("/login");
        return;
      }

      if (!data.session) {
        console.error("No session found");
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/login");
        return;
      }

      const user = data.session.user;

      // Calculate results
      const vitalityScore = calculateVitalityScore();
      const flags = generateFlags();
      const badges = generateBadges();

      // Profile payload matching exact database schema columns
      // Including quiz_data JSONB and updated_at timestamp
      const profilePayload = {
        id: user.id,
        email: user.email ?? null,
        name: quizData.name ?? null,
        level: INITIAL_USER_LEVEL,
        total_points: vitalityScore,
        quiz_data: quizData, // Store quiz answers as JSONB
        onboarding_completed: true,
      };

      console.log("Upserting profile with payload:", profilePayload);

      // Upsert profile: Create if not exists, update if exists
      // Set onboarding_completed = true to mark quiz as done
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: 'id' })
        .select();

      if (profileError) {
        console.error("Profile upsert error details:", {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code,
        });
        toast.error(`Erro ao salvar perfil: ${profileError.message}`);
        return;
      }

      console.log("Profile upserted successfully:", profileData);

      // Quiz results payload for onboarding_results table
      const quizResultsPayload = {
        user_id: user.id,
        quiz_data: quizData,
        vitality_score: vitalityScore,
        flags,
        badges,
        completed_at: new Date().toISOString(),
      };

      console.log("Inserting quiz results with payload:", quizResultsPayload);

      // Save quiz results to onboarding_results table
      const { data: quizResultData, error: quizError } = await supabase
        .from("onboarding_results")
        .insert(quizResultsPayload)
        .select();

      if (quizError) {
        console.error("Quiz insert error details:", {
          message: quizError.message,
          details: quizError.details,
          hint: quizError.hint,
          code: quizError.code,
        });
        toast.error(`Erro ao salvar questionário: ${quizError.message}`);
        return;
      }

      console.log("Quiz results saved successfully:", quizResultData);

      toast.success("Questionário concluído com sucesso!");
      router.push("/plans");
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast.error("Erro ao processar questionário");
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Informações Básicas
            </h2>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome</Label>
              <Input
                id="name"
                value={quizData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="bg-[#0D0D0D] border-white/10 text-white"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Idade</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => incrementNumber("age", -1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quizData.age}
                  onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
                  className="bg-[#0D0D0D] border-white/10 text-white text-center"
                />
                <Button
                  type="button"
                  onClick={() => incrementNumber("age", 1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Altura (cm)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => incrementNumber("height", -1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quizData.height}
                  onChange={(e) => updateField("height", parseInt(e.target.value) || 0)}
                  className="bg-[#0D0D0D] border-white/10 text-white text-center"
                />
                <Button
                  type="button"
                  onClick={() => incrementNumber("height", 1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Peso (kg)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => incrementNumber("weight", -1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quizData.weight}
                  onChange={(e) => updateField("weight", parseInt(e.target.value) || 0)}
                  className="bg-[#0D0D0D] border-white/10 text-white text-center"
                />
                <Button
                  type="button"
                  onClick={() => incrementNumber("weight", 1)}
                  className="bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black border border-white/10"
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Biomarcadores Críticos
            </h2>

            <div className="space-y-3">
              <Label className="text-white">
                Na última semana, com que frequência você acordou com uma ereção?
              </Label>
              <RadioGroup
                value={quizData.morningErection}
                onValueChange={(value) => updateField("morningErection", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="text-white cursor-pointer flex-1">
                    Todos os dias (+20 Vitality Score)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="sometimes" id="sometimes" />
                  <Label htmlFor="sometimes" className="text-white cursor-pointer flex-1">
                    Algumas vezes (3-4 dias) (+10 Vitality Score)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="rarely" id="rarely" />
                  <Label htmlFor="rarely" className="text-white cursor-pointer flex-1">
                    Raramente ou Nunca (⚠️ Critical Alert)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-white">
                Como você descreveria sua composição corporal atual?
              </Label>
              <RadioGroup
                value={quizData.bodyComposition}
                onValueChange={(value) => updateField("bodyComposition", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="defined" id="defined" />
                  <Label htmlFor="defined" className="text-white cursor-pointer flex-1">
                    Definido (Baixo risco)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="athletic" id="athletic" />
                  <Label htmlFor="athletic" className="text-white cursor-pointer flex-1">
                    Atlético
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="skinny_fat" id="skinny_fat" />
                  <Label htmlFor="skinny_fat" className="text-white cursor-pointer flex-1">
                    Falso Magro (⚠️ High Metabolic Risk)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="overweight" id="overweight" />
                  <Label htmlFor="overweight" className="text-white cursor-pointer flex-1">
                    Sobrepeso visível (⚠️ Max Risk)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Constituição & Sono
            </h2>

            <div className="space-y-3">
              <Label className="text-white">
                Média de sono ininterrupto?
              </Label>
              <RadioGroup
                value={quizData.sleepDuration}
                onValueChange={(value) => updateField("sleepDuration", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-white cursor-pointer flex-1">
                    &lt; 6h (Penalidade Constituição)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good" className="text-white cursor-pointer flex-1">
                    6h-7h
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="optimal" id="optimal" />
                  <Label htmlFor="optimal" className="text-white cursor-pointer flex-1">
                    7h-9h (✨ Bônus Constituição)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-white">
                Uso de telas na cama?
              </Label>
              <RadioGroup
                value={quizData.screenUsage}
                onValueChange={(value) => updateField("screenUsage", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="until_sleep" id="until_sleep" />
                  <Label htmlFor="until_sleep" className="text-white cursor-pointer flex-1">
                    Sim, até dormir
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="blue_filter" id="blue_filter" />
                  <Label htmlFor="blue_filter" className="text-white cursor-pointer flex-1">
                    Sim, com filtro azul
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="no_screen" id="no_screen" />
                  <Label htmlFor="no_screen" className="text-white cursor-pointer flex-1">
                    Não, paro 1h antes (🏆 Badge: Monk Start)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Nutrição
            </h2>

            <div className="space-y-3">
              <Label className="text-white">
                Fonte de gordura predominante?
              </Label>
              <RadioGroup
                value={quizData.fatSource}
                onValueChange={(value) => updateField("fatSource", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="healthy" id="healthy" />
                  <Label htmlFor="healthy" className="text-white cursor-pointer flex-1">
                    Ovos, Carne, Manteiga (✨ Pró-Andro)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="inflammatory" id="inflammatory" />
                  <Label htmlFor="inflammatory" className="text-white cursor-pointer flex-1">
                    Margarina, Óleo Soja/Frituras (⚠️ Inflamatório)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="avoid" id="avoid" />
                  <Label htmlFor="avoid" className="text-white cursor-pointer flex-1">
                    Evito gorduras (⚠️ Risco Deficiência)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-white">
                Onde você bebe água?
              </Label>
              <RadioGroup
                value={quizData.waterContainer}
                onValueChange={(value) => updateField("waterContainer", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="plastic" id="plastic" />
                  <Label htmlFor="plastic" className="text-white cursor-pointer flex-1">
                    Garrafa Plástico (⚠️ Toxin Alert)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="glass" id="glass" />
                  <Label htmlFor="glass" className="text-white cursor-pointer flex-1">
                    Vidro/Inox (✨ +Pontos Detox)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Treino & Mente
            </h2>

            <div className="space-y-3">
              <Label className="text-white">
                Foco atual de exercício?
              </Label>
              <RadioGroup
                value={quizData.exerciseFocus}
                onValueChange={(value) => updateField("exerciseFocus", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="weights" id="weights" />
                  <Label htmlFor="weights" className="text-white cursor-pointer flex-1">
                    Pesos/Calistenia/Crossfit (✨ Anabólico)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="cardio" id="cardio" />
                  <Label htmlFor="cardio" className="text-white cursor-pointer flex-1">
                    Corrida longa/Ciclismo (⚠️ Risco Cortisol)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="sedentary" id="sedentary" />
                  <Label htmlFor="sedentary" className="text-white cursor-pointer flex-1">
                    Sedentário
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-white">
                Sensação ao final do dia?
              </Label>
              <RadioGroup
                value={quizData.dailyFeeling}
                onValueChange={(value) => updateField("dailyFeeling", value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="energized" id="energized" />
                  <Label htmlFor="energized" className="text-white cursor-pointer flex-1">
                    Energizado/Focado
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="text-white cursor-pointer flex-1">
                    Cansado normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#00FF00]/30 cursor-pointer">
                  <RadioGroupItem value="exhausted" id="exhausted" />
                  <Label htmlFor="exhausted" className="text-white cursor-pointer flex-1">
                    &quot;Frito&quot; mentalmente/Ansioso (⚠️ Sympathetic Dominance)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A1A1AA]">
              Passo {currentStep} de {TOTAL_STEPS}
            </span>
            <span className="text-sm text-[#00FF00] font-bold">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Card */}
        <div className="bg-[#1A1A1A] border border-[#00FF00]/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,0,0.15)]">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 bg-[#0D0D0D] border-white/10 hover:bg-[#1A1A1A] text-white"
              >
                Voltar
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-bold"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#00FF00] hover:bg-[#00FF00]/90 text-black font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  "Finalizar"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
