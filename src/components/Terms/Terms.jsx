import React, { useState, useEffect } from 'react';
import { FileCheck, Shield, Cookie, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';
import styles from './Terms.module.css';

export default function Terms() {
  const [activeTab, setActiveTab] = useState('terminos');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'privacidad') setActiveTab('privacidad');
      else if (hash === 'cookies') setActiveTab('cookies');
      else if (hash === 'terminos') setActiveTab('terminos');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section id="terminos" className={styles.terms}>
      <div id="privacidad" className={styles['terms__anchor-target']} />
      <div id="cookies" className={styles['terms__anchor-target']} />

      <div className={styles['terms__container']}>
        {/* Header */}
        <div className={styles['terms__header']}>
          <div className={styles['terms__tag']}>
            <Shield size={13} />
            <span>Marco Legal & Transparencia</span>
          </div>
          <h2 className={styles['terms__title']}>
            Términos del Servicio &{' '}
            <span className={styles['terms__title-gradient']}>Políticas</span>
          </h2>
          <p className={styles['terms__subtitle']}>
            Información legal transparente conforme a las leyes de la República Argentina y las mejores prácticas de la industria digital.
          </p>
        </div>

        {/* Tab Controls */}
        <div className={styles['terms__tabs']}>
          <button
            type="button"
            className={`${styles['terms__tab']} ${
              activeTab === 'terminos' ? styles['terms__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('terminos')}
          >
            <FileCheck size={16} />
            <span>Términos y Condiciones</span>
          </button>

          <button
            type="button"
            className={`${styles['terms__tab']} ${
              activeTab === 'privacidad' ? styles['terms__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('privacidad')}
          >
            <Lock size={16} />
            <span>Política de Privacidad (Ley 25.326)</span>
          </button>

          <button
            type="button"
            className={`${styles['terms__tab']} ${
              activeTab === 'cookies' ? styles['terms__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('cookies')}
          >
            <Cookie size={16} />
            <span>Política de Cookies & Almacenamiento</span>
          </button>
        </div>

        {/* Content Box */}
        <div className={styles['terms__body']}>
          {/* TAB 1: TÉRMINOS Y CONDICIONES */}
          {activeTab === 'terminos' && (
            <div className={styles['terms__panel']}>
              <div className={styles['terms__panel-header']}>
                <h3 className={styles['terms__panel-title']}>Condiciones Generales de Contratación</h3>
                <span className={styles['terms__panel-badge']}>Vigente 2026 · Argentina</span>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>1. Identificación del Proveedor y Objeto</h4>
                <p className={styles['terms__text']}>
                  Los presentes Términos regulan la contratación de servicios de streaming de audio por internet, servidores Icecast V2 / SonicPanel, registro de dominios web, desarrollo de páginas web y aplicaciones móviles Android provistos por <strong>KSM Servicios</strong> (Titular: Saúl Tula), a través del sitio web <strong>streaming.ksmservicios.com.ar</strong> y su dominio principal <strong>ksmservicios.com.ar</strong>.
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>2. Modalidad de Cobro y Abonos Mensuales</h4>
                <ul className={styles['terms__bullets']}>
                  <li>
                    <strong>Vencimiento:</strong> Los abonos mensuales de streaming vencen del día 1 al día 5 de cada mes calendario por período adelantado.
                  </li>
                  <li>
                    <strong>Medios de Pago:</strong> Transferencia bancaria / CVU / CBU o tarjeta mediante pasarela Mercado Pago.
                  </li>
                  <li>
                    <strong>Suspensión por falta de pago:</strong> En caso de no registrarse el pago antes del día 10 del mes, el servidor de transmisión podrá ser pausado temporalmente hasta la regularización de la cuota.
                  </li>
                </ul>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>3. Dominios Propios (Planes Pro y Advance)</h4>
                <p className={styles['terms__text']}>
                  El registro del dominio solicitado (.com o .com.ar) se tramita a nombre de la emisora o titular indicado en la ficha de alta y posee una vigencia de doce (12) meses desde su activación. La renovación anual posterior correrá por cuenta del titular conforme a las tarifas de los organismos registradores correspondientes (ej. NIC Argentina / ICANN).
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>4. Desarrollo de Aplicación Android (Instalación APK)</h4>
                <p className={styles['terms__text']}>
                  El servicio de App Android contempla el diseño y compilación de una aplicación nativa dedicada con reproductor en vivo, botones de redes y enlaces directos a WhatsApp. Se entrega el archivo ejecutable APK optimizado en un plazo promedio de tres (3) días hábiles posteriores a la recepción de los materiales gráficos y datos de la emisora. La distribución se realiza mediante descarga directa libre, sin dependencia de tiendas externas ni costos mensuales de publicación.
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>5. Plan Advance (Desarrollo Web con Funciones Avanzadas)</h4>
                <p className={styles['terms__text']}>
                  El Plan Advance incluye el diseño y desarrollo de una plataforma web integral con funciones avanzadas por un arancel de desarrollo de $150.000 ARS (con opción de abonarse en un único pago o prorratearse en cuotas mensuales acordadas). A partir del segundo mes, el abono mensual de streaming de audio HD y mantenimiento técnico asciende a $12.500 ARS.
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>6. Derechos de Autor y Responsabilidad de Contenidos</h4>
                <p className={styles['terms__text']}>
                  KSM Servicios provee exclusivamente la infraestructura de conectividad y transmisión de datos (carrier tecnológico). La titularidad, permisos, licencias de propiedad intelectual y pago de aranceles de derechos de autor por las transmisiones (tales como SADAIC, AADI CAPIF o entidades análogas) corresponden de manera exclusiva y excluyente a la emisora cliente.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacidad' && (
            <div className={styles['terms__panel']}>
              <div className={styles['terms__panel-header']}>
                <h3 className={styles['terms__panel-title']}>Política de Privacidad y Protección de Datos Personales</h3>
                <span className={styles['terms__panel-badge']}>Ley 25.326 · República Argentina</span>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>1. Marco Legal y Responsable del Tratamiento</h4>
                <p className={styles['terms__text']}>
                  En cumplimiento de la <strong>Ley Nacional N° 25.326 de Protección de los Datos Personales</strong>, KSM Servicios (con titularidad a cargo de <strong>Saúl Tula</strong>, correo electrónico de contacto: <strong>saultula.st@gmail.com</strong>) garantiza la confidencialidad y resguardo de la información suministrada por los usuarios y clientes.
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>2. Datos Personales Recolectados y Finalidad</h4>
                <p className={styles['terms__text']}>
                  A través de nuestro formulario de alta, únicamente recolectamos los datos estrictamente necesarios para la formalización del servicio técnico:
                </p>
                <ul className={styles['terms__bullets']}>
                  <li><strong>Nombre de la Emisora y Datos del Titular:</strong> Para identificación del servicio y asignación de puerto de streaming.</li>
                  <li><strong>Teléfono / WhatsApp:</strong> Para comunicación de soporte técnico prioritario, entrega de accesos y avisos de facturación.</li>
                  <li><strong>Correo Electrónico:</strong> Para envío de credenciales del panel SonicPanel y facturación.</li>
                  <li><strong>Localidad y Provincia:</strong> Para geo-optimización de servidores y registro de dominios.</li>
                </ul>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>3. No Comercialización ni Cesión a Terceros</h4>
                <p className={styles['terms__text']}>
                  KSM Servicios <strong>no vende, no alquila, no cede ni comparte</strong> bajo ningún concepto las bases de datos de clientes a terceros con fines publicitarios o comerciales. La información se almacena con medidas de seguridad y cifrado SSL en servidores de base de datos protegidos por políticas RLS (Row Level Security).
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>4. Derechos de Acceso, Rectificación y Supresión (ARCO)</h4>
                <p className={styles['terms__text']}>
                  El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses. Asimismo, podrá solicitar la actualización, rectificación o supresión de sus datos enviando una solicitud por escrito a <strong>saultula.st@gmail.com</strong>.
                </p>
                <div className={styles['terms__legal-notice']}>
                  <Info size={18} className={styles['terms__legal-icon']} />
                  <p className={styles['terms__legal-text']}>
                    La <strong>AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA (AAIP)</strong>, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POLÍTICA DE COOKIES & ALMACENAMIENTO */}
          {activeTab === 'cookies' && (
            <div className={styles['terms__panel']}>
              <div className={styles['terms__panel-header']}>
                <h3 className={styles['terms__panel-title']}>Política de Cookies & Tecnologías de Almacenamiento Local</h3>
                <span className={styles['terms__panel-badge']}>100% Libre de Trackers Publicitarios</span>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>1. ¿Utilizamos Cookies de Seguimiento Publicitario?</h4>
                <div className={styles['terms__callout-ok']}>
                  <CheckCircle2 size={20} className={styles['terms__callout-icon']} />
                  <div>
                    <strong>No utilizamos cookies de terceros, ni píxeles publicitarios, ni rastreadores invasivos.</strong>
                    <p>
                      Tu navegación en <code>streaming.ksmservicios.com.ar</code> es totalmente privada y no genera perfiles de consumo para venta de publicidad a terceros.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>2. ¿Qué tecnologías técnicas se utilizan?</h4>
                <p className={styles['terms__text']}>
                  Esta plataforma utiliza exclusivamente mecanismos técnicos nativos del navegador web (<strong>LocalStorage</strong> y <strong>SessionStorage</strong>):
                </p>
                <ul className={styles['terms__bullets']}>
                  <li>
                    <strong>Almacenamiento de Sesión Técnica (SessionStorage):</strong> Para mantener activa la sesión administrativa del titular durante su permanencia en el panel de control. Se borra automáticamente al cerrar la pestaña.
                  </li>
                  <li>
                    <strong>Caché Local de Operatividad (LocalStorage):</strong> Para almacenar temporalmente copias locales de contingencia de las solicitudes en caso de cortes de red y guardar tu preferencia de aviso informativo.
                  </li>
                </ul>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>3. ¿Se requiere consentimiento previo intrusivo ("Cookie Wall")?</h4>
                <p className={styles['terms__text']}>
                  <strong>No.</strong> Tanto bajo la legislación argentina (Ley 25.326) como bajo los estándares internacionales (Directiva ePrivacy y RGPD), las cookies y el almacenamiento local clasificados como <em>estrictamente técnicos y funcionales</em> (necesarios para que la web o el panel funcionen) están <strong>exentos</strong> de requerir un bloqueo previo con ventanas emergentes molestas que impidan leer el contenido.
                </p>
              </div>

              <div className={styles['terms__section']}>
                <h4 className={styles['terms__section-title']}>4. Gestión y Eliminación por parte del Usuario</h4>
                <p className={styles['terms__text']}>
                  Podés inspeccionar, bloquear o vaciar los datos almacenados en cualquier momento ingresando a la configuración de Privacidad y Seguridad de tu navegador (Chrome, Edge, Firefox o Safari) en la sección "Datos de Sitios Web".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

