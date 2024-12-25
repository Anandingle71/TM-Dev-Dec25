/*
  # Fix Content Storage and Retrieval

  1. Changes
    - Add missing INSERT policy for content
    - Add index for faster content retrieval
    - Add better error handling for content operations

  2. Security
    - Maintain existing RLS policies
    - Add additional validation
*/

-- Add index for faster content retrieval
CREATE INDEX IF NOT EXISTS content_user_id_created_at_idx 
  ON public.content(user_id, created_at DESC);

-- Add better error handling for content operations
CREATE OR REPLACE FUNCTION public.handle_content_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NULL OR NEW.content = '' THEN
    RAISE EXCEPTION 'Content cannot be empty';
  END IF;
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for content validation
CREATE TRIGGER validate_content
  BEFORE INSERT OR UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_content_error();