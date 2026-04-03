import React, { useState } from 'react';
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
import { Menu } from 'lucide-react';
import { isAuthenticated } from './lib/api';
import './App.css';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
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
          <div className="mobile-logo">ROSÉ<span>.</span></div>
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mi-reserva" element={<CustomerPortal />} />
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
