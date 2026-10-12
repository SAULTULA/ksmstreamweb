import React from 'react';
import { Radio, MessageCircle, Mail, MapPin } from 'lucide-react';
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

function InstagramIcon({ size = 18 }) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }) {
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Planes y Precios', href: '#planes' },
  { label: 'Resumen de Pagos', href: '#comparativa' },
  { label: 'App Android', href: '#app-android' },
  { label: 'Ficha de Alta', href: '#ficha-alta' },
  { label: 'Términos y Condiciones', href: '#terminos' },
];

const SERVICE_LINKS = [
  { label: 'Streaming Básico', href: '#planes' },
  { label: 'Streaming Pro con Dominio', href: '#planes' },
  { label: 'App Android Dedicada', href: '#app-android' },
  { label: 'Panel SonicPanel', href: '#caracteristicas' },
  { label: 'Servidor Icecast / Shoutcast', href: '#caracteristicas' },
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
            style={{ cursor: 'pointer' }}
            title="Área de Clientes"
          >
            <img src="/logo.png" alt="KSM Logo" className={styles['footer__logo-img']} />
            <span className={styles['footer__logo-text']}>
              KSM <span className={styles['footer__logo-highlight']}>Streaming</span>
            </span>
          </div>

          <p className={styles['footer__tagline']}>
            Plataforma profesional de Streaming de Audio HD para Radios Online en Argentina.
            Infraestructura confiable, soporte real y precios sin sorpresas.
          </p>

          <ul className={styles['footer__social-list']}>
            <li>
              <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles['footer__social-link']} ${styles['footer__social-link--wa']}`}
                aria-label="WhatsApp de KSM Servicios"
              >
                <MessageCircle size={18} />
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles['footer__social-link']}
                aria-label="Facebook de KSM Servicios"
              >
                <FacebookIcon size={18} />
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles['footer__social-link']}
                aria-label="Instagram de KSM Servicios"
              >
                <InstagramIcon size={18} />
              </a>
            </li>
            <li>
              <a
                href="#"
                className={styles['footer__social-link']}
                aria-label="YouTube de KSM Servicios"
              >
                <YoutubeIcon size={18} />
              </a>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className={styles['footer__col']}>
          <h3 className={styles['footer__col-title']}>Navegación</h3>
          <ul className={styles['footer__col-list']}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
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
          <h3 className={styles['footer__col-title']}>Contacto</h3>
          <ul className={styles['footer__col-list']}>
            <li>
              <div className={styles['footer__contact-item']}>
                <MessageCircle size={15} className={styles['footer__contact-icon']} />
                <a
                  href="https://wa.me/5491100000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['footer__col-link']}
                >
                  WhatsApp Soporte Directo
                </a>
              </div>
            </li>
            <li>
              <div className={styles['footer__contact-item']}>
                <Mail size={15} className={styles['footer__contact-icon']} />
                <a
                  href="mailto:contacto@ksmservicios.com"
                  className={styles['footer__col-link']}
                >
                  contacto@ksmservicios.com
                </a>
              </div>
            </li>
            <li>
              <div className={styles['footer__contact-item']}>
                <MapPin size={15} className={styles['footer__contact-icon']} />
                <span>Argentina</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles['footer__bottom']}>
        <p className={styles['footer__copy']}>
          © {currentYear}{' '}
          <span className={styles['footer__copy-highlight']}>KSM Streaming</span>
          {' '}— Todos los derechos reservados.
          Precios expresados en pesos argentinos (ARS). Sujetos a actualización.
        </p>
        <div className={styles['footer__tech']}>
          <span className={styles['footer__tech-badge']}>⚡ Icecast V2</span>
          <span className={styles['footer__tech-badge']}>🎛️ SonicPanel</span>
          <span className={styles['footer__tech-badge']}>🔒 SSL</span>
        </div>
      </div>
    </footer>
  );
}
