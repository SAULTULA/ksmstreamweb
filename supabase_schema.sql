-- ================================================================
-- KSM STREAMING - ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- ================================================================
-- Copia y pega todo este script en el "SQL Editor" de tu proyecto
-- en https://supabase.com y presiona RUN.
-- ================================================================

-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  radio_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'Plan Pro',
  monthly_fee NUMERIC NOT NULL DEFAULT 10000,
  signup_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_day INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'al_dia', -- 'al_dia', 'proximo_a_vencer', 'vencido', 'pago_reportado'
  last_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Pagos y Facturación
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  radio_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  method TEXT NOT NULL DEFAULT 'Transferencia Bancaria',
  receipt_number TEXT NOT NULL UNIQUE,
  transaction_ref TEXT,
  period TEXT NOT NULL DEFAULT 'Cuota Mensual',
  status TEXT NOT NULL DEFAULT 'aprobado', -- 'aprobado', 'pendiente_verificacion'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Seguridad por Filas (Row Level Security)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para permitir acceso desde el portal web con clave anónima (anon)
CREATE POLICY "Permitir lectura publica de clientes"
  ON public.clients FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir insercion y edicion de clientes"
  ON public.clients FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir lectura publica de pagos"
  ON public.payments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir insercion de pagos"
  ON public.payments FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Clientes Iniciales de Demostración
INSERT INTO public.clients (id, radio_name, owner_name, phone, email, plan, monthly_fee, signup_date, due_day, status, last_payment_date, notes)
VALUES
  ('cli-001', 'Radio Urbana 94.7 FM', 'Alejandro Morales', '5491145678901', 'contacto@radiourbana947.com', 'Plan Pro con Dominio', 10000, '2026-01-15', 5, 'al_dia', '2026-10-02', 'Transmisión 24hs con SonicPanel activo.'),
  ('cli-002', 'FM Horizonte 101.3', 'Beatriz Gómez', '5491156789012', 'admin@fmhorizonte.com.ar', 'Plan Básico', 8000, '2026-03-10', 5, 'proximo_a_vencer', '2026-09-04', 'Avisar siempre el día 3 por WhatsApp.'),
  ('cli-003', 'Radio Impacto Digital', 'Martín Cabrera', '5491167890123', 'martin@radioimpacto.net', 'Plan Pro + App Android', 10000, '2026-02-01', 5, 'vencido', '2026-08-30', 'Tiene pendiente la cuota del mes en curso.')
ON CONFLICT (id) DO NOTHING;
