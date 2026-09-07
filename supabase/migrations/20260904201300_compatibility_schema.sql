-- =============================================
-- PREMA Compatibility Engine — Database Schema
-- Migration: Add compatibility engine tables
-- =============================================

-- Astrology Profiles (computed from birth_data)
CREATE TABLE IF NOT EXISTS public.astro_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  moon_longitude NUMERIC NOT NULL,
  rashi_index INTEGER NOT NULL CHECK (rashi_index >= 1 AND rashi_index <= 12),
  rashi_name TEXT NOT NULL,
  nakshatra_index INTEGER NOT NULL CHECK (nakshatra_index >= 1 AND nakshatra_index <= 27),
  nakshatra_name TEXT NOT NULL,
  nakshatra_pada INTEGER NOT NULL CHECK (nakshatra_pada >= 1 AND nakshatra_pada <= 4),
  has_birth_time BOOLEAN DEFAULT FALSE,
  lagna_rashi_index INTEGER,
  is_manglik BOOLEAN,
  manglik_severity TEXT CHECK (manglik_severity IN ('none', 'mild', 'strong')),
  confidence TEXT NOT NULL DEFAULT 'low' CHECK (confidence IN ('low', 'moderate', 'strong', 'insufficient_data')),
  methodology_version TEXT NOT NULL DEFAULT 'vedic_v1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Numerology Profiles
CREATE TABLE IF NOT EXISTS public.numerology_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  life_path_number INTEGER NOT NULL CHECK (life_path_number >= 1 AND life_path_number <= 33),
  expression_number INTEGER NOT NULL CHECK (expression_number >= 1 AND expression_number <= 33),
  is_master_number BOOLEAN DEFAULT FALSE,
  methodology_version TEXT NOT NULL DEFAULT 'numerology_v1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personality Profiles (9 normalized traits, 0.0-1.0)
CREATE TABLE IF NOT EXISTS public.personality_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  communication_directness NUMERIC CHECK (communication_directness >= 0 AND communication_directness <= 1),
  social_energy NUMERIC CHECK (social_energy >= 0 AND social_energy <= 1),
  independence NUMERIC CHECK (independence >= 0 AND independence <= 1),
  conflict_avoidance NUMERIC CHECK (conflict_avoidance >= 0 AND conflict_avoidance <= 1),
  emotional_openness NUMERIC CHECK (emotional_openness >= 0 AND emotional_openness <= 1),
  adventure_preference NUMERIC CHECK (adventure_preference >= 0 AND adventure_preference <= 1),
  routine_preference NUMERIC CHECK (routine_preference >= 0 AND routine_preference <= 1),
  decision_making NUMERIC CHECK (decision_making >= 0 AND decision_making <= 1),
  affection_style NUMERIC CHECK (affection_style >= 0 AND affection_style <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication Profiles (8 dimensions, 0.0-1.0)
CREATE TABLE IF NOT EXISTS public.communication_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  directness NUMERIC CHECK (directness >= 0 AND directness <= 1),
  frequency_preference NUMERIC CHECK (frequency_preference >= 0 AND frequency_preference <= 1),
  conflict_style NUMERIC CHECK (conflict_style >= 0 AND conflict_style <= 1),
  response_expectation NUMERIC CHECK (response_expectation >= 0 AND response_expectation <= 1),
  emotional_openness NUMERIC CHECK (emotional_openness >= 0 AND emotional_openness <= 1),
  reassurance_need NUMERIC CHECK (reassurance_need >= 0 AND reassurance_need <= 1),
  affection_communication NUMERIC CHECK (affection_communication >= 0 AND affection_communication <= 1),
  disagreement_handling NUMERIC CHECK (disagreement_handling >= 0 AND disagreement_handling <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Values Profiles
CREATE TABLE IF NOT EXISTS public.values_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  family_importance NUMERIC CHECK (family_importance >= 0 AND family_importance <= 1),
  marriage_expectation NUMERIC CHECK (marriage_expectation >= 0 AND marriage_expectation <= 1),
  children_expectation TEXT CHECK (children_expectation IN ('wants_children', 'does_not_want_children', 'open_to_children', 'has_children_wants_more', 'has_children_no_more', 'not_sure')),
  career_priority NUMERIC CHECK (career_priority >= 0 AND career_priority <= 1),
  financial_attitude NUMERIC CHECK (financial_attitude >= 0 AND financial_attitude <= 1),
  lifestyle_priority NUMERIC CHECK (lifestyle_priority >= 0 AND lifestyle_priority <= 1),
  religion_spirituality NUMERIC CHECK (religion_spirituality >= 0 AND religion_spirituality <= 1),
  social_values NUMERIC CHECK (social_values >= 0 AND social_values <= 1),
  personal_independence NUMERIC CHECK (personal_independence >= 0 AND personal_independence <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lifestyle Profiles
CREATE TABLE IF NOT EXISTS public.lifestyle_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  food_preference NUMERIC CHECK (food_preference >= 0 AND food_preference <= 1),
  travel_frequency NUMERIC CHECK (travel_frequency >= 0 AND travel_frequency <= 1),
  sleep_schedule NUMERIC CHECK (sleep_schedule >= 0 AND sleep_schedule <= 1),
  exercise_frequency NUMERIC CHECK (exercise_frequency >= 0 AND exercise_frequency <= 1),
  social_activity NUMERIC CHECK (social_activity >= 0 AND social_activity <= 1),
  alcohol_preference NUMERIC CHECK (alcohol_preference >= 0 AND alcohol_preference <= 1),
  smoking_preference NUMERIC CHECK (smoking_preference >= 0 AND smoking_preference <= 1),
  work_style NUMERIC CHECK (work_style >= 0 AND work_style <= 1),
  weekend_style NUMERIC CHECK (weekend_style >= 0 AND weekend_style <= 1),
  spending_style NUMERIC CHECK (spending_style >= 0 AND spending_style <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship Preferences (expanded from existing preferences table)
CREATE TABLE IF NOT EXISTS public.relationship_goals (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  intention TEXT CHECK (intention IN ('casual', 'long_term', 'marriage_oriented', 'open_to_either', 'not_sure')),
  marriage_timeline TEXT CHECK (marriage_timeline IN ('within_1_year', 'within_2_3_years', 'within_5_years', 'no_timeline', 'not_applicable')),
  children_preference TEXT CHECK (children_preference IN ('wants_children', 'does_not_want_children', 'open_to_children', 'has_children_wants_more', 'has_children_no_more', 'not_sure')),
  family_involvement NUMERIC CHECK (family_involvement >= 0 AND family_involvement <= 1),
  relocation_willingness NUMERIC CHECK (relocation_willingness >= 0 AND relocation_willingness <= 1),
  long_distance_willingness NUMERIC CHECK (long_distance_willingness >= 0 AND long_distance_willingness <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Interests
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility Scores (cached results)
CREATE TABLE IF NOT EXISTS public.compatibility_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  astrology_score INTEGER CHECK (astrology_score >= 0 AND astrology_score <= 100),
  numerology_score INTEGER CHECK (numerology_score >= 0 AND numerology_score <= 100),
  personality_score INTEGER CHECK (personality_score >= 0 AND personality_score <= 100),
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
  values_score INTEGER CHECK (values_score >= 0 AND values_score <= 100),
  lifestyle_score INTEGER CHECK (lifestyle_score >= 0 AND lifestyle_score <= 100),
  relationship_goal_score INTEGER CHECK (relationship_goal_score >= 0 AND relationship_goal_score <= 100),
  interests_score INTEGER CHECK (interests_score >= 0 AND interests_score <= 100),
  confidence TEXT NOT NULL DEFAULT 'low',
  strengths TEXT[] DEFAULT '{}',
  friction_points TEXT[] DEFAULT '{}',
  reasons TEXT[] DEFAULT '{}',
  algorithm_version TEXT NOT NULL,
  astrology_version TEXT NOT NULL DEFAULT 'vedic_v1',
  numerology_version TEXT NOT NULL DEFAULT 'numerology_v1',
  weights_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_a_id, user_b_id, algorithm_version)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_compatibility_scores_user_a ON public.compatibility_scores(user_a_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_scores_user_b ON public.compatibility_scores(user_b_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_scores_pair ON public.compatibility_scores(user_a_id, user_b_id);

-- Compatibility Events (impressions, likes, passes, matches)
CREATE TABLE IF NOT EXISTS public.compatibility_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'like', 'pass', 'mutual_match', 'conversation_started', 'date_scheduled')),
  compatibility_score_at_event INTEGER,
  algorithm_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compatibility_events_user_a ON public.compatibility_events(user_a_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_events_user_b ON public.compatibility_events(user_b_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_events_type ON public.compatibility_events(event_type);

-- Matching Configuration (stored in DB for hot-reloading)
CREATE TABLE IF NOT EXISTS public.matching_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  algorithm_version TEXT NOT NULL UNIQUE,
  weights_version TEXT NOT NULL,
  astrology_weight NUMERIC NOT NULL DEFAULT 0.50,
  personality_weight NUMERIC NOT NULL DEFAULT 0.12,
  communication_weight NUMERIC NOT NULL DEFAULT 0.08,
  values_weight NUMERIC NOT NULL DEFAULT 0.00,
  relationship_goals_weight NUMERIC NOT NULL DEFAULT 0.15,
  lifestyle_weight NUMERIC NOT NULL DEFAULT 0.10,
  interests_weight NUMERIC NOT NULL DEFAULT 0.05,
  numerology_mode TEXT NOT NULL DEFAULT 'metadata_only',
  numerology_weight NUMERIC NOT NULL DEFAULT 0.00,
  discovery_threshold INTEGER NOT NULL DEFAULT 70,
  max_recommendations INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Algorithm Version History
CREATE TABLE IF NOT EXISTS public.algorithm_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  description TEXT,
  astrology_methodology TEXT NOT NULL DEFAULT 'vedic_v1',
  numerology_methodology TEXT NOT NULL DEFAULT 'numerology_v1',
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Date Feedback (PRIVATE — never exposed to match partner)
CREATE TABLE IF NOT EXISTS public.post_date_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_rating INTEGER CHECK (conversation_rating >= 1 AND conversation_rating <= 5),
  comfort_rating INTEGER CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
  humor_rating INTEGER CHECK (humor_rating >= 1 AND humor_rating <= 5),
  attraction_rating INTEGER CHECK (attraction_rating >= 1 AND attraction_rating <= 5),
  values_alignment_rating INTEGER CHECK (values_alignment_rating >= 1 AND values_alignment_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  would_meet_again TEXT CHECK (would_meet_again IN ('yes', 'maybe', 'no')),
  compatibility_score_at_date INTEGER,
  algorithm_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_date_feedback_user ON public.post_date_feedback(user_id);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Astro Profiles: owner-only read/write, service_role for matching
ALTER TABLE public.astro_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own astro profile" ON public.astro_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own astro profile" ON public.astro_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own astro profile" ON public.astro_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Numerology Profiles: owner-only
ALTER TABLE public.numerology_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own numerology profile" ON public.numerology_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own numerology profile" ON public.numerology_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own numerology profile" ON public.numerology_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Personality Profiles: owner-only
ALTER TABLE public.personality_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own personality profile" ON public.personality_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own personality profile" ON public.personality_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own personality profile" ON public.personality_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Communication Profiles: owner-only
ALTER TABLE public.communication_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own communication profile" ON public.communication_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own communication profile" ON public.communication_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own communication profile" ON public.communication_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Values Profiles: owner-only
ALTER TABLE public.values_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own values profile" ON public.values_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own values profile" ON public.values_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own values profile" ON public.values_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Lifestyle Profiles: owner-only
ALTER TABLE public.lifestyle_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own lifestyle profile" ON public.lifestyle_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own lifestyle profile" ON public.lifestyle_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own lifestyle profile" ON public.lifestyle_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Relationship Goals: owner-only
ALTER TABLE public.relationship_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own relationship goals" ON public.relationship_goals FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own relationship goals" ON public.relationship_goals FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own relationship goals" ON public.relationship_goals FOR INSERT WITH CHECK (auth.uid() = id);

-- User Interests: owner-only
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interests" ON public.user_interests FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own interests" ON public.user_interests FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own interests" ON public.user_interests FOR INSERT WITH CHECK (auth.uid() = id);

-- Compatibility Scores: both users in pair can read
ALTER TABLE public.compatibility_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their compatibility scores" ON public.compatibility_scores FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
-- Writes via service_role only (Edge Functions)

-- Compatibility Events: owner can view their events
ALTER TABLE public.compatibility_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their events" ON public.compatibility_events FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
-- Writes via service_role only

-- Matching Config: read-only for authenticated users
ALTER TABLE public.matching_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view active config" ON public.matching_config FOR SELECT USING (is_active = TRUE);
-- Writes via admin only

-- Algorithm Versions: read-only for authenticated
ALTER TABLE public.algorithm_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view versions" ON public.algorithm_versions FOR SELECT USING (TRUE);

-- Post-Date Feedback: STRICTLY owner-only, NEVER exposed to match
ALTER TABLE public.post_date_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own feedback" ON public.post_date_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON public.post_date_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
-- match_user_id CANNOT read this feedback

-- Insert default V1 matching configuration
INSERT INTO public.matching_config (
  algorithm_version, weights_version,
  astrology_weight, personality_weight, communication_weight,
  values_weight, relationship_goals_weight, lifestyle_weight, interests_weight,
  numerology_mode, numerology_weight,
  discovery_threshold, max_recommendations, is_active
) VALUES (
  'prema_v1', 'weights_v1',
  0.50, 0.12, 0.08,
  0.00, 0.15, 0.10, 0.05,
  'metadata_only', 0.00,
  70, 5, TRUE
);

INSERT INTO public.algorithm_versions (
  version, description,
  astrology_methodology, numerology_methodology, is_current
) VALUES (
  'prema_v1',
  'Initial rule-based compatibility engine with Ashtakoota, personality, values, lifestyle, and relationship goals scoring.',
  'vedic_v1', 'numerology_v1', TRUE
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all new tables with updated_at
CREATE TRIGGER update_astro_profiles_updated_at BEFORE UPDATE ON public.astro_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_numerology_profiles_updated_at BEFORE UPDATE ON public.numerology_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personality_profiles_updated_at BEFORE UPDATE ON public.personality_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_profiles_updated_at BEFORE UPDATE ON public.communication_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_values_profiles_updated_at BEFORE UPDATE ON public.values_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lifestyle_profiles_updated_at BEFORE UPDATE ON public.lifestyle_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relationship_goals_updated_at BEFORE UPDATE ON public.relationship_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_interests_updated_at BEFORE UPDATE ON public.user_interests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compatibility_scores_updated_at BEFORE UPDATE ON public.compatibility_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matching_config_updated_at BEFORE UPDATE ON public.matching_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
