import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppFAB.module.css';

const WA_MSG = encodeURIComponent('Hola KSM Servicios! Quiero consultar sobre el Streaming de Radio Online.');

export default function WhatsAppFAB() {
  return (
    <a
      id="wa-fab"
      href={`https://wa.me/5491100000000?text=${WA_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles['wa-fab']}
      aria-label="Contactar por WhatsApp"
    >
      <span className={styles['wa-fab__pulse']} aria-hidden="true" />
      <MessageCircle size={28} />
      <span className={styles['wa-fab__tooltip']}>¡Consultanos ahora!</span>
    </a>
  );
}
