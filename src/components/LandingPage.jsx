import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getTranslation } from '../lib/translations';
import DateSlider from './DateSlider';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('es');
  const t = (key) => getTranslation(lang, key);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '',
    partySize: 2,
    occasion: '',
    specialRequests: ''
  });
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, [formData.reservationDate]);

  async function fetchSlots() {
    try {
      setLoadingSlots(true);
      const availableSlots = await api.getAvailableSlots(formData.reservationDate);
      setSlots(availableSlots);
      if (availableSlots.length > 0 && !availableSlots.find(s => s.time === formData.reservationTime)) {
        setFormData(prev => ({ ...prev, reservationTime: availableSlots.find(s => !s.isFull)?.time || '' }));
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reservationTime) {
      alert(lang === 'es' ? 'Por favor selecciona un horario' : 'Please select a time');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setError(null);
    try {
      await api.createReservation({
        ...formData,
        source: 'web',
        createdByRole: 'customer'
      });
      setShowConfirm(false);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
      setShowConfirm(false);
    }
  };

  const handlePaxPrompt = () => {
    const val = prompt(t('paxCustomPrompt'), '7');
    if(val && !isNaN(val)) setFormData({...formData, partySize: parseInt(val)});
  };

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="landing-overlay"></div>
      </div>
      
      <div className="landing-content animate-fade-in">
        <header className="landing-header">
          <div className="landing-logo">
            <img src="/Logo.png" alt="Rose Cafe Bar Logo" className="logo-img" />
            <h1>ROSÉ<span>.</span></h1>
            <p className="subtitle">CAFE BAR</p>
          </div>
          <div className="landing-actions">
            <div className="lang-toggle">
              <button 
                className={lang === 'es' ? 'active' : ''} 
                onClick={() => setLang('es')}
              >ES</button>
              <span className="separator">|</span>
              <button 
                className={lang === 'en' ? 'active' : ''} 
                onClick={() => setLang('en')}
              >EN</button>
            </div>
            <button className="btn-admin-link" onClick={() => navigate('/admin')}>
              {t('adminLogin')}
            </button>
          </div>
        </header>

        <main className="landing-main">
          <div className="hero-text">
            <h2>{t('heroTitle')}</h2>
            <p>{t('heroDesc')}</p>
          </div>

          <div className="reservation-card">
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>{t('successTitle')}</h3>
                <p>{t('successRecv')} <strong>{new Date(formData.reservationDate).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {weekday:'long', month:'short', day:'numeric'})}</strong> {t('successAt')} <strong>{formData.reservationTime}</strong>.</p>
                <p className="status-note">{t('successStatus')} <strong>{t('successStatusPend')}</strong>. {t('successWait')}</p>
                <p className="payment-confirmation-note">{t('successPayment')}</p>
                <button className="btn-primary" style={{marginTop: '20px', width: '100%'}} onClick={() => setIsSubmitted(false)}>
                  {t('successBtn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="booking-form">
                <h3>{t('formTitle')}</h3>
                
                {error && (
                  <div className="alert-item critical" style={{ marginBottom: '20px', borderLeftWidth: '4px' }}>
                    <div className="alert-content">
                      <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>{t('labelName')}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={t('placeholderName')}
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('labelPhone')}</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder={t('placeholderPhone')}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('labelDate')}</label>
                  <DateSlider 
                    selectedDate={formData.reservationDate}
                    onChange={val => setFormData({...formData, reservationDate: val})}
                    lang={lang}
                  />
                </div>

                <div className="form-group">
                  <label>{t('labelTime')}</label>
                  {loadingSlots ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <div className="loading-spinner" style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      {t('loadingSlots')}...
                    </div>
                  ) : slots.length === 0 ? (
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontWeight: 600 }}>{t('noSlots')}</div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>{lang === 'es' ? 'El restaurante está cerrado o no hay disponibilidad para esta fecha.' : 'The restaurant is closed or there is no availability for this date.'}</div>
                    </div>
                  ) : (
                    <div className="pax-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      {slots.map(slot => (
                        <button 
                          key={slot.time}
                          type="button" 
                          disabled={slot.isFull}
                          className={`pax-btn ${formData.reservationTime === slot.time ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, reservationTime: slot.time})}
                          style={{ minWidth: '85px', fontSize: '14px', padding: '10px 14px' }}
                        >
                          {slot.time}
                          {slot.isFull && <div style={{ fontSize: '9px', opacity: 0.7, fontWeight: 500 }}>{t('paxFull')}</div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>{t('labelGuests')}</label>
                  <div className="pax-selector">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button 
                        key={num}
                        type="button" 
                        className={`pax-btn ${formData.partySize === num ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, partySize: num})}
                      >
                        {num}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      className={`pax-btn ${formData.partySize > 6 ? 'active' : ''}`}
                      onClick={handlePaxPrompt}
                    >
                      {formData.partySize > 6 ? formData.partySize : '7+'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('labelOccasion')}</label>
                  <select 
                    className="form-select"
                    value={formData.occasion}
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                  >
                    <option value="">{t('optionNone')}</option>
                    <option value="birthday">{t('optionBirthday')}</option>
                    <option value="anniversary">{t('optionAnniversary')}</option>
                    <option value="romance">{t('optionRomance')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('labelRequests')}</label>
                  <textarea 
                    rows="3"
                    placeholder={t('placeholderRequests')}
                    value={formData.specialRequests}
                    onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary submit-btn">
                  {t('btnSubmit')}
                </button>
                <p className="payment-note-subtle">{t('paymentNote')}</p>
              </form>
            )}
          </div>
        </main>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card animate-fade-in confirm-modal">
            <div className="modal-header">
              <h2>{t('confirmTitle')}</h2>
            </div>
            <div className="confirm-body">
              <p className="confirm-prompt">{t('confirmDesc')}</p>
              <div className="confirm-details">
                <p><strong>{t('labelName')}:</strong> {formData.fullName}</p>
                <p><strong>{t('labelPhone')}:</strong> {formData.phone}</p>
                <p><strong>{t('labelDate')}:</strong> {new Date(formData.reservationDate).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}</p>
                <p><strong>{t('labelTime')}:</strong> {formData.reservationTime}</p>
                <p><strong>{t('labelGuests')}:</strong> {formData.partySize}</p>
                {formData.occasion && (
                  <p><strong>{t('labelOccasion')}:</strong> {t('option' + formData.occasion.charAt(0).toUpperCase() + formData.occasion.slice(1))}</p>
                )}
                {formData.specialRequests && (
                  <p><strong>{t('labelRequests')}:</strong> {formData.specialRequests}</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>{t('confirmBtnEdit')}</button>
              <button className="btn-primary" onClick={handleConfirmSubmit}>{t('confirmBtnSubmit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
