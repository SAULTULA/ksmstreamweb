import React from 'react';
import { CheckCircle2, Zap, Star, MessageCircle, ArrowRight, Layers, Sparkles, Calendar, PlusCircle, RefreshCw, Smartphone } from 'lucide-react';
import styles from './Pricing.module.css';

const PLAN_MENSUAL_FEATURES = [
  { text: 'Abono Mensual Mes a Mes (Sin permanencia obligatoria)', ok: true, highlight: true },
  { text: 'App Web PWA instalable en cualquier dispositivo (Android, iOS, PC, Tablet)', ok: true, highlight: true },
  { text: 'Servidor Icecast / Shoutcast SonicPanel HD', ok: true },
  { text: 'Oyentes Simultáneos Ilimitados', ok: true },
  { text: 'Tráfico de datos mensual no medido', ok: true },
  { text: 'Reproductor web directo siempre disponible', ok: true },
  { text: 'Certificado SSL Seguro (HTTPS)', ok: true },
  { text: 'Estadísticas Gráficas de oyentes en tiempo real', ok: true },
  { text: 'Soporte técnico y asistencia de configuración', ok: true },
];

const PROMO2_FEATURES = [
  { text: '1 Año de Streaming HD (Pagás 10 meses + 2 meses GRATIS)', ok: true, highlight: true },
  { text: 'Servidor Icecast / Shoutcast SonicPanel', ok: true },
  { text: 'Oyentes Simultáneos Ilimitados', ok: true },
  { text: 'Desarrollo Web Básico con Reproductor GRATIS', ok: true },
  { text: 'App Web PWA instalable GRATIS', ok: true },
  { text: 'Dominio por cuenta del cliente (nosotros lo delegamos y vinculamos)', ok: true },
  { text: 'Accesos directos a redes sociales', ok: true },
  { text: 'Subida y Hosting incluido', ok: true },
  { text: 'Mantenimiento técnico del primer año incluido', ok: true },
  { text: 'Estadísticas Gráficas en tiempo real', ok: true },
  { text: 'SSL Seguro (HTTPS)', ok: true },
  { text: 'Web fija (no ampliable con módulos posteriores)', ok: true, note: true },
];

const PROMO1_FEATURES = [
  { text: '1 Año de Streaming HD (Pagás 10 meses + 2 meses GRATIS)', ok: true, highlight: true },
  { text: 'Se abona 70% al iniciar y el resto al finalizar con la entrega de la URL real y todo conectado', ok: true, highlight: true },
  { text: 'Servidor Icecast / Shoutcast SonicPanel', ok: true },
  { text: 'Oyentes Simultáneos Ilimitados', ok: true },
  { text: 'Desarrollo Web Personalizado a Medida GRATIS', ok: true },
  { text: 'App Web PWA instalable GRATIS', ok: true },
  { text: 'Dominio por cuenta del cliente (nosotros lo delegamos y vinculamos)', ok: true },
  { text: 'Botón directo de WhatsApp y enlaces a redes', ok: true },
  { text: 'Subida y Hosting incluido', ok: true },
  { text: 'Mantenimiento técnico del primer año incluido', ok: true },
  { text: 'Estructura Web Modular (permite módulos opcionales)', ok: true, highlight: true },
  { text: 'Renovación al 2° año: Stream ajustado + $50.000 mantenimiento', ok: true, highlight: true },
  { text: 'Estadísticas Gráficas en tiempo real + SSL', ok: true },
];

const PROMO3_FEATURES = [
  { text: 'Todo lo incluido en la Promo 1 Modular', ok: true, highlight: true },
  { text: '1 Año de Streaming HD (10 meses + 2 meses GRATIS)', ok: true },
  { text: 'Desarrollo Web Personalizado GRATIS + App PWA', ok: true },
  { text: 'Dominio a nombre de KSM hasta cancelar cuota 12 (luego se transfiere a tu nombre)', ok: true, highlight: true },
  { text: 'Botón directo de WhatsApp y enlaces a redes', ok: true },
  { text: 'Subida, Hosting y Mantenimiento del 1er año', ok: true },
  { text: 'Financiación en 12 cuotas fijas de $50.000', ok: true, highlight: true },
  { text: '1ra cuota de $50.000 al iniciar el proyecto', ok: true },
  { text: 'Módulos opcionales en un solo pago (no se financian en cuotas)', ok: true, highlight: true },
  { text: 'Renovación al 2° año: Stream ajustado + $50.000 mantenimiento', ok: true, highlight: true },
  { text: 'Estadísticas Gráficas en tiempo real + SSL', ok: true },
];

const OPTIONAL_MODULES = [
  {
    name: 'Módulo Contador de Visitas',
    desc: 'Muestra en vivo la cantidad de oyentes y visitas a tu plataforma web.',
    promo1: '+$50.000 ARS',
    promo3: '+$80.000 ARS',
  },
  {
    name: 'Módulo Sectores para Publicidad',
    desc: 'Banners y espacios exclusivos para monetizar tu radio con anunciantes locales.',
    promo1: '+$50.000 ARS',
    promo3: '+$80.000 ARS',
  },
  {
    name: 'Módulo Feeds Facebook / Ventana YouTube',
    desc: 'Integración de publicaciones de Facebook o ventana de video en vivo de tu canal de YouTube.',
    promo1: '+$150.000 ARS',
    promo3: '+$180.000 ARS',
  },
];

const WA_MSG_MENSUAL = encodeURIComponent('Hola KSM Servicios! Quiero contratar el Plan Mensual de Streaming con App Web PWA instalable en cualquier dispositivo por $15.000 ARS al mes. ¿Me pueden asesorar?');
const WA_MSG_PROMO1 = encodeURIComponent('Hola KSM Servicios! Quiero contratar la Promo 1: Web Modular Personalizada ($200.000 ARS - 70% al iniciar y resto contra entrega con URL real). ¿Me pueden asesorar?');
const WA_MSG_PROMO2 = encodeURIComponent('Hola KSM Servicios! Quiero contratar la Promo 2: Web Básico + PWA al Contado ($170.000 ARS). ¿Me pueden asesorar?');
const WA_MSG_PROMO3 = encodeURIComponent('Hola KSM Servicios! Quiero contratar la Promo 3: Web Modular Financiada en 12 cuotas de $50.000 ARS. ¿Me pueden asesorar?');
const WA_BASE = 'https://wa.me/5491166508379?text=';

export default function Pricing() {
  return (
    <section id="planes" className={styles.pricing}>
      <div className={styles['pricing__container']}>
        <div className={styles['pricing__header']}>
          <div className={styles['pricing__tag']}>
            <Zap size={13} />
            <span>Streaming de Audio Profesional</span>
          </div>
          <h2 className={styles['pricing__title']}>
            Plan Mensual y{' '}
            <span className={styles['pricing__title-gradient']}>Promociones Anuales</span>
          </h2>
          <p className={styles['pricing__subtitle']}>
            Elegí entre nuestro Plan Mensual con App Web PWA instalable en cualquier dispositivo o las Promociones Anuales con desarrollo web bonificado y 2 meses gratis.
          </p>
        </div>

        {/* ===== CARDS GRID ===== */}
        <div className={styles['pricing__grid']}>
          {/* ===== PLAN MENSUAL: PWA UNIVERSAL ===== */}
          <article className={`${styles['pricing__card']} ${styles['pricing__card--monthly']}`}>
            <div className={styles['pricing__plan-badge--monthly']}>
              <Smartphone size={12} />
              <span>Abono Mensual</span>
            </div>

            <div>
              <p className={`${styles['pricing__plan-name']} ${styles['pricing__plan-name--monthly']}`}>
                Plan Mensual: Stream + App PWA
              </p>
              <p className={styles['pricing__plan-desc']}>
                Emisión mes a mes sin contratos largos, con App Web PWA instalable en cualquier dispositivo.
              </p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Abono Mensual Recurrente</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__currency']}>$</span>
                <span className={styles['pricing__amount']}>15.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS / mes · Sin permanencia obligatoria</p>
              <p className={styles['pricing__monthly-note']}>📱 App Web PWA instalable en celulares, tablets y computadoras</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {PLAN_MENSUAL_FEATURES.map((f, i) => (
                <li key={i} className={`${styles['pricing__feature-item']} ${f.highlight ? styles['pricing__feature-item--highlight'] : ''}`}>
                  <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_MENSUAL}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--monthly']}`}
            >
              <MessageCircle size={17} />
              <span>Contratar Plan Mensual ($15.000)</span>
            </a>
          </article>

          {/* ===== PROMO 2: WEB BÁSICO ===== */}
          <article className={styles['pricing__card']}>
            <div className={styles['pricing__plan-badge']}>
              <span>Plan Esencial Contado</span>
            </div>

            <div>
              <p className={styles['pricing__plan-name']}>Promo 2: Web Básico + PWA</p>
              <p className={styles['pricing__plan-desc']}>
                Para radios que buscan reproductor web directo y presencia online rápida sin complicaciones.
              </p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Pago Único Contado</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__currency']}>$</span>
                <span className={styles['pricing__amount']}>170.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS · 1 año completo de stream + web + hosting</p>
              <p className={styles['pricing__monthly-note']}>🎁 Incluye 2 meses de streaming 100% bonificados</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {PROMO2_FEATURES.map((f, i) => (
                <li key={i} className={`${styles['pricing__feature-item']} ${f.highlight ? styles['pricing__feature-item--highlight'] : ''}`}>
                  <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_PROMO2}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--basic']}`}
            >
              <MessageCircle size={17} />
              <span>Contratar Promo 2 ($170.000)</span>
            </a>
          </article>

          {/* ===== PROMO 1: WEB MODULAR PERSONALIZADA ===== */}
          <article className={`${styles['pricing__card']} ${styles['pricing__card--pro']}`}>
            <div className={styles['pricing__recommended-badge']}>
              <Star size={12} fill="currentColor" />
              <span>Más Elegido · Contado</span>
            </div>

            <div>
              <p className={`${styles['pricing__plan-name']} ${styles['pricing__plan-name--pro']}`}>
                Promo 1: Web Modular Personalizada
              </p>
              <p className={styles['pricing__plan-desc']}>
                Diseño a medida con identidad propia, adaptable y listo para sumar módulos avanzados.
              </p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Inversión Total Contado</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__currency']}>$</span>
                <span className={styles['pricing__amount']}>200.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS · 1 año completo de stream + web personalizada</p>
              <p className={styles['pricing__monthly-note']}>🤝 Se abona 70% al iniciar y el resto al finalizar con URL real y todo conectado</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {PROMO1_FEATURES.map((f, i) => (
                <li key={i} className={`${styles['pricing__feature-item']} ${f.highlight ? styles['pricing__feature-item--highlight'] : ''}`}>
                  <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_PROMO1}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--pro']}`}
            >
              <ArrowRight size={17} />
              <span>Contratar Promo 1 ($200.000)</span>
            </a>
          </article>

          {/* ===== PROMO 3: WEB MODULAR FINANCIADA ===== */}
          <article className={`${styles['pricing__card']} ${styles['pricing__card--financed']}`}>
            <div className={styles['pricing__finance-badge']}>
              <Calendar size={12} />
              <span>12 Cuotas Mensuales</span>
            </div>

            <div>
              <p className={`${styles['pricing__plan-name']} ${styles['pricing__plan-name--financed']}`}>
                Promo 3: Web Modular Financiada
              </p>
              <p className={styles['pricing__plan-desc']}>
                Toda la potencia de la Promo 1 con la máxima comodidad de pago en 12 cuotas mensuales.
              </p>
            </div>

            <div className={styles['pricing__price-block']}>
              <p className={styles['pricing__first-payment-label']}>Forma de Pago Financiada</p>
              <div className={styles['pricing__first-payment-amount']}>
                <span className={styles['pricing__amount']}>12 cuotas de $50.000</span>
              </div>
              <p className={styles['pricing__period']}>ARS / mes · La 1ra cuota se abona al iniciar el proyecto</p>
              <p className={styles['pricing__monthly-note']}>🚀 Módulos en un solo pago · Al 2° año: Stream + $50k mant.</p>
            </div>

            <ul className={styles['pricing__feature-list']}>
              {PROMO3_FEATURES.map((f, i) => (
                <li key={i} className={`${styles['pricing__feature-item']} ${f.highlight ? styles['pricing__feature-item--highlight'] : ''}`}>
                  <CheckCircle2 size={16} className={styles['pricing__feature-icon']} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={`${WA_BASE}${WA_MSG_PROMO3}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles['pricing__cta']} ${styles['pricing__cta--financed']}`}
            >
              <Sparkles size={17} />
              <span>Contratar Promo 3 (12x $50k)</span>
            </a>
          </article>
        </div>

        {/* ===== MÓDULOS OPCIONALES WEB MODULAR ===== */}
        <div className={styles['pricing__modules-section']}>
          <div className={styles['pricing__modules-header']}>
            <div className={styles['pricing__modules-tag']}>
              <Layers size={14} />
              <span>Web Modular — Personalizá tu Radio</span>
            </div>
            <h3 className={styles['pricing__modules-title']}>
              Módulos Opcionales Disponibles (Promos 1 y 3)
            </h3>
            <p className={styles['pricing__modules-desc']}>
              Los módulos opcionales se abonan en <strong>1 solo pago al contratar</strong> (en Promo 3 no se financian en cuotas):
            </p>
          </div>

          <div className={styles['pricing__modules-grid']}>
            {OPTIONAL_MODULES.map((m, idx) => (
              <div key={idx} className={styles['pricing__module-card']}>
                <div className={styles['pricing__module-icon-wrap']}>
                  <PlusCircle size={20} />
                </div>
                <h4 className={styles['pricing__module-name']}>{m.name}</h4>
                <p className={styles['pricing__module-text']}>{m.desc}</p>
                <div className={styles['pricing__module-pricing']}>
                  <div className={styles['pricing__module-price-item']}>
                    <span className={styles['pricing__module-price-label']}>Con Promo 1 (Contado):</span>
                    <strong className={styles['pricing__module-price-val']}>{m.promo1}</strong>
                  </div>
                  <div className={styles['pricing__module-price-item']}>
                    <span className={styles['pricing__module-price-label']}>Con Promo 3 (1 solo pago):</span>
                    <strong className={styles['pricing__module-price-val']}>{m.promo3}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RENOVACIÓN 2DO AÑO ===== */}
        <div className={styles['pricing__renewal-box']}>
          <div className={styles['pricing__renewal-icon']}>
            <RefreshCw size={24} />
          </div>
          <div className={styles['pricing__renewal-content']}>
            <h4 className={styles['pricing__renewal-title']}>
              Renovación a partir del Segundo Año (Aplica a Promo 1, Promo 3 y Promo 2)
            </h4>
            <p className={styles['pricing__renewal-desc']}>
              Al vencer el primer año de servicio bonificado, tanto en la Opción 1 como en la Opción 3 y 2, el cliente abona:
            </p>
            <div className={styles['pricing__renewal-items']}>
              <div className={styles['pricing__renewal-item']}>
                <strong>Stream anual completo (12 meses):</strong> Valor ajustado anualmente según inflación (estimado entre $60.000 y $80.000 ARS).
              </div>
              <div className={styles['pricing__renewal-item']}>
                <strong>Costo de mantenimiento anual:</strong> $50.000 ARS por año (soporte técnico prioritario, hosting y actualizaciones).
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
