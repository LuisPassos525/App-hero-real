-- =====================================================
-- HERO PWA - Profiles Table Schema and RLS Policies
-- =====================================================
-- This migration ensures the profiles table has the correct
-- schema and RLS policies for the onboarding flow.
--
-- Run this in your Supabase SQL Editor or via CLI:
-- supabase db push
-- =====================================================

-- Step 1: Add has_active_plan column if it doesn't exist
-- This column tracks whether user has an active subscription
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'has_active_plan'
  ) THEN
    ALTER TABLE profiles ADD COLUMN has_active_plan BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Step 3: Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_results_user_id ON onboarding_results(user_id);
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
