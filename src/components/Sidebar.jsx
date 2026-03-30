import { LayoutDashboard, CalendarDays, Users, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../lib/api';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Panel Interno', icon: <LayoutDashboard size={18} /> },
    { id: 'reservations', label: 'Reservaciones', icon: <CalendarDays size={18} /> },
    { id: 'customers', label: 'Clientes', icon: <Users size={18} /> },
    { id: 'settings', label: 'Configuración', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo-text">ROSÉ<span>.</span></h2>
        <p className="subtitle">CAFE BAR</p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
