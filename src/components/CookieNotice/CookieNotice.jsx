import React, { useState, useEffect } from 'react';
import { Cookie, Check, ArrowRight } from 'lucide-react';
import styles from './CookieNotice.module.css';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ksm_cookie_consent');
      if (!consent) {
        // Small delay so it smoothly slides in after load
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage may fail in restrictive environments
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('ksm_cookie_consent', 'accepted');
    } catch (e) {}
    setVisible(false);
  };

  const handleLearnMore = () => {
    const el = document.getElementById('cookies');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#cookies';
    }
  };

  if (!visible) return null;

  return (
    <aside className={styles['cookie-notice']} aria-label="Aviso de privacidad y almacenamiento local">
      <div className={styles['cookie-notice__card']}>
        <div className={styles['cookie-notice__content']}>
          <div className={styles['cookie-notice__icon-box']}>
            <Cookie size={20} />
          </div>
          <div className={styles['cookie-notice__text-box']}>
            <span className={styles['cookie-notice__title']}>Almacenamiento Técnico Esencial</span>
            <p className={styles['cookie-notice__desc']}>
              Utilizamos únicamente almacenamiento local imprescindible para el funcionamiento del servicio. No usamos cookies de seguimiento publicitario ni rastreadores de terceros.
            </p>
          </div>
        </div>

        <div className={styles['cookie-notice__actions']}>
          <button
            type="button"
            className={styles['cookie-notice__btn-learn']}
            onClick={handleLearnMore}
          >
            <span>Ver Política</span>
            <ArrowRight size={13} />
          </button>
          <button
            type="button"
            className={styles['cookie-notice__btn-accept']}
            onClick={handleAccept}
          >
            <Check size={14} />
            <span>Entendido</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
