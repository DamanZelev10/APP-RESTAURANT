import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, User, Calendar, Phone, Star, TrendingUp, History } from 'lucide-react';

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
                      <span style={{ fontWeight: 600 }}>{c.fullName}</span>
                    </div>
                  </td>
                  <td>{c.phone}</td>
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
                   <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedCustomer.fullName}</h2>
                   <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{selectedCustomer.phone}</p>
                 </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedCustomer(null)}><XCircle size={20} /></button>
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
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{res.reservationTime} • {res.partySize} pers.</div>
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
