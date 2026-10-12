import React, { useState, useEffect } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  Copy,
  CreditCard,
  FileText,
  X,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { loginClient, clientChangePassword, recordPayment } from '../../services/db';
import styles from './ClientPortal.module.css';

export default function ClientPortal({ isOpen, onClose, initialRadioName, onOpenInvoice }) {
  // ─── Auth State ───────────────────────────────────────────────────────────────
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'change_pass' | 'dashboard'
  const [loggedClient, setLoggedClient] = useState(null);

  // Login form
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Change-password form
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [changePassError, setChangePassError] = useState('');
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Payment state
  const [copiedField, setCopiedField] = useState(null);
  const [method, setMethod] = useState('Transferencia Bancaria');
  const [refCode, setRefCode] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [mpError, setMpError] = useState('');

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAuthScreen('login');
      setLoggedClient(null);
      setLoginId('');
      setLoginPass('');
      setLoginError('');
      setNewPass('');
      setConfirmPass('');
      setChangePassError('');
      setPaymentSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginId.trim() || !loginPass.trim()) {
      setLoginError('Por favor ingresá tu usuario y contraseña.');
      return;
    }
    setIsLoggingIn(true);
    try {
      const result = await loginClient(loginId, loginPass);
      if (!result.success) {
        setLoginError(result.error);
      } else {
        setLoggedClient(result.client);
        setAuthScreen(result.mustChangePassword ? 'change_pass' : 'dashboard');
      }
    } catch (err) {
      setLoginError('Error inesperado. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePassError('');
    if (newPass.length < 6) {
      setChangePassError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setChangePassError('Las contraseñas no coinciden. Verificá e intentá de nuevo.');
      return;
    }
    if (newPass === 'ksm123') {
      setChangePassError('No puedes usar la contraseña inicial. Elegí una contraseña personal.');
      return;
    }
    setIsSavingPass(true);
    try {
      await clientChangePassword(loggedClient.id, newPass);
      setLoggedClient((prev) => ({ ...prev, password: newPass, must_change_password: false }));
      setAuthScreen('dashboard');
    } catch (err) {
      setChangePassError('Error al guardar la contraseña. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSavingPass(false);
    }
  };

  const handleLogout = () => {
    setAuthScreen('login');
    setLoggedClient(null);
    setLoginId('');
    setLoginPass('');
    setPaymentSuccess(null);
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReportPayment = async (e) => {
    e.preventDefault();
    if (!loggedClient) return;
    setIsSubmitting(true);
    try {
      const payment = await recordPayment({
        clientId: loggedClient.id,
        radioName: loggedClient.radio_name,
        amount: loggedClient.monthly_fee,
        method,
        transactionRef: refCode || `TR-${Date.now().toString().slice(-6)}`,
        period: 'Cuota Mensual',
        status: 'pendiente_verificacion',
      });
      setPaymentSuccess(payment);
      setRefCode('');
      setLoggedClient((prev) => ({ ...prev, status: 'pago_reportado' }));
    } catch (err) {
      console.error(err);
      alert('Hubo un error al registrar el pago. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayWithMercadoPago = async () => {
    if (!loggedClient) return;
    setIsCreatingPreference(true);
    setMpError('');

    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: loggedClient.id,
          radioName: loggedClient.radio_name,
          ownerName: loggedClient.owner_name,
          email: loggedClient.email,
          amount: loggedClient.monthly_fee,
          origin: window.location.origin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error || 'No se pudo generar el enlace de pago de Mercado Pago.');
      }

      // Redirigir de inmediato al Checkout Pro de Mercado Pago
      window.location.href = data.init_point;
    } catch (err) {
      console.error('[MP error]', err);
      setMpError(err.message || 'Error al conectar con Mercado Pago. Podés transferir por Alias o intentar nuevamente.');
    } finally {
      setIsCreatingPreference(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────────
  const currentClient = loggedClient;
  const feeFormatted = Number(currentClient?.monthly_fee || 0).toLocaleString('es-AR');

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

        {/* ── SCREEN 1: LOGIN ───────────────────────────────────────────────────── */}
        {authScreen === 'login' && (
          <>
            <div className={styles['client-portal__header']}>
              <div className={styles['client-portal__icon-box']}>
                <Lock size={24} />
              </div>
              <div>
                <h2 className={styles['client-portal__title']}>Acceso de Clientes KSM</h2>
                <p className={styles['client-portal__subtitle']}>
                  Ingresá con tu usuario (o email) y contraseña para acceder a tu área.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className={styles['client-portal__auth-form']}>
              <div className={styles['client-portal__field']}>
                <label className={styles['client-portal__label']} htmlFor="cp-login-id">
                  Usuario, Email o Nombre de Radio
                </label>
                <input
                  id="cp-login-id"
                  type="text"
                  autoComplete="username"
                  placeholder="usuario / correo@email.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className={styles['client-portal__input']}
                />
              </div>

              <div className={styles['client-portal__field']}>
                <label className={styles['client-portal__label']} htmlFor="cp-login-pass">
                  Contraseña
                </label>
                <div className={styles['client-portal__pass-wrapper']}>
                  <input
                    id="cp-login-pass"
                    type={showLoginPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className={styles['client-portal__input']}
                  />
                  <button
                    type="button"
                    className={styles['client-portal__pass-toggle']}
                    onClick={() => setShowLoginPass((v) => !v)}
                    aria-label={showLoginPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className={styles['client-portal__error']}>
                  <AlertCircle size={15} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className={styles['client-portal__btn-submit-pay']}
              >
                <ShieldCheck size={16} />
                <span>{isLoggingIn ? 'Verificando...' : 'Ingresar a Mi Área'}</span>
              </button>

              <p className={styles['client-portal__hint']}>
                ¿Olvidaste tu contraseña? Contactá a KSM Servicios por WhatsApp para restablecerla.
              </p>
            </form>
          </>
        )}

        {/* ── SCREEN 2: FORCE CHANGE PASSWORD ──────────────────────────────────── */}
        {authScreen === 'change_pass' && (
          <>
            <div className={styles['client-portal__header']}>
              <div
                className={styles['client-portal__icon-box']}
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)' }}
              >
                <KeyRound size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h2 className={styles['client-portal__title']}>Cambio de Contraseña Requerido</h2>
                <p className={styles['client-portal__subtitle']}>
                  Hola <strong>{currentClient?.owner_name}</strong>. Por seguridad, debés establecer una contraseña personal antes de continuar.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className={styles['client-portal__auth-form']}>
              <div className={styles['client-portal__field']}>
                <label className={styles['client-portal__label']} htmlFor="cp-new-pass">
                  Nueva Contraseña (mínimo 6 caracteres)
                </label>
                <div className={styles['client-portal__pass-wrapper']}>
                  <input
                    id="cp-new-pass"
                    type={showNewPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Tu nueva contraseña segura"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className={styles['client-portal__input']}
                  />
                  <button
                    type="button"
                    className={styles['client-portal__pass-toggle']}
                    onClick={() => setShowNewPass((v) => !v)}
                    aria-label="Mostrar/ocultar contraseña"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles['client-portal__field']}>
                <label className={styles['client-portal__label']} htmlFor="cp-confirm-pass">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  id="cp-confirm-pass"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repetí tu nueva contraseña"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className={styles['client-portal__input']}
                />
              </div>

              {changePassError && (
                <div className={styles['client-portal__error']}>
                  <AlertCircle size={15} />
                  <span>{changePassError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPass}
                className={styles['client-portal__btn-submit-pay']}
              >
                <CheckCircle2 size={16} />
                <span>{isSavingPass ? 'Guardando...' : 'Guardar y Acceder'}</span>
              </button>
            </form>
          </>
        )}

        {/* ── SCREEN 3: DASHBOARD ───────────────────────────────────────────────── */}
        {authScreen === 'dashboard' && currentClient && (
          <>
            {/* Header con logout */}
            <div className={styles['client-portal__header']}>
              <div className={styles['client-portal__icon-box']}>
                <Radio size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 className={styles['client-portal__title']}>Área de Clientes KSM</h2>
                <p className={styles['client-portal__subtitle']}>
                  Bienvenido, <strong>{currentClient.owner_name}</strong>. Consultá tu señal o abonà tu cuota.
                </p>
              </div>
              <button
                type="button"
                className={styles['client-portal__btn-logout']}
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={15} />
                <span>Salir</span>
              </button>
            </div>

            {/* Ficha de la Radio */}
            <div className={styles['client-portal__account-box']}>
              <div className={styles['client-portal__account-header']}>
                <div>
                  <h3 className={styles['client-portal__radio-name']}>{currentClient.radio_name}</h3>
                  <p className={styles['client-portal__owner']}>Titular: {currentClient.owner_name}</p>
                </div>
                <div>
                  {currentClient.status === 'al_dia' && (
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
                  )}
                  {currentClient.status === 'pago_reportado' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: 'var(--color-warning)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      <AlertCircle size={14} />
                      <span>PAGO EN VERIFICACIÓN</span>
                    </span>
                  )}
                  {currentClient.status !== 'al_dia' && currentClient.status !== 'pago_reportado' && (
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
                  <span className={styles['client-portal__fee-highlight']}>${feeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Mensaje de Pago Informado */}
            {paymentSuccess && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 800 }}>
                  <CheckCircle2 size={18} />
                  <span>¡Comprobante informado con éxito! (N° {paymentSuccess.receipt_number})</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Registramos tu pago con referencia <strong>{paymentSuccess.transaction_ref}</strong>. La administración de KSM verificará la acreditación y tu factura quedará sellada definitivamente.
                </p>
                <button
                  type="button"
                  className={styles['client-portal__btn-invoice']}
                  onClick={() => onOpenInvoice && onOpenInvoice(paymentSuccess)}
                  style={{ alignSelf: 'flex-start', marginTop: '0.3rem' }}
                >
                  <FileText size={16} />
                  <span>Ver Comprobante Provisorio</span>
                </button>
              </div>
            )}

            {/* SECCIÓN DE PAGO */}
            <div className={styles['client-portal__pay-section']}>
              <div className={styles['client-portal__pay-title']}>
                <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Medios de Pago Habilitados para tu Abono</span>
              </div>

              {/* Opción 1: Pago Online Inmediato con Mercado Pago */}
              <div className={styles['client-portal__mp-box']}>
                <div className={styles['client-portal__mp-badge-tag']}>
                  <span>⚡ Acreditación Automática en el Acto</span>
                </div>
                <button
                  type="button"
                  className={styles['client-portal__btn-mp']}
                  onClick={handlePayWithMercadoPago}
                  disabled={isCreatingPreference}
                >
                  <CreditCard size={18} />
                  <span>
                    {isCreatingPreference
                      ? 'Conectando con Mercado Pago...'
                      : `Pagar $${feeFormatted} ARS con Mercado Pago`}
                  </span>
                </button>
                <span className={styles['client-portal__mp-caption']}>
                  Tarjetas de débito, crédito, dinero en cuenta de Mercado Pago o transferencia bancaria instantánea.
                </span>
                {mpError && (
                  <div className={styles['client-portal__error']}>
                    <AlertCircle size={14} />
                    <span>{mpError}</span>
                  </div>
                )}
              </div>

              <div className={styles['client-portal__divider']}>
                <span>o bien realizá una transferencia manual por CBU/Alias</span>
              </div>

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
                    {isSubmitting ? 'Procesando...' : `Confirmar Pago de $${feeFormatted} ARS`}
                  </span>
                </button>
              </form>
            </div>

            {/* Botón Ver Factura */}
            <button
              type="button"
              className={styles['client-portal__btn-invoice']}
              onClick={() => {
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
          </>
        )}
      </div>
    </div>
  );
}
