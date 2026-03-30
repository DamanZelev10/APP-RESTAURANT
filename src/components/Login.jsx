import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../lib/api';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <img src="/Logo.png" alt="Rose Cafe Logo" className="login-logo" />
          <h2>Acceso Administrativo</h2>
          <p>Ingresa para gestionar las reservaciones.</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn-primary login-btn">
            Iniciar Sesión
          </button>
        </form>
        
        <button className="btn-back" onClick={() => navigate('/')}>
          Volver a la página principal
        </button>
      </div>
    </div>
  );
}
