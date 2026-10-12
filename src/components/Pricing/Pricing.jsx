import React from 'react';
import { CheckCircle2, XCircle, Zap, Star, MessageCircle, ArrowRight } from 'lucide-react';
import styles from './Pricing.module.css';

const BASIC_FEATURES = [
  { text: 'Streaming Audio HD 128 kbps (MP3 / AAC+)', ok: true },
  { text: 'Oyentes Simultáneos Ilimitados', ok: true },
  { text: 'Servidor Icecast / Shoutcast SonicPanel', ok: true },
  { text: 'Reproductor HTML5 Estándar', ok: true },
  { text: 'Estadísticas Gráficas en tiempo real', ok: true },
  { text: 'Transferencia mensual ilimitada', ok: true },
  { text: 'Soporte Técnico vía WhatsApp', ok: true },
  { text: 'SSL Seguro (HTTPS)', ok: true },
  { text: 'Dominio propio (.com / .com.ar)', ok: false },
  { text: 'Reproductor Web Personalizado a Medida', ok: false },
];

const PRO_FEATURES = [
  { text: 'Streaming Audio HD 128 kbps (MP3 / AAC+)', ok: true },
  { text: 'Oyentes Simultáneos Ilimitados', ok: true },
  { text: 'Servidor Icecast / Shoutcast SonicPanel', ok: true },
  { text: 'Reproductor HTML5 Personalizado a Medida', ok: true },
  { text: 'Estadísticas Gráficas en tiempo real', ok: true },
  { text: 'Transferencia mensual ilimitada', ok: true },
  { text: 'Soporte Técnico vía WhatsApp', ok: true },
  { text: 'SSL Seguro (HTTPS)', ok: true },
  { text: 'Dominio propio registrado a tu nombre', ok: true },
  { text: 'Vigencia del dominio por 1 año incluida', ok: true },
];

const WA_MSG_BASIC = encodeURIComponent('Hola KSM Servicios! Quiero contratar el Plan BÁSICO de Streaming de Radio Online por $15.000 ARS. ¿Me pueden ayudar?');
const WA_MSG_PRO = encodeURIComponent('Hola KSM Servicios! Quiero contratar el Plan PRO de Streaming de Radio Online por $25.000 ARS. ¿Me pueden ayudar?');
const WA_BASE = 'https://wa.me/5491100000000?text=';

export default function Pricing() {
  return (
    <section id="planes" className={styles.pricing}>
      <div className={styles['pricing__container']}>
        <div className={styles['pricing__header']}>
          <div className={styles['pricing__tag']}>
            <Zap size={13} />
            <span>Planes y Precios</span>
          </div>
          <h2 className={styles['pricing__title']}>
            Elegí el plan que mejor{' '}
            <span className={styles['pricing__title-gradient']}>se adapta</span> a tu radio
          </h2>
          <p className={styles['pricing__subtitle']}>
            Sin contratos ocultos, sin costos extras sorpresa. Pagás solo lo que usás, con factura.
          </p>
        </div>

        <div className={styles['pricing__grid']}>
          {/* ===== PLAN BÁSICO ===== */}
          <article className={styles['pricing__card']}>
            <div>
              <p className={styles['pricing__plan-name']}>Plan Básico</p>
              <p className={styles['pricing__plan-desc']}>Ideal para radios que están comenzando su camino online.</p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Pago Inicial (Alta + Mes 1)</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__currency']}>$</span>
                <span className={styles['pricing__amount']}>15.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS · pago único de activación</p>

              <hr className={styles['pricing__divider']} />

              <p className={styles['pricing__monthly-label']}>Abono mensual (desde el mes 2)</p>
              <div className={styles['pricing__monthly-row']}>
                <span className={styles['pricing__monthly-amount']}>$8.000 ARS</span>
              </div>
              <p className={styles['pricing__monthly-note']}>Vencimiento del 1 al 5 de cada mes</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {BASIC_FEATURES.map((f, i) => (
                <li key={i} className={styles['pricing__feature-item']}>
                  {f.ok
                    ? <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                    : <XCircle size={16} className={`${styles['pricing__feature-icon']} ${styles['pricing__feature-icon--no']}`} />
                  }
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_BASIC}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--basic']}`}
            >
              <MessageCircle size={17} />
              <span>Contratar Plan Básico</span>
            </a>
          </article>

          {/* ===== PLAN PRO ===== */}
          <article className={`${styles['pricing__card']} ${styles['pricing__card--pro']}`}>
            <div className={styles['pricing__recommended-badge']}>
              <Star size={12} fill="currentColor" />
              <span>Recomendado</span>
            </div>

            <div>
              <p className={`${styles['pricing__plan-name']} ${styles['pricing__plan-name--pro']}`}>Plan Pro</p>
              <p className={styles['pricing__plan-desc']}>Para radios profesionales que quieren su propia identidad digital.</p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Pago Inicial (Alta + Mes 1 + Dominio)</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__currency']}>$</span>
                <span className={styles['pricing__amount']}>25.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS · incluye dominio .com / .com.ar</p>

              <hr className={styles['pricing__divider']} />

              <p className={styles['pricing__monthly-label']}>Abono mensual (desde el mes 2)</p>
              <div className={styles['pricing__monthly-row']}>
                <span className={styles['pricing__monthly-amount']}>$10.000 ARS</span>
              </div>
              <p className={styles['pricing__monthly-note']}>Vencimiento del 1 al 5 de cada mes</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className={styles['pricing__feature-item']}>
                  <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_PRO}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--pro']}`}
            >
              <ArrowRight size={17} />
              <span>Contratar Plan Pro</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
