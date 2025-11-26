-- =====================================================
-- HERO PWA - RLS Policies (Incremental Update)
-- =====================================================
-- 
-- ⚠️ NOTE: For a FRESH database setup, use:
--    000_complete_database_schema.sql
--
-- This file is for incremental RLS policy updates only.
-- If you need to drop everything and start fresh, use
-- the complete schema file instead.
-- =====================================================

-- =====================================================
-- SUPABASE CONFIGURATION CHECKLIST
-- =====================================================
-- 1. Go to: Authentication > URL Configuration
-- 2. Add these URLs to "Redirect URLs":
--    - http://localhost:3000/auth/callback
--    - http://localhost:3000/auth/callback?next=/quiz
--    - https://your-production-domain.com/auth/callback
--    - https://your-production-domain.com/auth/callback?next=/quiz
-- 
-- 3. Set "Site URL" to your production URL
-- =====================================================

-- The profiles table schema already exists:
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

-- =====================================================
-- STEP 1: PROFILES TABLE - RLS POLICIES
-- =====================================================
-- These policies allow users to manage only their own profile

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT (read) their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to INSERT their own profile (for new users)
-- WITH CHECK ensures they can only insert a row with their own id
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to UPDATE their own profile
-- USING clause checks ownership for the row being updated
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- STEP 2: ONBOARDING RESULTS TABLE
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

-- Allow users to SELECT their own onboarding results
CREATE POLICY "Users can view their own onboarding results"
  ON onboarding_results FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to INSERT their own onboarding results
CREATE POLICY "Users can insert their own onboarding results"
  ON onboarding_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 3: PERFORMANCE INDEXES
-- =====================================================

-- Create indexes for faster lookups in middleware
CREATE INDEX IF NOT EXISTS idx_onboarding_results_user_id ON onboarding_results(user_id);
-- Composite index for middleware state machine checks (onboarding_completed and total_points)
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_state ON profiles(onboarding_completed, total_points);
CREATE INDEX IF NOT EXISTS idx_profiles_has_active_plan ON profiles(has_active_plan);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries after to verify the setup worked:
--
-- Check policies on profiles:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
--
-- Check policies on onboarding_results:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'onboarding_results';
--
-- Check RLS is enabled:
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('profiles', 'onboarding_results');
-- =====================================================
