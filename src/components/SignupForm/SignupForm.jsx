import React, { useState } from 'react';
import { FileText, User, Radio, MessageCircle, Send, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { createServiceRequest } from '../../services/db';
import styles from './SignupForm.module.css';

const PLAN_PRICES = {
  basic: { alta: 0, mensual: 8000 },
  pro: { alta: 0, mensual: 15000 },
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
    android: 'no',
    androidFinanciacion: 'unico',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNumericTotal = () => {
    let base = 0;
    if (form.plan === 'basic') {
      base = PLAN_PRICES.basic.mensual;
    } else if (form.plan === 'pro') {
      base = PLAN_PRICES.pro.mensual;
    }
    const app = form.android === 'si' && form.androidFinanciacion === 'unico' ? ANDROID_PRICE : 0;
    return base + app;
  };

  const totalPrimerPago = () => {
    return calculateNumericTotal().toLocaleString('es-AR');
  };

  const getPlanLabel = () => {
    if (form.plan === 'basic') {
      return 'Plan Básico ($8.000 ARS/mes · sin costo de alta)';
    } else if (form.plan === 'pro') {
      return 'Plan Pro ($15.000 ARS/mes · sin costo de alta)';
    }
    return form.plan;
  };

  const buildWAMessage = () => {
    const planLabel = getPlanLabel();
    const androidLabel = form.android === 'si'
      ? `Sí (${form.androidFinanciacion === 'unico' ? 'pago único $100.000 ARS' : 'financiado en cuota'} - Entrega APK y AAB Play Store)`
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
      ``,
      `*App Android:* ${androidLabel}`,
      ``,
      `*Total primer pago estimado:* $${totalPrimerPago()} ARS`,
    ].filter(Boolean).join('\n');

    return encodeURIComponent(mensajeArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emisora.trim() || !form.titular.trim() || !form.telefono.trim()) {
      alert('Por favor completá los campos obligatorios: Nombre de la Emisora, Titular y Teléfono.');
      return;
    }

    setSubmitting(true);
    try {
      const numericTotal = calculateNumericTotal();
      const result = await createServiceRequest({
        ...form,
        plan: getPlanLabel(),
        totalEstimated: numericTotal,
      });
      setSubmittedResult(result);
      setSubmitted(true);
    } catch (err) {
      console.error('Error al guardar ficha:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
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
            Tu solicitud ingresa directamente a nuestro sistema y notifica a soporte técnico al instante sin depender de intermediarios.
          </p>
        </div>

        <div className={styles['signup__card']}>
          {submitted ? (
            <div className={styles['signup__success-box']}>
              <div className={styles['signup__success-icon']}>
                <CheckCircle2 size={36} />
              </div>
              <h3 className={styles['signup__success-title']}>¡Solicitud Recibida con Éxito!</h3>
              <p className={styles['signup__success-desc']}>
                La ficha de alta para <strong>{form.emisora}</strong> ingresó correctamente a nuestro sistema. Se ha enviado un aviso prioritario a la central técnica de KSM Servicios para preparar tu servidor.
              </p>

              <div className={styles['signup__success-details']}>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>Emisora:</span>
                  <span className={styles['signup__success-row-val']}>{form.emisora}</span>
                </div>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>Titular:</span>
                  <span className={styles['signup__success-row-val']}>{form.titular}</span>
                </div>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>WhatsApp:</span>
                  <span className={styles['signup__success-row-val']}>{form.telefono}</span>
                </div>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>Plan Seleccionado:</span>
                  <span className={styles['signup__success-row-val']}>
                    {form.plan === 'pro' ? 'Plan Pro' : 'Plan Básico'}
                  </span>
                </div>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>App Android:</span>
                  <span className={styles['signup__success-row-val']}>
                    {form.android === 'si' ? 'Sí (Entrega APK / AAB Play Store)' : 'No'}
                  </span>
                </div>
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>Total 1er Pago:</span>
                  <span className={styles['signup__success-row-val']} style={{ color: '#38bdf8' }}>
                    ${totalPrimerPago()} ARS
                  </span>
                </div>
              </div>

              <div className={styles['signup__success-actions']}>
                <a
                  href={`https://wa.me/5491166508379?text=${buildWAMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['signup__btn-wa-alt']}
                >
                  <MessageCircle size={18} />
                  <span>Abrir chat de WhatsApp para consulta inmediata (Opcional)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className={styles['signup__btn-reset']}
                >
                  Enviar otra solicitud o modificar ficha
                </button>
              </div>
            </div>
          ) : (
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
                  <span className={styles['signup__plan-price']}>$8.000 ARS / mes · Sin costo de alta</span>
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
                  <span className={styles['signup__plan-price']}>$15.000 ARS / mes · Sin costo de alta</span>
                </label>
              </div>
            </div>

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
                  Sí, deseo agregar la Promoción App Android ($100.000 ARS - Entrega APK y AAB Play Store)
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
                      Pago único al contratar ($100.000 ARS)
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
                  {form.plan === 'pro'
                    ? 'Plan Pro · Primer mes de streaming'
                    : 'Plan Básico · Primer mes de streaming'}
                  {form.android === 'si' && form.androidFinanciacion === 'unico' ? ' + Promoción App Android (APK/AAB)' : ''}
                </p>
              </div>
              <span className={styles['signup__total-amount']}>$ {totalPrimerPago()} ARS</span>
            </div>

            <button
              type="submit"
              id="signup-submit"
              className={styles['signup__submit']}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="spin" />
                  <span>Enviando ficha al sistema...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Confirmar y Enviar Solicitud de Alta</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className={styles['signup__privacy']}>
              Al enviar, tu solicitud queda registrada en el sistema de KSM Servicios y se emite un aviso por Telegram a la central técnica.
            </p>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
