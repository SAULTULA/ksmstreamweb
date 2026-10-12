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
  ADMIN_AUTH: 'ksm_admin_credentials',
  SUPABASE_CONFIG: 'ksm_supabase_config',
};

// Credenciales oficiales del Administrador de KSM Servicios
export const DEFAULT_ADMIN_USER = 'saultula';
export const DEFAULT_ADMIN_PASS = 'Sanjuan3:16#*$';

// Lista inicial vacía — los clientes reales se cargan desde Supabase
// o se crean desde el Panel de Administración.
const INITIAL_CLIENTS = [];
const INITIAL_PAYMENTS = [];

const DEFAULT_SUPABASE_URL = 'https://ojzueojgmjysufobdutm.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Aq_eNVcGeUEOILhWkTwKlg_byCeH_Da';

// Obtener configuración de Supabase (desde .env, defaults o localStorage)
export function getSupabaseConfig() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isFromEnv: true };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_KEY, isFromEnv: false };
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
// OWASP A09: Logging de Auditoría de Auth
// Fire-and-forget. Nunca bloquea el flujo principal.
// No registra contraseñas ni datos PII sensibles.
// ==========================================
function logAuthEvent(eventType, identifier) {
  // Reducir identificador a primeros chars para no filtrar datos exactos en logs
  const safeId = String(identifier || '').slice(0, 32);
  fetchSupabase('auth_audit_log', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      event_type: eventType,
      identifier: safeId,
      ip_hint: null, // no disponible en browser
      user_agent_hint: navigator?.userAgent?.split(' ').pop() || 'unknown',
    },
  }).catch(() => { /* silencioso — no interrumpir auth por fallo de log */ });
}

// ==========================================
// UTILIDADES DE LIMPIEZA Y MANTENIMIENTO
// ==========================================

/**
 * Borra todos los datos demo del localStorage.
 * Llamar desde DevTools o desde el panel de Supabase
 * cuando se pase de demo a producción real.
 */
export function clearDemoData() {
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  console.info('[KSM] Datos demo eliminados del localStorage. Recargando datos desde Supabase...');
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
    // Generar usuario por defecto a partir del nombre de la radio si no se proveyó
    const defaultUser = clientData.username
      ? clientData.username.trim().toLowerCase()
      : (clientData.radio_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .slice(0, 15) || `radio${Date.now().toString().slice(-4)}`);

    // Crear nuevo
    savedClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      username: defaultUser,
      password: clientData.password || 'ksm123',
      must_change_password: clientData.must_change_password !== undefined ? clientData.must_change_password : true,
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

  // Limpiar pagos huérfanos asociados a este cliente en localStorage
  try {
    const payments = await getPayments();
    const remainingPayments = payments.filter((p) => p.client_id !== clientId);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(remainingPayments));
    await fetchSupabase('payments', {
      method: 'DELETE',
      query: `?client_id=eq.${clientId}`,
    });
  } catch (err) {
    console.warn('[KSM] Error limpiando pagos del cliente eliminado:', err);
  }

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

export async function recordPayment({
  clientId,
  radioName,
  amount,
  method,
  transactionRef,
  period,
  status = 'aprobado',
}) {
  const payments = await getPayments();
  const today = new Date().toISOString().split('T')[0];
  const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const paymentStatus = status === 'pendiente_verificacion' ? 'pendiente_verificacion' : 'aprobado';

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
    status: paymentStatus,
  };

  const updatedPayments = [newPayment, ...payments];
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

  // Enviar a Supabase si existe
  await fetchSupabase('payments', {
    method: 'POST',
    body: newPayment,
  });

  // Si el pago es aprobado inmediatamente (cargado por el admin), el cliente pasa a "al_dia"
  // Si fue reportado por el cliente, pasa a "pago_reportado" para que el admin lo verifique
  const newClientStatus = paymentStatus === 'aprobado' ? 'al_dia' : 'pago_reportado';

  const clients = await getClients();
  const updatedClients = clients.map((c) => {
    if (c.id === clientId || c.radio_name?.toLowerCase() === radioName?.toLowerCase()) {
      return {
        ...c,
        status: newClientStatus,
        ...(paymentStatus === 'aprobado' ? { last_payment_date: today } : {}),
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  const clientPatchBody = paymentStatus === 'aprobado'
    ? { status: 'al_dia', last_payment_date: today }
    : { status: 'pago_reportado' };

  await fetchSupabase('clients', {
    method: 'PATCH',
    query: `?id=eq.${clientId}`,
    body: clientPatchBody,
  });

  return newPayment;
}

export async function getPaymentsByClient(clientId) {
  const all = await getPayments();
  return all.filter((p) => p.client_id === clientId);
}

export async function approvePayment(paymentId, clientId, radioName) {
  // Admin confirma un pago reportado por el cliente tras revisar el home banking/Mercado Pago
  const payments = await getPayments();
  const updatedPayments = payments.map((p) =>
    p.id === paymentId ? { ...p, status: 'aprobado' } : p
  );
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

  await fetchSupabase('payments', {
    method: 'PATCH',
    query: `?id=eq.${paymentId}`,
    body: { status: 'aprobado' },
  });

  // Actualizar estado del cliente a al_dia y registrar última fecha de pago
  const today = new Date().toISOString().split('T')[0];
  const clients = await getClients();
  const updatedClients = clients.map((c) => {
    const isMatch = (clientId && c.id === clientId) ||
      (radioName && c.radio_name?.toLowerCase() === radioName?.toLowerCase());
    return isMatch ? { ...c, status: 'al_dia', last_payment_date: today } : c;
  });
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  if (clientId) {
    await fetchSupabase('clients', {
      method: 'PATCH',
      query: `?id=eq.${clientId}`,
      body: { status: 'al_dia', last_payment_date: today },
    });
  }

  return true;
}

export async function deletePayment(paymentId) {
  // Elimina un pago o factura de prueba/huérfana
  const payments = await getPayments();
  const updatedPayments = payments.filter((p) => p.id !== paymentId);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

  await fetchSupabase('payments', {
    method: 'DELETE',
    query: `?id=eq.${paymentId}`,
  });
  return true;
}

export async function purgeOrphanPayments() {
  // Elimina pagos cuyos clientes ya no existen en el sistema
  const [clients, payments] = await Promise.all([getClients(), getPayments()]);
  const clientIds = new Set(clients.map((c) => c.id));
  const clientNames = new Set(clients.map((c) => c.radio_name?.toLowerCase().trim()));

  const validPayments = payments.filter((p) =>
    (p.client_id && clientIds.has(p.client_id)) ||
    (p.radio_name && clientNames.has(p.radio_name?.toLowerCase().trim()))
  );

  const orphanPayments = payments.filter((p) =>
    !((p.client_id && clientIds.has(p.client_id)) ||
    (p.radio_name && clientNames.has(p.radio_name?.toLowerCase().trim())))
  );

  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(validPayments));

  for (const orphan of orphanPayments) {
    await fetchSupabase('payments', {
      method: 'DELETE',
      query: `?id=eq.${orphan.id}`,
    });
  }

  return { purgedCount: orphanPayments.length, remainingCount: validPayments.length };
}


export async function verifyAdminCredentials(username, password) {
  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();

  // 1. Intentar validar contra Supabase tabla admin_users
  try {
    const supaAdmins = await fetchSupabase('admin_users', {
      query: `?username=eq.${encodeURIComponent(cleanUser)}&select=*`,
    });
    if (supaAdmins && Array.isArray(supaAdmins) && supaAdmins.length > 0) {
      const admin = supaAdmins[0];
      if (admin.password === cleanPass) {
        logAuthEvent('login_success', cleanUser);
        return { success: true, user: admin.username };
      }
      logAuthEvent('login_failed', cleanUser);
      return { success: false, error: 'Contraseña de administrador incorrecta.' };
    }
  } catch (err) {
    console.warn('[Admin Auth] Error consultando Supabase admin_users, usando fallback local.', err);
  }

  // 2. Validación de credenciales locales por defecto
  const localCredsRaw = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
  const localCreds = localCredsRaw ? JSON.parse(localCredsRaw) : null;
  const targetUser = localCreds?.username || DEFAULT_ADMIN_USER;
  const targetPass = localCreds?.password || DEFAULT_ADMIN_PASS;

  if (cleanUser === targetUser && cleanPass === targetPass) {
    logAuthEvent('login_success', cleanUser);
    return { success: true, user: targetUser };
  }

  logAuthEvent('login_failed', cleanUser);
  return { success: false, error: 'Usuario o contraseña de administrador incorrectos.' };
}

export async function updateAdminCredentials(newUsername, newPassword) {
  const creds = { username: newUsername.trim(), password: newPassword.trim() };
  localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(creds));

  // Actualizar también en Supabase si está disponible
  await fetchSupabase('admin_users', {
    method: 'PATCH',
    query: `?id=eq.admin-1`,
    body: creds,
  });

  return true;
}

// ==========================================
// AUTENTICACIÓN Y GESTIÓN DE CLAVES CLIENTES
// ==========================================

export async function loginClient(identifier, password) {
  const cleanId = String(identifier).trim().toLowerCase();
  const cleanPass = String(password).trim();

  const clients = await getClients();
  const found = clients.find(
    (c) =>
      (c.username && c.username.toLowerCase() === cleanId) ||
      (c.email && c.email.toLowerCase() === cleanId) ||
      (c.phone && c.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')) ||
      (c.radio_name && c.radio_name.toLowerCase() === cleanId)
  );

  if (!found) {
    logAuthEvent('login_failed', cleanId);
    return { success: false, error: 'No se encontró ninguna emisora con ese usuario o correo.' };
  }

  if (found.password !== cleanPass) {
    logAuthEvent('login_failed', cleanId);
    return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus datos.' };
  }

  logAuthEvent('login_success', cleanId);
  return {
    success: true,
    client: found,
    mustChangePassword: !!found.must_change_password,
  };
}

export async function clientChangePassword(clientId, newPassword) {
  const clients = await getClients();
  const updatedClients = clients.map((c) => {
    if (c.id === clientId) {
      return {
        ...c,
        password: String(newPassword).trim(),
        must_change_password: false,
      };
    }
    return c;
  });

  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  await fetchSupabase('clients', {
    method: 'PATCH',
    query: `?id=eq.${clientId}`,
    body: { password: String(newPassword).trim(), must_change_password: false },
  });

  logAuthEvent('password_changed', clientId);
  return true;
}

export async function adminResetClientPassword(clientId, temporaryPassword = 'ksm' + Math.floor(100 + Math.random() * 900)) {
  const clients = await getClients();
  let updatedClient = null;

  const updatedClients = clients.map((c) => {
    if (c.id === clientId) {
      updatedClient = {
        ...c,
        password: String(temporaryPassword).trim(),
        must_change_password: true,
      };
      return updatedClient;
    }
    return c;
  });

  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));

  await fetchSupabase('clients', {
    method: 'PATCH',
    query: `?id=eq.${clientId}`,
    body: { password: String(temporaryPassword).trim(), must_change_password: true },
  });

  logAuthEvent('password_reset', clientId);
  return updatedClient;
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
