const API_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('1. Verificar que /customer-search ya no existe...');
  const res1 = await fetch(`${API_URL}/reservations/customer-search?phone=3001234567`);
  console.log(`Status: ${res1.status} (Esperado: 404 o 401)`);
  
  console.log('\n2. Crear reserva pública y obtener Token...');
  const res2 = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Cliente Portal Seguro',
      phone: '+57 300 999 8888',
      reservationDate: '2026-06-01',
      reservationTime: '20:00',
      partySize: 2,
      occasion: 'aniversario'
    })
  });
  console.log(`Status: ${res2.status} (Esperado: 201)`);
  const resData = await res2.json();
  const token = resData.portalToken;
  console.log(`Reservation created: ${resData.id}`);
  console.log(`Portal Token: ${token}`);
  
  if (!token) {
    console.error('ERROR: No token returned!');
    return;
  }

  console.log('\n3. Acceder al portal usando el Token...');
  const res3 = await fetch(`${API_URL}/reservations/portal/${token}`);
  console.log(`Status: ${res3.status} (Esperado: 200)`);
  const portalData = await res3.json();
  console.log(`Portal Reservation ID: ${portalData.id}, Status: ${portalData.status}`);
  
  if (portalData.id !== resData.id) {
    console.error('ERROR: IDs mismatch!');
  }

  console.log('\n4. Ejecutar acción de confirmar usando el Token...');
  const res4 = await fetch(`${API_URL}/reservations/portal/${token}/action`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirm' })
  });
  console.log(`Status: ${res4.status} (Esperado: 200)`);
  const actionData = await res4.json();
  console.log(`New Status: ${actionData.status} (Esperado: confirmed)`);
  
  console.log('\n5. Request Access genérico (Simulando pérdida de link)...');
  const res5 = await fetch(`${API_URL}/reservations/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '3009998888' })
  });
  console.log(`Status: ${res5.status} (Esperado: 200)`);
  const requestAccessData = await res5.json();
  console.log(`Response message: ${requestAccessData.message}`);
  if (requestAccessData.tokens) {
    console.log(`Regenerated Tokens (DEV MODE):`, requestAccessData.tokens);
    console.log(`Original token should now be invalid. Let's test original token:`);
    const res6 = await fetch(`${API_URL}/reservations/portal/${token}`);
    console.log(`Status: ${res6.status} (Esperado: 404 o 403, porque fue regenerado)`);
  }
}

runTests().catch(console.error);
