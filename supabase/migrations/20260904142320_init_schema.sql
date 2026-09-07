-- PREMA Core Schema Initialization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Publicly accessible basic info)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender TEXT NOT NULL,
  city TEXT,
  bio TEXT,
  lifestyle_tags TEXT[],
  relationship_intention TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIRTH DATA (Highly sensitive, strict RLS)
CREATE TABLE public.birth_data (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  date_of_birth DATE NOT NULL,
  exact_birth_time TIME,
  birth_place_city TEXT,
  birth_place_lat NUMERIC,
  birth_place_lon NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREFERENCES (Hard filters)
CREATE TABLE public.preferences (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  target_gender TEXT[],
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 45,
  max_distance_km INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)

-- Profiles: Anyone can read profiles (for now), but only the owner can update
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Birth Data: ONLY the owner can read/update their birth data. The matching engine (Edge Functions) will use the service role to bypass RLS.
ALTER TABLE public.birth_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own birth data." ON public.birth_data FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own birth data." ON public.birth_data FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own birth data." ON public.birth_data FOR INSERT WITH CHECK (auth.uid() = id);

-- Preferences: Only the owner can read/update
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences." ON public.preferences FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own preferences." ON public.preferences FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own preferences." ON public.preferences FOR INSERT WITH CHECK (auth.uid() = id);

-- Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, age, gender)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', (new.raw_user_meta_data->>'age')::integer, new.raw_user_meta_data->>'gender');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
