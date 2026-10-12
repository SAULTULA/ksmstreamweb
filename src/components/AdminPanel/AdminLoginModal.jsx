import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { verifyAdminPin } from '../../services/db';
import styles from './AdminLoginModal.module.css';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setError('Por favor ingresa la clave de administrador.');
      return;
    }

    if (verifyAdminPin(pin)) {
      setError('');
      setPin('');
      sessionStorage.setItem('ksm_admin_authenticated', 'true');
      onSuccess();
    } else {
      setError('Credencial incorrecta. Acceso denegado.');
    }
  };

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
          <h2 className={styles['admin-modal__title']}>Acceso KSM Administración</h2>
          <p className={styles['admin-modal__subtitle']}>
            Panel privado de control de clientes, avisos automáticos y cobranzas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles['admin-modal__form']}>
          <div className={styles['admin-modal__field']}>
            <label htmlFor="admin-pin-input" className={styles['admin-modal__label']}>
              Contraseña o PIN Maestro
            </label>
            <div className={styles['admin-modal__input-wrapper']}>
              <Lock size={18} className={styles['admin-modal__input-icon']} />
              <input
                id="admin-pin-input"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa tu clave privada"
                autoFocus
                className={styles['admin-modal__input']}
              />
            </div>
          </div>

          {error && <div className={styles['admin-modal__error']}>{error}</div>}

          <button type="submit" className={styles['admin-modal__btn']}>
            <span>Ingresar al Panel</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p className={styles['admin-modal__hint']}>
          🔒 Acceso restringido únicamente al titular de KSM Servicios. (PIN inicial por defecto: <strong>1234</strong>)
        </p>
      </div>
    </div>
  );
}
