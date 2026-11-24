import React from 'react';
import { DollarSign, Star, Calendar, Smartphone } from 'lucide-react';
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
            Todas las promociones incluyen 1 año de streaming (pagás 10 meses y te llevás 2 meses GRATIS) + desarrollo web y hosting.
          </p>
        </div>

        <div className={styles['summary__grid']}>
          {/* Plan Mensual: Stream + App PWA */}
          <div className={`${styles['summary__card']} ${styles['summary__card--monthly']}`}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Plan Mensual PWA</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--monthly']}`}>
                <Smartphone size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Abono Mensual</span>
              <span className={`${styles['summary__amount']} ${styles['summary__amount--monthly']}`}>$15.000 ARS</span>
              <span className={styles['summary__amount-sub']}>Primer mes de servicio · Sin permanencia obligatoria</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {[
                'Streaming HD SonicPanel mes a mes',
                'App Web PWA instalable en cualquier dispositivo',
                'Oyentes ilimitados y tráfico no medido',
                'Reproductor web directo sin descargas',
                'SSL Seguro y soporte técnico continuo',
              ].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={styles['summary__includes-dot']} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Promo 2: Web Básico */}
          <div className={styles['summary__card']}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Promo 2: Básico</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--basic']}`}>
                <DollarSign size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Pago Único Contado</span>
              <span className={styles['summary__amount']}>$170.000 ARS</span>
              <span className={styles['summary__amount-sub']}>1 año completo de streaming + web básica + PWA</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {[
                '1 año de streaming HD (10m + 2m gratis)',
                'Configuración del servidor SonicPanel',
                'Desarrollo web básico con reproductor',
                'App Web PWA instalable gratis',
                'Dominio por cuenta del cliente (delegación técnica incluida)',
                'Hosting y mantenimiento del 1er año',
              ].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={`${styles['summary__includes-dot']} ${styles['summary__includes-dot--cyan']}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Promo 1: Web Modular Contado */}
          <div className={`${styles['summary__card']} ${styles['summary__card--pro']}`}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Promo 1: Modular</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--pro']}`}>
                <Star size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Inversión Total Contado</span>
              <span className={`${styles['summary__amount']} ${styles['summary__amount--pro']}`}>$200.000 ARS</span>
              <span className={styles['summary__amount-sub']}>1 año completo de stream + web a medida (70% al iniciar y resto al entregar)</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {[
                'Se abona 70% al iniciar y el resto al finalizar con URL real conectada',
                '1 año de streaming HD (10m + 2m gratis)',
                'Desarrollo web personalizado a medida',
                'App Web PWA instalable gratis',
                'Dominio por cuenta del cliente (delegación técnica incluida)',
                'Botón WhatsApp y enlaces a redes',
                'Hosting y mantenimiento del 1er año',
                'Arquitectura modular (admite módulos)',
                'Al 2° año: Stream ajustado + $50k mant.',
              ].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={`${styles['summary__includes-dot']} ${styles['summary__includes-dot--cyan']}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Promo 3: Web Modular Financiada */}
          <div className={`${styles['summary__card']} ${styles['summary__card--financed']}`}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Promo 3: Financiada</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--financed']}`}>
                <Calendar size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>1ra Cuota al Iniciar</span>
              <span className={`${styles['summary__amount']} ${styles['summary__amount--purple']}`}>$50.000 ARS</span>
              <span className={styles['summary__amount-sub']}>Plan financiado en 12 cuotas fijas de $50.000 / mes</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {[
                'Todo lo incluido en la Promo 1 Modular',
                'Inicia el proyecto con la 1ra cuota ($50.000)',
                '1 año de streaming HD (10m + 2m gratis)',
                'Dominio a nombre de KSM hasta abonar cuota 12 (luego a tu nombre)',
                'Hosting y mantenimiento anual incluido',
                'Módulos opcionales en 1 pago (no financiables)',
                'Al 2° año: Stream ajustado + $50k mant.',
              ].map((item, i) => (
                <li key={i} className={styles['summary__includes-item']}>
                  <span className={`${styles['summary__includes-dot']} ${styles['summary__includes-dot--purple']}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Aditamento Opcional: App Android */}
          <div className={`${styles['summary__card']} ${styles['summary__card--highlight']}`}>
            <div className={styles['summary__card-header']}>
              <h3 className={styles['summary__card-plan']}>Aditamento: App Android</h3>
              <div className={`${styles['summary__card-icon']} ${styles['summary__card-icon--bundle']}`}>
                <Smartphone size={20} />
              </div>
            </div>
            <hr className={styles['summary__card-divider']} />
            <div className={styles['summary__amount-row']}>
              <span className={styles['summary__amount-label']}>Módulo Opcional</span>
              <span className={`${styles['summary__amount']} ${styles['summary__amount--accent']}`}>+$100.000 ARS</span>
              <span className={styles['summary__amount-sub']}>Sumable a cualquiera de las 3 promociones</span>
            </div>
            <hr className={styles['summary__card-divider']} />
            <p className={styles['summary__includes-label']}>Incluye:</p>
            <ul className={styles['summary__includes-list']}>
              {[
                'App Android dedicada con logo y colores',
                'Entrega de archivo APK (para compartir)',
                'Entrega de paquete AAB (para Play Store)',
                'Entrega lista en 3 días hábiles',
                'Sin cuotas mensuales de mantenimiento',
              ].map((item, i) => (
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
