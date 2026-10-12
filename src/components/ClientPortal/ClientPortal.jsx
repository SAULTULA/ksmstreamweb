import React, { useState, useEffect } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  Copy,
  CreditCard,
  FileText,
  X,
  ExternalLink,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { getClients, recordPayment } from '../../services/db';
import styles from './ClientPortal.module.css';

export default function ClientPortal({ isOpen, onClose, initialRadioName, onOpenInvoice }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  // Formulario de pago
  const [method, setMethod] = useState('Transferencia Bancaria');
  const [refCode, setRefCode] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen, initialRadioName]);

  const loadClients = async () => {
    const list = await getClients();
    setClients(list);

    if (initialRadioName) {
      const match = list.find(
        (c) => c.radio_name.toLowerCase() === initialRadioName.toLowerCase()
      );
      if (match) setSelectedClientId(match.id);
      else if (list.length > 0) setSelectedClientId(list[0].id);
    } else if (list.length > 0 && !selectedClientId) {
      setSelectedClientId(list[0].id);
    }
  };

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReportPayment = async (e) => {
    e.preventDefault();
    if (!currentClient) return;

    setIsSubmitting(true);
    try {
      const payment = await recordPayment({
        clientId: currentClient.id,
        radioName: currentClient.radio_name,
        amount: currentClient.monthly_fee,
        method: method,
        transactionRef: refCode || `TR-${Date.now().toString().slice(-6)}`,
        period: 'Cuota Mensual',
      });

      setPaymentSuccess(payment);
      setRefCode('');
      // Recargar clientes
      await loadClients();
    } catch (err) {
      console.error(err);
      alert('Hubo un error al registrar el pago. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['client-portal']} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles['client-portal__card']} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles['client-portal__close']}
          onClick={onClose}
          aria-label="Cerrar portal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className={styles['client-portal__header']}>
          <div className={styles['client-portal__icon-box']}>
            <Radio size={26} />
          </div>
          <div>
            <h2 className={styles['client-portal__title']}>Área de Clientes KSM</h2>
            <p className={styles['client-portal__subtitle']}>
              Consulta el estado de tu señal, abona tu cuota mensual y descarga tu factura.
            </p>
          </div>
        </div>

        {/* Selector de Radio */}
        <div className={styles['client-portal__search-section']}>
          <label htmlFor="portal-client-select" className={styles['client-portal__search-label']}>
            Selecciona tu Radio o Proyecto:
          </label>
          <select
            id="portal-client-select"
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setPaymentSuccess(null);
            }}
            className={styles['client-portal__select']}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.radio_name} — ({c.owner_name})
              </option>
            ))}
          </select>
        </div>

        {/* Ficha de la Radio */}
        {currentClient && (
          <div className={styles['client-portal__account-box']}>
            <div className={styles['client-portal__account-header']}>
              <div>
                <h3 className={styles['client-portal__radio-name']}>{currentClient.radio_name}</h3>
                <p className={styles['client-portal__owner']}>Titular: {currentClient.owner_name}</p>
              </div>

              <div>
                {currentClient.status === 'al_dia' ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: 'var(--color-success)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>SERVICIO AL DÍA</span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: 'var(--color-danger)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>CUOTA PENDIENTE DE PAGO</span>
                  </span>
                )}
              </div>
            </div>

            <div className={styles['client-portal__details-grid']}>
              <div className={styles['client-portal__detail-item']}>
                <span className={styles['client-portal__detail-label']}>Plan Contratado</span>
                <span className={styles['client-portal__detail-val']}>{currentClient.plan}</span>
              </div>

              <div className={styles['client-portal__detail-item']}>
                <span className={styles['client-portal__detail-label']}>Vencimiento Regular</span>
                <span className={styles['client-portal__detail-val']}>
                  Día {currentClient.due_day || 5} de cada mes
                </span>
              </div>

              <div className={styles['client-portal__detail-item']}>
                <span className={styles['client-portal__detail-label']}>Monto de la Cuota</span>
                <span className={styles['client-portal__fee-highlight']}>
                  ${Number(currentClient.monthly_fee || 0).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de Pago Exitoso */}
        {paymentSuccess && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 800 }}>
              <CheckCircle2 size={18} />
              <span>¡Pago procesado con éxito! Comprobante N° {paymentSuccess.receipt_number}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Tu cuenta ya se encuentra al día y el impacto se registró automáticamente en el sistema de KSM Servicios.
            </p>
            <button
              type="button"
              className={styles['client-portal__btn-invoice']}
              onClick={() => onOpenInvoice && onOpenInvoice(paymentSuccess)}
              style={{ alignSelf: 'flex-start', marginTop: '0.3rem' }}
            >
              <FileText size={16} />
              <span>Ver y Descargar Mi Factura Oficial</span>
            </button>
          </div>
        )}

        {/* SECCIÓN DE PAGO (Si no está al día o desea abonar) */}
        {currentClient && (
          <div className={styles['client-portal__pay-section']}>
            <div className={styles['client-portal__pay-title']}>
              <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Medios de Pago Habilitados para tu Abono</span>
            </div>

            {/* Datos Bancarios KSM */}
            <div className={styles['client-portal__bank-card']}>
              <div className={styles['client-portal__bank-row']}>
                <span>
                  <strong>Alias:</strong> <code>KSM.STREAMING.AUDIO</code>
                </span>
                <button
                  type="button"
                  className={styles['client-portal__btn-copy']}
                  onClick={() => handleCopy('KSM.STREAMING.AUDIO', 'alias')}
                >
                  <Copy size={11} style={{ marginRight: '3px' }} />
                  {copiedField === 'alias' ? '¡Copiado!' : 'Copiar Alias'}
                </button>
              </div>

              <div className={styles['client-portal__bank-row']}>
                <span>
                  <strong>CVU:</strong> <code>0000003100094827163821</code>
                </span>
                <button
                  type="button"
                  className={styles['client-portal__btn-copy']}
                  onClick={() => handleCopy('0000003100094827163821', 'cvu')}
                >
                  <Copy size={11} style={{ marginRight: '3px' }} />
                  {copiedField === 'cvu' ? '¡Copiado!' : 'Copiar CVU'}
                </button>
              </div>

              <div className={styles['client-portal__bank-row']}>
                <span>
                  <strong>Titular:</strong> KSM Servicios Digitales
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
                  Acreditación inmediata
                </span>
              </div>
            </div>

            {/* Formulario para Informar Pago */}
            <form onSubmit={handleReportPayment} className={styles['client-portal__report-form']}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                ¿Ya transferiste? Confirma tu pago para actualizar tu estado y emitir tu factura:
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className={styles['client-portal__input']}
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                </select>

                <input
                  type="text"
                  placeholder="N° de Operación o Comprobante"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  className={styles['client-portal__input']}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles['client-portal__btn-submit-pay']}
              >
                <CheckCircle2 size={16} />
                <span>
                  {isSubmitting
                    ? 'Procesando...'
                    : `Confirmar Pago de $${Number(currentClient.monthly_fee || 0).toLocaleString('es-AR')} ARS`}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* Botón Ver Factura */}
        {currentClient && (
          <button
            type="button"
            className={styles['client-portal__btn-invoice']}
            onClick={() => {
              // Generar o mostrar última factura
              const mockPayment = {
                id: `pay-${currentClient.id}`,
                client_id: currentClient.id,
                radio_name: currentClient.radio_name,
                amount: currentClient.monthly_fee,
                payment_date: currentClient.last_payment_date || new Date().toISOString().split('T')[0],
                method: 'Transferencia Bancaria',
                receipt_number: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                transaction_ref: 'VERIFICADO',
                period: 'Abono Streaming',
                status: 'aprobado',
              };
              if (onOpenInvoice) onOpenInvoice(mockPayment);
            }}
          >
            <FileText size={16} />
            <span>Descargar Factura / Comprobante de Mi Radio</span>
          </button>
        )}
      </div>
    </div>
  );
}
