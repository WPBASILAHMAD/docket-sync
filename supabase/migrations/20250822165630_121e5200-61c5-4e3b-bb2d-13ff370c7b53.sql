-- Create user roles and profiles tables
CREATE TYPE user_role AS ENUM ('main_admin', 'second_admin', 'manager', 'staff');
CREATE TYPE docket_status AS ENUM ('open', 'closed');
CREATE TYPE shipment_type AS ENUM ('documents', 'package', 'fragile', 'dangerous');
CREATE TYPE service_type AS ENUM ('express', 'standard', 'economy');
CREATE TYPE connote_status AS ENUM ('created', 'processing', 'in_transit', 'delivered', 'returned');

-- User profiles table extending Supabase auth
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'staff',
    avatar_url TEXT,
    created_by UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Dockets/Manifest table
CREATE TABLE public.dockets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    summary_no TEXT NOT NULL UNIQUE,
    docket_no TEXT NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    station TEXT NOT NULL,
    carrier TEXT NOT NULL,
    flight_no TEXT,
    bags INTEGER DEFAULT 0,
    weight DECIMAL(10,2) DEFAULT 0,
    country TEXT NOT NULL,
    load_no TEXT,
    status docket_status DEFAULT 'open',
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Connotes/Shipments table
CREATE TABLE public.connotes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    awb_number TEXT NOT NULL UNIQUE,
    docket_id UUID REFERENCES public.dockets(id),
    
    -- Shipper details
    shipper_name TEXT NOT NULL,
    shipper_address TEXT NOT NULL,
    shipper_city TEXT NOT NULL,
    shipper_country TEXT NOT NULL,
    shipper_phone TEXT,
    shipper_email TEXT,
    
    -- Consignee details
    consignee_name TEXT NOT NULL,
    consignee_address TEXT NOT NULL,
    consignee_city TEXT NOT NULL,
    consignee_country TEXT NOT NULL,
    consignee_phone TEXT,
    consignee_email TEXT,
    
    -- Shipment details
    shipment_type shipment_type NOT NULL,
    service_type service_type NOT NULL,
    description TEXT NOT NULL,
    pieces INTEGER NOT NULL DEFAULT 1,
    weight DECIMAL(10,2) NOT NULL,
    dimensions TEXT,
    customs_value DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Charges
    freight_charges DECIMAL(10,2) DEFAULT 0,
    fuel_surcharge DECIMAL(10,2) DEFAULT 0,
    security_charge DECIMAL(10,2) DEFAULT 0,
    handling_charge DECIMAL(10,2) DEFAULT 0,
    insurance_fee DECIMAL(10,2) DEFAULT 0,
    other_charges DECIMAL(10,2) DEFAULT 0,
    total_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Status and tracking
    status connote_status DEFAULT 'created',
    tracking_updates JSONB DEFAULT '[]',
    
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tracking history table
CREATE TABLE public.tracking_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    connote_id UUID NOT NULL REFERENCES public.connotes(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('main_admin', 'second_admin'))
);

-- RLS Policies for dockets
CREATE POLICY "Users can view all dockets" ON public.dockets FOR SELECT USING (true);
CREATE POLICY "Managers and above can manage dockets" ON public.dockets FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('main_admin', 'second_admin', 'manager'))
);

-- RLS Policies for connotes
CREATE POLICY "Users can view all connotes" ON public.connotes FOR SELECT USING (true);
CREATE POLICY "Staff and above can manage connotes" ON public.connotes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('main_admin', 'second_admin', 'manager', 'staff'))
);

-- RLS Policies for tracking history
CREATE POLICY "Users can view tracking history" ON public.tracking_history FOR SELECT USING (true);
CREATE POLICY "Staff and above can add tracking updates" ON public.tracking_history FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('main_admin', 'second_admin', 'manager', 'staff'))
);

-- RLS Policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('main_admin', 'second_admin'))
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_dockets_status ON public.dockets(status);
CREATE INDEX idx_dockets_date ON public.dockets(date);
CREATE INDEX idx_connotes_awb ON public.connotes(awb_number);
CREATE INDEX idx_connotes_status ON public.connotes(status);
CREATE INDEX idx_connotes_docket ON public.connotes(docket_id);
CREATE INDEX idx_tracking_connote ON public.tracking_history(connote_id);
CREATE INDEX idx_audit_user ON public.audit_logs(user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dockets_updated_at BEFORE UPDATE ON public.dockets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_connotes_updated_at BEFORE UPDATE ON public.connotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create a default main admin user function
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
$$ LANGUAGE plpgsql;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_main_admin();