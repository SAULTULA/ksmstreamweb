import React from 'react';
import { MessageCircle, Mail, MapPin, Globe } from 'lucide-react';
import styles from './Footer.module.css';

function FacebookIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Planes y Precios', href: '#planes' },
  { label: 'Resumen de Pagos', href: '#comparativa' },
  { label: 'App Android', href: '#app-android' },
  { label: 'Ficha de Alta', href: '#ficha-alta' },
  { label: 'Términos del Servicio', href: '#terminos' },
  { label: 'Política de Privacidad', href: '#privacidad' },
  { label: 'Política de Cookies', href: '#cookies' },
];

const SERVICE_LINKS = [
  { label: 'Streaming Básico', href: '#planes' },
  { label: 'Streaming Pro con Dominio', href: '#planes' },
  { label: 'Plan Advance con Web', href: '#planes' },
  { label: 'App Android Dedicada', href: '#app-android' },
  { label: 'Panel SonicPanel HD', href: '#caracteristicas' },
  { label: 'Servidor Icecast V2', href: '#caracteristicas' },
];

const currentYear = new Date().getFullYear();

export default function Footer({ onOpenClientPortal }) {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer__container']}>
        {/* Brand */}
        <div className={styles['footer__brand']}>
          <div
            className={styles['footer__logo']}
            onClick={onOpenClientPortal}
            title="Área de Clientes"
          >
            <img src="/logo.png" alt="KSM Logo" className={styles['footer__logo-img']} />
            <span className={styles['footer__logo-text']}>
              KSM <span className={styles['footer__logo-highlight']}>Streaming</span>
            </span>
          </div>

          <p className={styles['footer__tagline']}>
            Plataforma profesional de Streaming de Audio HD para Radios Online en Argentina.
            Subdominio oficial de <strong>ksmservicios.com.ar</strong>.
          </p>

          <ul className={styles['footer__social-list']}>
            <li>
              <a
                href="https://wa.me/5491166508379"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['footer__social-link']} ${styles['footer__social-link--wa']}`}
                aria-label="WhatsApp de KSM Servicios (+54 9 11 6650-8379)"
              >
                <MessageCircle size={18} />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/RadiosOnlineRecursos"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['footer__social-link']}
                aria-label="Facebook de Radios Online Recursos - KSM Servicios"
              >
                <FacebookIcon size={18} />
              </a>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className={styles['footer__col']}>
          <h3 className={styles['footer__col-title']}>Navegación & Legales</h3>
          <ul className={styles['footer__col-list']}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles['footer__col-link']}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className={styles['footer__col']}>
          <h3 className={styles['footer__col-title']}>Servicios</h3>
          <ul className={styles['footer__col-list']}>
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles['footer__col-link']}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles['footer__col']}>
          <h3 className={styles['footer__col-title']}>Contacto Directo</h3>
          <ul className={styles['footer__col-list']}>
            <li>
              <div className={styles['footer__contact-item']}>
                <MessageCircle size={15} className={styles['footer__contact-icon']} />
                <a
                  href="https://wa.me/5491166508379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['footer__col-link']}
                >
                  +54 9 11 6650-8379
                </a>
              </div>
            </li>
            <li>
              <div className={styles['footer__contact-item']}>
                <Mail size={15} className={styles['footer__contact-icon']} />
                <a
                  href="mailto:saultula.st@gmail.com"
                  className={styles['footer__col-link']}
                >
                  saultula.st@gmail.com
                </a>
              </div>
            </li>
            <li>
              <div className={styles['footer__contact-item']}>
                <Globe size={15} className={styles['footer__contact-icon']} />
                <a
                  href="https://ksmservicios.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['footer__col-link']}
                >
                  ksmservicios.com.ar
                </a>
              </div>
            </li>
            <li>
              <div className={styles['footer__contact-item']}>
                <MapPin size={15} className={styles['footer__contact-icon']} />
                <span>Buenos Aires, Argentina</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles['footer__bottom']}>
        <p className={styles['footer__copy']}>
          © {currentYear}{' '}
          <span className={styles['footer__copy-highlight']}>KSM Streaming</span>
          {' '}— Titular: Saúl Tula (KSM Servicios). Subdominio:{' '}
          <span className={styles['footer__copy-highlight']}>streaming.ksmservicios.com.ar</span>.
          Todos los derechos reservados. Precios en ARS sujetos a actualización.
        </p>
        <div className={styles['footer__tech']}>
          <span className={styles['footer__tech-badge']}>⚡ Icecast V2</span>
          <span className={styles['footer__tech-badge']}>🎛️ SonicPanel</span>
          <span className={styles['footer__tech-badge']}>🔒 SSL Seguro</span>
        </div>
      </div>
    </footer>
  );
}
