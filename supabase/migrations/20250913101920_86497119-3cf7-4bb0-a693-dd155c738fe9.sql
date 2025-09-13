-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('main_admin', 'second_admin', 'manager', 'staff')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create connotes table for shipping documents
CREATE TABLE public.connotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  awb_number TEXT NOT NULL UNIQUE,
  shipper_name TEXT NOT NULL,
  shipper_address TEXT NOT NULL,
  shipper_city TEXT NOT NULL,
  shipper_country TEXT NOT NULL,
  shipper_zip_code TEXT NOT NULL,
  shipper_phone TEXT,
  shipper_email TEXT,
  consignee_name TEXT NOT NULL,
  consignee_address TEXT NOT NULL,
  consignee_city TEXT NOT NULL,
  consignee_country TEXT NOT NULL,
  consignee_zip_code TEXT NOT NULL,
  consignee_phone TEXT,
  consignee_email TEXT,
  pieces INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  dimensions TEXT,
  service_type TEXT NOT NULL DEFAULT 'standard',
  special_instructions TEXT,
  declared_value DECIMAL(10,2) DEFAULT 0,
  insurance_value DECIMAL(10,2) DEFAULT 0,
  cod_amount DECIMAL(10,2) DEFAULT 0,
  freight_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
  fuel_surcharge DECIMAL(10,2) DEFAULT 0,
  insurance_charges DECIMAL(10,2) DEFAULT 0,
  handling_charges DECIMAL(10,2) DEFAULT 0,
  other_charges DECIMAL(10,2) DEFAULT 0,
  total_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dockets table for manifests
CREATE TABLE public.dockets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  docket_no TEXT NOT NULL UNIQUE,
  summary_no TEXT NOT NULL,
  date DATE NOT NULL,
  station TEXT NOT NULL,
  carrier TEXT NOT NULL,
  flight_no TEXT NOT NULL,
  country TEXT NOT NULL,
  load_no TEXT NOT NULL,
  bags INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dockets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for connotes
CREATE POLICY "Authenticated users can view all connotes" ON public.connotes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create connotes" ON public.connotes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update connotes" ON public.connotes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete connotes" ON public.connotes FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for dockets
CREATE POLICY "Authenticated users can view all dockets" ON public.dockets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create dockets" ON public.dockets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update dockets" ON public.dockets FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete dockets" ON public.dockets FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connotes_updated_at
  BEFORE UPDATE ON public.connotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dockets_updated_at
  BEFORE UPDATE ON public.dockets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_connotes_awb_number ON public.connotes(awb_number);
CREATE INDEX idx_connotes_status ON public.connotes(status);
CREATE INDEX idx_connotes_created_by ON public.connotes(created_by);
CREATE INDEX idx_dockets_docket_no ON public.dockets(docket_no);
CREATE INDEX idx_dockets_status ON public.dockets(status);
CREATE INDEX idx_dockets_created_by ON public.dockets(created_by);