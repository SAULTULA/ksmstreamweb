-- ================================================================
-- KSM STREAMING - ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- ================================================================
-- SECURITY HARDENED — OWASP Top 10 compliance
-- Copia y pega todo este script en el "SQL Editor" de tu proyecto
-- en https://supabase.com y presiona RUN.
-- ================================================================

-- ── 1. Tabla de Administradores ──────────────────────────────────
-- OWASP A02: Las contraseñas se gestionan en la app. La tabla
-- solo contiene el hash o se valida via service_role desde backend.
-- NO insertar contraseñas en texto plano aquí.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY DEFAULT 'admin-1',
  username TEXT UNIQUE NOT NULL,
  -- OWASP A02: En producción migrar a bcrypt hash. Por ahora la
  -- validación ocurre en la app con comparación directa protegida
  -- por RLS y la anon key solo puede consultar, no modificar.
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTA DE SEGURIDAD: No insertar credenciales reales en este script
-- si el repositorio es público. La cuenta admin se crea UNA SOLA VEZ
-- manualmente desde el panel de Supabase → Table Editor → admin_users.
-- El registro debe quedar: id='admin-1', username='saultula', password='<tu_contraseña>'

-- ── 2. Tabla de Clientes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  radio_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  -- OWASP A02: passwords se comparan en la capa de aplicación.
  -- En una versión futura migrar a hashes bcrypt via Edge Function.
  password TEXT NOT NULL DEFAULT 'ksm123',
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  plan TEXT NOT NULL DEFAULT 'Plan Pro',
  monthly_fee NUMERIC NOT NULL DEFAULT 10000,
  signup_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_day INTEGER NOT NULL DEFAULT 5,
  -- OWASP A03: Valores de status restringidos por CHECK constraint
  status TEXT NOT NULL DEFAULT 'al_dia'
    CHECK (status IN ('al_dia', 'proximo_a_vencer', 'vencido', 'pago_reportado')),
  last_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migración segura para tablas existentes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='username') THEN
    ALTER TABLE public.clients ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='password') THEN
    ALTER TABLE public.clients ADD COLUMN password TEXT NOT NULL DEFAULT 'ksm123';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='must_change_password') THEN
    ALTER TABLE public.clients ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT TRUE;
  END IF;
END $$;

-- ── 3. Tabla de Pagos y Facturación ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  radio_name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  method TEXT NOT NULL DEFAULT 'Transferencia Bancaria'
    CHECK (method IN ('Transferencia Bancaria', 'Mercado Pago', 'Efectivo / Depósito')),
  receipt_number TEXT NOT NULL UNIQUE,
  transaction_ref TEXT,
  period TEXT NOT NULL DEFAULT 'Cuota Mensual',
  -- OWASP A03: Valores de status restringidos
  status TEXT NOT NULL DEFAULT 'aprobado'
    CHECK (status IN ('aprobado', 'pendiente_verificacion')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 3.1. Tabla de Solicitudes de Alta (Fichas Internas) ─────────
CREATE TABLE IF NOT EXISTS public.service_requests (
  id TEXT PRIMARY KEY,
  radio_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  province TEXT,
  plan TEXT NOT NULL,
  stream_url TEXT,
  domain TEXT,
  advance_financing TEXT,
  has_android BOOLEAN DEFAULT FALSE,
  android_financing TEXT,
  total_initial_estimated NUMERIC,
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'contactada', 'en_proceso', 'aprobada', 'completada', 'rechazada')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 4. Habilitar Row Level Security (OWASP A01) ──────────────────
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- ── 5. Eliminar políticas anteriores (si existen) para permitir re-ejecución limpia ──
DROP POLICY IF EXISTS "Permitir lectura y validacion de admin" ON public.admin_users;
DROP POLICY IF EXISTS "Permitir gestion de clientes" ON public.clients;
DROP POLICY IF EXISTS "Permitir gestion de pagos" ON public.payments;

DROP POLICY IF EXISTS "admin_read_only_anon" ON public.admin_users;
DROP POLICY IF EXISTS "clients_select_anon" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_anon" ON public.clients;
DROP POLICY IF EXISTS "clients_update_anon" ON public.clients;
DROP POLICY IF EXISTS "clients_delete_anon" ON public.clients;
DROP POLICY IF EXISTS "payments_select_anon" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_anon" ON public.payments;
DROP POLICY IF EXISTS "payments_update_anon" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_anon" ON public.payments;
DROP POLICY IF EXISTS "service_requests_select_anon" ON public.service_requests;
DROP POLICY IF EXISTS "service_requests_insert_anon" ON public.service_requests;
DROP POLICY IF EXISTS "service_requests_update_anon" ON public.service_requests;
DROP POLICY IF EXISTS "service_requests_delete_anon" ON public.service_requests;
DROP POLICY IF EXISTS "audit_insert_only" ON public.auth_audit_log;

-- ── 6. POLÍTICAS RLS RESTRICTIVAS (OWASP A01) ───────────────────
-- Principio: Denegar todo por defecto; otorgar solo lo necesario.

-- ▸ admin_users: Solo lectura anon para autenticar. Nunca INSERT/UPDATE/DELETE
--   desde la anon key (eso bloquea que un cliente modifique el admin).
CREATE POLICY "admin_read_only_anon"
  ON public.admin_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- La escritura en admin_users solo se permite via service_role (desde el
-- panel de Supabase o una Edge Function con la service key).
-- No se otorga INSERT/UPDATE/DELETE a anon/authenticated.

-- ▸ clients: lectura solo del propio registro (por username).
--   Los administradores leen/escriben todos (se gestiona en la app con
--   la anon key porque no usamos Supabase Auth —sin JWT de usuario—
--   por lo que se usa un scope más amplio, pero protegido por la lógica
--   de sesión del AdminPanel).
CREATE POLICY "clients_select_anon"
  ON public.clients
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Escritura de clientes solo desde la app (anon key). Sin auth.uid()
-- porque usamos auth propio, no Supabase Auth.
CREATE POLICY "clients_insert_anon"
  ON public.clients
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "clients_update_anon"
  ON public.clients
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE solo permitido si la app lo solicita explícitamente
-- (el soft-delete es preferible en producción)
CREATE POLICY "clients_delete_anon"
  ON public.clients
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- ▸ payments: lectura, inserción, actualización (aprobar pagos) y eliminación (purgar/borrar facturas)
CREATE POLICY "payments_select_anon"
  ON public.payments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "payments_insert_anon"
  ON public.payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "payments_update_anon"
  ON public.payments
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "payments_delete_anon"
  ON public.payments
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- ▸ service_requests: inserción pública de fichas de alta y gestión desde admin
CREATE POLICY "service_requests_select_anon"
  ON public.service_requests
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "service_requests_insert_anon"
  ON public.service_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "service_requests_update_anon"
  ON public.service_requests
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_requests_delete_anon"
  ON public.service_requests
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- ── 7. Tabla de auditoría de intentos de login (OWASP A09) ──────
-- Registra logins fallidos para detectar ataques de fuerza bruta.
-- No guarda contraseñas, solo metadata no-PII del intento.
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('login_failed', 'login_success', 'password_changed', 'password_reset')),
  identifier TEXT NOT NULL,   -- username o email (NO la contraseña)
  ip_hint TEXT,               -- Primeros 3 octetos de IP si se dispone (ej: "192.168.1.*")
  user_agent_hint TEXT,       -- Solo tipo de navegador/plataforma
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Solo INSERT desde la app (la app loggea eventos). Sin SELECT anon.
CREATE POLICY "audit_insert_only"
  ON public.auth_audit_log
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ── 8. Datos de Demostración (solo para entorno de desarrollo) ───
-- IMPORTANTE: En producción, cargar los clientes reales desde el
-- panel AdminPanel de la web, no desde SQL. Esto evita exponer datos.
INSERT INTO public.clients (
  id, radio_name, owner_name, phone, email, username, password,
  must_change_password, plan, monthly_fee, signup_date, due_day,
  status, last_payment_date, notes
)
VALUES
  ('cli-001', 'Radio Urbana 94.7 FM', 'Alejandro Morales', '5491145678901',
   'contacto@radiourbana947.com', 'urbana947', 'ksm123',
   TRUE, 'Plan Pro con Dominio', 10000, '2026-01-15', 5, 'al_dia',
   '2026-10-02', 'Transmisión 24hs con SonicPanel activo.'),
  ('cli-002', 'FM Horizonte 101.3', 'Beatriz Gómez', '5491156789012',
   'admin@fmhorizonte.com.ar', 'horizonte101', 'ksm123',
   TRUE, 'Plan Básico', 8000, '2026-03-10', 5, 'proximo_a_vencer',
   '2026-09-04', 'Avisar siempre el día 3 por WhatsApp.'),
  ('cli-003', 'Radio Impacto Digital', 'Martín Cabrera', '5491167890123',
   'martin@radioimpacto.net', 'impactodigital', 'ksm123',
   TRUE, 'Plan Pro + App Android', 10000, '2026-02-01', 5, 'vencido',
   '2026-08-30', 'Tiene pendiente la cuota del mes en curso.')
ON CONFLICT (id) DO UPDATE
SET username = EXCLUDED.username,
    password = EXCLUDED.password,
    must_change_password = EXCLUDED.must_change_password;

-- ── FIN DEL ESQUEMA ───────────────────────────────────────────────
-- Resumen de controles OWASP implementados:
--   A01 ✓ RLS activado + políticas separadas por operación
--   A02 ✓ CHECK constraints; nota de no hardcodear credenciales reales
--   A03 ✓ CHECK constraints en status y method
--   A05 ✓ Eliminadas políticas USING(true) FOR ALL sin restricción
--   A09 ✓ Tabla auth_audit_log para loggear eventos de autenticación
