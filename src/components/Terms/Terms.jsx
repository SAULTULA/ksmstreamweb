import React from 'react';
import { FileCheck } from 'lucide-react';
import styles from './Terms.module.css';

const TERMS = [
  {
    title: 'Abonos Mensuales',
    desc: 'El cobro del abono mensual vence del 1 al 5 de cada mes por adelantado. El retraso en el pago puede ocasionar la suspensión temporal del servicio.'
  },
  {
    title: 'Dominio Propio (Plan Pro)',
    desc: 'El registro del dominio queda a nombre del cliente y posee vigencia de 1 año desde la fecha de alta. La renovación anual corre por cuenta del titular.'
  },
  {
    title: 'Desarrollo de App Android',
    desc: 'Requiere un tiempo estimado de entrega de 3 a 7 días hábiles tras recibir el logo y material gráfico de la radio en alta resolución.'
  },
];

export default function Terms() {
  return (
    <section id="terminos" className={styles.terms}>
      <div className={styles['terms__container']}>
        <div className={styles['terms__header']}>
          <div className={styles['terms__icon']}>
            <FileCheck size={20} />
          </div>
          <h2 className={styles['terms__title']}>Términos y Condiciones Resumidos del Servicio</h2>
        </div>

        <ol className={styles['terms__list']}>
          {TERMS.map((t, i) => (
            <li key={i} className={styles['terms__item']}>
              <span className={styles['terms__item-number']}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles['terms__item-content']}>
                <span className={styles['terms__item-title']}>{t.title}</span>
                <span className={styles['terms__item-desc']}>{t.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
