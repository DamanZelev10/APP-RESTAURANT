export function buildReservationAccessMessage({
  customerName,
  portalUrl,
  restaurantName = 'ROSÉ Gastro Bar'
}) {
  if (customerName) {
    const firstName = customerName.split(' ')[0];
    return `Hola ${firstName} 👋\n\nRecibimos tu solicitud de acceso a tu reserva en ${restaurantName}.\n\nGestiona tu reserva aquí:\n${portalUrl}\n\nPor seguridad, no compartas este enlace.`;
  }
  
  return `Hola 👋\n\nRecibimos tu solicitud de acceso a tu reserva en ${restaurantName}.\n\nGestiona tu reserva aquí:\n${portalUrl}\n\nPor seguridad, no compartas este enlace.`;
}
