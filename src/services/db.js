/**
 * KSM Streaming - Servicio Universal de Datos (Supabase + LocalStorage Fallback)
 * 
 * Permite gestionar clientes, pagos, estados de cobranza y avisos de WhatsApp.
 * Si las variables de Supabase están configuradas en .env o guardadas en el panel,
 * utiliza la API REST de Supabase en la nube para sincronización en tiempo real.
 * Si no, utiliza LocalStorage para funcionar sin dependencias en Vercel.
 */

const STORAGE_KEYS = {
  CLIENTS: 'ksm_clients_data',
  PAYMENTS: 'ksm_payments_data',
  ADMIN_PIN: 'ksm_admin_pin',
  SUPABASE_CONFIG: 'ksm_supabase_config',
};

// Contraseña / PIN por defecto de administrador
const DEFAULT_ADMIN_PIN = '1234';

// Datos iniciales de demostración para radios de ejemplo
const INITIAL_CLIENTS = [
  {
    id: 'cli-001',
    radio_name: 'Radio Urbana 94.7 FM',
    owner_name: 'Alejandro Morales',
    phone: '5491145678901',
    email: 'contacto@radiourbana947.com',
    plan: 'Plan Pro con Dominio',
    monthly_fee: 10000,
    signup_date: '2026-01-15',
    due_day: 5,
    status: 'al_dia', // 'al_dia' | 'proximo_a_vencer' | 'vencido' | 'pago_reportado'
    last_payment_date: '2026-10-02',
    notes: 'Transmisión 24hs con SonicPanel activo.',
  },
  {
    id: 'cli-002',
    radio_name: 'FM Horizonte 101.3',
    owner_name: 'Beatriz Gómez',
    phone: '5491156789012',
    email: 'admin@fmhorizonte.com.ar',
    plan: 'Plan Básico',
    monthly_fee: 8000,
    signup_date: '2026-03-10',
    due_day: 5,
    status: 'proximo_a_vencer',
    last_payment_date: '2026-09-04',
    notes: 'Avisar siempre el día 3 por WhatsApp.',
  },
  {
    id: 'cli-003',
    radio_name: 'Radio Impacto Digital',
    owner_name: 'Martín Cabrera',
    phone: '5491167890123',
    email: 'martin@radioimpacto.net',
    plan: 'Plan Pro + App Android',
    monthly_fee: 10000,
    signup_date: '2026-02-01',
    due_day: 5,
    status: 'vencido',
    last_payment_date: '2026-08-30',
    notes: 'Tiene pendiente la cuota del mes en curso.',
  },
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay-001',
    client_id: 'cli-001',
    radio_name: 'Radio Urbana 94.7 FM',
    amount: 10000,
    payment_date: '2026-10-02',
    method: 'Mercado Pago',
    receipt_number: 'REC-2026-0104',
    transaction_ref: 'MP-893471029',
    period: 'Octubre 2026',
    status: 'aprobado',
  },
];

// Obtener configuración de Supabase (desde .env o localStorage)
export function getSupabaseConfig() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isFromEnv: true };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return { url: '', key: '', isFromEnv: false };
}

export function saveSupabaseConfig(url, key) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url, key, isFromEnv: false }));
}

// Helpers para consultar Supabase REST
async function fetchSupabase(table, options = {}) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/${table}${options.query || ''}`;
    const res = await fetch(endpoint, {
      method: options.method || 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': options.prefer || 'return=representation',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error(`Supabase error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.warn(`[Supabase fallback] No se pudo conectar a ${table}, usando almacenamiento local.`, error);
    return null;
  }
}

// ==========================================
// CLIENTES
// ==========================================

export async function getClients() {
  // Intentar Supabase
  const supaData = await fetchSupabase('clients', { query: '?select=*&order=radio_name.asc' });
  if (supaData && Array.isArray(supaData) && supaData.length > 0) {
    return supaData;
  }

  // Fallback LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    return INITIAL_CLIENTS;
  } catch (e) {
    return INITIAL_CLIENTS;
  }
}

export async function saveClient(clientData) {
  const clients = await getClients();
  const now = new Date().toISOString().split('T')[0];

  let updatedClients;
  let savedClient;

  if (clientData.id) {
    // Editar existente
    savedClient = { ...clientData };
    updatedClients = clients.map((c) => (c.id === clientData.id ? savedClient : c));

    // Si Supabase está activo
    await fetchSupabase('clients', {
      method: 'PATCH',
      query: `?id=eq.${clientData.id}`,
      body: clientData,
    });
  } else {
    // Crear nuevo
    savedClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      signup_date: clientData.signup_date || now,
      status: clientData.status || 'al_dia',
      due_day: clientData.due_day || 5,
    };
    updatedClients = [savedClient, ...clients];

    // Si Supabase está activo
    await fetchSupabase('clients', {
      method: 'POST',
      body: savedClient,
    });
  }

  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));
  return savedClient;
}

export async function deleteClient(clientId) {
  const clients = await getClients();
  const updatedClients = clients.filter((c) => c.id !== clientId);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  await fetchSupabase('clients', {
    method: 'DELETE',
    query: `?id=eq.${clientId}`,
  });
  return true;
}

// ==========================================
// PAGOS & FACTURACIÓN
// ==========================================

export async function getPayments() {
  const supaData = await fetchSupabase('payments', { query: '?select=*&order=payment_date.desc' });
  if (supaData && Array.isArray(supaData) && supaData.length > 0) {
    return supaData;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    return INITIAL_PAYMENTS;
  } catch (e) {
    return INITIAL_PAYMENTS;
  }
}

export async function recordPayment({ clientId, radioName, amount, method, transactionRef, period }) {
  const payments = await getPayments();
  const today = new Date().toISOString().split('T')[0];
  const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPayment = {
    id: `pay-${Date.now()}`,
    client_id: clientId,
    radio_name: radioName,
    amount: Number(amount),
    payment_date: today,
    method: method || 'Transferencia Bancaria',
    receipt_number: receiptNum,
    transaction_ref: transactionRef || `REF-${Date.now().toString().slice(-6)}`,
    period: period || 'Cuota Actual',
    status: 'aprobado',
  };

  const updatedPayments = [newPayment, ...payments];
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

  // Enviar a Supabase si existe
  await fetchSupabase('payments', {
    method: 'POST',
    body: newPayment,
  });

  // Actualizar estado del cliente a "al_dia"
  const clients = await getClients();
  const updatedClients = clients.map((c) => {
    if (c.id === clientId || c.radio_name.toLowerCase() === radioName.toLowerCase()) {
      return {
        ...c,
        status: 'al_dia',
        last_payment_date: today,
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  await fetchSupabase('clients', {
    method: 'PATCH',
    query: `?id=eq.${clientId}`,
    body: { status: 'al_dia', last_payment_date: today },
  });

  return newPayment;
}

// ==========================================
// SEGURIDAD / PIN DE ADMINISTRADOR
// ==========================================

export function getAdminPin() {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
}

export function setAdminPin(newPin) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
  return true;
}

export function verifyAdminPin(pin) {
  const current = getAdminPin();
  return String(pin).trim() === String(current).trim();
}

// ==========================================
// GENERADOR DE AVISOS WHATSAPP (1 CLIC)
// ==========================================

export function buildWhatsAppLink(phone, message) {
  const cleanPhone = String(phone).replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function getNoticeMessage(type, client, baseUrl = window.location.origin) {
  const portalUrl = `${baseUrl}?portal=1&radio=${encodeURIComponent(client.radio_name)}`;
  const feeFormatted = Number(client.monthly_fee || 0).toLocaleString('es-AR');

  if (type === 'dia1') {
    return `📻 *KSM SERVICIOS - EMISIÓN DE CUOTA MENSUAL*
━━━━━━━━━━━━━━━━━━━━━
Hola *${client.owner_name}* (*${client.radio_name}*), te informamos que ya se encuentra emitida la cuota mensual de tu servicio de Streaming de audio.

📦 *Plan:* ${client.plan}
💰 *Importe:* $${feeFormatted} ARS
📅 *Vencimiento regular:* Día 5 de este mes

💳 Podés abonar y descargar tu comprobante oficial ingresando aquí:
👉 ${portalUrl}

¡Muchas gracias por elegirnos para transmitir tu señal!`;
  }

  if (type === 'dia3') {
    return `⚠️ *KSM SERVICIOS - RECORDATORIO DE VENCIMIENTO*
━━━━━━━━━━━━━━━━━━━━━
Hola *${client.owner_name}* (*${client.radio_name}*), te recordamos que en 48 horas (Día 5) vence el plazo regular para abonar la cuota de tu Streaming.

📦 *Plan:* ${client.plan}
💰 *Monto a regularizar:* $${feeFormatted} ARS

📲 Aboná de forma rápida y obtené tu factura desde tu área de cliente:
👉 ${portalUrl}

Si ya realizaste el pago, por favor desestimá este mensaje o envianos tu comprobante por este medio.`;
  }

  if (type === 'dia5') {
    return `🚨 *KSM SERVICIOS - ÚLTIMO DÍA DE PAGO*
━━━━━━━━━━━━━━━━━━━━━
Hola *${client.owner_name}* (*${client.radio_name}*), te informamos que hoy es el *último día de pago* para mantener activo tu servidor de Streaming sin cortes ni demoras en la transmisión.

📦 *Plan:* ${client.plan}
💰 *Total pendiente:* $${feeFormatted} ARS

💳 Regularizá tu cuenta de inmediato aquí:
👉 ${portalUrl}

O transferí al alias/CBU de KSM y respondé a este mensaje con tu comprobante. ¡Evitemos la interrupción de tu radio en vivo!`;
  }

  return '';
}
