-- SnapTechFix Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create repair_orders table
CREATE TABLE IF NOT EXISTS public.repair_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  issue TEXT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  tracking_code VARCHAR(20) UNIQUE NOT NULL,
  estimated_cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for tracking code lookups
CREATE INDEX IF NOT EXISTS idx_repair_orders_tracking_code ON public.repair_orders(tracking_code);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_repair_orders_updated_at BEFORE UPDATE
    ON public.repair_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read/write for now - adjust as needed)
CREATE POLICY "Allow public read" ON public.repair_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.repair_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.repair_orders FOR UPDATE USING (true);

-- Insert a test record
INSERT INTO public.repair_orders (
  device_category,
  brand,
  model,
  issue,
  customer_name,
  customer_email,
  customer_phone,
  description,
  tracking_code,
  estimated_cost
) VALUES (
  'smartphone',
  'iPhone',
  '12 Pro',
  'Screen replacement',
  'Test Customer',
  'test@example.com',
  '+91 9731852323',
  'iPhone 12 Pro - Screen replacement',
  'TEST123',
  2500
) ON CONFLICT (tracking_code) DO NOTHING;

-- Verify the setup
SELECT 
  'Table created successfully' as message,
  COUNT(*) as total_records
FROM public.repair_orders;