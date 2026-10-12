import React, { useState } from 'react';
import { FileText, User, Radio, MessageCircle, Send, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { createServiceRequest } from '../../services/db';
import styles from './SignupForm.module.css';

const PLAN_PRICES = {
  basic: { alta: 15000, mensual: 8000 },
  pro: { alta: 25000, mensual: 10000 },
  advance: { alta: 150000, mensual: 12500 },
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
    advanceFinanciacion: 'unico',
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
      base = PLAN_PRICES.basic.alta;
    } else if (form.plan === 'pro') {
      base = PLAN_PRICES.pro.alta;
    } else if (form.plan === 'advance') {
      base = form.advanceFinanciacion === 'unico' ? PLAN_PRICES.advance.alta : PLAN_PRICES.advance.mensual;
    }
    const app = form.android === 'si' && form.androidFinanciacion === 'unico' ? ANDROID_PRICE : 0;
    return base + app;
  };

  const totalPrimerPago = () => {
    return calculateNumericTotal().toLocaleString('es-AR');
  };

  const getPlanLabel = () => {
    if (form.plan === 'basic') {
      return 'Plan Básico ($15.000 ARS alta · $8.000/mes)';
    } else if (form.plan === 'pro') {
      return 'Plan Pro ($25.000 ARS alta con Dominio · $10.000/mes)';
    } else if (form.plan === 'advance') {
      return `Plan Advance ($150.000 ARS desarrollo [${form.advanceFinanciacion === 'unico' ? 'Pago único' : 'Prorrateado en cuota'}] · $12.500/mes desde mes 2)`;
    }
    return form.plan;
  };

  const buildWAMessage = () => {
    const planLabel = getPlanLabel();
    const androidLabel = form.android === 'si'
      ? `Sí (${form.androidFinanciacion === 'unico' ? 'pago único $100.000 ARS' : 'financiado en cuota'} - Instalación APK)`
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
      (form.plan === 'pro' || form.plan === 'advance') && form.dominio ? `*Dominio deseado:* www.${form.dominio}.com / .com.ar` : null,
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
                    {form.plan === 'advance' ? 'Plan Advance' : form.plan === 'pro' ? 'Plan Pro' : 'Plan Básico'}
                  </span>
                </div>
                {form.dominio && (
                  <div className={styles['signup__success-row']}>
                    <span className={styles['signup__success-row-label']}>Dominio:</span>
                    <span className={styles['signup__success-row-val']}>www.{form.dominio}.com</span>
                  </div>
                )}
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>App Android:</span>
                  <span className={styles['signup__success-row-val']}>
                    {form.android === 'si' ? 'Sí (Instalación APK)' : 'No'}
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

              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-advance"
                  name="plan"
                  value="advance"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'advance'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-advance" className={`${styles['signup__plan-label']} ${styles['signup__plan-label--advance']}`}>
                  <span className={styles['signup__plan-name']}>Plan Advance 🚀</span>
                  <span className={styles['signup__plan-price']}>Desarrollo: $150.000 ARS · Mensual: $12.500 ARS</span>
                </label>
              </div>
            </div>

            {form.plan === 'advance' && (
              <div className={styles['signup__suboptions']}>
                <span className={styles['signup__suboptions-title']}>Modalidad de Pago del Desarrollo Web ($150.000 ARS)</span>
                <div className={styles['signup__android-option']}>
                  <input
                    type="radio"
                    id="advance-unico"
                    name="advanceFinanciacion"
                    value="unico"
                    className={styles['signup__android-input']}
                    checked={form.advanceFinanciacion === 'unico'}
                    onChange={handleChange}
                  />
                  <label htmlFor="advance-unico" className={styles['signup__android-label']}>
                    <span className={styles['signup__android-radio-indicator']} />
                    Pago único de desarrollo al contratar ($150.000 ARS)
                  </label>
                </div>
                <div className={styles['signup__android-option']}>
                  <input
                    type="radio"
                    id="advance-prorrateado"
                    name="advanceFinanciacion"
                    value="prorrateado"
                    className={styles['signup__android-input']}
                    checked={form.advanceFinanciacion === 'prorrateado'}
                    onChange={handleChange}
                  />
                  <label htmlFor="advance-prorrateado" className={styles['signup__android-label']}>
                    <span className={styles['signup__android-radio-indicator']} />
                    Prorratear / Financiar desarrollo en cuota mensual acordada
                  </label>
                </div>
              </div>
            )}

            {(form.plan === 'pro' || form.plan === 'advance') && (
              <div className={styles['signup__fields-grid']}>
                <div className={`${styles['signup__field']} ${styles['signup__field-full']}`}>
                  <label className={styles['signup__label']} htmlFor="signup-dominio">
                    Dominio deseado ({form.plan === 'advance' ? 'Plan Advance' : 'Plan Pro'})
                  </label>
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
                  Sí, deseo agregar la App Android Dedicada ($100.000 ARS - Instalación APK)
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
                  {form.plan === 'advance'
                    ? `Plan Advance (${form.advanceFinanciacion === 'unico' ? 'Pago único desarrollo' : 'Prorrateado en cuota mensual'})`
                    : form.plan === 'pro'
                    ? 'Plan Pro'
                    : 'Plan Básico'}
                  {form.android === 'si' && form.androidFinanciacion === 'unico' ? ' + App Android' : ''}
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
