import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { CreditCard, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentSandbox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reservationId = searchParams.get('reservationId');
  const providerPaymentId = searchParams.get('providerPaymentId');

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Simulate the Webhook from the Backend
      // In a real scenario, the payment provider sends this to /api/payments/webhook
      await api.simulateWebhook('mock', {
        status: 'success',
        providerPaymentId,
        reservationId
      });
      
      setIsSuccess(true);
      // Wait a bit to show success before redirecting back
      setTimeout(() => {
        navigate('/mi-reserva?payment=success');
      }, 2000);
    } catch (err) {
      alert('Error simulating webhook: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="portal-container animate-fade-in" style={{ background: '#111', color: '#fff' }}>
      <div className="portal-auth-card" style={{ maxWidth: '440px', border: '1px solid #333' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(201, 169, 110, 0.1)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '16px' }}>
            <CreditCard size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Simulador de Pago</h2>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>Estás en el entorno de pruebas de ROSÉ</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#888' }}>Monto a pagar</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>$20.000 COP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#888' }}>Referencia</span>
            <span style={{ fontFamily: 'monospace' }}>{providerPaymentId}</span>
          </div>
          <div style={{ borderTop: '1px solid #333', marginTop: '12px', paddingTop: '12px', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Pago seguro y encriptado
          </div>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px' }} className="animate-bounce-in">
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>¡Pago Autorizado!</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Redirigiendo a tu reserva...</p>
          </div>
        ) : (
          <button 
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
            }}
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin" size={20} /> PROCESANDO...</>
            ) : (
              <><CheckCircle2 size={20} /> CONFIRMAR PAGO <ArrowRight size={18} /></>
            )}
          </button>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/mi-reserva')}
            style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '14px', cursor: 'pointer' }}
          >
            Cancelar y volver
          </button>
        </div>
      </div>
    </div>
  );
}
