import React, { useState } from 'react';
import { FileText, User, Radio, MessageCircle, Send, CheckCircle2, ArrowRight, Loader2, Layers, CheckSquare, Square } from 'lucide-react';
import { createServiceRequest } from '../../services/db';
import styles from './SignupForm.module.css';

const PLAN_PRICES = {
  promo1: {
    id: 'promo1',
    name: 'Promo 1: Web Modular Personalizada ($200.000 Contado)',
    badge: 'Contado',
    price: 200000,
    priceLabel: '$200.000 ARS (Se abona 70% al iniciar y el resto al finalizar)',
    allowsModules: true,
  },
  promo2: {
    id: 'promo2',
    name: 'Promo 2: Web Básico + PWA (Contado)',
    badge: 'Contado',
    price: 170000,
    priceLabel: '$170.000 ARS (Pago único contado · 1 año stream)',
    allowsModules: false,
  },
  promo3: {
    id: 'promo3',
    name: 'Promo 3: Web Modular Financiada (12 Cuotas)',
    badge: '12 Cuotas',
    price: 50000,
    priceLabel: '12 cuotas de $50.000 ARS (1ra cuota: $50.000)',
    allowsModules: true,
  },
};

const MODULE_PRICES = {
  contador: {
    id: 'contador',
    label: 'Módulo Contador de Visitas',
    contado: 50000,
    financiado: 80000,
  },
  publicidad: {
    id: 'publicidad',
    label: 'Módulo Sectores para Publicidad',
    contado: 50000,
    financiado: 80000,
  },
  feeds: {
    id: 'feeds',
    label: 'Módulo Feeds Facebook / Ventana YouTube',
    contado: 150000,
    financiado: 180000,
  },
};

const ANDROID_PRICE = 100000;

export default function SignupForm() {
  const [form, setForm] = useState({
    emisora: '',
    titular: '',
    telefono: '',
    email: '',
    ciudad: '',
    dominio: '',
    plan: 'promo1',
    moduloContador: false,
    moduloPublicidad: false,
    moduloFeeds: false,
    android: 'no',
    androidFinanciacion: 'unico',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateNumericTotal = () => {
    const selectedPlan = PLAN_PRICES[form.plan] || PLAN_PRICES.promo1;
    let total = selectedPlan.price;

    if (selectedPlan.allowsModules) {
      const isFinanced = form.plan === 'promo3';
      if (form.moduloContador) {
        total += isFinanced ? MODULE_PRICES.contador.financiado : MODULE_PRICES.contador.contado;
      }
      if (form.moduloPublicidad) {
        total += isFinanced ? MODULE_PRICES.publicidad.financiado : MODULE_PRICES.publicidad.contado;
      }
      if (form.moduloFeeds) {
        total += isFinanced ? MODULE_PRICES.feeds.financiado : MODULE_PRICES.feeds.contado;
      }
    }

    if (form.android === 'si' && form.androidFinanciacion === 'unico') {
      total += ANDROID_PRICE;
    }

    return total;
  };

  const totalPrimerPago = () => {
    return calculateNumericTotal().toLocaleString('es-AR');
  };

  const getPlanLabel = () => {
    return PLAN_PRICES[form.plan]?.name || form.plan;
  };

  const getSelectedModulesList = () => {
    if (!PLAN_PRICES[form.plan]?.allowsModules) return [];
    const isFinanced = form.plan === 'promo3';
    const list = [];
    if (form.moduloContador) {
      list.push(`${MODULE_PRICES.contador.label} (+$${(isFinanced ? MODULE_PRICES.contador.financiado : MODULE_PRICES.contador.contado).toLocaleString('es-AR')})`);
    }
    if (form.moduloPublicidad) {
      list.push(`${MODULE_PRICES.publicidad.label} (+$${(isFinanced ? MODULE_PRICES.publicidad.financiado : MODULE_PRICES.publicidad.contado).toLocaleString('es-AR')})`);
    }
    if (form.moduloFeeds) {
      list.push(`${MODULE_PRICES.feeds.label} (+$${(isFinanced ? MODULE_PRICES.feeds.financiado : MODULE_PRICES.feeds.contado).toLocaleString('es-AR')})`);
    }
    return list;
  };

  const buildWAMessage = () => {
    const planLabel = getPlanLabel();
    const modulesList = getSelectedModulesList();
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
      form.dominio ? `*Dominio Web:* ${form.dominio}` : null,
      ``,
      `*Promoción elegida:* ${planLabel}`,
      form.plan === 'promo1' ? `*Condición Promo 1:* Se abona 70% al iniciar y el resto al finalizar con la entrega de la URL real y todo conectado` : null,
      modulesList.length > 0 ? `*Módulos adicionales:* ${modulesList.join(', ')}` : null,
      ``,
      `*Aditamento App Android:* ${androidLabel}`,
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
      const modulesList = getSelectedModulesList();
      const result = await createServiceRequest({
        ...form,
        plan: getPlanLabel(),
        modules: modulesList,
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
            Tu solicitud ingresa directamente a nuestro sistema y notifica a soporte técnico al instante sin intermediarios.
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
                La ficha de alta para <strong>{form.emisora}</strong> ingresó correctamente a nuestro sistema. Se ha enviado un aviso prioritario a la central técnica de KSM Servicios para preparar tu servidor y web.
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
                {form.dominio && (
                  <div className={styles['signup__success-row']}>
                    <span className={styles['signup__success-row-label']}>Dominio:</span>
                    <span className={styles['signup__success-row-val']}>{form.dominio}</span>
                  </div>
                )}
                <div className={styles['signup__success-row']}>
                  <span className={styles['signup__success-row-label']}>Plan / Promoción:</span>
                  <span className={styles['signup__success-row-val']}>
                    {getPlanLabel()}
                  </span>
                </div>
                {getSelectedModulesList().length > 0 && (
                  <div className={styles['signup__success-row']}>
                    <span className={styles['signup__success-row-label']}>Módulos:</span>
                    <span className={styles['signup__success-row-val']}>
                      {getSelectedModulesList().join(', ')}
                    </span>
                  </div>
                )}
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

              <div className={`${styles['signup__field']} ${styles['signup__field-full']}`}>
                <label className={styles['signup__label']} htmlFor="signup-dominio">
                  Dominio Web (opcional o a delegar)
                </label>
                <input
                  id="signup-dominio"
                  name="dominio"
                  type="text"
                  className={styles['signup__input']}
                  placeholder="ej: miemisora.com o miemisora.com.ar"
                  value={form.dominio}
                  onChange={handleChange}
                />
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  {form.plan === 'promo3'
                    ? 'ℹ️ En Promo 3 (Financiada): El dominio permanece registrado a nombre de KSM Servicios hasta finalizar la 12ª cuota; a partir de ahí se transfiere a tu nombre.'
                    : 'ℹ️ En Promo 1 y Promo 2 (Contado): El dominio corre por tu cuenta; nos entregás los accesos o datos DNS y nosotros lo delegamos e integramos gratis.'}
                </p>
              </div>
            </div>

            {/* --- Selección de Promo --- */}
            <p className={styles['signup__section-title']}>
              <Radio size={14} />
              Selección de Promoción de Streaming (Incluye 1 Año + Web + PWA)
            </p>

            <div className={styles['signup__plan-options']}>
              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-promo1"
                  name="plan"
                  value="promo1"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'promo1'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-promo1" className={`${styles['signup__plan-label']} ${styles['signup__plan-label--pro']}`}>
                  <span className={styles['signup__plan-name']}>Promo 1: Web Modular ⭐</span>
                  <span className={styles['signup__plan-price']}>$200.000 ARS · 70% al iniciar y el resto contra entrega con URL real</span>
                </label>
              </div>

              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-promo2"
                  name="plan"
                  value="promo2"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'promo2'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-promo2" className={styles['signup__plan-label']}>
                  <span className={styles['signup__plan-name']}>Promo 2: Web Básico</span>
                  <span className={styles['signup__plan-price']}>$170.000 ARS · Contado (1 año stream)</span>
                </label>
              </div>

              <div className={styles['signup__plan-option']}>
                <input
                  type="radio"
                  id="plan-promo3"
                  name="plan"
                  value="promo3"
                  className={styles['signup__plan-input']}
                  checked={form.plan === 'promo3'}
                  onChange={handleChange}
                />
                <label htmlFor="plan-promo3" className={`${styles['signup__plan-label']} ${styles['signup__plan-label--financed']}`}>
                  <span className={styles['signup__plan-name']}>Promo 3: Financiada 📅</span>
                  <span className={styles['signup__plan-price']}>12 cuotas fijas de $50.000 ARS</span>
                </label>
              </div>
            </div>

            {/* --- Módulos Opcionales Web Modular (si aplica) --- */}
            {PLAN_PRICES[form.plan]?.allowsModules && (
              <div className={styles['signup__modules-box']}>
                <p className={styles['signup__modules-box-title']}>
                  <Layers size={14} />
                  Módulos Opcionales Web Modular ({form.plan === 'promo3' ? 'Tarifa Financiada — Se abonan en 1 solo pago' : 'Tarifa Contado'})
                </p>
                {form.plan === 'promo3' && (
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.75rem', fontWeight: 500 }}>
                    ⚠️ Importante: En la Promo 3 los módulos opcionales NO se financian en cuotas; se pagan en 1 solo pago al iniciar junto a la 1ra cuota.
                  </p>
                )}
                <div className={styles['signup__checkbox-group']}>
                  <label className={styles['signup__checkbox-item']}>
                    <input
                      type="checkbox"
                      name="moduloContador"
                      checked={form.moduloContador}
                      onChange={handleChange}
                      className={styles['signup__checkbox-input']}
                    />
                    <span className={styles['signup__checkbox-custom']} />
                    <span className={styles['signup__checkbox-label']}>
                      Contador de Visitas en Vivo ({form.plan === 'promo3' ? '+$80.000 ARS (en 1 pago)' : '+$50.000 ARS'})
                    </span>
                  </label>

                  <label className={styles['signup__checkbox-item']}>
                    <input
                      type="checkbox"
                      name="moduloPublicidad"
                      checked={form.moduloPublicidad}
                      onChange={handleChange}
                      className={styles['signup__checkbox-input']}
                    />
                    <span className={styles['signup__checkbox-custom']} />
                    <span className={styles['signup__checkbox-label']}>
                      Sectores para Publicidad y Banners ({form.plan === 'promo3' ? '+$80.000 ARS (en 1 pago)' : '+$50.000 ARS'})
                    </span>
                  </label>

                  <label className={styles['signup__checkbox-item']}>
                    <input
                      type="checkbox"
                      name="moduloFeeds"
                      checked={form.moduloFeeds}
                      onChange={handleChange}
                      className={styles['signup__checkbox-input']}
                    />
                    <span className={styles['signup__checkbox-custom']} />
                    <span className={styles['signup__checkbox-label']}>
                      Feeds Facebook / Ventana YouTube ({form.plan === 'promo3' ? '+$180.000 ARS (en 1 pago)' : '+$150.000 ARS'})
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* --- Aditamento App Android --- */}
            <p className={styles['signup__section-title']}>
              <span>📱</span>
              Aditamento Opcional: App Móvil Android Dedicada
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
                  Sí, deseo sumar la App Android Dedicada ($100.000 ARS - Entrega APK + AAB Play Store)
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
                      Financiar / coordinar monto en cuotas
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
                  {form.plan === 'promo3'
                    ? 'Promo 3 Financiada (1ra cuota de $50.000)'
                    : form.plan === 'promo2'
                    ? 'Promo 2: Web Básico Contado ($170.000)'
                    : 'Promo 1: Web Modular ($200.000 · se abona 70% al iniciar y el resto al finalizar con URL real y streaming conectado)'}
                  {getSelectedModulesList().length > 0
                    ? ` + ${getSelectedModulesList().length} módulo(s) en 1 solo pago`
                    : ''}
                  {form.android === 'si' && form.androidFinanciacion === 'unico' ? ' + App Android ($100.000)' : ''}
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
              Al enviar, tu solicitud queda registrada en el sistema de KSM Servicios y se emite un aviso inmediato a la central técnica.
            </p>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
