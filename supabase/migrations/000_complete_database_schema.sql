-- =====================================================
-- HERO PWA - COMPLETE DATABASE SCHEMA
-- =====================================================
-- 
-- ⚠️ WARNING: This script will DROP ALL EXISTING TABLES
-- and recreate everything from scratch!
--
-- Run this in Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste > Run
-- =====================================================

-- =====================================================
-- SUPABASE CONFIGURATION CHECKLIST (Do this FIRST!)
-- =====================================================
-- 1. Go to: Authentication > URL Configuration
-- 2. Add these URLs to "Redirect URLs":
--    - http://localhost:3000/auth/callback
--    - http://localhost:3000/auth/callback?next=/quiz
--    - https://your-production-domain.com/auth/callback
--    - https://your-production-domain.com/auth/callback?next=/quiz
-- 
-- 3. Set "Site URL" to your production URL
--    (or http://localhost:3000 for local development)
-- =====================================================


-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES (CASCADE)
-- =====================================================
-- This removes all existing data and tables!

DROP TABLE IF EXISTS public.daily_logs CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;
DROP TABLE IF EXISTS public.onboarding_results CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- =====================================================
-- STEP 2: CREATE PROFILES TABLE
-- =====================================================
-- Main user profile with gamification and subscription data

CREATE TABLE public.profiles (
  -- Primary key linked to auth.users
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  
  -- Gamification
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Subscription/Plan
  has_active_plan BOOLEAN DEFAULT FALSE,
  plan_tier TEXT DEFAULT 'free', -- Valid values: 'free', 'starter', 'quarterly', 'elite'
  CONSTRAINT plan_tier_valid CHECK (plan_tier IN ('free', 'starter', 'quarterly', 'elite')),
  plan_expires_at TIMESTAMPTZ,
  
  -- Onboarding
  quiz_data JSONB, -- Stores all quiz answers
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Settings (JSONB for flexibility)
  settings JSONB DEFAULT '{"language": "pt-BR", "notifications": true, "theme": "dark"}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for middleware state machine checks
CREATE INDEX idx_profiles_onboarding_state ON profiles(onboarding_completed, total_points);
CREATE INDEX idx_profiles_has_active_plan ON profiles(has_active_plan);
CREATE INDEX idx_profiles_email ON profiles(email);


-- =====================================================
-- STEP 3: CREATE HABITS TABLE
-- =====================================================
-- User habits with categories and gamification

CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Habit Info
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  category TEXT NOT NULL CHECK (category IN ('vice', 'health', 'training')),
  
  -- Gamification
  base_points INTEGER DEFAULT 50,
  is_hard_mode_active BOOLEAN DEFAULT FALSE,
  hard_mode_multiplier NUMERIC(3,2) DEFAULT 1.5,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_category ON habits(category);


-- =====================================================
-- STEP 4: CREATE DAILY LOGS TABLE
-- =====================================================
-- Tracks daily habit completions

CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Date (one log per user per day)
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Completed habits (array of habit IDs)
  completed_habits UUID[] DEFAULT '{}',
  
  -- Daily Stats
  daily_score INTEGER DEFAULT 0,
  health_percentage INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one log per user per day
  CONSTRAINT unique_daily_log UNIQUE (user_id, log_date)
);

CREATE INDEX idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date);


-- =====================================================
-- STEP 5: CREATE GOALS TABLE
-- =====================================================
-- User goals with target days and progress tracking

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  
  -- Goal Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Progress
  target_days INTEGER NOT NULL DEFAULT 30,
  current_progress INTEGER DEFAULT 0,
  
  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  is_failed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_habit_id ON goals(habit_id);


-- =====================================================
-- STEP 6: CREATE ONBOARDING RESULTS TABLE
-- =====================================================
-- Stores detailed quiz results and analysis

CREATE TABLE public.onboarding_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Quiz Data
  quiz_data JSONB NOT NULL,
  vitality_score INTEGER NOT NULL DEFAULT 0,
  
  -- Analysis Flags (e.g., 'critical_alert', 'max_risk')
  flags TEXT[] DEFAULT '{}',
  
  -- Earned Badges (e.g., 'Monk Start', 'Iron Warrior')
  badges TEXT[] DEFAULT '{}',
  
  -- Timestamps
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_onboarding_results_user_id ON onboarding_results(user_id);


-- =====================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_results ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- STEP 8: RLS POLICIES FOR PROFILES
-- =====================================================

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);


-- =====================================================
-- STEP 9: RLS POLICIES FOR HABITS
-- =====================================================

CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- STEP 10: RLS POLICIES FOR DAILY LOGS
-- =====================================================

CREATE POLICY "Users can view their own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id);


-- =====================================================
-- STEP 11: RLS POLICIES FOR GOALS
-- =====================================================

CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- STEP 12: RLS POLICIES FOR ONBOARDING RESULTS
-- =====================================================

CREATE POLICY "Users can view their own onboarding results"
  ON onboarding_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding results"
  ON onboarding_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- STEP 13: CREATE AUTO-UPDATE TIMESTAMP FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';


-- =====================================================
-- STEP 14: CREATE TRIGGERS FOR AUTO-UPDATE
-- =====================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- STEP 15: CREATE FUNCTION TO HANDLE NEW USER SIGNUP
-- =====================================================
-- Automatically creates a profile when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the setup:

-- Check all tables:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check policies on profiles:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

-- Check RLS is enabled:
-- SELECT relname, relrowsecurity FROM pg_class 
-- WHERE relname IN ('profiles', 'habits', 'daily_logs', 'goals', 'onboarding_results');

-- Check triggers:
-- SELECT trigger_name, event_object_table FROM information_schema.triggers 
-- WHERE trigger_schema = 'public';


-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Your database is now ready for the HERO app.
-- 
-- Tables created:
-- 1. profiles - User profiles with gamification
-- 2. habits - User habits (vice/health/training)
-- 3. daily_logs - Daily habit completion logs
-- 4. goals - User goals with progress tracking
-- 5. onboarding_results - Quiz results and analysis
--
-- Features:
-- ✓ Row Level Security (RLS) on all tables
-- ✓ Auto-update timestamps via triggers
-- ✓ Auto-create profile on user signup
-- ✓ Indexes for optimized queries
-- =====================================================
