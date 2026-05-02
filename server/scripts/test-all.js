const API_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('1. Admin sin token...');
  const res1 = await fetch(`${API_URL}/reservations`);
  console.log(`Status: ${res1.status} (Esperado: 401)`);
  
  console.log('\n2. Login...');
  const res2 = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password' })
  });
  console.log(`Status: ${res2.status} (Esperado: 200)`);
  const loginData = await res2.json();
  console.log('Login Response keys:', Object.keys(loginData));
  const token = loginData.token;

  console.log('\n3. Auth me...');
  const res3 = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${res3.status} (Esperado: 200)`);
  
  console.log('\n4. Admin con token...');
  const res4 = await fetch(`${API_URL}/reservations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${res4.status} (Esperado: 200)`);

  console.log('\n5. Slots públicos...');
  const res5 = await fetch(`${API_URL}/reservations/slots?date=2026-05-01`);
  console.log(`Status: ${res5.status} (Esperado: 200)`);
  
  console.log('\n6. Crear reserva pública...');
  const res6 = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Cliente Prueba',
      phone: '+57 300 123 4567',
      reservationDate: '2026-05-01',
      reservationTime: '19:00',
      partySize: 2,
      occasion: 'cumpleaños'
    })
  });
  console.log(`Status: ${res6.status} (Esperado: 201)`);
  const resData = await res6.json();
  const resId = resData.id;
  console.log(`Reservation created: ${resId}, Phone saved: ${resData.phone}`);

  console.log('\n7. Duplicado de teléfono...');
  const res7 = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Cliente Prueba 2',
      phone: '3001234567',
      reservationDate: '2026-05-01',
      reservationTime: '20:00',
      partySize: 2
    })
  });
  console.log(`Status: ${res7.status} (Esperado: 201)`);
  const res7Data = await res7.json();
  console.log(`Reservation created: ${res7Data.id}, Phone saved: ${res7Data.phone}`);
  
  if (res7Data.customerId === resData.customerId) {
    console.log('Éxito: Reutilizó el mismo customerId!');
  } else {
    console.log('Fallo: Creó un customerId diferente.');
  }

  console.log('\n8. Confirmar reserva...');
  const res8 = await fetch(`${API_URL}/reservations/${resId}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'confirmed' })
  });
  console.log(`Status: ${res8.status} (Esperado: 200)`);
  const confirmedData = await res8.json();
  console.log(`Status: ${confirmedData.status}, confirmedAt: ${confirmedData.confirmedAt}, isPaid: ${confirmedData.isPaid}, paidAt: ${confirmedData.paidAt}`);
}

runTests().catch(console.error);
