import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, X, ArrowRight } from 'lucide-react';
import styles from './BeginnerPromoToast.module.css';

const WA_MESSAGE = encodeURIComponent(
  'Hola KSM Servicios! Vi la promo para principiantes / novatos. Me gustaría conocer la opción a mi medida con precio promocional.'
);
const WA_LINK = `https://wa.me/5491166508379?text=${WA_MESSAGE}`;

// Tiempos en milisegundos
const INITIAL_DELAY_MS = 5000;   // Primera aparición: 5 segundos tras cargar
const DISPLAY_DURATION_MS = 9000; // Tiempo en pantalla: 9 segundos
const REAPPEAR_INTERVAL_MS = 32000; // Tiempo oculto antes de volver: 32 segundos

export default function BeginnerPromoToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const displayTimerRef = useRef(null);
  const reappearTimerRef = useRef(null);

  // Iniciar ciclo de aparición
  const showToast = () => {
    setIsVisible(true);
    // Programar que se vaya después de DISPLAY_DURATION_MS
    displayTimerRef.current = setTimeout(() => {
      hideToast();
    }, DISPLAY_DURATION_MS);
  };

  const hideToast = () => {
    setIsVisible(false);
    clearTimeout(displayTimerRef.current);
    // Programar reaparición periódica
    reappearTimerRef.current = setTimeout(() => {
      showToast();
    }, REAPPEAR_INTERVAL_MS);
  };

  const handleManualClose = () => {
    // Si el usuario cierra manualmente, esperamos un poco más antes de volver a molestar (45s)
    setIsVisible(false);
    clearTimeout(displayTimerRef.current);
    clearTimeout(reappearTimerRef.current);
    reappearTimerRef.current = setTimeout(() => {
      showToast();
    }, 45000);
  };

  // Pausar auto-ocultado al hacer hover para que el usuario pueda leer con calma
  const handleMouseEnter = () => {
    setIsPaused(true);
    clearTimeout(displayTimerRef.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    // Reanudar el temporizador si sigue visible
    if (isVisible) {
      displayTimerRef.current = setTimeout(() => {
        hideToast();
      }, 4000); // 4 segundos extra tras quitar el mouse
    }
  };

  useEffect(() => {
    // Primera aparición tras INITIAL_DELAY_MS
    const initTimer = setTimeout(() => {
      showToast();
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(displayTimerRef.current);
      clearTimeout(reappearTimerRef.current);
    };
  }, []);

  return (
    <aside
      className={`${styles['beginner-toast']} ${isVisible ? styles['beginner-toast--visible'] : ''}`}
      role="complementary"
      aria-label="Promoción especial para principiantes"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón Cerrar */}
      <button
        type="button"
        className={styles['beginner-toast__close']}
        onClick={handleManualClose}
        title="Cerrar aviso"
        aria-label="Cerrar aviso"
      >
        <X size={14} />
      </button>

      {/* Cabecera / Badge */}
      <div className={styles['beginner-toast__header']}>
        <div className={styles['beginner-toast__badge']}>
          <Sparkles size={13} className={styles['beginner-toast__badge-icon']} />
          <span>¡Atención Principiante!</span>
        </div>
        <span className={styles['beginner-toast__pulse-dot']} />
      </div>

      {/* Título y Mensaje */}
      <div className={styles['beginner-toast__body']}>
        <p className={styles['beginner-toast__title']}>
          ¿Querés tu primera radio online?
        </p>
        <p className={styles['beginner-toast__message']}>
          Tenemos una opción para vos con <strong>precio totalmente promocional</strong>. ¡Comunicate, no te vas a arrepentir! <strong>Plan a tu medida</strong>.
        </p>
      </div>

      {/* Botón WhatsApp */}
      <div className={styles['beginner-toast__actions']}>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['beginner-toast__btn']}
          onClick={() => setIsVisible(false)}
        >
          <MessageCircle size={15} />
          <span>Consultar Promo Novato</span>
          <ArrowRight size={14} className={styles['beginner-toast__btn-arrow']} />
        </a>
      </div>

      {/* Barra de progreso de auto-cierre */}
      <div
        className={`${styles['beginner-toast__progress']} ${isVisible && !isPaused ? styles['beginner-toast__progress--running'] : ''
          }`}
      />
    </aside>
  );
}

