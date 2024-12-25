/*
  # Fix User Creation Flow

  1. Changes
    - Add INSERT policy for profiles table
    - Modify handle_new_user function to be more robust
    - Add error handling for profile creation

  2. Security
    - Maintain RLS policies
    - Ensure proper user creation flow
*/

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with basic user data
  INSERT INTO public.profiles (
    user_id,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- Recreate trigger with improved function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();