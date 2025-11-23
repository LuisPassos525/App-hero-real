import Link from "next/link";
import { Trophy, Flame, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF00] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              <Trophy className="w-5 h-5 text-[#0D0D0D]" />
            </div>
            <h1 className="font-black tracking-tighter text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-white/80 uppercase italic">
              HERO
            </h1>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#00FF00] hover:text-black transition-all border border-white/10 hover:border-[#00FF00] text-sm font-medium"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/20 mb-8">
            <Zap className="w-4 h-4 text-[#00FF00]" />
            <span className="text-xs font-bold text-[#00FF00] uppercase tracking-wider">
              Otimização Masculina
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black font-[var(--font-poppins)] mb-6 leading-tight">
            Transforme Seus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#00FF00]/60">
              Hábitos
            </span>
            <br />
            Em Superpoderes
          </h1>
          
          <p className="text-lg md:text-xl text-[#A1A1AA] mb-12 max-w-2xl mx-auto font-[var(--font-inter)]">
            Aumente sua testosterona naturalmente através da gamificação de hábitos saudáveis. 
            Sistema de pontos, níveis e recompensas visuais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-[#00FF00] text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all text-lg"
            >
              Começar Agora
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-[#1A1A1A] text-white font-bold hover:bg-[#1A1A1A]/80 transition-all border border-white/10 text-lg"
            >
              Já Tenho Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 hover:border-[#00FF00]/30 transition-all">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6">
                <Flame className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-[var(--font-poppins)]">Sistema de Streak</h3>
              <p className="text-[#A1A1AA] font-[var(--font-inter)]">
                Mantenha sua sequência de dias cumprindo ≥60% dos hábitos diários. 
                Cada dia conta para seu progresso.
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 hover:border-[#00FF00]/30 transition-all">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-[var(--font-poppins)]">Metas Dinâmicas</h3>
              <p className="text-[#A1A1AA] font-[var(--font-inter)]">
                Algoritmo inteligente ajusta a dificuldade automaticamente. 
                Quanto mais você evolui, maiores os desafios.
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-8 hover:border-[#00FF00]/30 transition-all">
              <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-[var(--font-poppins)]">Gamificação Total</h3>
              <p className="text-[#A1A1AA] font-[var(--font-inter)]">
                Ganhe XP, suba de nível e desbloqueie conquistas. 
                Transforme disciplina em jogo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-sm text-[#A1A1AA]">
        <p>&copy; 2024 HERO. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
