-- Add zip code fields to the connotes table
ALTER TABLE public.connotes 
ADD COLUMN shipper_zip_code TEXT,
ADD COLUMN consignee_zip_code TEXT;