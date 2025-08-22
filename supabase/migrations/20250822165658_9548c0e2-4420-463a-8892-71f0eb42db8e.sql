-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

CREATE OR REPLACE FUNCTION public.create_main_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile if this is the first user
    IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
        INSERT INTO public.profiles (user_id, full_name, email, role)
        VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Main Admin'), NEW.email, 'main_admin');
    ELSE
        -- For subsequent users, create as staff by default
        INSERT INTO public.profiles (user_id, full_name, email, role)
        VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Staff User'), NEW.email, 'staff');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;