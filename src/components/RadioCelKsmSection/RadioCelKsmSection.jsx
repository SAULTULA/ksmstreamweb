import React, { useState, useRef } from 'react';
import { Radio, CheckCircle2, Mic, Disc, MessageCircle, Download, Volume2, VolumeX } from 'lucide-react';
import styles from './RadioCelKsmSection.module.css';

const simplifiedFeatures = [
  'Emisión en vivo hacia servidores Icecast 2, Shoutcast v1 y Shoutcast v2 en MP3 (64 a 320 kbps)',
  'Uso del micrófono interno del celular o micrófono externo (USB-C, Jack o Bluetooth)',
  'Botón MIC con Auto-Ducking (Talkover): baja la música al hablar y la restaura al desactivar',
  'Botones PLAY / STOP de transmisión y reproductor de archivos de audio locales del celular',
  'Grabación simultánea en formato MP3 directo en la memoria del teléfono',
  'Medidor VU estéreo en tiempo real + visualización y envío de Artista y Canción (Metadata ICY)',
  'Protección ante llamadas entrantes: la transmisión de música continúa sin cortes',
];

const WA_MSG = encodeURIComponent(
  'Hola KSM Servicios! Quiero consultar por la app RadioCelKSM (Versión Simplificada - USD 35 / $50.000 ARS) para emitir radio desde el celular.'
);

export default function RadioCelKsmSection() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="radiocelksm" className={styles.radiocel}>
      <div className={styles['radiocel__container']}>
        {/* Media Promo */}
        <div className={styles['radiocel__media']}>
          <div className={styles['radiocel__video-wrapper']}>
            <video
              ref={videoRef}
              src="/videos/radiocelksm-promo.mp4"
              className={styles['radiocel__video']}
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
            <button
              type="button"
              onClick={toggleMute}
              className={styles['radiocel__mute-btn']}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar video'}
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className={styles['radiocel__promo-chip']}>
              <Disc size={14} />
              <span>Consola Móvil Android</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles['radiocel__content']}>
          <div className={styles['radiocel__tag']}>
            <Radio size={13} />
            <span>Nuevo Lanzamiento · App Emisora</span>
          </div>

          <h2 className={styles['radiocel__title']}>
            <span className={styles['radiocel__title-gradient']}>RadioCelKSM</span> — Emití tu Radio Online desde el Celular
          </h2>

          <p className={styles['radiocel__desc']}>
            Convertí tu teléfono Android en una consola portátil para transmitir radio en vivo sin depender de una computadora.
            Cargá los datos de tu encoder Icecast o Shoutcast, mezclá tu voz con tu música y grabá tu programa en MP3 desde cualquier lugar.
          </p>

          <div className={styles['radiocel__price-box']}>
            <div className={styles['radiocel__price-row']}>
              <div className={styles['radiocel__price-label']}>
                <span className={styles['radiocel__price-badge']}>Licencia RadioCelKSM (Edición Estándar)</span>
                <span className={styles['radiocel__price-sublabel']}>
                  Pago único · Incluye 7 días de prueba gratis para evaluar en tu celular.
                </span>
              </div>
              <div className={styles['radiocel__prices']}>
                <span className={styles['radiocel__price-usd']}>USD 35</span>
                <span className={styles['radiocel__price-ars']}>$50.000 ARS</span>
              </div>
            </div>

            <hr className={styles['radiocel__divider']} />

            <div className={styles['radiocel__highlight']}>
              <Mic size={18} className={styles['radiocel__highlight-icon']} />
              <p className={styles['radiocel__highlight-text']}>
                <strong>Ideal para exteriores y móviles:</strong> conectá tu micrófono interno o externo, activá el Talkover con un toque y salí al aire al instante.
              </p>
            </div>
          </div>

          <ul className={styles['radiocel__features']}>
            {simplifiedFeatures.map((feat, idx) => (
              <li key={idx} className={styles['radiocel__feature-item']}>
                <CheckCircle2 size={16} className={styles['radiocel__feature-icon']} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <div className={styles['radiocel__actions']}>
            <a
              href={`https://wa.me/5491166508379?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['radiocel__cta']}
            >
              <MessageCircle size={18} />
              <span>Solicitar Licencia (USD 35 / $50.000 ARS)</span>
            </a>

            <a
              href="https://radiocelapp.ksmservicios.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['radiocel__cta-secondary']}
            >
              <Download size={18} />
              <span>Descargas / Versiones</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

