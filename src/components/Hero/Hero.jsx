import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Headphones, Wifi, Activity } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles['hero__container']}>
        <div className={styles['hero__content']}>
          <div className={styles['hero__badge']}>
            <Sparkles size={14} />
            <span>Servicio Profesional de Streaming de Audio</span>
          </div>

          <h1 className={styles['hero__title']}>
            Lleva tu Radio Online al mundo con{' '}
            <span className={styles['hero__title-gradient']}>Streaming HD</span>
          </h1>

          <p className={styles['hero__description']}>
            Infraestructura robusta para emisoras de radio, podcasters y comunicadores.
            Servidores de ultra baja latencia con panel SonicPanel, oyentes ilimitados,
            reproductor HTML5 y desarrollo de App Móvil Android dedicada.
          </p>

          <div className={styles['hero__actions']}>
            <a href="#planes" className={`${styles['hero__btn']} ${styles['hero__btn--primary']}`}>
              <span>Ver Planes y Precios</span>
              <ArrowRight size={18} />
            </a>
            <a href="#ficha-alta" className={`${styles['hero__btn']} ${styles['hero__btn--secondary']}`}>
              <span>Completar Ficha de Alta</span>
            </a>
          </div>

          <div className={styles['hero__trust']}>
            <ul className={styles['hero__trust-list']}>
              <li className={styles['hero__trust-item']}>
                <ShieldCheck size={16} className={styles['hero__trust-icon']} />
                <span>SSL Seguro HTTPS</span>
              </li>
              <li className={styles['hero__trust-item']}>
                <Headphones size={16} className={styles['hero__trust-icon']} />
                <span>Oyentes Ilimitados</span>
              </li>
              <li className={styles['hero__trust-item']}>
                <Wifi size={16} className={styles['hero__trust-icon']} />
                <span>Calidad HD 128 kbps</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles['hero__media']}>
          <div className={styles['hero__media-wrapper']}>
            <img
              src="/hero.png"
              alt="Estudio de radio y transmisión de audio streaming HD"
              className={styles['hero__image']}
              loading="eager"
            />
            <div className={styles['hero__media-overlay']} />
            <div className={styles['hero__floating-badge']}>
              <Activity size={20} className={styles['hero__floating-icon']} />
              <div>
                <div className={styles['hero__floating-title']}>Servidores Icecast / Shoutcast</div>
                <div className={styles['hero__floating-sub']}>Transmisión estable 24/7 sin cortes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
