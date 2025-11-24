# 🦁 HERO - Plataforma de Otimização Masculina

## 1. Visão Geral do Projeto

HERO é uma Web App Progressiva (PWA) focada na saúde masculina e aumento natural de testosterona através da gamificação de hábitos saudáveis. O sistema utiliza monitoramento de rotina, metas dinâmicas e recompensas visuais para manter o engajamento.

**Objetivo Principal:** Ajudar homens a construírem disciplina através de um sistema de pontuação e níveis, com uma estética high-tech e premium.

## 2. Stack Tecnológica (Vibe Coding Optimized)

Para garantir desenvolvimento rápido e compatibilidade total com assistentes de IA (GitHub Copilot/Cursor):

* **Core:** Next.js 14+ (App Router)
* **Linguagem:** TypeScript (Strict Mode obrigatório)
* **Estilização:** Tailwind CSS (Mobile-first)
* **Componentes:** Shadcn/ui (Radix UI base) + Lucide React (Ícones)
* **Animações:** Framer Motion (para micro-interações)
* **Gráficos:** Recharts (Estilizados minimalistas)
* **Backend & Auth:** Supabase (PostgreSQL, Auth, Edge Functions)
* **Deploy:** Vercel

## 3. Diretrizes de Codificação para IA

**ATENÇÃO:** Toda geração de código deve seguir estritamente estas regras:

### 3.1. Qualidade e Limpeza (Clean Code)

* Princípios **SOLID**: Componentes devem ter responsabilidade única.
* **Tipagem Forte:** Proibido uso de `any`. Defina interfaces para todas as props e dados do Supabase.
* **Nomes Descritivos:** Funções e variáveis devem explicar o que fazem (ex: `calculateWeeklyProgress`).
* **DRY (Don't Repeat Yourself):** Extraia lógicas repetidas para Hooks customizados.

### 3.2. Estrutura de Arquivos (App Router)

```
/app
  /components     # Componentes UI reutilizáveis (Atomic Design simplificado)
  /(auth)         # Rotas de login/registro (Route Groups)
  /(dashboard)    # Rotas protegidas (Home, Profile)
  /lib            # Utilitários, Clientes Supabase, Helpers de Data
  /types          # Definições globais de tipos TypeScript
```

### 3.3. Segurança (Crítico)

* **RLS (Row Level Security):** TODA tabela no Supabase deve ter RLS ativado. O usuário só pode ler/editar seus próprios dados.
* **Validação de Inputs:** Utilizar Zod para validar formulários.
* **Autenticação:** Middleware do Next.js deve proteger rotas privadas (`/dashboard`, `/profile`).

## 4. Regras de Negócio e Funcionalidades

### 4.1. Sistema de Pontuação e Níveis

* **Cálculo de Streak:** Um dia conta para o streak se o usuário completar ≥ 60% dos hábitos diários.
* **Pontuação:** Soma total de pontos dos hábitos concluídos.
* **Hábitos "Vícios":** (ex: Fumar) valem mais pontos que "Saúde".
* **Hard Mode:** Se um hábito for negligenciado por >2 dias, seu valor aumenta para incentivar a retomada.

### 4.2. Metas Dinâmicas (Algoritmo de Dificuldade)

O sistema deve ajustar a dificuldade automaticamente.

**Exemplo:**

* "Não fumar por 7 dias".
* Se completado: Nova meta "Não fumar por 15 dias".
* Se falhou: Reseta o progresso da meta.

### 4.3. Interface e UX

* Header: Transparente/Glassmorphism sutil, focado na imersão.
* Navegação no Tempo: Carrossel de dias (Futuro bloqueado, Passado histórico).
* Interatividade: Feedback visual imediato (Verde Neon) ao completar tarefas.

## 5. Estrutura de Dados (Supabase Schema Suggestion)

A IA deve usar este esboço para criar as migrações SQL:

### profiles

* id (uuid, FK auth.users)
* username
* avatar_url
* level
* total_points
* current_streak
* settings (jsonb: language, notifications)

### habits

* id
* title
* category (vice, health, training)
* base_points
* is_hard_mode_active (boolean)

### daily_logs

* id
* user_id
* date
* completed_habits (array of habit_ids)
* daily_score
* health_percentage

### onboarding_results (Novo)

* id
* user_id (uuid, FK auth.users)
* quiz_data (jsonb: armazena todas as respostas do quiz)
* vitality_score (integer: pontuação calculada 0-100+)
* flags (text[]: alertas como 'critical_alert', 'toxin_alert', etc.)
* badges (text[]: conquistas como 'Monk Start', 'Nutrition Pro', etc.)
* completed_at (timestamp)
* created_at (timestamp)
* updated_at (timestamp)

## 6. Setup do Projeto

### 6.1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com suas credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6.2. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

### 6.3. Criação da Tabela de Onboarding no Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- Criar tabela de resultados do onboarding
CREATE TABLE onboarding_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_data JSONB NOT NULL,
  vitality_score INTEGER NOT NULL DEFAULT 0,
  flags TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE onboarding_results ENABLE ROW LEVEL SECURITY;

-- Policy: Usuário só pode ver seus próprios resultados
CREATE POLICY "Users can view their own onboarding results"
  ON onboarding_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Usuário pode inserir seus próprios resultados
CREATE POLICY "Users can insert their own onboarding results"
  ON onboarding_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Usuário pode atualizar seus próprios resultados
CREATE POLICY "Users can update their own onboarding results"
  ON onboarding_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Criar índice para melhor performance
CREATE INDEX idx_onboarding_user_id ON onboarding_results(user_id);
```

## 7. Requisitos PWA (Progressive Web App)

* Manifesto: `manifest.json` configurado com fundo `#0D0D0D` e ícones Neon.
* Offline: Service Workers básicos.
* Responsividade: Layout Mobile-First. Nenhum elemento deve quebrar em telas de 320px.
* Touch Targets: Mínimo 44px para botões.

## 7. Fluxo de Navegação

* Landing Page → CTA Cadastro (`/register`)
* Cadastro → Onboarding Quiz (`/quiz`)
* Quiz → Dashboard (Home) (`/homepage`)
* Dashboard (Home) → Visão geral de progresso
* Configurações/Perfil → Gestão de conta

### 7.1. Onboarding Flow (Implementado)

O sistema de onboarding consiste em:

1. **Landing Page** (`/`):
   - Logo HERO com gradiente verde neon
   - CTA principal redireciona para `/register`
   - Apresentação de features principais

2. **Página de Registro** (`/register`):
   - Formulário com validação Zod
   - Campos: Nome, Email, Senha, Confirmar Senha
   - Integração com Supabase Auth
   - Toast notifications para feedback
   - Redirecionamento automático para `/quiz` após sucesso

3. **Quiz Gamificado** (`/quiz`):
   - 5 passos progressivos com barra de progresso
   - **Passo 1:** Informações básicas (Nome, Idade, Altura, Peso com botões +/-)
   - **Passo 2:** Biomarcadores críticos (Frequência de ereção matinal, Composição corporal)
   - **Passo 3:** Constituição & Sono (Duração do sono, Uso de telas)
   - **Passo 4:** Nutrição (Fontes de gordura, Tipo de recipiente de água)
   - **Passo 5:** Treino & Mente (Foco de exercício, Sensação diária)
   - Cálculo automático de Vitality Score
   - Sistema de Flags (alertas) e Badges (conquistas)
   - Salvamento no Supabase
   - Redirecionamento para `/homepage`

## 8. Definição Visual (Theme & UI)

Conceito: **Premium Tech, Dark Minimalist, High Contrast.** A estética deve evocar tecnologia de ponta e alta performance.

### 8.1. Paleta de Cores (Tailwind Extension)

As cores devem ser configuradas no `tailwind.config.ts`:

* **Background:** #0D0D0D (Preto Profundo — Não usar preto absoluto #000000)
* **Surface/Cards:** #121212 ou #1A1A1A
* **Primary / Accent:** #00FF00 (Verde Neon Vibrante)

  * Uso: Botões, Checkboxes ativos, Destaques de progresso, Glow.
* **Text Primary:** #FFFFFF
* **Text Secondary:** #A1A1AA
* **Danger:** #FF3333

### 8.2. Tipografia

Importar e configurar no next/font:

* **Títulos (Headings):** Poppins — pesos 600 e 700
* **Corpo (Body):** Inter — pesos 400 e 500

### 8.3. Diretrizes de UI/UX

* Cards Premium: Fundos escuros (#1A1A1A), bordas sutis (border-white/10), sombras difusas.
* Glow Effects: Sombras verdes sutis (ex: `shadow-green-500/20`).
* Gráficos Clean: Linhas finas, sem grid excessivo, gradientes verticais.
* Microinterações: Animação de "check" ao marcar hábitos; transições suaves.
* Glassmorphism: Usar com moderação, principalmente no Header/Nav.

---

**Este documento é a Lei.** O design deve ser fiel à estética Tech Minimalista descrita na seção 8.
Qualquer desvio deve ser corrigido imediatamente.