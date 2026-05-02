import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reservations from './components/Reservations';
import Customers from './components/Customers';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CustomerPortal from './components/CustomerPortal';
import PaymentSandbox from './components/PaymentSandbox';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import LocationPage from './pages/LocationPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ContactPage from './pages/ContactPage';
import './styles/index.css';
import { Menu } from 'lucide-react';
import { isAuthenticated, getMe } from './lib/api';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setIsAuth(false);
        return;
      }
      try {
        await getMe();
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#c9a96e' }}>Verificando sesión...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigateToReservation = (id) => {
    setSelectedReservationId(id);
    setActiveTab('reservations');
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <main className="main-content">
        <header className="mobile-admin-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="mobile-logo">
            <img src="/Logo.png" alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </header>
        {activeTab === 'dashboard' && <Dashboard onNavigateToReservation={handleNavigateToReservation} />}
        {activeTab === 'reservations' && <Reservations selectedReservationId={selectedReservationId} clearSelectedReservation={() => setSelectedReservationId(null)} />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservas" element={<ReservationsPage />} />
        <Route path="/ubicacion" element={<LocationPage />} />
        <Route path="/experiencias" element={<ExperiencesPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/mi-reserva/:token" element={<CustomerPortal />} />
        <Route path="/mi-reserva" element={<CustomerPortal />} />
      </Route>

      <Route path="/reservar-mesa" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cliente" element={<CustomerPortal />} />
      <Route path="/payment-sandbox" element={<PaymentSandbox />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
