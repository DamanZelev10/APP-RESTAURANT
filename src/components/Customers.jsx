import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, User, Star, History, XCircle, Trash2, Ban, CheckCircle } from 'lucide-react';
import { format12h } from '../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleViewDetails = async (id) => {
    try {
      const data = await api.getCustomer(id);
      setSelectedCustomer(data);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este cliente? Esta acción eliminará todo su historial.')) {
      try {
        await api.deleteCustomer(id);
        setSelectedCustomer(null);
        loadCustomers();
      } catch (err) {
        alert('Error eliminando cliente: ' + err.message);
      }
    }
  };

  const handleToggleSuspend = async (id, currentStatus) => {
    const action = currentStatus ? 'suspender' : 'reactivar';
    if (window.confirm(`¿Estás seguro de que deseas ${action} a este cliente?`)) {
      try {
        await api.updateCustomerStatus(id, !currentStatus);
        handleViewDetails(id);
        loadCustomers();
      } catch (err) {
        alert('Error cambiando estado del cliente: ' + err.message);
      }
    }
  };

  return (
    <div className="customers">
       <header className="dashboard-header">
        <h1>Clientes</h1>
        <p>Seguimiento de lealtad y frecuencia de tus visitantes.</p>
      </header>

      <div className="table-controls mb-4" style={{ marginBottom: '24px', background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
         <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o celular..." 
              className="input" 
              style={{ paddingLeft: '40px', height: '42px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="badge badge-pending" style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
            {filteredCustomers.length} Clientes Totales
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 1fr' : '1fr', gap: '24px' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Celular</th>
                <th>Reservas</th>
                <th>Última</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Cargando clientes...</td></tr>
              ) : filteredCustomers.map(c => (
                <tr key={c.id} onClick={() => handleViewDetails(c.id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="var(--primary)" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: c.isActive === false ? 'var(--text-muted)' : 'inherit', textDecoration: c.isActive === false ? 'line-through' : 'none' }}>{c.fullName}</span>
                        {c.isActive === false && <span style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 600 }}>SUSPENDIDO</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ opacity: c.isActive === false ? 0.5 : 1 }}>{c.phone}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={14} color="var(--primary)" fill={c.totalReservations >= 3 ? "var(--primary)" : "none"} />
                      {c.totalReservations}
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {c.lastReservationAt ? new Date(c.lastReservationAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <button className="btn btn-icon" style={{ color: 'var(--primary)' }}>
                      <History size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="customer-detail-card" style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
                   {selectedCustomer.fullName.substring(0,1)}
                 </div>
                 <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <h2 style={{ fontSize: '20px', fontWeight: 700, color: selectedCustomer.isActive === false ? 'var(--text-muted)' : 'inherit' }}>{selectedCustomer.fullName}</h2>
                     {selectedCustomer.isActive === false && <span className="badge badge-danger">SUSPENDIDO</span>}
                   </div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{selectedCustomer.phone}</p>
                 </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedCustomer(null)}><XCircle size={20} /></button>
            </div>

            <div className="customer-admin-actions" style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: selectedCustomer.isActive === false ? 'var(--primary)' : '#f59e0b', borderColor: selectedCustomer.isActive === false ? 'var(--primary)' : 'rgba(245, 158, 11, 0.3)' }}
                onClick={() => handleToggleSuspend(selectedCustomer.id, selectedCustomer.isActive)}
              >
                {selectedCustomer.isActive === false ? <CheckCircle size={16} /> : <Ban size={16} />}
                {selectedCustomer.isActive === false ? 'Reactivar Cliente' : 'Suspender Cliente'}
              </button>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={() => handleDelete(selectedCustomer.id)}
              >
                <Trash2 size={16} /> Eliminar Cliente
              </button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--bg-hover)', padding: '16px', borderRadius: '12px' }}>
                <span className="label" style={{ fontSize: '11px' }}>Reservas Totales</span>
                <div className="value" style={{ fontSize: '24px', margin: '4px 0' }}>{selectedCustomer.totalReservations}</div>
              </div>
              <div style={{ background: 'var(--bg-hover)', padding: '16px', borderRadius: '12px' }}>
                <span className="label" style={{ fontSize: '11px' }}>Estado Reciente</span>
                <div className="value" style={{ fontSize: '24px', margin: '4px 0' }}>
                   <span className={`badge badge-${selectedCustomer.lastStatus}`} style={{ fontSize: '14px' }}>{selectedCustomer.lastStatus}</span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--primary)" /> Historial de Visitas
            </h3>
            
            <div className="history-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
               {selectedCustomer.reservations.map(res => (
                  <div key={res.id} style={{ padding: '12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{res.reservationDate}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{format12h(res.reservationTime)} • {res.partySize} pers.</div>
                    </div>
                    <span className={`badge badge-${res.status}`} style={{ fontSize: '10px' }}>{res.status}</span>
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
