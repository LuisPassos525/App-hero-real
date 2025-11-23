import { Flame, TrendingUp, Award } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
          Bem-vindo, Herói! 🦁
        </h2>
        <p className="text-secondary">
          Continue sua jornada de otimização hoje
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg p-6 border border-white/10 hover:shadow-glow transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Streak Atual
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-primary">0</p>
          <p className="text-sm text-secondary mt-1">dias consecutivos</p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-white/10 hover:shadow-glow transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Pontos Totais
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-primary">0</p>
          <p className="text-sm text-secondary mt-1">pontos conquistados</p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-white/10 hover:shadow-glow transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Nível
            </h3>
          </div>
          <p className="text-4xl font-heading font-bold text-primary">1</p>
          <p className="text-sm text-secondary mt-1">iniciante</p>
        </div>
      </section>

      {/* Daily Habits Section */}
      <section>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
          Hábitos de Hoje
        </h3>
        <div className="bg-surface rounded-lg p-8 border border-white/10 text-center">
          <p className="text-secondary">
            Configure seus hábitos para começar sua jornada
          </p>
        </div>
      </section>
    </div>
  );
}
