import React, { useState } from 'react';
import { FileText, User, Radio, MessageCircle, Send } from 'lucide-react';
import styles from './SignupForm.module.css';

const PLAN_PRICES = {
  basic: { alta: 15000, mensual: 8000 },
  pro: { alta: 25000, mensual: 10000 },
};

const ANDROID_PRICE = 100000;

export default function SignupForm() {
  const [form, setForm] = useState({
    emisora: '',
    titular: '',
    telefono: '',
    email: '',
    ciudad: '',
    plan: 'pro',
    dominio: '',
    android: 'no',
    androidFinanciacion: 'unico',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrimerPago = () => {
    const base = PLAN_PRICES[form.plan]?.alta ?? 0;
    const app = form.android === 'si' ? ANDROID_PRICE : 0;
    return (base + app).toLocaleString('es-AR');
  };

  const buildWAMessage = () => {
    const planLabel = form.plan === 'pro' ? 'Plan PRO ($25.000 ARS)' : 'Plan BÁSICO ($15.000 ARS)';
    const androidLabel = form.android === 'si'
      ? `Sí (${form.androidFinanciacion === 'unico' ? 'pago único' : 'financiado en cuota'})`
      : 'No';

    const mensajeArr = [
      `📻 *FICHA DE ALTA - KSM Streaming*`,
      ``,
      `*Emisora:* ${form.emisora || '—'}`,
      `*Titular:* ${form.titular || '—'}`,
      `*Teléfono:* ${form.telefono || '—'}`,
      `*Email:* ${form.email || '—'}`,
      `*Ciudad/Provincia:* ${form.ciudad || '—'}`,
      ``,
      `*Plan elegido:* ${planLabel}`,
      form.plan === 'pro' && form.dominio ? `*Dominio deseado:* www.${form.dominio}.com / .com.ar` : null,
      ``,
      `*App Android:* ${androidLabel}`,
      ``,
      `*Total primer pago estimado:* $${totalPrimerPago()} ARS`,
    ].filter(Boolean).join('\n');

    return encodeURIComponent(mensajeArr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const waUrl = `https://wa.me/5491100000000?text=${buildWAMessage()}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="ficha-alta" className={styles.signup}>
      <div className={styles['signup__container']}>
        <div className={styles['signup__header']}>
          <div className={styles['signup__tag']}>
            <FileText size={13} />
            <span>Formulario de Alta</span>
          </div>
          <h2 className={styles['signup__title']}>
            Completá tu{' '}
            <span className={styles['signup__title-gradient']}>Ficha de Alta</span>
          </h2>
          <p className={styles['signup__subtitle']}>
            Llenás el formulario, hacés clic en el botón y te enviamos el resumen por WhatsApp
            listo para confirmar tu contratación.
          </p>
        </div>

        <div className={styles['signup__card']}>
          <form onSubmit={handleSubmit} noValidate>
            {/* --- Datos del cliente --- */}
            <p className={styles['signup__section-title']}>
              <User size={14} />
              Datos generales del cliente y radio
            </p>

            <div className={styles['signup__fields-grid']}>
              <div className={styles['signup__field']}>
                <label className={styles['signup__label']} htmlFor="signup-emisora">Nombre de la Emisora *</label>
                <input
                  id="signup-emisora"
                  name="emisora"
                  type="text"
                  className={styles['signup__input']}
                  placeholder="Radio La Voz FM"
                  value={form.emisora}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['signup__field']}>
                <label className={styles['signup__label']} htmlFor="signup-titular">Nombre del Titular / Responsable *</label>
                <input
                  id="signup-titular"
                  name="titular"
                  type="text"
                  className={styles['signup__input']}
                  placeholder="Juan Pérez"
                  value={form.titular}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['signup__field']}>
                <label className={styles['signup__label']} htmlFor="signup-telefono">Teléfono / WhatsApp *</label>
                <input
                  id="signup-telefono"
                  name="telefono"
                  type="tel"
                  className={styles['signup__input']}
                  placeholder="+54 9 11 0000-0000"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['signup__field']}>
                <label className={styles['signup__label']} htmlFor="signup-email">Correo Electrónico</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  className={styles['signup__input']}
                  placeholder="radio@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className={`${styles['signup__field']} ${styles['signup__field-full']}`}>
                <label className={styles['signup__label']} htmlFor="signup-ciudad">Ciudad / Provincia</label>
                <input
                  id="signup-ciudad"
                  name="ciudad"
                  type="text"
                  className={styles['signup__input']}
                  placeholder="Buenos Aires, Argentina"
                  value={form.ciudad}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* --- Plan --- */}
            <p className={styles['signup__section-title']}>
              <Radio size={14} />
              Selección del plan de streaming
            </p>

            <div className={styles['signup__plan-options']}>
              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-basic"
                  name="plan"
                  value="basic"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'basic'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-basic" className={styles['signup__plan-label']}>
                  <span className={styles['signup__plan-name']}>Plan Básico</span>
                  <span className={styles['signup__plan-price']}>Alta: $15.000 ARS · Mensual: $8.000 ARS</span>
                </label>
              </div>

              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-pro"
                  name="plan"
                  value="pro"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'pro'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-pro" className={styles['signup__plan-label']}>
                  <span className={styles['signup__plan-name']}>Plan Pro ⭐</span>
                  <span className={styles['signup__plan-price']}>Alta: $25.000 ARS · Mensual: $10.000 ARS</span>
                </label>
              </div>
            </div>

            {form.plan === 'pro' && (
              <div className={styles['signup__fields-grid']}>
                <div className={`${styles['signup__field']} ${styles['signup__field-full']}`}>
                  <label className={styles['signup__label']} htmlFor="signup-dominio">Dominio deseado (Plan Pro)</label>
                  <div className={styles['signup__domain-group']}>
                    <span className={styles['signup__domain-prefix']}>www.</span>
                    <input
                      id="signup-dominio"
                      name="dominio"
                      type="text"
                      className={styles['signup__domain-input']}
                      placeholder="miradio"
                      value={form.dominio}
                      onChange={handleChange}
                    />
                    <span className={styles['signup__domain-suffix']}>.com / .com.ar</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- App Android --- */}
            <p className={styles['signup__section-title']}>
              <span>📱</span>
              Módulo adicional App Android
            </p>

            <div className={styles['signup__android-options']}>
              <div className={styles['signup__android-option']}>
                <input
                  type="radio"
                  id="android-si"
                  name="android"
                  value="si"
                  className={styles['signup__android-input']}
                  checked={form.android === 'si'}
                  onChange={handleChange}
                />
                <label htmlFor="android-si" className={styles['signup__android-label']}>
                  <span className={styles['signup__android-radio-indicator']} />
                  Sí, deseo agregar la App Android Dedicada ($100.000 ARS)
                </label>
              </div>

              {form.android === 'si' && (
                <>
                  <div className={styles['signup__android-option']} style={{ paddingLeft: '1.5rem' }}>
                    <input
                      type="radio"
                      id="android-unico"
                      name="androidFinanciacion"
                      value="unico"
                      className={styles['signup__android-input']}
                      checked={form.androidFinanciacion === 'unico'}
                      onChange={handleChange}
                    />
                    <label htmlFor="android-unico" className={styles['signup__android-label']}>
                      <span className={styles['signup__android-radio-indicator']} />
                      Pago único al contratar
                    </label>
                  </div>
                  <div className={styles['signup__android-option']} style={{ paddingLeft: '1.5rem' }}>
                    <input
                      type="radio"
                      id="android-financiado"
                      name="androidFinanciacion"
                      value="financiado"
                      className={styles['signup__android-input']}
                      checked={form.androidFinanciacion === 'financiado'}
                      onChange={handleChange}
                    />
                    <label htmlFor="android-financiado" className={styles['signup__android-label']}>
                      <span className={styles['signup__android-radio-indicator']} />
                      Financiar / incluir monto acordado en cuota mensual
                    </label>
                  </div>
                </>
              )}

              <div className={styles['signup__android-option']}>
                <input
                  type="radio"
                  id="android-no"
                  name="android"
                  value="no"
                  className={styles['signup__android-input']}
                  checked={form.android === 'no'}
                  onChange={handleChange}
                />
                <label htmlFor="android-no" className={styles['signup__android-label']}>
                  <span className={styles['signup__android-radio-indicator']} />
                  No por el momento
                </label>
              </div>
            </div>

            {/* --- Total --- */}
            <div className={styles['signup__total']}>
              <div>
                <p className={styles['signup__total-label']}>Total estimado — Primer Pago</p>
                <p className={styles['signup__total-note']}>
                  {form.plan === 'pro' ? 'Plan Pro' : 'Plan Básico'}
                  {form.android === 'si' && form.androidFinanciacion === 'unico' ? ' + App Android' : ''}
                </p>
              </div>
              <span className={styles['signup__total-amount']}>$ {totalPrimerPago()} ARS</span>
            </div>

            <button type="submit" id="signup-submit" className={styles['signup__submit']}>
              <MessageCircle size={20} />
              <span>Enviar Ficha por WhatsApp</span>
              <Send size={18} />
            </button>

            <p className={styles['signup__privacy']}>
              Al enviar, se abre WhatsApp con el resumen listo. No almacenamos tus datos en ningún servidor.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
