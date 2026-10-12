import React from 'react';
import { FileCheck } from 'lucide-react';
import styles from './Terms.module.css';

const TERMS = [
  {
    title: 'Abonos Mensuales',
    desc: 'El cobro del abono mensual vence del 1 al 5 de cada mes por adelantado. El retraso en el pago puede ocasionar la suspensión temporal del servicio.'
  },
  {
    title: 'Dominio Propio (Planes Pro y Advance)',
    desc: 'El registro del dominio queda a nombre del cliente y posee vigencia de 1 año desde la fecha de alta. La renovación anual corre por cuenta del titular.'
  },
  {
    title: 'Desarrollo de App Android (Instalación APK)',
    desc: 'El archivo APK funcional se entrega en 3 días hábiles tras recibir el material gráfico, listo para instalar y usar directamente en celulares Android. No requiere publicación en tienda ni abonos adicionales.'
  },
  {
    title: 'Desarrollo Web Avanzada (Plan Advance)',
    desc: 'El costo de desarrollo de la web con funciones avanzadas es de $150.000 ARS (con opción de abonarse en pago único o prorratearse en cuotas mensuales acordadas). El abono mensual de streaming y mantenimiento es de $12.500 ARS a partir del mes 2.'
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
