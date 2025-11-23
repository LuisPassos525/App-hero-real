import { Flame, TrendingUp, Award } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-[#00FF00] to-[#00DD00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,0,0.3)] mb-2">
          Bem-vindo, Herói! 🦁
        </h2>
        <p className="text-secondary">
          Continue sua jornada de otimização hoje
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <Flame className="w-6 h-6 text-[#00FF00]" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Streak Atual
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">0</p>
          <p className="text-sm text-secondary mt-1">dias consecutivos</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <TrendingUp className="w-6 h-6 text-[#00FF00]" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Pontos Totais
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">0</p>
          <p className="text-sm text-secondary mt-1">pontos conquistados</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <Award className="w-6 h-6 text-[#00FF00]" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Nível
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">1</p>
          <p className="text-sm text-secondary mt-1">iniciante</p>
        </div>
      </section>

      {/* Daily Habits Section */}
      <section>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
          Hábitos de Hoje
        </h3>
        <div className="bg-[#1A1A1A] rounded-lg p-8 border border-white/5 text-center hover:border-[#00FF00]/10 transition-all">
          <p className="text-secondary">
            Configure seus hábitos para começar sua jornada
          </p>
        </div>
      </section>
    </div>
  );
}
