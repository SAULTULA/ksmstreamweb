import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Pricing from './components/Pricing/Pricing';
import Summary from './components/Summary/Summary';
import AndroidSection from './components/AndroidSection/AndroidSection';
import SignupForm from './components/SignupForm/SignupForm';
import Terms from './components/Terms/Terms';
import Footer from './components/Footer/Footer';
import WhatsAppFAB from './components/WhatsAppFAB/WhatsAppFAB';

// Nuevos componentes de Gestión y Pagos
import AdminLoginModal from './components/AdminPanel/AdminLoginModal';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ClientPortal from './components/ClientPortal/ClientPortal';
import InvoiceModal from './components/Invoice/InvoiceModal';

import './index.css';

export default function App() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [portalRadioParam, setPortalRadioParam] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);

  // Detectar retorno de pago desde Mercado Pago o enlace directo (?portal=1 o ?radio=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mpStatus = params.get('mp_status') || params.get('collection_status') || params.get('status');
      const clientId = params.get('client_id') || params.get('external_reference');
      const paymentId = params.get('payment_id') || params.get('collection_id');

      if ((mpStatus === 'approved' || mpStatus === 'success') && clientId) {
        (async () => {
          try {
            const { getClients, recordPayment } = await import('./services/db');
            const clients = await getClients();
            const targetClient = clients.find((c) => c.id === clientId);

            if (targetClient) {
              const payment = await recordPayment({
                clientId: targetClient.id,
                radioName: targetClient.radio_name,
                amount: targetClient.monthly_fee,
                method: 'Mercado Pago',
                transactionRef: paymentId ? `MP-${paymentId}` : `MP-${Date.now().toString().slice(-6)}`,
                period: 'Cuota Mensual',
                status: 'aprobado',
              });

              // Abrir automáticamente la factura aprobada
              setInvoiceData(payment);
            }
          } catch (err) {
            console.error('[App MP auto-confirm error]', err);
          } finally {
            // Limpiar la URL sin recargar
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })();
      } else if (params.get('portal') || params.get('radio')) {
        setIsClientPortalOpen(true);
        setPortalRadioParam(params.get('radio') || '');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // OWASP A07: Validar sesión con TTL de 2h antes de abrir el panel
  const handleOpenAdmin = () => {
    const isAuth = sessionStorage.getItem('ksm_admin_authenticated') === 'true';
    const expiresAt = Number(sessionStorage.getItem('ksm_admin_expires') || 0);
    const sessionValid = isAuth && Date.now() < expiresAt;

    if (sessionValid) {
      setIsAdminPanelOpen(true);
    } else {
      // Limpiar sesión vencida
      sessionStorage.removeItem('ksm_admin_authenticated');
      sessionStorage.removeItem('ksm_admin_expires');
      sessionStorage.removeItem('ksm_admin_user');
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleOpenClientPortal = (radioName = '') => {
    setPortalRadioParam(radioName);
    setIsClientPortalOpen(true);
  };

  const handleOpenInvoice = (payment) => {
    setInvoiceData(payment);
  };

  return (
    <>
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        onOpenClientPortal={() => handleOpenClientPortal()}
      />
      <main>
        <Hero onOpenClientPortal={() => handleOpenClientPortal()} />
        <Features />
        <Pricing />
        <Summary />
        <AndroidSection />
        <SignupForm />
        <Terms />
      </main>
      <Footer onOpenClientPortal={() => handleOpenClientPortal()} />
      <WhatsAppFAB />

      {/* Modal de Login de Administrador */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Panel Completo de Administración */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenInvoice={handleOpenInvoice}
      />

      {/* Portal de Acceso a Clientes (Pagos y Facturas) */}
      <ClientPortal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        initialRadioName={portalRadioParam}
        onOpenInvoice={handleOpenInvoice}
      />

      {/* Modal / Comprobante de Factura Imprimible */}
      <InvoiceModal
        isOpen={!!invoiceData}
        paymentData={invoiceData}
        onClose={() => setInvoiceData(null)}
      />
    </>
  );
}

