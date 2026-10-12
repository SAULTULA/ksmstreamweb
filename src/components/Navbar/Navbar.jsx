import React from 'react';
import { Radio, MessageCircle, Sparkles, FileText, Smartphone } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ onOpenAdmin, onOpenClientPortal }) {
  return (
    <header className={styles.navbar}>
      <div className={styles['navbar__container']}>
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenAdmin}
          onKeyDown={(e) => e.key === 'Enter' && onOpenAdmin()}
          className={styles['navbar__brand']}
          title="KSM Streaming — Clic en el logo para Panel de Administración"
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="KSM Logo" className={styles['navbar__brand-img']} />
          <span className={styles['navbar__brand-text']}>
            KSM <span className={styles['navbar__brand-highlight']}>Streaming</span>
          </span>
          <div className={styles['navbar__badge']}>
            <span className={styles['navbar__badge-dot']} />
            <span>EN VIVO</span>
          </div>
        </div>

        <nav className={styles['navbar__nav']}>
          <ul className={styles['navbar__list']}>
            <li className={styles['navbar__item']}>
              <a href="#caracteristicas" className={styles['navbar__link']}>Características</a>
            </li>
            <li className={styles['navbar__item']}>
              <a href="#planes" className={styles['navbar__link']}>Planes y Precios</a>
            </li>
            <li className={styles['navbar__item']}>
              <a href="#comparativa" className={styles['navbar__link']}>Comparativa</a>
            </li>
            <li className={styles['navbar__item']}>
              <a href="#app-android" className={styles['navbar__link']}>App Android</a>
            </li>
            <li className={styles['navbar__item']}>
              <a href="#ficha-alta" className={styles['navbar__link']}>Ficha de Alta</a>
            </li>
          </ul>
        </nav>

        <div className={styles['navbar__actions']}>
          <button
            type="button"
            className={`${styles['navbar__btn']} ${styles['navbar__btn--client']}`}
            onClick={onOpenClientPortal}
            title="Acceso para clientes: pagar y descargar factura"
          >
            <FileText size={15} />
            <span>Área Clientes</span>
          </button>

          <a
            href="https://wa.me/5491166508379?text=Hola%20KSM%20Servicios,%20quiero%20consultar%20sobre%20el%20Streaming%20de%20Radio%20Online"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles['navbar__btn']} ${styles['navbar__btn--cta']}`}
          >
            <MessageCircle size={16} />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
