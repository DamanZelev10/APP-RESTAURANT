import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Trash2, 
  Edit,
  CheckCircle,
  XCircle,
  UserX,
  ChevronDown,
  CalendarClock,
  Users,
  TrendingUp,
  MessageCircle,
  Copy,
  ExternalLink,
  RotateCcw,
  DollarSign
} from 'lucide-react';
import { format12h, isTodayLocal, generateWhatsAppDeepLink, getLocalDateString } from '../utils/formatters';
import DatePicker from './DatePicker';

export default function Reservations({ selectedReservationId, clearSelectedReservation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ date: '', period: 'today', status: '' });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRes, setCurrentRes] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [whatsappModal, setWhatsappModal] = useState(null); // { res: obj }

  useEffect(() => {
    loadReservations();
  }, [filter]);

  useEffect(() => {
    if (selectedReservationId) {
      api.getReservation(selectedReservationId).then(data => {
        setCurrentRes(data);
        setShowModal(true);
        if (clearSelectedReservation) clearSelectedReservation();
      }).catch(console.error);
    }
  }, [selectedReservationId, clearSelectedReservation]);

  async function loadReservations() {
    try {
      setLoading(true);
      
      let params = { status: filter.status };
      if (filter.date) {
        params.date = filter.date;
      } else if (filter.period) {
        const today = new Date();
        const yyyyMmDd = (d) => {
          const z = n => ('0' + n).slice(-2);
          return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
        };
        
        if (filter.period === 'today') {
          params.date = yyyyMmDd(today);
        } else if (filter.period === 'yesterday') {
          const y = new Date(today);
          y.setDate(y.getDate() - 1);
          params.date = yyyyMmDd(y);
        } else if (filter.period === 'this_week') {
          const d = new Date(today);
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(d.setDate(diff));
          const sunday = new Date(monday);
          sunday.setDate(sunday.getDate() + 6);
          params.startDate = yyyyMmDd(monday);
          params.endDate = yyyyMmDd(sunday);
        }
      }

      const data = await api.getReservations(params);
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  }

  const requestStatusChange = (res, newStatus) => {
    const statusMap = {
      'confirmed': 'confirmar pago o asistencia de',
      'completed': 'completar el servicio de',
      'no_show': 'marcar como No-Show a',
      'cancelled': 'cancelar la reserva de',
      'pending': 'revertir a pendiente la reserva de'
    };
    
    setConfirmAction({
      type: 'status',
      id: res.id,
      title: 'Confirmar Acción',
      message: `¿Estás seguro de que deseas ${statusMap[newStatus]} ${res.fullName}?`,
      payload: newStatus,
      confirmText: newStatus === 'cancelled' || newStatus === 'no_show' ? 'Sí, continuar' : 'Sí, confirmar'
    });
  };

  const requestDelete = (res) => {
    setConfirmAction({
      type: 'delete',
      id: res.id,
      title: 'Eliminar Reserva',
      message: `¿Estás seguro de que deseas ELIMINAR permanentemente la reserva de ${res.fullName}?`,
      confirmText: 'Sí, eliminar',
      isDanger: true
    });
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'status') {
        await api.updateReservationStatus(confirmAction.id, confirmAction.payload);
      } else if (confirmAction.type === 'delete') {
        await api.deleteReservation(confirmAction.id);
      }
      loadReservations();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setConfirmAction(null);
    }
  };

  const handleOpenWhatsApp = (res) => {
    setWhatsappModal({ res });
  };

  const handleEditOpen = (res) => {
    setCurrentRes(res);
    setShowModal(true);
  };

  // --- Defensive Search and Filter Logic ---
  const safeReservations = Array.isArray(reservations) ? reservations : [];

  const filteredReservations = safeReservations.filter(r => 
    (r.fullName || '').toLowerCase().includes((search || '').toLowerCase()) || 
    (r.phone || '').includes(search || '')
  );

  const todayStr = getLocalDateString();
  const sortedAndFiltered = [...filteredReservations].sort((a, b) => {
    const isAToday = a.reservationDate === todayStr;
    const isBToday = b.reservationDate === todayStr;
    
    if (isAToday && !isBToday) return -1;
    if (!isAToday && isBToday) return 1;
    
    if (a.reservationDate === b.reservationDate) {
      return a.reservationTime.localeCompare(b.reservationTime);
    }
    
    const isAPast = a.reservationDate < todayStr;
    const isBPast = b.reservationDate < todayStr;
    
    if (isAPast && !isBPast) return 1;
    if (!isAPast && isBPast) return -1;
    
    if (isAPast && isBPast) return b.reservationDate.localeCompare(a.reservationDate);
    return a.reservationDate.localeCompare(b.reservationDate);
  });

  const totalRes = sortedAndFiltered.length;
  const pendingRes = sortedAndFiltered.filter(r => r.status === 'pending').length;
  const completedRes = sortedAndFiltered.filter(r => r.status === 'completed').length;

  return (
    <div className="reservations">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1>Reservaciones</h1>
          <p>Gestiona y controla el flujo de clientes para el servicio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setCurrentRes(null); setShowModal(true); }}>
          <Plus size={20} /> Nueva Reserva
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(201, 169, 110, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}><CalendarClock size={24} /></div>
          <div><div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Total Reservas</div><div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{totalRes}</div></div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '12px', borderRadius: '50%' }}><DollarSign size={24} /></div>
          <div><div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Pendientes (Pago)</div><div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{pendingRes}</div></div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', padding: '12px', borderRadius: '50%' }}><CheckCircle size={24} /></div>
          <div><div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Completadas</div><div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{completedRes}</div></div>
        </div>
      </div>

      <div className="data-table-container" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div className="table-controls" style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['today', 'yesterday', 'this_week', 'all'].map(p => (
              <button 
                key={p}
                onClick={() => setFilter(prev => ({ ...prev, period: p, date: '' }))}
                style={{
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: filter.period === p ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: filter.period === p ? 'rgba(201, 169, 110, 0.1)' : 'transparent',
                  color: filter.period === p ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {p === 'today' && 'Hoy'}
                {p === 'yesterday' && 'Ayer'}
                {p === 'this_week' && 'Esta semana'}
                {p === 'all' && 'Todas'}
              </button>
            ))}
          </div>

          <div className="filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o celular..." 
                className="input" 
                style={{ paddingLeft: '40px', height: '42px', width: '100%' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div style={{ width: '180px' }}>
              <DatePicker 
                value={filter.date}
                onChange={(val) => setFilter({ ...filter, date: val, period: '' })}
                placeholder="Seleccionar fecha"
              />
            </div>

            <select 
              className="input" 
              style={{ width: '160px', height: '42px' }}
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">Todos los Estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="no_show">No-Show</option>
            </select>

            <button 
              className="btn btn-outline" 
              onClick={() => { setSearch(''); setFilter({ date: '', period: 'today', status: '' }); }}
              style={{ height: '42px', padding: '0 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Limpiar filtros"
            >
              <RotateCcw size={14} /> 
              <span className="hidden-mobile">Limpiar</span>
            </button>
            
            <div className="quick-stats" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, marginLeft: 'auto' }}>
              {sortedAndFiltered.length} {sortedAndFiltered.length === 1 ? 'resultado' : 'resultados'}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha/Hora</th>
                <th style={{ textAlign: 'center' }}>Personas</th>
                <th>Estado</th>
                <th>Fuente</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div className="loading-spinner" style={{ border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando reservaciones...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedAndFiltered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <CalendarClock size={48} color="var(--border)" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '16px' }}>No hay reservaciones</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No se encontraron registros para los filtros seleccionados.</span>
                      </div>
                      <button className="btn btn-outline" onClick={() => { setSearch(''); setFilter({ date: '', period: 'today', status: '' }); }} style={{ fontSize: '13px' }}>
                        Limpiar todos los filtros
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAndFiltered.map(res => {
                  const isToday = isTodayLocal(res.reservationDate);
                  return (
                  <tr key={res.id} style={{ backgroundColor: isToday ? 'rgba(201, 169, 110, 0.05)' : 'transparent', borderLeft: isToday ? '3px solid var(--primary)' : '3px solid transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: isToday ? 'var(--text-main)' : 'var(--text-main)' }}>{res.fullName || 'Sin Nombre'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{res.phone || 'N/A'}</div>
                        </div>
                        {res.isPaid && (
                          <div title="Pagado" style={{ background: 'rgba(201, 169, 110, 0.2)', color: 'var(--primary)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                            <DollarSign size={12} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ fontSize: '12px', color: isToday ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CalendarClock size={12} />
                          {res.reservationDate || 'N/A'} {isToday && <span style={{fontSize: '9px', background: 'var(--primary)', color: '#000', padding:'2px 4px', borderRadius:'4px', fontWeight: 700}}>HOY</span>}
                        </div>
                        <div style={{ fontSize: '18px', color: 'var(--text-main)', fontWeight: 700, letterSpacing: '-0.5px' }}>{format12h(res.reservationTime) || 'N/A'}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px' }}>
                        <Users size={16} color="var(--primary)" />
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{res.partySize || 0}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${res.status}`} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {res.status === 'pending' && 'Pendiente'}
                        {res.status === 'confirmed' && 'Confirmado'}
                        {res.status === 'cancelled' && 'Cancelado'}
                        {res.status === 'no_show' && 'No-Show'}
                        {res.status === 'completed' && 'Completado'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, fontWeight: 500 }}>{res.source || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon btn-action" 
                          title="Contactar vía WhatsApp"
                          onClick={() => handleOpenWhatsApp(res)}
                          style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)', padding: '6px 10px', borderRadius: '8px', display: 'flex', gap: '4px', fontWeight: 600, fontSize: '11px', border: '1px solid rgba(37, 211, 102, 0.2)' }}
                        >
                          <MessageCircle size={14} /> WApp
                        </button>
                        
                        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 2px' }}></div>
                        
                        {res.status === 'pending' && (
                          <button 
                            className="btn btn-primary" 
                            title="Confirmar y Marcar como Pagado"
                            onClick={() => requestStatusChange(res, 'confirmed')}
                            style={{ padding: '6px 12px', fontSize: '11px', height: '32px', fontWeight: 700 }}
                          >
                            <CheckCircle size={14} /> RESERVA PAGA
                          </button>
                        )}
  
                        {res.status === 'confirmed' && (
                          <button 
                            className="btn" 
                            title="Completar Servicio"
                            onClick={() => requestStatusChange(res, 'completed')}
                            style={{ background: 'var(--info)', color: '#fff', padding: '6px 12px', fontSize: '11px', height: '32px', fontWeight: 700 }}
                          >
                            <TrendingUp size={14} /> COMPLETAR
                          </button>
                        )}

                        {res.status !== 'pending' && (
                          <button 
                            className="btn-icon" 
                            title="Revertir a Pendiente"
                            onClick={() => requestStatusChange(res, 'pending')}
                            style={{ color: 'var(--primary)', background: 'rgba(201, 169, 110, 0.1)', width: '32px', height: '32px' }}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {res.status !== 'no_show' && res.status !== 'completed' && res.status !== 'cancelled' && (
                            <button 
                              className="btn-icon" 
                              title="No-Show (Ausente)"
                              onClick={() => requestStatusChange(res, 'no_show')}
                              style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)', width: '32px', height: '32px', border: '1px solid rgba(245, 158, 11, 0.1)' }}
                            >
                              <UserX size={16} />
                            </button>
                          )}

                          {res.status !== 'cancelled' && res.status !== 'completed' && (
                            <button 
                              className="btn-icon" 
                              title="Cancelar Reserva"
                              onClick={() => requestStatusChange(res, 'cancelled')}
                              style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', width: '32px', height: '32px', border: '1px solid rgba(239, 68, 68, 0.1)' }}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 2px' }}></div>

                        <button 
                          className="btn-icon" 
                          title="Editar"
                          onClick={() => handleEditOpen(res)}
                          style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-muted)', width: '32px', height: '32px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button 
                          className="btn-icon" 
                          title="Eliminar"
                          onClick={() => requestDelete(res)}
                          style={{ background: 'rgba(239, 68, 68, 0.07)', color: 'var(--danger)', width: '32px', height: '32px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ReservationModal 
          onClose={() => setShowModal(false)} 
          onSave={() => { setShowModal(false); loadReservations(); }}
          initialData={currentRes}
        />
      )}

      {confirmAction && (
        <ConfirmModal 
          action={confirmAction}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {whatsappModal && (
        <WhatsAppModal 
          reservation={whatsappModal.res}
          onClose={() => setWhatsappModal(null)}
        />
      )}
    </div>
  );
}

function ConfirmModal({ action, onConfirm, onCancel }) {
  const [inProgress, setInProgress] = useState(false);
  const handleConfirm = async () => {
    setInProgress(true);
    await onConfirm();
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px' }}>
        {action.isDanger ? (
          <Trash2 size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
        ) : (
          <CheckCircle size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
        )}
        <h2 style={{ marginBottom: '16px', color: action.isDanger ? 'var(--danger)' : 'var(--text-main)' }}>{action.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>{action.message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={`btn ${action.isDanger ? 'btn-primary' : 'btn-primary'}`} style={{ flex: 1, background: action.isDanger ? 'var(--danger)' : 'var(--primary)', color: action.isDanger ? '#fff' : '#000' }} onClick={handleConfirm} disabled={inProgress}>
            {inProgress ? 'Procesando...' : action.confirmText}
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={inProgress}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ onClose, onSave, initialData }) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phone: '',
    idNumber: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:00',
    partySize: 2,
    occasion: '',
    specialRequests: '',
    source: 'admin',
    createdByRole: 'admin'
  });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      const normalizedPhone = formData.phone.startsWith('+57') 
        ? formData.phone 
        : `+57${formData.phone.replace(/\D/g, '')}`;

      const finalData = { ...formData, phone: normalizedPhone };

      if (isEditing) {
        await api.updateReservation(initialData.id, finalData);
      } else {
        await api.createReservation(finalData);
      }
      onSave();
    } catch (err) {
      setErrors(err.message.split(', '));
    } finally {
      setSubmitting(false);
    }
  };

  const timeOptions = [];
  const bogotaDate = getLocalDateString();
  const isSelectedToday = formData.reservationDate === bogotaDate;
  
  // Get current Bogota hour/min for real-time blocking
  const nowBogota = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
  const [currentH, currentM] = nowBogota.split(':').map(Number);

  for (let i = 17; i <= 22; i++) {
    const hStr = String(i).padStart(2, '0');
    
    // Check :00 slot
    const isPast00 = isSelectedToday && (i < currentH || (i === currentH && currentM > 0));
    if (!isPast00) {
      timeOptions.push(`${hStr}:00`);
    }
    
    // Check :30 slot
    if (i < 22) {
      const isPast30 = isSelectedToday && (i < currentH || (i === currentH && currentM > 30));
      if (!isPast30) {
        timeOptions.push(`${hStr}:30`);
      }
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '24px' }}>{isEditing ? 'Editar Reserva' : 'Nueva Reservación'}</h2>
        
        {errors.length > 0 && (
          <div className="alert-item critical" style={{ marginBottom: '20px', borderLeftWidth: '4px' }}>
            <div className="alert-content">
              <h4 style={{ color: 'var(--danger)' }}>Errores de validación</h4>
              <ul style={{ fontSize: '13px', paddingLeft: '16px' }}>
                {errors.map((e, idx) => <li key={idx}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Cliente</label>
            {isEditing ? (
              <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {formData.fullName} 
                <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.1)', color: '#aaa', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px' }}>SOLO LECTURA</span>
              </div>
            ) : (
              <input 
                type="text" className="input" required 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Celular (WhatsApp)</label>
              <input 
                type="tel" className="input" required 
                placeholder="300 123 4567"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({...formData, phone: val});
                }}
              />
            </div>
            <div className="form-group">
              <label>Cédula/ID (Opcional)</label>
              <input 
                type="text" className="input"
                placeholder="CC 12345..."
                value={formData.idNumber || ''}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Fecha</label>
              <input 
                type="date" className="input" required 
                value={formData.reservationDate}
                onChange={(e) => setFormData({...formData, reservationDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <select 
                className="input" required 
                value={formData.reservationTime}
                onChange={(e) => setFormData({...formData, reservationTime: e.target.value})}
              >
                <option value="">Selecciona hora</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{format12h(t)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Personas</label>
              <input 
                type="number" className="input" required min="1" max="12"
                value={formData.partySize}
                onChange={(e) => setFormData({...formData, partySize: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Ocasión</label>
              {isEditing ? (
                <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formData.occasion === 'birthday' ? 'Cumpleaños' : formData.occasion === 'anniversary' ? 'Aniversario' : formData.occasion === 'romance' ? 'Plan Romántico' : 'Ninguna'}
                  <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.1)', color: '#aaa', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px' }}>SOLO LECTURA</span>
                </div>
              ) : (
                <select 
                  className="input"
                  value={formData.occasion || ''}
                  onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                >
                  <option value="">Ninguna</option>
                  <option value="birthday">Cumpleaños</option>
                  <option value="anniversary">Aniversario</option>
                  <option value="romance">Plan Romántico</option>
                </select>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Reserva'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WhatsAppModal({ reservation, onClose }) {
  const [templateType, setTemplateType] = useState('confirmation');
  const [message, setMessage] = useState('');

  const name = reservation.fullName.split(' ')[0] || '';
  const date = reservation.reservationDate || '';
  const time = format12h(reservation.reservationTime) || '';
  const partySize = reservation.partySize || '';

  const templates = {
    confirmation: `Hola ${name} 👋\nTe escribimos de ROSÉ Cafe Bar para confirmar tu reserva de hoy a las ${time} para ${partySize} personas.\nPor favor responde:\n✅ SI, confirmo\n❌ NO, cancelar`,
    reminder: `Hola ${name} 👋\nTe recordamos tu reserva de hoy en ROSÉ Cafe Bar a las ${time} para ${partySize} personas.\nTe esperamos.`,
    cancellation: `Hola ${name},\nTu reserva para el ${date} a las ${time} ha sido cancelada correctamente.\nGracias por avisarnos.`,
    custom: `Hola ${name}, te escribimos de ROSÉ Cafe Bar respecto a tu reserva del ${date} a las ${time}.`
  };

  useEffect(() => {
    setMessage(templates[templateType]);
  }, [templateType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.innerHTML = '<span style="display:flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copiado</span>';
      setTimeout(() => btn.innerHTML = '<span style="display:flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copiar</span>', 2000);
    }
  };

  const handleSend = () => {
    const apiType = templateType === 'confirmation' ? 'confirmation_request' : (templateType === 'custom' ? 'manual_message' : templateType);
    api.sendWhatsApp(reservation.id, apiType).catch(console.error);
    const link = generateWhatsAppDeepLink(reservation.phone, message);
    window.open(link, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
            <div style={{ background: 'rgba(37, 211, 102, 0.15)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
              <MessageCircle color="#25D366" size={24} />
            </div>
            Centro de Mensajes
          </h2>
          <button className="btn-icon" onClick={onClose}><XCircle size={24} color="var(--text-muted)" /></button>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seleccionar Plantilla</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-hover)', padding: '8px', borderRadius: '12px' }}>
            <button type="button" className={`btn ${templateType === 'confirmation' ? 'btn-primary' : ''}`} 
              onClick={() => setTemplateType('confirmation')} style={{ padding:'10px', fontSize:'13px', background: templateType === 'confirmation' ? 'var(--primary)' : 'transparent', color: templateType === 'confirmation' ? '#000' : 'var(--text-main)', border: 'none' }}>Solicitar Confirm.</button>
            <button type="button" className={`btn ${templateType === 'reminder' ? 'btn-primary' : ''}`} 
              onClick={() => setTemplateType('reminder')} style={{ padding:'10px', fontSize:'13px', background: templateType === 'reminder' ? 'var(--primary)' : 'transparent', color: templateType === 'reminder' ? '#000' : 'var(--text-main)', border: 'none' }}>Recordatorio</button>
            <button type="button" className={`btn ${templateType === 'cancellation' ? 'btn-primary' : ''}`} 
              onClick={() => setTemplateType('cancellation')} style={{ padding:'10px', fontSize:'13px', background: templateType === 'cancellation' ? 'var(--primary)' : 'transparent', color: templateType === 'cancellation' ? '#000' : 'var(--text-main)', border: 'none' }}>Cancelación</button>
            <button type="button" className={`btn ${templateType === 'custom' ? 'btn-primary' : ''}`} 
              onClick={() => setTemplateType('custom')} style={{ padding:'10px', fontSize:'13px', background: templateType === 'custom' ? 'var(--primary)' : 'transparent', color: templateType === 'custom' ? '#000' : 'var(--text-main)', border: 'none' }}>Mensaje General</button>
          </div>
        </div>

        <div className="form-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Previsualización y Edición</span>
            <span style={{ textTransform: 'none', color: 'var(--primary)' }}>Enviar a: {reservation.phone}</span>
          </label>
          <textarea 
            className="input" 
            style={{ minHeight: '160px', resize: 'vertical', lineHeight: '1.6', fontFamily: 'inherit', background: '#0a0a0a', border: '1px solid #333' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button className="btn" style={{ flex: 2, background: '#25D366', color: '#fff', padding: '14px', fontSize: '15px', fontWeight: 600, border: 'none' }} onClick={handleSend}>
            <ExternalLink size={18} /> Abrir Chat de WhatsApp
          </button>
          <button id="copyBtn" className="btn btn-outline" style={{ flex: 1, padding: '14px' }} onClick={handleCopy}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Copy size={16} /> Copiar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
