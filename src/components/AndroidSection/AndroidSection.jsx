import React from 'react';
import { Smartphone, CheckCircle2, Clock, Banknote, Play, MessageCircle } from 'lucide-react';
import styles from './AndroidSection.module.css';

const appFeatures = [
  'Diseño completamente personalizado con la identidad y colores de tu radio',
  'Reproductor integrado con carátula, artista y título del programa en vivo',
  'Entrega de archivo APK para compartir e instalar directo en cualquier celular',
  'Entrega de paquete AAB (Android App Bundle) listo para publicar en Google Play Store',
  'Entrega de archivos funcionales en 3 días hábiles (listos para usar)',
  'Sin cuotas mensuales de mantenimiento por la aplicación',
];

const WA_MSG = encodeURIComponent('Hola KSM Servicios! Me interesa la promoción de la App Android ($100.000 ARS - Entrega APK y AAB para Play Store). ¿Me podés dar más información?');

export default function AndroidSection() {
  return (
    <section id="app-android" className={styles.android}>
      <div className={styles['android__container']}>
        {/* Content */}
        <div className={styles['android__content']}>
          <div className={styles['android__tag']}>
            <Smartphone size={13} />
            <span>Promoción Especial App Móvil</span>
          </div>

          <h2 className={styles['android__title']}>
            App Móvil <span className={styles['android__title-gradient']}>Android Dedicada</span>{' '}
            para tu Radio
          </h2>

          <p className={styles['android__desc']}>
            Llevá tu radio al bolsillo de tus oyentes con una aplicación propia. Continúa nuestra promoción especial:
            te entregamos el archivo APK para que lo compartas directamente con tus oyentes (por WhatsApp, web o redes)
            y el archivo AAB listo para que lo subas y publiques en Google Play Store si lo deseás. Completamente
            personalizada con tu logo, colores y nombre de emisora.
          </p>

          <div className={styles['android__price-box']}>
            <div className={styles['android__price-row']}>
              <div className={styles['android__price-label']}>
                <span className={styles['android__price-badge']}>Promoción App Android (Entrega APK + AAB)</span>
                <span className={styles['android__price-sublabel']}>Pago único promocional de desarrollo. Luego solo el abono habitual del streaming.</span>
              </div>
              <span className={styles['android__price-value']}>$100.000 ARS</span>
            </div>

            <hr className={styles['android__divider']} />

            <div className={styles['android__financing']}>
              <Banknote size={20} className={styles['android__financing-icon']} />
              <p className={styles['android__financing-text']}>
                <strong>Financiación y Abono:</strong> podés coordinar el pago único al contratar,
                o bien prorratear el desarrollo e incluirlo dentro de tu cuota mensual. Recordá que el abono mensual de streaming continúa en su valor habitual (ej: $15.000 ARS/mes en Plan Pro) a partir del mes 2.
              </p>
            </div>
          </div>

          <ul className={styles['android__features']}>
            {appFeatures.map((f, i) => (
              <li key={i} className={styles['android__feature-item']}>
                <CheckCircle2 size={16} className={styles['android__feature-icon']} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/5491166508379?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['android__cta']}
          >
            <MessageCircle size={18} />
            <span>Consultar por la Promoción App Android</span>
          </a>
        </div>

        {/* Media */}
        <div className={styles['android__media']}>
          <div className={styles['android__image-wrapper']}>
            <img
              src="/app-preview.png"
              alt="Aplicación móvil Android para radio streaming personalizada"
              className={styles['android__image']}
              loading="lazy"
            />
            <div className={styles['android__delivery-chip']}>
              <Clock size={14} />
              <span>APK + AAB en 3 días hábiles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
