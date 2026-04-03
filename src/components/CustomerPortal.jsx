import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { normalizePhone, formatPhoneForDisplay } from '../utils/phone';
import { format12h } from '../utils/formatters';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  ChevronRight,
  Info,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import './CustomerPortal.css';

export default function CustomerPortal() {
  const [phone, setPhone] = useState(localStorage.getItem('customer_portal_phone') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, creating, verifying, success, error
  const [searchParams] = useSearchParams();
  const pollingRef = useRef(null);

  const upcoming = reservations.length > 0 ? reservations[0] : null;

  useEffect(() => {
    // Check if we just returned from payment
    if (searchParams.get('payment') === 'success') {
      setPaymentStatus('verifying');
    }
  }, [searchParams]);

  // Polling for payment completion
  useEffect(() => {
    if (paymentStatus === 'verifying' && upcoming) {
      pollingRef.current = setInterval(async () => {
        try {
          const status = await api.getPaymentStatus(upcoming.id);
          if (status.isPaid) {
            setPaymentStatus('success');
            clearInterval(pollingRef.current);
            handleSearch(); // Refresh list
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => clearInterval(pollingRef.current);
  }, [paymentStatus, upcoming]);

  useEffect(() => {
    if (phone && !isLoggedIn) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!phone) return;

    setError(null);
    setIsSearching(true);
    try {
      const normalized = normalizePhone(phone);
      const data = await api.searchCustomerReservations(normalized);
      setReservations(data);
      setIsLoggedIn(true);
      localStorage.setItem('customer_portal_phone', phone);
    } catch (err) {
      setError(err.message || 'Error al buscar reservaciones');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.customerAction(id, action);
      // Refresh
      handleSearch();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleStartPayment = async () => {
    if (!upcoming) return;
    setPaymentStatus('creating');
    try {
      const { url } = await api.createPaymentCheckout(upcoming.id);
      window.location.href = url; // Redirect to checkout (sandbox)
    } catch (err) {
      alert('Error al iniciar el pago: ' + err.message);
      setPaymentStatus('idle');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setReservations([]);
    setPhone('');
    localStorage.removeItem('customer_portal_phone');
  };

  if (!isLoggedIn) {
    return (
      <div className="portal-container animate-fade-in">
        <div className="portal-auth-card">
          <div className="portal-logo">
            <h1>ROSÉ<span>.</span></h1>
            <p>GESTIÓN DE RESERVAS</p>
          </div>
          
          <form onSubmit={handleSearch} className="portal-form">
            <h2>Bienvenido</h2>
            <p>Ingresa tu número de WhatsApp para ver y gestionar tus reservaciones.</p>
            
            <div className="form-group">
              <input 
                type="tel" 
                className="input-premium" 
                placeholder="Ej. 300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-portal-primary" disabled={isSearching}>
              {isSearching ? 'Buscando...' : 'Acceder'}
              <ChevronRight size={20} />
            </button>
            
            {error && <p className="portal-error">{error}</p>}
          </form>
          
          <div className="portal-help" style={{ marginTop: '24px' }}>
            <Info size={16} />
            <span>Acceso rápido sin contraseñas.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-main animate-fade-in">
      <header className="portal-header">
        <div className="header-left">
          <button className="btn-back" onClick={handleLogout}>
            <ArrowLeft size={20} />
            <span>Salir</span>
          </button>
          <div className="header-divider"></div>
          <h1 className="header-title">Mi Reserva</h1>
        </div>
        <div className="portal-header-logo">ROSÉ<span>.</span></div>
      </header>

      <main className="portal-content">
        <section className="user-welcome">
          <h1>Hola, {upcoming ? upcoming.fullName.split(' ')[0] : 'Cliente'}</h1>
          <p>Gestiona tu experiencia en ROSÉ Cafe Bar.</p>
        </section>

        {!upcoming ? (
          <div className="no-reservations-card">
            <Calendar size={48} className="icon-decent" />
            <h3>No tienes reservas activas</h3>
            <p>No encontramos reservaciones próximas para el número {formatPhoneForDisplay(phone)}.</p>
            <button className="btn-portal-primary" onClick={() => window.location.href = '/'}>
              Hacer una reserva ahora
            </button>
          </div>
        ) : (
          <div className="reservation-focus">
            {/* Status Messages */}
            {paymentStatus === 'success' && (
              <div className="status-banner banner-success-premium animate-fade-in-fast">
                <CheckCircle size={24} className="banner-icon" />
                <div className="banner-text">
                  <h3>¡Pago confirmado con éxito!</h3>
                  <p>Tu mesa ya está asegurada. ¡Nos vemos pronto!</p>
                </div>
                <button className="banner-close" onClick={() => setPaymentStatus('idle')}>×</button>
              </div>
            )}

            {paymentStatus === 'verifying' && (
              <div className="status-banner banner-info-premium animate-fade-in-fast">
                <div className="spinner-small"></div>
                <div className="banner-text">
                  <h3>Verificando pago</h3>
                  <p>Estamos confirmando tu transacción, por favor espera...</p>
                </div>
              </div>
            )}

            <div className={`res-card-premium status-${upcoming.status}`}>
              <div className="res-card-header">
                <div className="res-date-box">
                  <span className="month">{new Date(upcoming.reservationDate + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</span>
                  <span className="day">{new Date(upcoming.reservationDate + 'T12:00:00').getDate()}</span>
                </div>
                <div className="res-main-info">
                  <h3>{new Date(upcoming.reservationDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}</h3>
                  <div className="res-meta">
                    <span className="meta-item"><Clock size={14} /> {format12h(upcoming.reservationTime)}</span>
                    <span className="meta-item"><Users size={14} /> {upcoming.partySize} personas</span>
                  </div>
                </div>
                <div className={`status-badge-compact badge-${upcoming.status}`}>
                  {upcoming.status === 'confirmed' ? 'Confirmada' : (upcoming.status === 'pending' ? 'Pendiente' : 'Completada')}
                </div>
              </div>

              <div className="res-details-list">
                <div className="detail-item">
                  <span className="label">Ubicación</span>
                  <span className="value"><MapPin size={14} /> ROSÉ Cafe Bar, Piso 2</span>
                </div>
                {upcoming.occasion && (
                  <div className="detail-item">
                    <span className="label">Ocasión</span>
                    <span className="value capitalize">{upcoming.occasion}</span>
                  </div>
                )}
                {upcoming.specialRequests && (
                  <div className="detail-item">
                    <span className="label">Peticiones</span>
                    <span className="value">{upcoming.specialRequests}</span>
                  </div>
                )}
              </div>

              {/* Payment Reminder Section */}
              {upcoming.status !== 'completed' && !upcoming.isPaid && (
                <div className="payment-notice-premium">
                  <div className="notice-content">
                    <Info size={20} className="notice-icon" />
                    <div className="notice-text">
                      <h4>Asegura tu mesa ahora</h4>
                      <p>Para confirmar se requiere un abono de $20.000 COP que se descontará de tu cuenta final.</p>
                    </div>
                  </div>
                  <button 
                    className="btn-pay-premium-full" 
                    onClick={handleStartPayment}
                    disabled={paymentStatus === 'creating'}
                  >
                    {paymentStatus === 'creating' ? 'Cargando...' : 'Pagar y confirmar ahora'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {upcoming.status === 'completed' && (() => {
                const now = new Date();
                const resDateTime = new Date(`${upcoming.reservationDate}T${upcoming.reservationTime}:00-05:00`);
                const oneHourAfter = new Date(resDateTime.getTime() + 60 * 60 * 1000);
                
                let title = '¡Bienvenidos!';
                let message = 'Los estábamos esperando en ROSÉ Cafe Bar. Disfruten su reserva.';
                
                if (now < resDateTime) {
                  title = '¡Nos vemos pronto!';
                  message = `Tu mesa estará lista a las ${format12h(upcoming.reservationTime)}. Te esperamos en ROSÉ Cafe Bar.`;
                } else if (now > oneHourAfter) {
                  title = '¡Gracias por visitarnos!';
                  message = 'Esperamos que hayas tenido una experiencia inolvidable en ROSÉ.';
                }

                return (
                  <div className="service-finish-box-premium">
                    <CheckCircle size={24} color="var(--primary)" />
                    <p><strong>{title}</strong> {message}</p>
                  </div>
                );
              })()}

              <div className="res-actions-grid">
                {upcoming.status === 'pending' && (
                  <button className="btn-action-premium confirm" onClick={() => handleAction(upcoming.id, 'confirm')}>
                    <CheckCircle size={18} />
                    <span>Confirmar Asistencia</span>
                  </button>
                )}
                <button className="btn-action-premium whatsapp" onClick={() => window.open(`https://wa.me/573000000000?text=Hola, tengo una pregunta sobre mi reserva para el ${upcoming.reservationDate}`, '_blank')}>
                  <MessageCircle size={18} />
                  <span>Contactar WhatsApp</span>
                </button>
                {upcoming.status !== 'completed' && (
                  <button className="btn-action-premium cancel" onClick={() => { if(window.confirm('¿Estás seguro de que deseas cancelar tu reserva?')) handleAction(upcoming.id, 'cancel') }}>
                    <XCircle size={18} />
                    <span>Cancelar Reserva</span>
                  </button>
                )}
              </div>
            </div>

            {/* Multiple Reservations - Vertical Cards */}
            {reservations.length > 1 && (
              <div className="multiple-reservations-section">
                <h4 className="section-title">Otras Reservas Históricas</h4>
                <div className="vertical-res-list">
                  {reservations.slice(1).map(res => (
                    <div key={res.id} className="mini-res-card-premium">
                      <div className="mini-res-date">
                        <Calendar size={16} />
                        <span>{new Date(res.reservationDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="mini-res-details">
                        <span className="mini-time">{format12h(res.reservationTime)}</span>
                        <span className="mini-pax">{res.partySize} pers.</span>
                      </div>
                      <div className={`mini-status-badge badge-${res.status}`}>
                        {res.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <footer className="portal-footer">
          <p>© 2026 ROSÉ Cafe Bar. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
