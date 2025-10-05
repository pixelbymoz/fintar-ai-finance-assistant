-- Neon Postgres Schema untuk integrasi dengan Clerk
-- Berdasarkan dokumentasi resmi Clerk x Neon

-- Tabel users yang terintegrasi dengan Clerk
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel expenses dengan foreign key ke users
CREATE TABLE IF NOT EXISTS public.expenses (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel income dengan foreign key ke users
CREATE TABLE IF NOT EXISTS public.income (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  income_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel assets dengan foreign key ke users
CREATE TABLE IF NOT EXISTS public.assets (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  purchase_price NUMERIC(14,2) NOT NULL,
  current_value NUMERIC(14,2) NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_income_user_id ON public.income(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON public.assets(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_income_date ON public.income(income_date);
CREATE INDEX IF NOT EXISTS idx_assets_date ON public.assets(purchase_date);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Policy untuk users: user hanya bisa akses data mereka sendiri
CREATE POLICY users_policy ON public.users
  FOR ALL USING (id = current_setting('app.current_user_id', true));

-- Policy untuk expenses: user hanya bisa akses expenses mereka sendiri
CREATE POLICY expenses_policy ON public.expenses
  FOR ALL USING (user_id = current_setting('app.current_user_id', true));

-- Policy untuk income: user hanya bisa akses income mereka sendiri
CREATE POLICY income_policy ON public.income
  FOR ALL USING (user_id = current_setting('app.current_user_id', true));

-- Policy untuk assets: user hanya bisa akses assets mereka sendiri
CREATE POLICY assets_policy ON public.assets
  FOR ALL USING (user_id = current_setting('app.current_user_id', true));