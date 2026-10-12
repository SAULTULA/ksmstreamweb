import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './InvoiceModal.module.css';

export default function InvoiceModal({ isOpen, onClose, paymentData }) {
  if (!isOpen || !paymentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountFormatted = Number(paymentData.amount || 0).toLocaleString('es-AR');
  const today = paymentData.payment_date || new Date().toISOString().split('T')[0];

  return (
    <div className={styles['invoice-modal']} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles['invoice-modal__card']} onClick={(e) => e.stopPropagation()}>
        {/* Top actions */}
        <div className={styles['invoice-modal__actions']}>
          <button
            type="button"
            className={styles['invoice-modal__btn-print']}
            onClick={handlePrint}
          >
            <Printer size={15} />
            <span>Imprimir / Guardar en PDF</span>
          </button>

          <button
            type="button"
            className={styles['invoice-modal__btn-close']}
            onClick={onClose}
            aria-label="Cerrar comprobante"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Document */}
        <div className={styles['invoice-doc']}>
          {/* Header */}
          <div className={styles['invoice-doc__header']}>
            <div className={styles['invoice-doc__brand']}>
              <img src="/logo.png" alt="KSM Streaming" className={styles['invoice-doc__logo-img']} />
              <div className={styles['invoice-doc__brand-sub']}>
                <strong>KSM Servicios Audiovisuales & Streaming HD</strong><br />
                Plataforma de Transmisión de Audio Digital<br />
                contacto@ksmservicios.com | Buenos Aires, Argentina
              </div>
            </div>

            <div className={styles['invoice-doc__title-box']}>
              <span className={styles['invoice-doc__badge']}>Comprobante Oficial</span>
              <span className={styles['invoice-doc__number']}>
                {paymentData.receipt_number || 'REC-2026-0001'}
              </span>
              <span className={styles['invoice-doc__date']}>Fecha: {today}</span>
            </div>
          </div>

          {/* Parties */}
          <div className={styles['invoice-doc__parties']}>
            <div className={styles['invoice-doc__party-col']}>
              <span className={styles['invoice-doc__party-title']}>Emisor</span>
              <span className={styles['invoice-doc__party-name']}>KSM SERVICIOS DIGITALES</span>
              <span>Servicios de Servidores & Streaming de Audio</span>
              <span>Régimen Simplificado / Factura B / Recibo Electrónico</span>
              <span>Soporte Oficial 24/7</span>
            </div>

            <div className={styles['invoice-doc__party-col']}>
              <span className={styles['invoice-doc__party-title']}>Cliente / Receptor</span>
              <span className={styles['invoice-doc__party-name']}>{paymentData.radio_name}</span>
              <span>Medio de Pago: {paymentData.method || 'Transferencia'}</span>
              <span>Referencia Operación: {paymentData.transaction_ref || 'OK-ACREDITADO'}</span>
              <span>Período Abonado: {paymentData.period || 'Cuota Mensual'}</span>
            </div>
          </div>

          {/* Table */}
          <table className={styles['invoice-doc__table']}>
            <thead>
              <tr>
                <th className={styles['invoice-doc__th']} style={{ textAlign: 'left' }}>Descripción del Servicio</th>
                <th className={styles['invoice-doc__th']} style={{ textAlign: 'center' }}>Cant.</th>
                <th className={styles['invoice-doc__th']} style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles['invoice-doc__td']}>
                  <strong>Abono Mensual Servidor de Streaming HD</strong><br />
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Infraestructura Icecast V2 / Shoutcast SSL 128 kbps AAC+ - Panel SonicPanel - Transferencia sin límite
                  </span>
                </td>
                <td className={styles['invoice-doc__td']} style={{ textAlign: 'center' }}>1</td>
                <td className={styles['invoice-doc__td']} style={{ textAlign: 'right', fontWeight: 700 }}>
                  ${amountFormatted} ARS
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total & Stamp */}
          <div className={styles['invoice-doc__footer']}>
            <div
              className={`${styles['invoice-doc__stamp']} ${
                paymentData.status === 'pendiente_verificacion'
                  ? styles['invoice-doc__stamp--pending']
                  : ''
              }`}
            >
              <CheckCircle2 size={16} />
              <span>
                {paymentData.status === 'pendiente_verificacion'
                  ? 'EN REVISIÓN / INFORMADO'
                  : 'PAGADO & ACREDITADO'}
              </span>
            </div>

            <div className={styles['invoice-doc__total-box']}>
              <span className={styles['invoice-doc__total-label']}>TOTAL ABONADO:</span>
              <span className={styles['invoice-doc__total-val']}>${amountFormatted} ARS</span>
            </div>
          </div>

          {/* Security note */}
          <div className={styles['invoice-doc__notes']}>
            <p>
              Documento digital de validez comercial emitido por KSM Servicios para la emisora {paymentData.radio_name}.<br />
              Por consultas sobre este comprobante contactar a soporte administrativo oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
