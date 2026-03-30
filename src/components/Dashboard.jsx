import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Users, 
  CalendarClock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#C9A96E', '#1e1e1e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [metrics, currentAlerts] = await Promise.all([
          api.getDashboardMetrics(),
          api.getAlerts()
        ]);
        setData(metrics);
        setAlerts(currentAlerts);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <div className="loading">Cargando panel...</div>;
  if (!data) return <div className="error">Error al cargar datos.</div>;

  const { kpis, charts, insights } = data;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Panel de Control</h1>
        <p>Bienvenido de nuevo a ROSÉ Cafe Bar. Aquí tienes el resumen operativo.</p>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard 
          label="Reservas Mensuales" 
          value={kpis.reservationsMonth} 
          icon={<CalendarClock size={24} color="var(--primary)" />}
          trend={`${kpis.reservationsQuarter} en el trimestre`}
        />
        <KpiCard 
          label="Reservas para Hoy" 
          value={kpis.todayCount} 
          icon={<Clock size={24} color="var(--info)" />}
          trend={`${kpis.upcomingCount} pendientes`}
        />
        <KpiCard 
          label="Tasa de No-Show" 
          value={`${kpis.noShowRate}%`} 
          icon={<AlertCircle size={24} color="var(--danger)" />}
          trend="Basado en historial"
        />
        <KpiCard 
          label="Confirmación" 
          value={`${kpis.confirmationRate}%`} 
          icon={<CheckCircle2 size={24} color="var(--success)" />}
          trend="Reservas activas"
        />
      </div>

      <div className="dashboard-sections">
        {/* Main Analytics Area */}
        <div className="analytics-area">
          <div className="charts-section">
            <div className="chart-card">
              <h3>Reservas por Día (Este Mes)</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.dailyReservations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis dataKey="date" stroke="#a0a0a0" fontSize={10} tickFormatter={(str) => str.split('-')[2]} />
                    <YAxis stroke="#a0a0a0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Horas Pico de Reservas</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis dataKey="time" stroke="#a0a0a0" fontSize={12} />
                    <YAxis stroke="#a0a0a0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Distribución de Estados</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.statusDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {charts.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Mix de Clientes</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.customerMix}
                      innerRadius={0}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {charts.customerMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#1e1e1e' : '#C9A96E'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="insights-card mt-3" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-muted)' }}>Operación y Tendencias</h3>
            <ul style={{ listStyle: 'none' }}>
              {insights.map((insight, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '14px' }}>
                  <TrendingUp size={18} color="var(--primary)" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar: Alert Center */}
        <div className="alerts-section">
          <div className="section-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Centro de Alertas</h2>
            <span className="badge badge-pending">{alerts.length}</span>
          </div>

          {alerts.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
              <CheckCircle2 size={32} color="#2a2a2a" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Todo bajo control por ahora.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type || 'info'}`}>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                </div>
                {alert.reservationId && (
                  <button 
                    className="btn-icon" 
                    style={{ background: 'var(--bg-hover)', color: 'var(--primary)', cursor: 'pointer' }}
                    onClick={() => console.log('Navigate to reservation:', alert.reservationId)}
                    title="Ver Reservación"
                  >
                    <CalendarClock size={16} />
                  </button>
                )}
              </div>
            ))
          )}
          
          <div className="quick-actions" style={{ marginTop: '20px' }}>
             <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Acciones Rápidas</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => alert('Próximamente: Envío de recordatorios masivos')}
                >
                  <MessageSquare size={16} /> Enviar Recordatorios Masivos
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => alert('Próximamente: Filtro de Clientes VIP')}
                >
                  <Users size={16} /> Ver Clientes VIP
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, trend }) {
  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="label">{label}</span>
        {icon}
      </div>
      <div className="value">{value}</div>
      <div className="trend" style={{ color: 'var(--text-muted)' }}>{trend}</div>
    </div>
  );
}
