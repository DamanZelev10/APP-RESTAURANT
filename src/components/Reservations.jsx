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
  TrendingUp
} from 'lucide-react';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ date: new Date().toISOString().split('T')[0], status: '' });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRes, setCurrentRes] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [filter]);

  async function loadReservations() {
    try {
      setLoading(true);
      const data = await api.getReservations(filter);
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateReservationStatus(id, status);
      loadReservations();
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  const handleWhatsApp = async (id, type) => {
    try {
      const action = await api.sendWhatsApp(id, type);
      window.open(action.link, '_blank');
      loadReservations();
    } catch (err) {
      alert('Error al generar enlace de WhatsApp: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      await api.deleteReservation(id);
      loadReservations();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  // --- Defensive Search and Filter Logic ---
  const safeReservations = Array.isArray(reservations) ? reservations : [];

  const filteredReservations = safeReservations.filter(r => 
    (r.fullName || '').toLowerCase().includes((search || '').toLowerCase()) || 
    (r.phone || '').includes(search || '')
  );

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

      <div className="data-table-container" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div className="table-controls" style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="filters" style={{ display: 'flex', gap: '12px', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
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
            
            <input 
              type="date" 
              className="input" 
              style={{ width: '160px', height: '42px' }}
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            />

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
          </div>
          
          <div className="quick-stats" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>
            {filteredReservations.length} {filteredReservations.length === 1 ? 'resultado' : 'resultados'}
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
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <CalendarClock size={48} color="var(--border)" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '16px' }}>No hay reservaciones</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No se encontraron registros para los filtros seleccionados.</span>
                      </div>
                      <button className="btn btn-outline" onClick={() => { setSearch(''); setFilter({ date: '', status: '' }); }} style={{ fontSize: '13px' }}>
                        Limpiar todos los filtros
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReservations.map(res => (
                  <tr key={res.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{res.fullName || 'Sin Nombre'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{res.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{res.reservationDate || 'N/A'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>{res.reservationTime || 'N/A'}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'var(--bg-hover)', borderRadius: '6px', padding: '4px 8px', width: 'fit-content', margin: '0 auto' }}>
                        <Users size={14} color="var(--text-muted)" />
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{res.partySize || 0}</span>
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
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon" 
                          title="WhatsApp"
                          onClick={() => handleWhatsApp(res.id, 'reminder')}
                          style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)' }}
                        >
                          <MessageSquare size={16} />
                        </button>
                        
                        {res.status === 'pending' && (
                          <button 
                            className="btn-icon" 
                            title="Confirmar"
                            onClick={() => handleStatusChange(res.id, 'confirmed')}
                            style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
  
                        {(res.status === 'pending' || res.status === 'confirmed') && (
                          <button 
                            className="btn-icon" 
                            title="Completar"
                            onClick={() => handleStatusChange(res.id, 'completed')}
                            style={{ color: 'var(--info)', background: 'rgba(59, 130, 246, 0.1)' }}
                          >
                            <TrendingUp size={16} />
                          </button>
                        )}
  
                        <button className="btn-icon" title="Opciones" style={{ background: 'rgba(160, 160, 160, 0.1)', color: 'var(--text-muted)' }}>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
    </div>
  );
}

function ReservationModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phone: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:00',
    partySize: 2,
    occasion: '',
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
      await api.createReservation(formData);
      onSave();
    } catch (err) {
      setErrors(err.message.split(', '));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '24px' }}>{initialData ? 'Editar Reserva' : 'Nueva Reservación'}</h2>
        
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
            <input 
              type="text" className="input" required 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Celular (WhatsApp)</label>
            <input 
              type="tel" className="input" required 
              placeholder="+57..."
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
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
              <input 
                type="time" className="input" required 
                value={formData.reservationTime}
                onChange={(e) => setFormData({...formData, reservationTime: e.target.value})}
              />
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
              <select 
                className="input"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              >
                <option value="">Ninguna</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Aniversario">Aniversario</option>
                <option value="Plan Romántico">Plan Romántico</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Guardando...' : 'Crear Reserva'}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
