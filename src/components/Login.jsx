import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../lib/api';
import { getTranslation } from '../lib/translations';
import './Login.css';

export default function Login() {
  const [lang] = useState(localStorage.getItem('rose_lang') || 'es');
  const t = (key) => getTranslation(lang, key);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await loginAdmin(username, password);
    if (ok) {
      navigate('/admin');
    } else {
      setError(t('errorLogin'));
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <img src="/Logo.png" alt="Rose Cafe Logo" className="login-logo" style={{ height: '80px', width: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
          <h2>{t('loginTitle')}</h2>
          <p>{t('loginSubtitle')}</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>{t('labelUser')}</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label>{t('labelPass')}</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn-primary login-btn">
            {t('btnLogin')}
          </button>
        </form>
        
        <button className="btn-back" onClick={() => navigate('/')}>
          {t('btnBack')}
        </button>
      </div>
    </div>
  );
}
