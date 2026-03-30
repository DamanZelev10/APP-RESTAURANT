import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Building2, 
  Settings2, 
  Clock, 
  MessageSquare, 
  Save, 
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export default function Settings() {
  const [restaurant, setRestaurant] = useState(null);
  const [settings, setSettings] = useState(null);
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const [res, sett, hr] = await Promise.all([
        api.getRestaurant(),
        api.getSettings(),
        api.getBusinessHours()
      ]);
      setRestaurant(res);
      setSettings(sett);
      setHours(hr);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      if (activeSubTab === 'profile') await api.updateRestaurant(restaurant);
      if (activeSubTab === 'rules') await api.updateSettings(settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      alert('Error al guardar: ' + err.message);
      setSaveStatus(null);
    }
  };

  if (loading) return <div className="loading">Cargando configuraciones...</div>;

  return (
    <div className="settings">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Configuración</h1>
          <p>Personaliza las reglas de negocio y el perfil de ROSÉ Cafe Bar.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saveStatus === 'saving'}>
           {saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'saved' ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
        </button>
      </header>

      <div className="settings-container mt-4" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
        <div className="settings-nav" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', alignSelf: 'start' }}>
           <button className={`nav-item ${activeSubTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveSubTab('profile')} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Building2 size={18} /> Perfil del Restaurante
           </button>
           <button className={`nav-item ${activeSubTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveSubTab('rules')} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Settings2 size={18} /> Reglas de Reserva
           </button>
           <button className={`nav-item ${activeSubTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveSubTab('hours')} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Clock size={18} /> Horarios de Atención
           </button>
           <button className={`nav-item ${activeSubTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveSubTab('messages')} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <MessageSquare size={18} /> Mensajes de WhatsApp
           </button>
        </div>

        <div className="settings-panel" style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
           {activeSubTab === 'profile' && (
             <div className="profile-settings">
                <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Perfil de ROSÉ</h3>
                <div className="form-group">
                   <label>Nombre del Establecimiento</label>
                   <input type="text" className="input" value={restaurant.name} onChange={(e) => setRestaurant({...restaurant, name: e.target.value})} />
                </div>
                <div className="form-group">
                   <label>WhatsApp de Contacto</label>
                   <input type="text" className="input" value={restaurant.phone} onChange={(e) => setRestaurant({...restaurant, phone: e.target.value})} />
                </div>
                <div className="form-group">
                   <label>Dirección Física</label>
                   <input type="text" className="input" value={restaurant.address} onChange={(e) => setRestaurant({...restaurant, address: e.target.value})} />
                </div>
                <div className="form-group">
                   <label>Zona Horaria</label>
                   <select className="input" value={restaurant.timezone} onChange={(e) => setRestaurant({...restaurant, timezone: e.target.value})}>
                      <option value="America/Bogota">America/Bogota (COT)</option>
                      <option value="America/Mexico_City">America/Mexico_City (CST)</option>
                   </select>
                </div>
             </div>
           )}

           {activeSubTab === 'rules' && (
             <div className="rules-settings">
                <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Reglas Operativas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                   <div className="form-group">
                      <label>Capacidad Máxima por Slot</label>
                      <input type="number" className="input" value={settings.maxCapacityPerSlot} onChange={(e) => setSettings({...settings, maxCapacityPerSlot: e.target.value})} />
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Capacidad total en personas para cada intervalo de 30 min.</p>
                   </div>
                   <div className="form-group">
                      <label>Tamaño Máximo de Mesa</label>
                      <input type="number" className="input" value={settings.maxPartySize} onChange={(e) => setSettings({...settings, maxPartySize: e.target.value})} />
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Límite de personas por reservación individual.</p>
                   </div>
                   <div className="form-group">
                      <label>Anticipación Mínima (Horas)</label>
                      <input type="number" className="input" value={settings.minAdvanceHours} onChange={(e) => setSettings({...settings, minAdvanceHours: e.target.value})} />
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Tiempo mínimo antes del servicio para reservar.</p>
                   </div>
                   <div className="form-group">
                      <label>Confirmación Manual (Horas)</label>
                      <input type="number" className="input" value={settings.confirmationLeadHours} onChange={(e) => setSettings({...settings, confirmationLeadHours: e.target.value})} />
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Tiempo de anticipación para enviar recordatorio.</p>
                   </div>
                </div>
             </div>
           )}

           {activeSubTab === 'hours' && (
             <div className="hours-settings">
                <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Horarios de Apertura</h3>
                <div className="hours-list">
                   {hours.map((h, idx) => (
                      <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: idx < hours.length - 1 ? '1px solid var(--border)' : 'none' }}>
                         <div style={{ width: '100px', fontWeight: 600 }}>
                            {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][h.weekday]}
                         </div>
                         <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <input 
                              type="time" className="input" style={{ width: '130px' }} 
                              value={h.openTime} disabled={!h.isOpen}
                              onChange={async (e) => {
                                 const updated = {...h, openTime: e.target.value};
                                 await api.updateBusinessHour(h.id, updated);
                                 loadSettings();
                              }}
                            />
                            <span>a</span>
                            <input 
                              type="time" className="input" style={{ width: '130px' }} 
                              value={h.closeTime} disabled={!h.isOpen}
                              onChange={async (e) => {
                                 const updated = {...h, closeTime: e.target.value};
                                 await api.updateBusinessHour(h.id, updated);
                                 loadSettings();
                              }}
                            />
                         </div>
                         <button 
                            className={`btn ${h.isOpen ? 'btn-primary' : 'btn-outline'}`} 
                            style={{ width: '100px', fontSize: '12px', padding: '6px' }}
                            onClick={async () => {
                               const updated = {...h, isOpen: !h.isOpen};
                               await api.updateBusinessHour(h.id, updated);
                               loadSettings();
                            }}
                         >
                           {h.isOpen ? 'Abierto' : 'Cerrado'}
                         </button>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {activeSubTab === 'messages' && (
             <div className="messages-settings">
                <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Plantillas de Mensajes</h3>
                <div style={{ padding: '24px', background: 'var(--bg-hover)', borderRadius: '12px', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--success)' }}>
                      <Smartphone size={16} />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Recordatorio de Reserva</span>
                   </div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                      Hola [Nombre] 🌹<br/><br/>
                      Te recordamos tu reserva de hoy a las [Hora] para [Personas] persona(s) en ROSÉ Cafe Bar.<br/><br/>
                      ¡Te esperamos! 🥂
                   </p>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                   Las plantillas están pre-definidas para garantizar el tono premium de ROSÉ. <br/>
                   Podrás editarlas en la versión V2 del sistema.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
