import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Info, Check, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { getTranslation } from '../lib/translations';
import DateSlider from './DateSlider';
import { format12h } from '../utils/formatters';
import { getLocalDateString } from '../utils/formatters';
import './LandingPage.css';

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className="dropdown-icon" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>
      {isOpen && (
        <ul className="dropdown-list animate-fade-in-fast">
          {options.map(opt => (
            <li 
              key={opt.value}
              className={`dropdown-item ${value === opt.value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem('rose_lang') || 'es');
  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    localStorage.setItem('rose_lang', lang);
  }, [lang]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    reservationDate: getLocalDateString(),
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
      alert(t('alertSelectTime'));
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setError(null);
    try {
      const normalizedPhone = formData.phone.startsWith('+57') 
        ? formData.phone 
        : `+57${formData.phone.replace(/\D/g, '')}`;

      await api.createReservation({
        ...formData,
        phone: normalizedPhone,
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
            <Link to="/mi-reserva" className="btn-manage-landing">
              <ExternalLink size={16} /> {t('manageReservation')}
            </Link>
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
          <div className="landing-split-container">
            <div className="hero-section">
              <div className="hero-text">
                <h2>{t('heroTitle')}</h2>
                <p>{t('heroDesc')}</p>
              </div>
            </div>

            <div className="form-section-container">
              <div className="reservation-card">
                {isSubmitted ? (
                  <div className="animate-fade-in">
                    <div className="success-icon-premium">
                      <Check size={28} />
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>{t('successTitle')}</h3>
                    
                    <div className="receipt-card">
                      <div className="receipt-header">
                        <h3>Confirmación de Reserva</h3>
                      </div>
                      <div className="receipt-body">
                        <div className="receipt-row">
                          <span className="receipt-label">{t('labelName')}</span>
                          <span className="receipt-value">{formData.fullName}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">{t('labelDate')}</span>
                          <span className="receipt-value">{new Date(formData.reservationDate + 'T00:00:00').toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {weekday:'long', month:'short', day:'numeric'})}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">{t('labelTime')}</span>
                          <span className="receipt-value">{format12h(formData.reservationTime)}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="receipt-label">{t('labelGuests')}</span>
                          <span className="receipt-value">{formData.partySize} {t('labelGuestsValue')}</span>
                        </div>
                        
                        <div className="payment-notice-box" style={{ marginTop: '10px', marginBottom: '0' }}>
                          <p style={{ fontSize: '12px' }}>{t('successPayment')}</p>
                        </div>
                      </div>
                      <div className="receipt-footer">
                        <Link to="/mi-reserva" className="btn-portal-link">
                          <ExternalLink size={18} /> Ver y Gestionar mi Reserva
                        </Link>
                        <span className="receipt-id">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      <button className="submit-btn outline" onClick={() => setIsSubmitted(false)}>
                        {t('successBtn')}
                      </button>
                    </div>
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

                    <div className="form-section">
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
                          placeholder="300 123 4567"
                          value={formData.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({...formData, phone: val});
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="form-section">
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
                          <div className="pax-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            {['18:00', '19:00', '20:00', '21:00', '22:00'].map(time => (
                              <button 
                                key={time}
                                type="button" 
                                className={`pax-btn ${formData.reservationTime === time ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, reservationTime: time})}
                                style={{ minWidth: '85px', fontSize: '14px', padding: '10px 14px' }}
                              >
                                {format12h(time)}
                              </button>
                            ))}
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
                                {format12h(slot.time)}
                                {slot.isFull && <div style={{ fontSize: '9px', opacity: 0.7, fontWeight: 500 }}>{t('paxFull')}</div>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-section">
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
                            {formData.partySize > 6 ? formData.partySize : t('paxCustom')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-group">
                        <label>{t('labelOccasion')}</label>
                        <CustomDropdown 
                          value={formData.occasion}
                          onChange={val => setFormData({...formData, occasion: val})}
                          placeholder={t('optionNone')}
                          options={[
                            { value: '', label: t('optionNone') },
                            { value: 'birthday', label: t('optionBirthday') },
                            { value: 'anniversary', label: t('optionAnniversary') },
                            { value: 'romance', label: t('optionRomance') }
                          ]}
                        />
                      </div>

                      <div className="form-group">
                        <label>{t('labelRequests')}</label>
                        <textarea 
                          className="textarea-premium"
                          rows="3"
                          placeholder={t('placeholderRequests')}
                          value={formData.specialRequests}
                          onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                        ></textarea>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary submit-btn">
                      {t('btnSubmit')}
                    </button>
                    <div className="payment-info-box">
                      <div className="icon-wrapper" style={{color: 'var(--primary)'}}>
                        <Info size={20} />
                      </div>
                      <p>{t('paymentNote')}</p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card confirm-modal animate-fade-in">
            <div className="modal-header-vertical">
              <h2>{t('confirmTitle')}</h2>
              <p className="modal-subtitle">{t('confirmDesc')}</p>
            </div>
            <div className="confirm-body-vertical">
              <div className="confirm-row">
                <span className="confirm-label">{t('labelName')}</span>
                <span className="confirm-value">{formData.fullName}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">{t('labelPhone')}</span>
                <span className="confirm-value">{formData.phone}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">{t('labelDate')}</span>
                <span className="confirm-value">{new Date(formData.reservationDate + 'T00:00:00').toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {weekday:'long', month:'short', day:'numeric'})}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">{t('labelTime')}</span>
                <span className="confirm-value">{format12h(formData.reservationTime)}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">{t('labelGuests')}</span>
                <span className="confirm-value">{formData.partySize} {t('labelGuestsValue')}</span>
              </div>
              {formData.occasion && (
                <div className="confirm-row">
                  <span className="confirm-label">{t('labelOccasion')}</span>
                  <span className="confirm-value occasion-highlight">{t('option' + formData.occasion.charAt(0).toUpperCase() + formData.occasion.slice(1))}</span>
                </div>
              )}
              {formData.specialRequests && (
                <div className="confirm-row">
                  <span className="confirm-label">{t('labelRequests')}</span>
                  <span className="confirm-value">{formData.specialRequests}</span>
                </div>
              )}
            </div>
            <div className="modal-actions-vertical">
              <button className="btn-primary" onClick={handleConfirmSubmit}>{t('confirmBtnSubmit')}</button>
              <button className="btn-secondary ghost" onClick={() => setShowConfirm(false)}>{t('confirmBtnEdit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
