"use client";

import { Flame, TrendingUp, Award, Target, Zap, Activity, CheckCircle2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for charts
const progressData = [
  { day: "Seg", points: 45, health: 60 },
  { day: "Ter", points: 68, health: 75 },
  { day: "Qua", points: 82, health: 85 },
  { day: "Qui", points: 95, health: 90 },
  { day: "Sex", points: 78, health: 80 },
  { day: "Sáb", points: 88, health: 88 },
  { day: "Dom", points: 92, health: 92 },
];

const weeklyData = [
  { week: "S1", score: 320 },
  { week: "S2", score: 485 },
  { week: "S3", score: 567 },
  { week: "S4", score: 698 },
];

const habits = [
  { id: 1, title: "Treino Matinal", category: "training", completed: true, points: 50 },
  { id: 2, title: "8h de Sono", category: "health", completed: true, points: 40 },
  { id: 3, title: "Não Fumar", category: "vice", completed: false, points: 80 },
  { id: 4, title: "Meditação 10min", category: "health", completed: true, points: 30 },
  { id: 5, title: "Leitura 30min", category: "general", completed: false, points: 25 },
];

export default function HeroAppShowcase() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section with Metallic Title */}
      <section className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-[#00FF00] via-[#00DD00] to-[#00CC00] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,0,0.5)] mb-4">
          HERO APP
        </h1>
        <p className="text-xl text-secondary">Premium Tech • Dark Minimalist • High Performance</p>
        <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#00FF00] to-transparent shadow-[0_0_15px_rgba(0,255,0,0.6)]"></div>
      </section>

      {/* Stats Overview - Premium Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <Flame className="w-6 h-6 text-[#00FF00]" />
            </div>
            <span className="text-xs text-secondary">Streak</span>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">27</p>
          <p className="text-sm text-secondary mt-2">dias consecutivos</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <TrendingUp className="w-6 h-6 text-[#00FF00]" />
            </div>
            <span className="text-xs text-secondary">Total</span>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">2.847</p>
          <p className="text-sm text-secondary mt-2">pontos acumulados</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <Award className="w-6 h-6 text-[#00FF00]" />
            </div>
            <span className="text-xs text-secondary">Level</span>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">12</p>
          <p className="text-sm text-secondary mt-2">guerreiro avançado</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#00FF00]/10 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)]">
              <Activity className="w-6 h-6 text-[#00FF00]" />
            </div>
            <span className="text-xs text-secondary">Saúde</span>
          </div>
          <p className="text-4xl font-heading font-bold text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">92%</p>
          <p className="text-sm text-secondary mt-2">índice de saúde</p>
        </div>
      </section>

      {/* Charts Section - Recharts with Neon Green */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress Chart */}
        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/10 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold text-foreground">Progresso Semanal</h3>
            <Zap className="w-5 h-5 text-[#00FF00]" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                stroke="#A1A1AA" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#A1A1AA' }}
              />
              <YAxis 
                stroke="#A1A1AA" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#A1A1AA' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D0D0D', 
                  border: '1px solid rgba(0, 255, 0, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
                }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#00FF00' }}
              />
              <Area 
                type="monotone" 
                dataKey="points" 
                stroke="#00FF00" 
                strokeWidth={2}
                fill="url(#colorPoints)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Score Chart */}
        <div className="bg-[#1A1A1A] rounded-lg p-6 border border-white/5 hover:border-[#00FF00]/10 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold text-foreground">Score Mensal</h3>
            <Target className="w-5 h-5 text-[#00FF00]" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyData}>
              <XAxis 
                dataKey="week" 
                stroke="#A1A1AA" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#A1A1AA' }}
              />
              <YAxis 
                stroke="#A1A1AA" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#A1A1AA' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D0D0D', 
                  border: '1px solid rgba(0, 255, 0, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
                }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#00FF00' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#00FF00" 
                strokeWidth={3}
                dot={{ fill: '#00FF00', strokeWidth: 2, r: 6, stroke: '#0D0D0D' }}
                activeDot={{ 
                  r: 8, 
                  fill: '#00FF00',
                  stroke: '#0D0D0D',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.8))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Daily Habits - Interactive List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-heading font-bold text-foreground">Hábitos de Hoje</h3>
          <span className="text-sm text-secondary">3/5 completos</span>
        </div>
        <div className="space-y-3">
          {habits.map((habit) => (
            <div 
              key={habit.id}
              className={`bg-[#1A1A1A] rounded-lg p-4 border transition-all ${
                habit.completed 
                  ? 'border-[#00FF00]/20 shadow-[0_0_15px_rgba(0,255,0,0.2)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    habit.completed 
                      ? 'bg-[#00FF00]/20 shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                      : 'bg-[#1A1A1A] border border-white/5'
                  }`}>
                    {habit.completed && (
                      <CheckCircle2 className="w-6 h-6 text-[#00FF00]" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-heading font-semibold ${
                      habit.completed ? 'text-[#00FF00]' : 'text-foreground'
                    }`}>
                      {habit.title}
                    </h4>
                    <p className="text-sm text-secondary capitalize">{habit.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-heading font-bold ${
                    habit.completed 
                      ? 'text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]' 
                      : 'text-secondary'
                  }`}>
                    +{habit.points}
                  </p>
                  <p className="text-xs text-secondary">pontos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#121212] rounded-lg p-8 border border-[#00FF00]/20 shadow-[0_0_30px_rgba(0,255,0,0.2)] text-center">
        <h3 className="text-2xl font-heading font-bold bg-gradient-to-r from-[#00FF00] to-[#00DD00] bg-clip-text text-transparent mb-4">
          Continue Sua Evolução
        </h3>
        <p className="text-secondary mb-6">
          Mantenha o foco e conquiste seus objetivos diariamente
        </p>
        <button className="px-8 py-3 bg-[#00FF00] text-[#0D0D0D] font-heading font-semibold rounded-lg hover:bg-[#00DD00] transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)]">
          Completar Mais Hábitos
        </button>
      </section>
    </div>
  );
}
