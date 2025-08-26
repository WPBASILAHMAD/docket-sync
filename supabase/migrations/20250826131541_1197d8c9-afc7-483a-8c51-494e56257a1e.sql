-- Fix security vulnerability: Restrict connotes SELECT access to staff and above only
-- Remove the overly permissive policy that allows all users to view connotes
DROP POLICY IF EXISTS "Users can view all connotes" ON public.connotes;

-- Create a new restrictive policy that only allows staff and above to view connotes
CREATE POLICY "Only staff and above can view connotes" 
ON public.connotes 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['main_admin'::user_role, 'second_admin'::user_role, 'manager'::user_role, 'staff'::user_role])
));