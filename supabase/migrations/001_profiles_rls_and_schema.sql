-- =====================================================
-- HERO PWA - RLS Policies for Onboarding Flow
-- =====================================================
-- This migration sets up the RLS policies needed for the
-- onboarding flow. The profiles table schema already exists:
--
-- CREATE TABLE public.profiles (
--   id uuid NOT NULL,
--   email text,
--   name text,
--   avatar_url text,
--   level integer DEFAULT 1,
--   current_streak integer DEFAULT 0,
--   total_points integer DEFAULT 0,
--   has_active_plan boolean DEFAULT false,
--   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
--   onboarding_completed boolean DEFAULT false,
--   CONSTRAINT profiles_pkey PRIMARY KEY (id),
--   CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
-- );
--
-- Run this in your Supabase SQL Editor or via CLI:
-- supabase db push
-- =====================================================

-- Step 1: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Step 2: Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies for profiles

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- ONBOARDING RESULTS TABLE (if needed)
-- =====================================================

-- Create onboarding_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS onboarding_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_data JSONB NOT NULL,
  vitality_score INTEGER NOT NULL DEFAULT 0,
  flags TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on onboarding_results
ALTER TABLE onboarding_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own onboarding results" ON onboarding_results;
DROP POLICY IF EXISTS "Users can insert their own onboarding results" ON onboarding_results;

-- RLS Policies for onboarding_results
CREATE POLICY "Users can view their own onboarding results"
  ON onboarding_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding results"
  ON onboarding_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_results_user_id ON onboarding_results(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_has_active_plan ON profiles(has_active_plan);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the setup:
--
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- SELECT * FROM pg_policies WHERE tablename = 'onboarding_results';
-- \d profiles
-- =====================================================
