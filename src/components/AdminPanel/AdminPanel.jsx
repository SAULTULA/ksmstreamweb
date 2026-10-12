import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Plus,
  Search,
  MessageCircle,
  FileText,
  CreditCard,
  Trash2,
  Edit,
  X,
  ExternalLink,
  ShieldCheck,
  Database,
  ArrowRight,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import {
  getClients,
  saveClient,
  deleteClient,
  getPayments,
  recordPayment,
  getSupabaseConfig,
  saveSupabaseConfig,
  getNoticeMessage,
  buildWhatsAppLink,
} from '../../services/db';
import styles from './AdminPanel.module.css';

export default function AdminPanel({ isOpen, onClose, onOpenInvoice }) {
  const [activeTab, setActiveTab] = useState('clientes'); // 'clientes' | 'pagos' | 'supabase'
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [loading, setLoading] = useState(true);

  // WhatsApp dropdown abierto para un cliente específico
  const [openWaMenuId, setOpenWaMenuId] = useState(null);

  // Modal para nuevo/editar cliente
  const [editingClient, setEditingClient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Modal para registrar pago manual
  const [payingClient, setPayingClient] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Transferencia Bancaria');
  const [payRef, setPayRef] = useState('');

  // Config Supabase
  const [supaConfig, setSupaConfig] = useState(getSupabaseConfig());
  const [supaUrlInput, setSupaUrlInput] = useState(supaConfig.url || '');
  const [supaKeyInput, setSupaKeyInput] = useState(supaConfig.key || '');
  const [supaSavedMsg, setSupaSavedMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, pList] = await Promise.all([getClients(), getPayments()]);
      setClients(cList);
      setPayments(pList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Estadísticas
  const totalClients = clients.length;
  const okClients = clients.filter((c) => c.status === 'al_dia').length;
  const warningClients = clients.filter((c) => c.status === 'proximo_a_vencer').length;
  const overdueClients = clients.filter((c) => c.status === 'vencido').length;
  const totalRevenue = clients.reduce((acc, c) => acc + Number(c.monthly_fee || 0), 0);

  // Filtrado de clientes
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.radio_name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    const matchesFilter = filterStatus === 'todos' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenNew = () => {
    setEditingClient({
      radio_name: '',
      owner_name: '',
      phone: '',
      email: '',
      plan: 'Plan Pro con Dominio',
      monthly_fee: 10000,
      due_day: 5,
      status: 'al_dia',
      notes: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient({ ...client });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente del sistema?')) {
      await deleteClient(id);
      loadData();
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!editingClient.radio_name || !editingClient.owner_name || !editingClient.phone) {
      alert('Por favor completa el nombre de la radio, titular y teléfono.');
      return;
    }
    await saveClient(editingClient);
    setIsFormOpen(false);
    loadData();
  };

  const handleQuickStatusChange = async (client, newStatus) => {
    await saveClient({ ...client, status: newStatus });
    loadData();
  };

  const handleOpenPay = (client) => {
    setPayingClient(client);
    setPayAmount(String(client.monthly_fee || 10000));
    setPayMethod('Transferencia Bancaria');
    setPayRef(`TR-${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmPay = async (e) => {
    e.preventDefault();
    if (!payingClient) return;
    const payment = await recordPayment({
      clientId: payingClient.id,
      radioName: payingClient.radio_name,
      amount: Number(payAmount),
      method: payMethod,
      transactionRef: payRef,
      period: 'Cuota Mensual',
    });
    setPayingClient(null);
    loadData();
    if (onOpenInvoice) {
      onOpenInvoice(payment);
    }
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supaUrlInput.trim(), supaKeyInput.trim());
    setSupaConfig(getSupabaseConfig());
    setSupaSavedMsg('¡Configuración guardada! Recargando datos...');
    setTimeout(() => {
      setSupaSavedMsg('');
      loadData();
    }, 1500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ksm_admin_authenticated');
    onClose();
  };

  return (
    <div className={styles['admin-panel']}>
      {/* Topbar */}
      <header className={styles['admin-panel__topbar']}>
        <div className={styles['admin-panel__brand']}>
          <img src="/logo.png" alt="KSM Logo" className={styles['admin-panel__logo-img']} />
          <div className={styles['admin-panel__title-box']}>
            <span className={styles['admin-panel__title']}>KSM Panel de Administración</span>
            <span className={styles['admin-panel__subtitle']}>Gestión de Clientes & Avisos de Cobranza</span>
          </div>
        </div>

        <div className={styles['admin-panel__topbar-actions']}>
          <div
            className={`${styles['admin-panel__cloud-badge']} ${
              supaConfig.url ? styles['admin-panel__cloud-badge--active'] : ''
            }`}
            title={supaConfig.url ? 'Sincronizado con Supabase Cloud' : 'Almacenamiento Local en Navegador'}
          >
            <span className={styles['admin-panel__cloud-dot']} />
            <span>{supaConfig.url ? 'Supabase Conectado' : 'Modo Local Sync'}</span>
          </div>

          <button
            type="button"
            className={styles['admin-panel__btn-tool']}
            onClick={() => setActiveTab('supabase')}
            title="Configurar Base de Datos en la Nube"
          >
            <Database size={15} />
            <span>Nube Supabase</span>
          </button>

          <button
            type="button"
            className={styles['admin-panel__btn-tool']}
            onClick={loadData}
            title="Recargar datos"
          >
            <RefreshCw size={15} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            className={styles['admin-panel__btn-tool']}
            onClick={handleLogout}
            title="Cerrar sesión de administrador"
          >
            <LogOut size={15} />
            <span>Salir</span>
          </button>

          <button
            type="button"
            className={styles['admin-panel__btn-close']}
            onClick={onClose}
          >
            <span>Volver a la Web</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles['admin-panel__container']}>
        {/* Stats */}
        <section className={styles['admin-panel__stats']}>
          <div className={styles['admin-panel__stat-card']}>
            <div className={`${styles['admin-panel__stat-icon']} ${styles['admin-panel__stat-icon--total']}`}>
              <Users size={22} />
            </div>
            <div className={styles['admin-panel__stat-info']}>
              <span className={styles['admin-panel__stat-value']}>{totalClients}</span>
              <span className={styles['admin-panel__stat-label']}>Radios en Servicio</span>
            </div>
          </div>

          <div className={styles['admin-panel__stat-card']}>
            <div className={`${styles['admin-panel__stat-icon']} ${styles['admin-panel__stat-icon--ok']}`}>
              <CheckCircle2 size={22} />
            </div>
            <div className={styles['admin-panel__stat-info']}>
              <span className={styles['admin-panel__stat-value']}>{okClients}</span>
              <span className={styles['admin-panel__stat-label']}>Al Día (Abonadas)</span>
            </div>
          </div>

          <div className={styles['admin-panel__stat-card']}>
            <div className={`${styles['admin-panel__stat-icon']} ${styles['admin-panel__stat-icon--warning']}`}>
              <Clock size={22} />
            </div>
            <div className={styles['admin-panel__stat-info']}>
              <span className={styles['admin-panel__stat-value']}>{warningClients}</span>
              <span className={styles['admin-panel__stat-label']}>Próximas a Vencer (Día 3)</span>
            </div>
          </div>

          <div className={styles['admin-panel__stat-card']}>
            <div className={`${styles['admin-panel__stat-icon']} ${styles['admin-panel__stat-icon--danger']}`}>
              <AlertCircle size={22} />
            </div>
            <div className={styles['admin-panel__stat-info']}>
              <span className={styles['admin-panel__stat-value']}>{overdueClients}</span>
              <span className={styles['admin-panel__stat-label']}>En Demora / Vencidas</span>
            </div>
          </div>

          <div className={styles['admin-panel__stat-card']}>
            <div className={`${styles['admin-panel__stat-icon']} ${styles['admin-panel__stat-icon--revenue']}`}>
              <DollarSign size={22} />
            </div>
            <div className={styles['admin-panel__stat-info']}>
              <span className={styles['admin-panel__stat-value']}>
                ${Number(totalRevenue).toLocaleString('es-AR')}
              </span>
              <span className={styles['admin-panel__stat-label']}>Facturación Mensual</span>
            </div>
          </div>
        </section>

        {/* Tab Selector */}
        <div className={styles['admin-panel__tabs']}>
          <button
            type="button"
            className={`${styles['admin-panel__tab']} ${
              activeTab === 'clientes' ? styles['admin-panel__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('clientes')}
          >
            <Users size={16} />
            <span>Gestión de Radios & Cobranzas ({clients.length})</span>
          </button>

          <button
            type="button"
            className={`${styles['admin-panel__tab']} ${
              activeTab === 'pagos' ? styles['admin-panel__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('pagos')}
          >
            <CreditCard size={16} />
            <span>Control de Pagos & Facturas ({payments.length})</span>
          </button>

          <button
            type="button"
            className={`${styles['admin-panel__tab']} ${
              activeTab === 'supabase' ? styles['admin-panel__tab--active'] : ''
            }`}
            onClick={() => setActiveTab('supabase')}
          >
            <Database size={16} />
            <span>Configuración Supabase Cloud</span>
          </button>
        </div>

        {/* TAB 1: CLIENTES */}
        {activeTab === 'clientes' && (
          <>
            {/* Controls */}
            <div className={styles['admin-panel__controls']}>
              <div className={styles['admin-panel__search-box']}>
                <Search size={16} className={styles['admin-panel__search-icon']} />
                <input
                  type="text"
                  placeholder="Buscar por radio, titular o WhatsApp..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles['admin-panel__search-input']}
                />
              </div>

              <div className={styles['admin-panel__filter-group']}>
                {['todos', 'al_dia', 'proximo_a_vencer', 'vencido'].map((statusKey) => (
                  <button
                    key={statusKey}
                    type="button"
                    className={`${styles['admin-panel__filter-btn']} ${
                      filterStatus === statusKey ? styles['admin-panel__filter-btn--active'] : ''
                    }`}
                    onClick={() => setFilterStatus(statusKey)}
                  >
                    {statusKey === 'todos' && 'Todos'}
                    {statusKey === 'al_dia' && 'Al Día'}
                    {statusKey === 'proximo_a_vencer' && 'Día 3 (Avisar)'}
                    {statusKey === 'vencido' && 'En Demora'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles['admin-panel__btn-add']}
                onClick={handleOpenNew}
              >
                <Plus size={16} />
                <span>Cargar Nueva Radio</span>
              </button>
            </div>

            {/* Table */}
            <div className={styles['admin-panel__table-wrapper']}>
              <table className={styles['admin-panel__table']}>
                <thead>
                  <tr>
                    <th className={styles['admin-panel__th']}>Emisora / Titular</th>
                    <th className={styles['admin-panel__th']}>Contacto</th>
                    <th className={styles['admin-panel__th']}>Plan & Abono</th>
                    <th className={styles['admin-panel__th']}>Vencimiento</th>
                    <th className={styles['admin-panel__th']}>Estado</th>
                    <th className={styles['admin-panel__th']}>Avisos WhatsApp</th>
                    <th className={styles['admin-panel__th']}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const waDia1 = getNoticeMessage('dia1', client);
                    const waDia3 = getNoticeMessage('dia3', client);
                    const waDia5 = getNoticeMessage('dia5', client);

                    return (
                      <tr key={client.id} className={styles['admin-panel__tr']}>
                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__radio-cell']}>
                            <span className={styles['admin-panel__radio-name']}>
                              {client.radio_name}
                            </span>
                            <span className={styles['admin-panel__owner-name']}>
                              👤 {client.owner_name}
                            </span>
                          </div>
                        </td>

                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__contact-cell']}>
                            <span>📱 +{client.phone}</span>
                            {client.email && <span>✉️ {client.email}</span>}
                          </div>
                        </td>

                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__radio-cell']}>
                            <span className={styles['admin-panel__fee']}>
                              ${Number(client.monthly_fee || 0).toLocaleString('es-AR')}
                            </span>
                            <span className={styles['admin-panel__plan-tag']}>
                              {client.plan}
                            </span>
                          </div>
                        </td>

                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__radio-cell']}>
                            <span style={{ fontWeight: 600 }}>Día {client.due_day || 5} de cada mes</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>
                              Alta: {client.signup_date || 'Reciente'}
                            </span>
                          </div>
                        </td>

                        <td className={styles['admin-panel__td']}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <span
                              className={`${styles['admin-panel__status-badge']} ${
                                styles[`admin-panel__status-badge--${client.status}`]
                              }`}
                            >
                              {client.status === 'al_dia' && '● Al Día'}
                              {client.status === 'proximo_a_vencer' && '⚠️ Vence Pronto'}
                              {client.status === 'vencido' && '🚨 En Demora'}
                              {client.status === 'pago_reportado' && '💰 Pago Informado'}
                            </span>
                            {/* Selector rápido de estado */}
                            <select
                              value={client.status}
                              onChange={(e) => handleQuickStatusChange(client, e.target.value)}
                              style={{
                                fontSize: '0.7rem',
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)',
                                borderRadius: '4px',
                                padding: '2px',
                              }}
                            >
                              <option value="al_dia">Cambiar a: Al Día</option>
                              <option value="proximo_a_vencer">Cambiar a: Vence Pronto (Día 3)</option>
                              <option value="vencido">Cambiar a: En Demora (Día 5+)</option>
                            </select>
                          </div>
                        </td>

                        {/* Avisos WhatsApp con 1 Clic */}
                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__btn-wa-menu']}>
                            <button
                              type="button"
                              className={styles['admin-panel__btn-wa']}
                              onClick={() =>
                                setOpenWaMenuId(openWaMenuId === client.id ? null : client.id)
                              }
                            >
                              <MessageCircle size={14} />
                              <span>Enviar Aviso</span>
                            </button>

                            {openWaMenuId === client.id && (
                              <div className={styles['admin-panel__wa-dropdown']}>
                                <a
                                  href={buildWhatsAppLink(client.phone, waDia1)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles['admin-panel__wa-item']}
                                  onClick={() => setOpenWaMenuId(null)}
                                >
                                  <span className={styles['admin-panel__wa-item-title']}>
                                    📅 Aviso Día 1 (Emisión Cuota)
                                  </span>
                                  <span className={styles['admin-panel__wa-item-desc']}>
                                    Informa inicio de mes y link de pago.
                                  </span>
                                </a>

                                <a
                                  href={buildWhatsAppLink(client.phone, waDia3)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles['admin-panel__wa-item']}
                                  onClick={() => setOpenWaMenuId(null)}
                                >
                                  <span className={styles['admin-panel__wa-item-title']}>
                                    ⏳ Aviso Día 3 (Próximo a Vencer)
                                  </span>
                                  <span className={styles['admin-panel__wa-item-desc']}>
                                    Recordatorio en 48hs previo al vencimiento.
                                  </span>
                                </a>

                                <a
                                  href={buildWhatsAppLink(client.phone, waDia5)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles['admin-panel__wa-item']}
                                  onClick={() => setOpenWaMenuId(null)}
                                >
                                  <span
                                    className={styles['admin-panel__wa-item-title']}
                                    style={{ color: 'var(--color-danger)' }}
                                  >
                                    🚨 Aviso Día 5 (Último Día)
                                  </span>
                                  <span className={styles['admin-panel__wa-item-desc']}>
                                    Alerta de suspensión de transmisión por mora.
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className={styles['admin-panel__td']}>
                          <div className={styles['admin-panel__actions-cell']}>
                            <button
                              type="button"
                              className={`${styles['admin-panel__btn-action']} ${styles['admin-panel__btn-action--pay']}`}
                              onClick={() => handleOpenPay(client)}
                              title="Registrar pago manual y emitir recibo"
                            >
                              <CreditCard size={15} />
                            </button>

                            <button
                              type="button"
                              className={styles['admin-panel__btn-action']}
                              onClick={() => handleEdit(client)}
                              title="Editar datos del cliente"
                            >
                              <Edit size={15} />
                            </button>

                            <button
                              type="button"
                              className={`${styles['admin-panel__btn-action']} ${styles['admin-panel__btn-action--danger']}`}
                              onClick={() => handleDelete(client.id)}
                              title="Eliminar radio"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredClients.length === 0 && (
                <div className={styles['admin-panel__empty']}>
                  <Users size={36} />
                  <p>No se encontraron radios que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: HISTORIAL DE PAGOS */}
        {activeTab === 'pagos' && (
          <div className={styles['admin-panel__table-wrapper']}>
            <table className={styles['admin-panel__table']}>
              <thead>
                <tr>
                  <th className={styles['admin-panel__th']}>N° Comprobante</th>
                  <th className={styles['admin-panel__th']}>Emisora</th>
                  <th className={styles['admin-panel__th']}>Fecha</th>
                  <th className={styles['admin-panel__th']}>Método</th>
                  <th className={styles['admin-panel__th']}>Referencia</th>
                  <th className={styles['admin-panel__th']}>Monto Abonado</th>
                  <th className={styles['admin-panel__th']}>Factura</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className={styles['admin-panel__tr']}>
                    <td className={styles['admin-panel__td']}>
                      <span style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                        {p.receipt_number}
                      </span>
                    </td>
                    <td className={styles['admin-panel__td']}>
                      <strong>{p.radio_name}</strong>
                    </td>
                    <td className={styles['admin-panel__td']}>{p.payment_date}</td>
                    <td className={styles['admin-panel__td']}>
                      <span className={styles['admin-panel__cloud-badge']}>{p.method}</span>
                    </td>
                    <td className={styles['admin-panel__td']}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                        {p.transaction_ref}
                      </span>
                    </td>
                    <td className={styles['admin-panel__td']}>
                      <span className={styles['admin-panel__fee']}>
                        ${Number(p.amount).toLocaleString('es-AR')}
                      </span>
                    </td>
                    <td className={styles['admin-panel__td']}>
                      <button
                        type="button"
                        className={styles['admin-panel__btn-tool']}
                        onClick={() => onOpenInvoice && onOpenInvoice(p)}
                        title="Ver e Imprimir Factura Oficial"
                      >
                        <FileText size={14} />
                        <span>Ver Factura</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payments.length === 0 && (
              <div className={styles['admin-panel__empty']}>
                <CreditCard size={36} />
                <p>Aún no se han registrado pagos en el sistema.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPABASE CONFIG */}
        {activeTab === 'supabase' && (
          <div className={styles['admin-panel__supabase-card']}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                Sincronización en la Nube con Supabase
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
                Conectar tu base de datos gratuita de Supabase permite que cuando un cliente reporte un pago desde su teléfono, impacte al instante en tu panel en tiempo real.
              </p>
            </div>

            <form onSubmit={handleSaveSupabase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Project URL de Supabase</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supaUrlInput}
                  onChange={(e) => setSupaUrlInput(e.target.value)}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Anon / Public API Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supaKeyInput}
                  onChange={(e) => setSupaKeyInput(e.target.value)}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              {supaSavedMsg && (
                <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 700 }}>
                  {supaSavedMsg}
                </div>
              )}

              <button type="submit" className={styles['admin-panel__btn-add']} style={{ alignSelf: 'flex-start' }}>
                <CheckCircle2 size={16} />
                <span>Guardar Credenciales de Supabase</span>
              </button>
            </form>

            <hr style={{ borderColor: 'var(--color-border)', margin: '0.5rem 0' }} />

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Paso a Paso para configurar Supabase gratis:
              </h4>
              <ol style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.7', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                <li>Entra a <strong>supabase.com</strong> y crea un proyecto nuevo gratuito.</li>
                <li>Ve a <strong>SQL Editor</strong>, copia el contenido del archivo <code>supabase_schema.sql</code> que dejamos en tu proyecto y dale a <strong>RUN</strong>.</li>
                <li>Ve a <strong>Settings → API</strong>, copia la <strong>URL</strong> y la <strong>anon public key</strong>, y pégalas aquí arriba.</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* MODAL FORM: NUEVO / EDITAR CLIENTE */}
      {isFormOpen && (
        <div className={styles['admin-form-modal']}>
          <div className={styles['admin-form-modal__card']}>
            <div className={styles['admin-form-modal__header']}>
              <h3 className={styles['admin-form-modal__title']}>
                {editingClient?.id ? 'Editar Radio Cliente' : 'Cargar Nueva Radio'}
              </h3>
              <button
                type="button"
                className={styles['admin-panel__btn-action']}
                onClick={() => setIsFormOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className={styles['admin-form-modal__grid']}>
              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Nombre de la Emisora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Radio Delta 90.3"
                  value={editingClient.radio_name}
                  onChange={(e) => setEditingClient({ ...editingClient, radio_name: e.target.value })}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Nombre del Titular *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={editingClient.owner_name}
                  onChange={(e) => setEditingClient({ ...editingClient, owner_name: e.target.value })}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="5491123456789 (con código de país)"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="contacto@radio.com"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Paquete / Plan Contratado</label>
                <select
                  value={editingClient.plan}
                  onChange={(e) => setEditingClient({ ...editingClient, plan: e.target.value })}
                  className={styles['admin-form-modal__select']}
                >
                  <option value="Plan Básico">Plan Básico ($8.000 / mes)</option>
                  <option value="Plan Pro con Dominio">Plan Pro con Dominio ($10.000 / mes)</option>
                  <option value="Plan Pro + App Android">Plan Pro + App Android ($10.000 / mes)</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Abono Mensual ($ ARS)</label>
                <input
                  type="number"
                  required
                  value={editingClient.monthly_fee}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, monthly_fee: Number(e.target.value) })
                  }
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Día de Vencimiento</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={editingClient.due_day || 5}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, due_day: Number(e.target.value) })
                  }
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Estado Inicial</label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                  className={styles['admin-form-modal__select']}
                >
                  <option value="al_dia">Al Día (Sin deuda)</option>
                  <option value="proximo_a_vencer">Próximo a Vencer (Día 3)</option>
                  <option value="vencido">En Demora / Vencido (Día 5+)</option>
                </select>
              </div>

              <div className={`${styles['admin-form-modal__field']} ${styles['admin-form-modal__field--full']}`}>
                <label className={styles['admin-form-modal__label']}>Notas internas</label>
                <input
                  type="text"
                  placeholder="Detalles del servidor, enlaces o acordados..."
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={`${styles['admin-form-modal__footer']} ${styles['admin-form-modal__field--full']}`}>
                <button
                  type="button"
                  className={styles['admin-panel__btn-tool']}
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles['admin-panel__btn-add']}>
                  <CheckCircle2 size={16} />
                  <span>Guardar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR PAGO MANUAL */}
      {payingClient && (
        <div className={styles['admin-form-modal']}>
          <div className={styles['admin-form-modal__card']} style={{ maxWidth: '460px' }}>
            <div className={styles['admin-form-modal__header']}>
              <h3 className={styles['admin-form-modal__title']}>Registrar Pago de Cuota</h3>
              <button
                type="button"
                className={styles['admin-panel__btn-action']}
                onClick={() => setPayingClient(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Emisora: <strong>{payingClient.radio_name}</strong> ({payingClient.owner_name})
            </p>

            <form onSubmit={handleConfirmPay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Monto Recibido ($ ARS)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>Método de Pago</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className={styles['admin-form-modal__select']}
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Efectivo / Depósito">Efectivo / Depósito</option>
                </select>
              </div>

              <div className={styles['admin-form-modal__field']}>
                <label className={styles['admin-form-modal__label']}>N° de Operación / Comprobante</label>
                <input
                  type="text"
                  required
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className={styles['admin-form-modal__input']}
                />
              </div>

              <div className={styles['admin-form-modal__footer']}>
                <button
                  type="button"
                  className={styles['admin-panel__btn-tool']}
                  onClick={() => setPayingClient(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles['admin-panel__btn-add']}>
                  <CreditCard size={16} />
                  <span>Aprobar Pago & Emitir Recibo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
