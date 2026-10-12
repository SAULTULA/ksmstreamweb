/**
 * Serverless Function para Vercel: /api/create-preference
 * Genera una preferencia de pago segura de Mercado Pago Checkout Pro.
 * El MERCADOPAGO_ACCESS_TOKEN se lee desde las variables de entorno del servidor
 * y NUNCA se expone en el cliente (OWASP A01 / A02).
 */

export default async function handler(req, res) {
  // Manejo de CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    console.error('[Mercado Pago] MERCADOPAGO_ACCESS_TOKEN no está definido en el entorno.');
    return res.status(500).json({
      error: 'La pasarela de pago no está configurada (falta MERCADOPAGO_ACCESS_TOKEN).',
    });
  }

  try {
    const { clientId, radioName, ownerName, email, amount, origin } = req.body || {};

    if (!clientId || !amount) {
      return res.status(400).json({ error: 'Datos incompletos: clientId y amount son obligatorios.' });
    }

    // URL base de retorno (la de producción en Vercel o la del request)
    const hostHeader = req.headers['host'];
    const protoHeader = req.headers['x-forwarded-proto'] || 'https';
    const safeOrigin = origin || (hostHeader ? `${protoHeader}://${hostHeader}` : 'https://ksmstreamweb.vercel.app');

    const preferenceData = {
      items: [
        {
          id: `cuota-${clientId}`,
          title: `Abono Streaming HD - ${radioName || 'Radio Cliente'}`,
          description: `Servicio mensual de transmisión de audio digital KSM para ${radioName || 'Radio'}`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(amount),
        },
      ],
      payer: {
        name: ownerName || radioName || 'Cliente KSM',
        email: email || 'cliente@ksmservicios.com',
      },
      external_reference: String(clientId),
      back_urls: {
        success: `${safeOrigin}/?mp_status=approved&client_id=${clientId}`,
        pending: `${safeOrigin}/?mp_status=pending&client_id=${clientId}`,
        failure: `${safeOrigin}/?mp_status=failure&client_id=${clientId}`,
      },
      auto_return: 'approved',
      statement_descriptor: 'KSM STREAMING',
      binary_mode: true, // Solo aprueba o rechaza, sin estados intermedios ambiguos
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpRes.ok) {
      const errText = await mpRes.text();
      console.error('[Mercado Pago API error]', mpRes.status, errText);
      return res.status(mpRes.status).json({
        error: 'Error de comunicación con Mercado Pago',
        details: errText,
      });
    }

    const data = await mpRes.json();
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    console.error('[Create Preference exception]', err);
    return res.status(500).json({ error: 'Error interno del servidor procesando el pago.' });
  }
}
