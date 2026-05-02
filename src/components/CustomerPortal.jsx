import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  const { token: paramToken } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeToken, setActiveToken] = useState(paramToken || searchParams.get('token') || sessionStorage.getItem('portal_token'));
  
  const [phone, setPhone] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  const [reservation, setReservation] = useState(null);
  const [isLoadingToken, setIsLoadingToken] = useState(!!activeToken);
  const [tokenError, setTokenError] = useState(null);
  
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, creating, verifying, success, error
  const pollingRef = useRef(null);

  useEffect(() => {
    if (activeToken) {
      sessionStorage.setItem('portal_token', activeToken);
      if (searchParams.has('token')) {
        searchParams.delete('token');
        setSearchParams(searchParams, { replace: true });
      }
      loadReservationByToken(activeToken);
    }
  }, [activeToken]);

  useEffect(() => {
    // Check if we just returned from payment
    if (searchParams.get('payment') === 'success') {
      setPaymentStatus('verifying');
    }
  }, [searchParams]);

  // Polling for payment completion
  useEffect(() => {
    if (paymentStatus === 'verifying' && reservation) {
      pollingRef.current = setInterval(async () => {
        try {
          const status = await api.getPaymentStatus(reservation.id);
          if (status.isPaid) {
            setPaymentStatus('success');
            clearInterval(pollingRef.current);
            if (activeToken) loadReservationByToken(activeToken); // Refresh
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => clearInterval(pollingRef.current);
  }, [paymentStatus, reservation, activeToken]);

  const loadReservationByToken = async (authToken) => {
    setIsLoadingToken(true);
    setTokenError(null);
    try {
      const data = await api.getPortalReservation(authToken);
      setReservation(data);
    } catch (err) {
      setTokenError(err.message || 'Link inválido o expirado.');
      setReservation(null);
    } finally {
      setIsLoadingToken(false);
    }
  };

  const handleRequestAccess = async (e) => {
    if (e) e.preventDefault();
    if (!phone) return;

    setIsRequesting(true);
    try {
      const normalized = normalizePhone(phone);
      await api.requestPortalAccess(normalized);
      setRequestSuccess(true);
    } catch (err) {
      // Even on error we might just show success to avoid enumeration, but if it's a network error we can alert.
      alert('Error: ' + (err.message || 'Error al solicitar acceso'));
    } finally {
      setIsRequesting(false);
    }
  };

  const handleAction = async (action) => {
    if (!activeToken) return;
    try {
      await api.portalAction(activeToken, action);
      // Refresh
      loadReservationByToken(activeToken);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleStartPayment = async () => {
    if (!reservation) return;
    setPaymentStatus('creating');
    try {
      const { url } = await api.createPaymentCheckout(reservation.id);
      window.location.href = url; // Redirect to checkout (sandbox)
    } catch (err) {
      alert('Error al iniciar el pago: ' + err.message);
      setPaymentStatus('idle');
    }
  };

  // ─── STATE: No Token provided or Request Access mode ───
  if (!activeToken || tokenError) {
    return (
      <div className="portal-container animate-fade-in">
        <div className="portal-auth-card">
          <div className="portal-logo">
            <img src="/Logo.png" alt="ROSÉ Logo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
            <p>GESTIÓN DE RESERVAS</p>
          </div>
          
          {tokenError && (
            <div className="status-banner banner-info-premium" style={{ marginBottom: '20px', background: 'rgba(255,0,0,0.1)', color: '#ff6b6b' }}>
              <XCircle size={20} style={{ marginRight: '10px' }} />
              <p style={{ margin: 0 }}>{tokenError}</p>
            </div>
          )}

          {!requestSuccess ? (
            <form onSubmit={handleRequestAccess} className="portal-form">
              <h2>Acceso Seguro</h2>
              <p>Por motivos de seguridad, enviamos links únicos por WhatsApp. Ingresa tu número si perdiste tu link.</p>
              
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
              
              <button type="submit" className="btn-portal-primary" disabled={isRequesting}>
                {isRequesting ? 'Enviando...' : 'Solicitar Link de Acceso'}
                <ChevronRight size={20} />
              </button>
            </form>
          ) : (
            <div className="portal-form" style={{ textAlign: 'center' }}>
              <CheckCircle size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h2>Solicitud Recibida</h2>
              <p style={{ lineHeight: '1.6' }}>
                Si tienes reservas activas con el número <strong>{formatPhoneForDisplay(phone)}</strong>, 
                te enviaremos los links de acceso seguro por WhatsApp en breve.
              </p>
              <button className="btn-portal-secondary" onClick={() => setRequestSuccess(false)} style={{ marginTop: '20px', width: '100%' }}>
                Volver
              </button>
            </div>
          )}
          
          <div className="portal-help" style={{ marginTop: '24px' }}>
            <Info size={16} />
            <span>Acceso seguro mediante Link Único.</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE: Loading Reservation ───
  if (isLoadingToken) {
    return (
      <div className="portal-container">
        <div className="spinner-small" style={{ margin: '0 auto' }}></div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-light)' }}>Cargando tu reserva de forma segura...</p>
      </div>
    );
  }

  // ─── STATE: Viewing specific Reservation ───
  return (
    <div className="portal-main animate-fade-in">
      <header className="portal-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => window.location.href = '/'}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <div className="header-divider"></div>
          <h1 className="header-title">Mi Reserva</h1>
        </div>
        <div className="portal-header-logo">
          <img src="/Logo.png" alt="Logo" style={{ height: '35px', width: '35px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      </header>

      <main className="portal-content">
        <section className="user-welcome">
          <h1>Hola, {reservation.fullName.split(' ')[0]}</h1>
          <p>Gestiona tu experiencia en ROSÉ Cafe Bar.</p>
        </section>

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

          <div className={`res-card-premium status-${reservation.status}`}>
            <div className="res-card-header">
              <div className="res-date-box">
                <span className="month">{new Date(reservation.reservationDate + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</span>
                <span className="day">{new Date(reservation.reservationDate + 'T12:00:00').getDate()}</span>
              </div>
              <div className="res-main-info">
                <h3>{new Date(reservation.reservationDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}</h3>
                <div className="res-meta">
                  <span className="meta-item"><Clock size={14} /> {format12h(reservation.reservationTime)}</span>
                  <span className="meta-item"><Users size={14} /> {reservation.partySize} personas</span>
                </div>
              </div>
              <div className={`status-badge-compact badge-${reservation.status}`}>
                {reservation.status === 'confirmed' ? 'Confirmada' : (reservation.status === 'pending' ? 'Pendiente' : 'Completada')}
              </div>
            </div>

            <div className="res-details-list">
              <div className="detail-item">
                <span className="label">Ubicación</span>
                <span className="value"><MapPin size={14} /> ROSÉ Cafe Bar, Piso 2</span>
              </div>
              {reservation.occasion && (
                <div className="detail-item">
                  <span className="label">Ocasión</span>
                  <span className="value capitalize">{reservation.occasion}</span>
                </div>
              )}
              {reservation.specialRequests && (
                <div className="detail-item">
                  <span className="label">Peticiones</span>
                  <span className="value">{reservation.specialRequests}</span>
                </div>
              )}
            </div>

            {/* Payment Reminder Section */}
            {reservation.status !== 'completed' && !reservation.isPaid && (
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

            {reservation.status === 'completed' && (() => {
              const now = new Date();
              const resDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}:00-05:00`);
              const oneHourAfter = new Date(resDateTime.getTime() + 60 * 60 * 1000);
              
              let title = '¡Bienvenidos!';
              let message = 'Los estábamos esperando en ROSÉ Cafe Bar. Disfruten su reserva.';
              
              if (now < resDateTime) {
                title = '¡Nos vemos pronto!';
                message = `Tu mesa estará lista a las ${format12h(reservation.reservationTime)}. Te esperamos en ROSÉ Cafe Bar.`;
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
              {reservation.status === 'pending' && (
                <button className="btn-action-premium confirm" onClick={() => handleAction('confirm')}>
                  <CheckCircle size={18} />
                  <span>Confirmar Asistencia</span>
                </button>
              )}
              <button className="btn-action-premium whatsapp" onClick={() => window.open(`https://wa.me/573000000000?text=Hola, tengo una pregunta sobre mi reserva para el ${reservation.reservationDate}`, '_blank')}>
                <MessageCircle size={18} />
                <span>Contactar WhatsApp</span>
              </button>
              {reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
                <button className="btn-action-premium cancel" onClick={() => { if(window.confirm('¿Estás seguro de que deseas cancelar tu reserva?')) handleAction('cancel') }}>
                  <XCircle size={18} />
                  <span>Cancelar Reserva</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <footer className="portal-footer">
          <p>© 2026 ROSÉ Cafe Bar. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
