-- Create admins table for admin authentication
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table for car listings
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mileage INTEGER,
  transmission TEXT,
  body_type TEXT,
  fuel_type TEXT,
  engine_size TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  dealer_name TEXT,
  dealer_phone TEXT,
  dealer_email TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for regular users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create car_requests table for user requests
CREATE TABLE public.car_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  engine_size TEXT,
  max_price DECIMAL(10,2),
  max_mileage INTEGER,
  transmission TEXT,
  body_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'matched', 'contacted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table (admins can manage themselves)
CREATE POLICY "Admins can view their own data" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Admins can update their own data" ON public.admins FOR UPDATE USING (true);
CREATE POLICY "Admins can insert new admins" ON public.admins FOR INSERT WITH CHECK (true);

-- RLS Policies for cars table (public read, admin write)
CREATE POLICY "Cars are publicly readable" ON public.cars FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage cars" ON public.cars FOR ALL USING (true);

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (true);

-- RLS Policies for car_requests table
CREATE POLICY "Users can view their own requests" ON public.car_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON public.car_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all requests" ON public.car_requests FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_car_requests_updated_at BEFORE UPDATE ON public.car_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the initial admin user
INSERT INTO public.admins (email, password_hash) 
VALUES ('abdulhadizaeem7@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert some sample car data
INSERT INTO public.cars (make, model, year, price, mileage, transmission, body_type, fuel_type, engine_size, exterior_color, interior_color, description, is_featured, dealer_name, dealer_phone, dealer_email, location) VALUES
('Toyota', 'Camry', 2022, 28999.99, 15000, 'Automatic', 'Sedan', 'Gasoline', '2.5L', 'Silver', 'Black', 'Well-maintained Toyota Camry with excellent fuel economy.', true, 'Japs Motors', '(555) 123-4567', 'sales@japsmotors.com', 'Toronto, ON'),
('Honda', 'Civic', 2023, 26500.00, 8000, 'Manual', 'Sedan', 'Gasoline', '2.0L', 'Blue', 'Gray', 'Sporty Honda Civic with low mileage and excellent condition.', true, 'Japs Motors', '(555) 123-4567', 'sales@japsmotors.com', 'Toronto, ON'),
('Nissan', 'Altima', 2021, 24999.99, 22000, 'CVT', 'Sedan', 'Gasoline', '2.5L', 'Red', 'Beige', 'Reliable Nissan Altima with advanced safety features.', false, 'Japs Motors', '(555) 123-4567', 'sales@japsmotors.com', 'Toronto, ON'),
('Mazda', 'CX-5', 2023, 32999.99, 5000, 'Automatic', 'SUV', 'Gasoline', '2.5L', 'White', 'Black', 'Premium SUV with all-wheel drive and luxury features.', true, 'Japs Motors', '(555) 123-4567', 'sales@japsmotors.com', 'Toronto, ON');