import React from 'react';
import { DollarSign, Star, Package } from 'lucide-react';
import styles from './Summary.module.css';

export default function Summary() {
  return (
    <section id="comparativa" className={styles.summary}>
      <div className={styles['summary__container']}>
        <div className={styles['summary__header']}>
          <div className={styles['summary__tag']}>
            <DollarSign size={13} />
            <span>Resumen de Primer Pago</span>
          </div>
          <h2 className={styles['summary__title']}>
            ¿Cuánto abono el{' '}
            <span className={styles['summary__title-gradient']}>primer día?</span>
          </h2>
          <p className={styles['summary__subtitle']}>
            El Plan Básico arranca directo desde $8.000/mes y el Plan Pro desde $15.000/mes sin costo de alta.
          </p>
        </div>

        <div className={styles['summary__grid']}>
          {/* Plan Básico */}
          <div className={styles['summary__card']}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Plan Básico</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--basic']}`}>
                <DollarSign size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Precio del Streaming</span>
              <span className={styles['summary__amount']}>$8.000 ARS / mes</span>
              <span className={styles['summary__amount-sub']}>Sin costo de alta · desde el primer mes</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {['Streaming desde el día 1', 'Configuración del servidor', 'Reproductor HTML5 Estándar', 'Reproductor tipo App Web instalable (PWA)', 'Soporte vía WhatsApp'].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={`${styles['summary__includes-dot']} ${styles['summary__includes-dot--cyan']}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Pro */}
          <div className={styles['summary__card']}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Plan Pro</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--pro']}`}>
                <Star size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Precio del Streaming Pro</span>
              <span className={styles['summary__amount']}>$15.000 ARS / mes</span>
              <span className={styles['summary__amount-sub']}>Sin costo de alta · desde el primer mes</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {['Streaming HD desde el día 1', 'Configuración del servidor y SonicPanel', 'Reproductor personalizado a medida', 'Reproductor tipo App Web instalable (PWA)', 'Estadísticas gráficas en tiempo real', 'Soporte técnico prioritario'].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={`${styles['summary__includes-dot']} ${styles['summary__includes-dot--cyan']}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Pro + App */}
          <div className={`${styles['summary__card']} ${styles['summary__card--highlight']}`}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Pro + App Android</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--bundle']}`}>
                <Package size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Pago Inicial</span>
              <span className={`${styles['summary__amount']} ${styles['summary__amount--accent']}`}>$115.000 ARS</span>
              <span className={styles['summary__amount-sub']}>Plan Pro ($15.000) + App Android ($100.000 promo), luego $15.000/mes desde mes 2</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {['Todo lo del Plan Pro', 'App Android dedicada personalizada', 'Entrega de APK para compartir e instalar directo', 'Entrega de AAB listo para subir a Google Play Store', 'Reproductor tipo App Web instalable (PWA)', 'Streaming: $15.000 / mes desde mes 2', 'Sin cuotas de mantenimiento por la App'].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={styles['summary__includes-dot']} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
