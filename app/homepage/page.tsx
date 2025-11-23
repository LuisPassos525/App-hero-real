"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Settings, 
  ChevronLeft, 
  Trophy, 
  Target, 
  Activity, 
  Flame, 
  CheckCircle2, 
  Dumbbell,
  Cigarette,
  Home,
  BarChart3,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- CONSTANTES VISUAIS (NEON TECH THEME) ---
const THEME = {
  bg: "bg-[#0D0D0D]",      // Preto Profundo
  card: "bg-[#1A1A1A]",    // Surface Dark Grey
  accent: "#00FF00",       // Verde Neon Puro
  textMain: "text-white",
  textMuted: "text-[#A1A1AA]",
  border: "border-white/10",
  glow: "shadow-[0_0_15px_rgba(0,255,0,0.15)]",
  glowActive: "shadow-[0_0_20px_rgba(0,255,0,0.4)]"
};

const WEEKLY_DATA = [
  { name: 'Seg', saude: 40 },
  { name: 'Ter', saude: 55 },
  { name: 'Qua', saude: 50 },
  { name: 'Qui', saude: 65 },
  { name: 'Sex', saude: 70 },
  { name: 'Sab', saude: 85 },
  { name: 'Dom', saude: 82 },
];

type Habit = {
  id: number;
  title: string;
  category: 'health' | 'vice' | 'exercise';
  points: number;
  completed: boolean;
  isHardMode?: boolean; 
};

type User = {
  name: string;
  email: string;
  avatar: string | null;
  streak: number;
  points: number;
};

// --- COMPONENTES ---

const BottomNav = ({ currentView, onViewChange }: { currentView: string, onViewChange: (v: string) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'metas', icon: Target, label: 'Metas' },
    { id: 'progresso', icon: BarChart3, label: 'Progresso' },
    { id: 'settings', icon: Settings, label: 'Configs' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0D0D0D]/90 backdrop-blur-lg border-t border-white/10 pb-6 pt-3 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-[#00FF00] -translate-y-1' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#00FF00] mt-1 shadow-[0_0_5px_#00FF00]" />}
            </button>
          )
        })}
      </div>
    </nav>
  );
};

const Header = ({ user, onViewChange }: { user: User, onViewChange: (v: string) => void }) => (
  <header className="fixed top-0 w-full z-50 px-5 py-4 flex justify-between items-center border-b border-white/5 bg-[#0D0D0D]/90 backdrop-blur-md">
    <div className="flex items-center gap-3">
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center relative">
        <Image src="/logo.png" alt="HERO Logo" width={40} height={40} className="object-contain" />
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF00] to-white/80">
            HERO
          </span>
        </h1>
        <p className="text-[10px] font-medium text-[#A1A1AA] tracking-wide">Bem-vindo, Herói</p>
      </div>
    </div>
    
    <div 
      onClick={() => onViewChange('settings')}
      className="cursor-pointer relative group"
    >
      <div className={`w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-[#00FF00] transition-colors ${THEME.glow}`}>
        {user.avatar ? (
          <Image src={user.avatar} alt="Profile" width={40} height={40} className="object-cover" />
        ) : (
          <span className="text-sm font-bold text-white group-hover:text-[#00FF00]">{user.name.charAt(0)}</span>
        )}
      </div>
    </div>
  </header>
);

const StatCard = ({ icon: Icon, value, label, sublabel, accentColor = "text-[#00FF00]" }: { 
  icon: React.ElementType; 
  value: string | number; 
  label: string; 
  sublabel?: string; 
  accentColor?: string;
}) => (
  <div className={`bg-[#1A1A1A] border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center text-center hover:border-[#00FF00]/30 transition-all group min-h-[100px]`}>
    <Icon className={`w-4 h-4 mb-2 ${accentColor} opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.5)] transition-all`} />
    <span className="text-xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA]">{label}</span>
    {sublabel && <span className="text-[8px] text-[#00FF00] mt-1 font-mono">{sublabel}</span>}
  </div>
);

const DayCarousel = () => {
  const days = Array.from({ length: 7 }, (_, i) => i + 15);
  return (
    <div className="flex space-x-2 overflow-x-auto pb-4 pt-2 no-scrollbar mask-fade-sides">
      {days.map((day, idx) => {
        const isToday = idx === 3;
        const isFuture = idx > 3;
        return (
          <div 
            key={day}
            className={`
              flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center border transition-all duration-300
              ${isToday 
                ? `bg-[#00FF00] border-[#00FF00] text-black scale-105 ${THEME.glowActive}`
                : isFuture 
                  ? 'bg-[#1A1A1A]/30 border-white/5 opacity-30 cursor-not-allowed' 
                  : 'bg-[#1A1A1A] border-white/5 text-[#A1A1AA] hover:border-white/20'}
            `}
          >
            <span className={`text-[8px] font-bold uppercase mb-0.5 ${isToday ? 'opacity-80' : 'opacity-40'}`}>NOV</span>
            <span className="text-lg font-black font-[Poppins]">{day}</span>
          </div>
        )
      })}
    </div>
  );
};

const HabitItem = ({ habit, onToggle }: { habit: Habit, onToggle: (id: number) => void }) => {
  return (
    <div 
      onClick={() => onToggle(habit.id)}
      className={`
        relative group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer mb-2.5 overflow-hidden
        ${habit.completed 
          ? 'bg-[#00FF00]/5 border-[#00FF00]/20' 
          : 'bg-[#1A1A1A] border-white/5 hover:border-[#00FF00]/40'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FF00]/0 via-[#00FF00]/0 to-[#00FF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center gap-3 z-10">
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center transition-all
          ${habit.completed 
            ? 'bg-[#00FF00] text-black shadow-[0_0_10px_rgba(0,255,0,0.4)]' 
            : 'bg-[#0D0D0D] text-[#A1A1AA] border border-white/10 group-hover:text-white'}
        `}>
          {habit.category === 'vice' && <Cigarette className="w-4 h-4" />}
          {habit.category === 'exercise' && <Dumbbell className="w-4 h-4" />}
          {habit.category === 'health' && <CheckCircle2 className="w-4 h-4" />}
        </div>
        <div>
          <h3 className={`font-bold text-xs ${habit.completed ? 'text-[#A1A1AA] line-through decoration-[#00FF00]/50' : 'text-white'}`}>
            {habit.title}
          </h3>
          <p className="text-[9px] text-[#00FF00] font-mono mt-0.5 tracking-wider">
             +{habit.points} XP {habit.isHardMode && <span className="text-red-500 ml-1 font-bold">HARD MODE</span>}
          </p>
        </div>
      </div>
      <div className={`
        w-5 h-5 rounded border flex items-center justify-center transition-all z-10
        ${habit.completed 
          ? 'bg-[#00FF00] border-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.5)]' 
          : 'border-[#333] group-hover:border-[#00FF00] bg-black'}
      `}>
        {habit.completed && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
      </div>
    </div>
  );
};

// --- TELAS ---

const HomeScreen = ({ user, habits, toggleHabit }: { 
  user: User; 
  habits: Habit[]; 
  toggleHabit: (id: number) => void;
}) => {
  const completedCount = habits.filter((h: Habit) => h.completed).length;
  const healthPercentage = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="pb-32 pt-24 px-5 space-y-8 animate-in fade-in duration-700 max-w-lg mx-auto">
      
      {/* SEÇÃO 1: STATS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} value={`${user.streak}`} label="Streak Dias" />
        <StatCard icon={Target} value="1/3" label="Meta Atual" sublabel="No Smoking" />
        <StatCard icon={Trophy} value={user.points} label="Total XP" />
        <StatCard icon={Activity} value={`${healthPercentage}%`} label="Bio Hacking" />
      </div>

      {/* SEÇÃO 2: HÁBITOS DE HOJE */}
      <div>
        <div className="flex justify-between items-end mb-4 border-l-2 border-[#00FF00] pl-3">
          <div>
            <h2 className="text-lg font-bold text-white leading-none font-[Poppins]">
              Protocolo Diário
            </h2>
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">Foco do dia</span>
          </div>
          <span className="text-[10px] font-mono text-[#00FF00]">NOV 2024</span>
        </div>
        
        <DayCarousel />

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
             <div className="h-[1px] w-4 bg-[#00FF00]"></div>
             <h3 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Lista de Prioridades</h3>
          </div>
          {habits.map((h: Habit) => (
            <HabitItem key={h.id} habit={h} onToggle={toggleHabit} />
          ))}
        </div>
      </div>

      {/* SEÇÃO 3: GRÁFICO */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FF00] to-transparent opacity-50" />
        <h3 className="text-[10px] font-bold text-[#A1A1AA] mb-6 flex items-center gap-2 uppercase tracking-wider">
          <Activity className="w-3 h-3 text-[#00FF00]" />
          Performance Semanal
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_DATA}>
              <defs>
                <linearGradient id="colorSaude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF00" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #333', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,255,0,0.1)' }}
                itemStyle={{ color: '#00FF00', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="saude" stroke="#00FF00" strokeWidth={2} fillOpacity={1} fill="url(#colorSaude)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEÇÃO 4: EXTRAS */}
      <div className="space-y-3">
        <button className="w-full bg-[#1A1A1A] border border-white/5 hover:border-[#00FF00]/50 p-4 rounded-xl flex items-center justify-between transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00FF00]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          <div className="flex items-center gap-4 z-10">
            <div className="bg-[#0D0D0D] border border-white/10 p-2.5 rounded-lg text-[#00FF00]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-sm">Treino Pélvico</h4>
              <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wide">Módulo de Fortalecimento</p>
            </div>
          </div>
          <ChevronLeft className="rotate-180 text-[#333] group-hover:text-[#00FF00] transition-colors z-10" />
        </button>
      </div>
    </div>
  );
};

const SettingsScreen = ({ user, onBack }: { user: User; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center z-50">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-[#1A1A1A] rounded-full transition-colors group">
          <ChevronLeft className="w-6 h-6 text-[#A1A1AA] group-hover:text-white" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-8 tracking-wider uppercase font-[Poppins]">Configurações</h1>
      </header>

      <div className="p-6 pb-20 space-y-8">
        <div className="flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full bg-[#1A1A1A] border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-[#00FF00] ${THEME.glow} overflow-hidden`}>
             {user.avatar ? (
               <Image src={user.avatar} width={96} height={96} className="object-cover" alt="User" />
             ) : (
               user.name.charAt(0)
             )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white font-[Poppins]">{user.name}</h2>
          <div className="mt-3 bg-[#00FF00]/10 text-[#00FF00] px-4 py-1 rounded-full text-[10px] font-bold border border-[#00FF00]/20 tracking-wider">
            NÍVEL {Math.floor(user.points / 1000) + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function HomePage() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState({
    name: 'Carlos Oliveira',
    email: 'carlos@hero.app',
    avatar: null,
    streak: 12,
    points: 1450,
  });

  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, title: 'No Smoking Protocol', category: 'vice', points: 150, completed: true, isHardMode: true },
    { id: 2, title: 'Kegel Routine', category: 'health', points: 50, completed: false },
    { id: 3, title: 'Hydration 3L', category: 'health', points: 30, completed: false },
    { id: 4, title: 'Strength Training', category: 'exercise', points: 100, completed: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newStatus = !h.completed;
        setUser(u => ({
          ...u,
          points: newStatus ? u.points + h.points : u.points - h.points
        }));
        return { ...h, completed: newStatus };
      }
      return h;
    }));
  };

  return (
    <div className={`bg-[#0D0D0D] min-h-screen font-sans text-white selection:bg-[#00FF00]/30 selection:text-white`}>
      
      {view === 'settings' ? (
        <SettingsScreen user={user} onBack={() => setView('home')} />
      ) : (
        <>
          <Header user={user} onViewChange={setView} />
          <main className="pb-24">
            {view === 'home' && <HomeScreen user={user} habits={habits} toggleHabit={toggleHabit} />}
            {view === 'metas' && <div className="pt-24 px-5 text-center text-[#A1A1AA]">Tela de Metas em Construção...</div>}
            {view === 'progresso' && <div className="pt-24 px-5 text-center text-[#A1A1AA]">Tela de Progresso em Construção...</div>}
          </main>
          <BottomNav currentView={view} onViewChange={setView} />
        </>
      )}
    </div>
  );
}
