import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'mercadopago-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/create-preference', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method not allowed' }));
            }

            const token = env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
            if (!token) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'MERCADOPAGO_ACCESS_TOKEN no encontrado en .env' }));
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const preferenceData = {
                  items: [
                    {
                      id: `cuota-${parsed.clientId}`,
                      title: `Abono Streaming HD - ${parsed.radioName || 'Radio'}`,
                      description: 'Servicio mensual de streaming de audio KSM',
                      quantity: 1,
                      currency_id: 'ARS',
                      unit_price: Number(parsed.amount) || 10000,
                    },
                  ],
                  payer: {
                    name: parsed.ownerName || parsed.radioName || 'Cliente KSM',
                    email: parsed.email || 'cliente@ksmservicios.com',
                  },
                  external_reference: String(parsed.clientId || ''),
                  back_urls: {
                    success: `${parsed.origin || 'http://localhost:3000'}/?mp_status=approved&client_id=${parsed.clientId}`,
                    pending: `${parsed.origin || 'http://localhost:3000'}/?mp_status=pending&client_id=${parsed.clientId}`,
                    failure: `${parsed.origin || 'http://localhost:3000'}/?mp_status=failure&client_id=${parsed.clientId}`,
                  },
                  auto_return: 'approved',
                  statement_descriptor: 'KSM STREAMING',
                  binary_mode: true,
                };

                const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(preferenceData),
                });

                const data = await mpRes.json();
                res.statusCode = mpRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});

