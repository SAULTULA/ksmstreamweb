import React, { useState, useRef } from 'react';
import { Radio, X, Volume2, VolumeX, ArrowDownRight } from 'lucide-react';
import styles from './RadioCelKsmLaunchFloat.module.css';

export default function RadioCelKsmLaunchFloat() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  if (!isVisible) return null;

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = () => {
    const el = document.getElementById('radiocelksm');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className={styles['launch-float']}
      role="complementary"
      aria-label="Anuncio de lanzamiento RadioCelKSM"
    >
      <div className={styles['launch-float__header']}>
        <span className={styles['launch-float__badge']}>
          <Radio size={12} />
          <span>Lanzamiento</span>
        </span>
        <div className={styles['launch-float__controls']}>
          <button
            type="button"
            className={styles['launch-float__icon-btn']}
            onClick={toggleMute}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar'}
            title={isMuted ? 'Activar audio' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            type="button"
            className={styles['launch-float__icon-btn']}
            onClick={() => setIsVisible(false)}
            aria-label="Cerrar anuncio"
            title="Cerrar"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className={styles['launch-float__video-box']}>
        <video
          ref={videoRef}
          src="/videos/radiocelksm-lanzamiento.mp4"
          className={styles['launch-float__video']}
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
      </div>

      <div className={styles['launch-float__footer']}>
        <div className={styles['launch-float__info']}>
          <strong className={styles['launch-float__title']}>RadioCelKSM App</strong>
          <span className={styles['launch-float__price']}>USD 35 · $42.000 ARS</span>
        </div>
        <button
          type="button"
          className={styles['launch-float__cta']}
          onClick={scrollToSection}
        >
          <span>Ver App</span>
          <ArrowDownRight size={14} />
        </button>
      </div>
    </aside>
  );
}

