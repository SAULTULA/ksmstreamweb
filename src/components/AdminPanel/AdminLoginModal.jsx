import React, { useState, useRef } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { verifyAdminCredentials } from '../../services/db';
import styles from './AdminLoginModal.module.css';

// ── OWASP A07: Rate Limiting client-side ────────────────────────────────────
// 5 intentos fallidos → bloqueo de 30 segundos.
// Nota: el bloqueo definitivo debe implementarse también en Supabase RLS / Edge Function.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 30 segundos

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rate limiting state
  const attempts = useRef(0);
  const lockedUntil = useRef(null);
  const [lockCountdown, setLockCountdown] = useState(0);

  if (!isOpen) return null;

  // Inicia cuenta regresiva de desbloqueo
  const startLockCountdown = () => {
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil.current - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setLockCountdown(0);
        attempts.current = 0;
        lockedUntil.current = null;
      } else {
        setLockCountdown(remaining);
      }
    }, 1000);
  };

  const isLocked = () => lockedUntil.current && Date.now() < lockedUntil.current;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // OWASP A07: Verificar bloqueo
    if (isLocked()) {
      setError(`Demasiados intentos. Espera ${lockCountdown} segundos.`);
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Ingresá tu usuario y contraseña.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyAdminCredentials(username.trim(), password);

      if (result.success) {
        // Login exitoso — resetear contadores
        attempts.current = 0;
        lockedUntil.current = null;
        setUsername('');
        setPassword('');

        // OWASP A07: Marcar sesión con timestamp de expiración (2h)
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
        sessionStorage.setItem('ksm_admin_authenticated', 'true');
        sessionStorage.setItem('ksm_admin_expires', String(expiresAt));
        sessionStorage.setItem('ksm_admin_user', result.user);

        onSuccess();
      } else {
        // Login fallido — incrementar contador
        attempts.current += 1;

        if (attempts.current >= MAX_ATTEMPTS) {
          lockedUntil.current = Date.now() + LOCKOUT_MS;
          setLockCountdown(LOCKOUT_MS / 1000);
          startLockCountdown();
          setError(`Acceso bloqueado por ${LOCKOUT_MS / 1000}s. Demasiados intentos fallidos.`);
        } else {
          const remaining = MAX_ATTEMPTS - attempts.current;
          setError(`Credenciales incorrectas. Te quedan ${remaining} intento${remaining !== 1 ? 's' : ''}.`);
        }
      }
    } catch (err) {
      console.error('[AdminLogin] Error:', err);
      setError('Error de conexión. Verifica tu red e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const locked = isLocked();

  return (
    <div className={styles['admin-modal']} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles['admin-modal__card']} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles['admin-modal__close']}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        <div className={styles['admin-modal__header']}>
          <div className={styles['admin-modal__icon-box']}>
            <ShieldCheck size={28} />
          </div>
          <h2 className={styles['admin-modal__title']}>KSM Servicios</h2>
          <p className={styles['admin-modal__subtitle']}>
            Acceso Restringido · Panel de Gestión
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles['admin-modal__form']} autoComplete="off">
          {/* Campo Usuario */}
          <div className={styles['admin-modal__field']}>
            <label htmlFor="admin-username-input" className={styles['admin-modal__label']}>
              Usuario Administrador
            </label>
            <div className={styles['admin-modal__input-wrapper']}>
              <User size={16} className={styles['admin-modal__input-icon']} />
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Usuario"
                autoComplete="username"
                disabled={locked || isLoading}
                className={styles['admin-modal__input']}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className={styles['admin-modal__field']}>
            <label htmlFor="admin-password-input" className={styles['admin-modal__label']}>
              Contraseña
            </label>
            <div className={styles['admin-modal__input-wrapper']}>
              <Lock size={16} className={styles['admin-modal__input-icon']} />
              <input
                id="admin-password-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••"
                autoComplete="current-password"
                disabled={locked || isLoading}
                className={`${styles['admin-modal__input']} ${styles['admin-modal__input--pass']}`}
              />
              <button
                type="button"
                className={styles['admin-modal__pass-toggle']}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Mensaje de error / bloqueo */}
          {error && (
            <div className={styles[locked ? 'admin-modal__error--locked' : 'admin-modal__error']}>
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Barra de intentos */}
          {attempts.current > 0 && !locked && (
            <div className={styles['admin-modal__attempts-bar']}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <span
                  key={i}
                  className={`${styles['admin-modal__attempt-dot']} ${
                    i < attempts.current ? styles['admin-modal__attempt-dot--used'] : ''
                  }`}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className={styles['admin-modal__btn']}
            disabled={locked || isLoading}
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : locked ? (
              <span>Bloqueado ({lockCountdown}s)</span>
            ) : (
              <>
                <Lock size={16} />
                <span>Ingresar al Panel</span>
              </>
            )}
          </button>
        </form>

        <p className={styles['admin-modal__hint']}>
          🔒 Acceso protegido. Sesión con expiración automática de 2 horas.
        </p>
      </div>
    </div>
  );
}
